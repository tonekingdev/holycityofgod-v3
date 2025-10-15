import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { canPerformAction } from "@/lib/permissions"

// POST /api/calendars/permissions - Grant calendar access to church/user
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const body = await request.json()
    const { calendar_id, granted_to_church_id, granted_to_user_id, granted_to_role_id, permission_type, expires_at } =
      body

    if (!canPerformAction(user, "event", "share")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Verify calendar exists and user has admin access
    const calendar = await executeQuery(
      `
      SELECT * FROM calendars 
      WHERE id = ? AND (owner_user_id = ? OR owner_church_id = ?)
    `,
      [Number(calendar_id), user.id, user.primary_church_id],
    )

    if (!calendar.length && user.role.name !== "super_admin" && user.role.name !== "network_admin") {
      return NextResponse.json({ error: "Calendar not found or access denied" }, { status: 404 })
    }

    // Insert permission
    await executeQuery(
      `
      INSERT INTO calendar_permissions (
        calendar_id, granted_to_church_id, granted_to_user_id, granted_to_role_id,
        permission_type, expires_at, granted_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        Number(calendar_id),
        granted_to_church_id ? Number(granted_to_church_id) : null,
        granted_to_user_id ? Number(granted_to_user_id) : null,
        granted_to_role_id ? Number(granted_to_role_id) : null,
        String(permission_type),
        expires_at || null,
        user.id,
      ],
    )

    return NextResponse.json(
      {
        success: true,
        message: "Calendar permission granted successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Calendar permission error:", error)
    return NextResponse.json({ error: "Failed to grant calendar permission" }, { status: 500 })
  }
}

// GET /api/calendars/permissions - List calendar permissions
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const { searchParams } = new URL(request.url)
    const calendarId = searchParams.get("calendar_id")

    let query = `
      SELECT cp.*, c.name as calendar_name,
             ch.name as church_name, u.first_name, u.last_name,
             r.name as role_name
      FROM calendar_permissions cp
      JOIN calendars c ON cp.calendar_id = c.id
      LEFT JOIN churches ch ON cp.granted_to_church_id = ch.id
      LEFT JOIN users u ON cp.granted_to_user_id = u.id
      LEFT JOIN roles r ON cp.granted_to_role_id = r.id
      WHERE cp.is_active = 1
    `
    const params: unknown[] = []

    if (calendarId) {
      query += ` AND cp.calendar_id = ?`
      params.push(Number(calendarId))
    }

    // Filter by user's accessible calendars
    if (user.role.name !== "super_admin" && user.role.name !== "network_admin") {
      query += ` AND (c.owner_user_id = ? OR c.owner_church_id = ?)`
      params.push(user.id, user.primary_church_id)
    }

    query += ` ORDER BY cp.created_at DESC`

    const permissions = await executeQuery(query, params)

    return NextResponse.json({
      success: true,
      permissions: permissions.map((perm) => ({
        id: Number(perm.id),
        calendar_name: String(perm.calendar_name),
        permission_type: String(perm.permission_type),
        granted_to:
          perm.church_name ||
          (perm.first_name ? `${String(perm.first_name)} ${String(perm.last_name)}` : null) ||
          String(perm.role_name || ""),
        expires_at: perm.expires_at ? String(perm.expires_at) : null,
        created_at: String(perm.created_at),
      })),
    })
  } catch (error) {
    console.error("Calendar permissions fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch calendar permissions" }, { status: 500 })
  }
}