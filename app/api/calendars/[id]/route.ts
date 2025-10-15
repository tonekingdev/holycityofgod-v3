import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { canPerformAction } from "@/lib/permissions"

// GET /api/calendars/[id] - Get calendar details
export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const calendarId = params.id
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult

    // Get calendar with permissions check
    const calendar = await executeQuery(
      `
      SELECT c.*, ct.name as calendar_type_name, ct.level,
             ch.name as church_name, u.first_name, u.last_name,
             m.name as ministry_name
      FROM calendars c
      JOIN calendar_types ct ON c.calendar_type_id = ct.id
      LEFT JOIN churches ch ON c.owner_church_id = ch.id
      LEFT JOIN users u ON c.owner_user_id = u.id
      LEFT JOIN ministries m ON c.owner_ministry_id = m.id
      WHERE c.id = ? AND c.is_active = 1
    `,
      [Number(calendarId)],
    )

    if (!calendar.length) {
      return NextResponse.json({ error: "Calendar not found" }, { status: 404 })
    }

    const cal = calendar[0]

    // Check access permissions
    const hasAccess =
      user.role.name === "super_admin" ||
      user.role.name === "network_admin" ||
      Number(cal.owner_user_id) === user.id ||
      Number(cal.owner_church_id) === user.primary_church_id ||
      !cal.owner_church_id // Network calendar

    if (!hasAccess) {
      // Check explicit permissions
      const permission = await executeQuery(
        `
        SELECT * FROM calendar_permissions 
        WHERE calendar_id = ? 
        AND (granted_to_church_id = ? OR granted_to_user_id = ? OR granted_to_role_id = ?)
        AND is_active = 1
        AND (expires_at IS NULL OR expires_at > NOW())
      `,
        [Number(calendarId), user.primary_church_id, user.id, user.role_id],
      )

      if (!permission.length) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    return NextResponse.json({
      success: true,
      calendar: {
        id: Number(cal.id),
        name: String(cal.name),
        description: String(cal.description || ""),
        type: String(cal.calendar_type_name),
        level: String(cal.level),
        church_name: String(cal.church_name || ""),
        owner_name: cal.first_name ? `${String(cal.first_name)} ${String(cal.last_name)}` : null,
        ministry_name: String(cal.ministry_name || ""),
        color_code: String(cal.color_code),
        is_default: Boolean(cal.is_default),
        settings: cal.settings ? JSON.parse(String(cal.settings)) : {},
      },
    })
  } catch (error) {
    console.error("Calendar fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 })
  }
}

// PUT /api/calendars/[id] - Update calendar
export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const calendarId = params.id
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const body = await request.json()
    const { name, description, color_code, settings, is_active } = body

    // Check if calendar exists and user has permission
    const calendar = await executeQuery("SELECT * FROM calendars WHERE id = ?", [Number(calendarId)])

    if (!calendar.length) {
      return NextResponse.json({ error: "Calendar not found" }, { status: 404 })
    }

    const cal = calendar[0]
    const canEdit =
      user.role.name === "super_admin" ||
      user.role.name === "network_admin" ||
      Number(cal.owner_user_id) === user.id ||
      (Number(cal.owner_church_id) === user.primary_church_id && canPerformAction(user, "event", "edit"))

    if (!canEdit) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Update calendar
    await executeQuery(
      `
      UPDATE calendars 
      SET name = ?, description = ?, color_code = ?, settings = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `,
      [
        String(name),
        String(description || ""),
        String(color_code || cal.color_code),
        settings ? JSON.stringify(settings) : cal.settings,
        is_active !== undefined ? Boolean(is_active) : Boolean(cal.is_active),
        Number(calendarId),
      ],
    )

    return NextResponse.json({ success: true, message: "Calendar updated successfully" })
  } catch (error) {
    console.error("Calendar update error:", error)
    return NextResponse.json({ error: "Failed to update calendar" }, { status: 500 })
  }
}

// DELETE /api/calendars/[id] - Delete calendar
export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const calendarId = params.id
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult

    // Check if calendar exists and user has permission
    const calendar = await executeQuery("SELECT * FROM calendars WHERE id = ?", [Number(calendarId)])

    if (!calendar.length) {
      return NextResponse.json({ error: "Calendar not found" }, { status: 404 })
    }

    const cal = calendar[0]
    const canDelete =
      user.role.name === "super_admin" ||
      user.role.name === "network_admin" ||
      Number(cal.owner_user_id) === user.id ||
      (Number(cal.owner_church_id) === user.primary_church_id && canPerformAction(user, "event", "delete"))

    if (!canDelete) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Soft delete calendar
    await executeQuery("UPDATE calendars SET is_active = 0, updated_at = NOW() WHERE id = ?", [Number(calendarId)])

    return NextResponse.json({ success: true, message: "Calendar deleted successfully" })
  } catch (error) {
    console.error("Calendar deletion error:", error)
    return NextResponse.json({ error: "Failed to delete calendar" }, { status: 500 })
  }
}