import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { canPerformAction } from "@/lib/permissions"

// GET /api/calendars - List calendars with filtering and permissions
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get("church_id")
    const calendarType = searchParams.get("type")

    let query = `
      SELECT DISTINCT c.*, ct.name as calendar_type_name, ct.level,
             ch.name as church_name, u.first_name, u.last_name,
             m.name as ministry_name
      FROM calendars c
      JOIN calendar_types ct ON c.calendar_type_id = ct.id
      LEFT JOIN churches ch ON c.owner_church_id = ch.id
      LEFT JOIN users u ON c.owner_user_id = u.id
      LEFT JOIN ministries m ON c.owner_ministry_id = m.id
      WHERE c.is_active = 1
    `
    const params: unknown[] = []

    // Filter by user's accessible calendars
    if (user.role.name !== "super_admin" && user.role.name !== "network_admin") {
      query += ` AND (
        c.owner_church_id = ? OR 
        c.owner_user_id = ? OR
        c.owner_church_id IS NULL OR
        EXISTS (
          SELECT 1 FROM calendar_permissions cp 
          WHERE cp.calendar_id = c.id 
          AND (cp.granted_to_church_id = ? OR cp.granted_to_user_id = ? OR cp.granted_to_role_id = ?)
          AND cp.is_active = 1
          AND (cp.expires_at IS NULL OR cp.expires_at > NOW())
        )
      )`
      params.push(user.primary_church_id, user.id, user.primary_church_id, user.id, user.role_id)
    }

    if (churchId) {
      query += ` AND c.owner_church_id = ?`
      params.push(Number(churchId))
    }

    if (calendarType) {
      query += ` AND ct.level = ?`
      params.push(calendarType)
    }

    query += ` ORDER BY ct.level, c.name`

    const calendars = await executeQuery(query, params)

    return NextResponse.json({
      success: true,
      calendars: calendars.map((cal) => ({
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
      })),
    })
  } catch (error) {
    console.error("Calendar list error:", error)
    return NextResponse.json({ error: "Failed to fetch calendars" }, { status: 500 })
  }
}

// POST /api/calendars - Create new calendar
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const body = await request.json()
    const { name, description, calendar_type_id, owner_church_id, owner_ministry_id, color_code, settings } = body

    if (!canPerformAction(user, "event", "create")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const calendarType = await executeQuery("SELECT * FROM calendar_types WHERE id = ?", [Number(calendar_type_id)])

    if (!calendarType.length) {
      return NextResponse.json({ error: "Invalid calendar type" }, { status: 400 })
    }

    const result = await executeQuery(
      `
      INSERT INTO calendars (
        name, description, calendar_type_id, owner_church_id, 
        owner_user_id, owner_ministry_id, color_code, settings, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        String(name),
        String(description || ""),
        Number(calendar_type_id),
        owner_church_id ? Number(owner_church_id) : null,
        user.id,
        owner_ministry_id ? Number(owner_ministry_id) : null,
        String(color_code || "#3B82F6"),
        settings ? JSON.stringify(settings) : null,
        user.id,
      ],
    )

    const resultArray = result as { insertId: number }[]
    const calendarId = resultArray.length > 0 ? Number(resultArray[0].insertId) : null

    if (!calendarId) {
      throw new Error("Failed to get calendar ID from database result")
    }

    const newCalendar = await executeQuery(
      `
      SELECT c.*, ct.name as calendar_type_name, ct.level,
             ch.name as church_name
      FROM calendars c
      JOIN calendar_types ct ON c.calendar_type_id = ct.id
      LEFT JOIN churches ch ON c.owner_church_id = ch.id
      WHERE c.id = ?
    `,
      [calendarId],
    )

    return NextResponse.json(
      {
        success: true,
        calendar: {
          id: Number(newCalendar[0].id),
          name: String(newCalendar[0].name),
          description: String(newCalendar[0].description || ""),
          type: String(newCalendar[0].calendar_type_name),
          level: String(newCalendar[0].level),
          church_name: String(newCalendar[0].church_name || ""),
          color_code: String(newCalendar[0].color_code),
          settings: newCalendar[0].settings ? JSON.parse(String(newCalendar[0].settings)) : {},
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Calendar creation error:", error)
    return NextResponse.json({ error: "Failed to create calendar" }, { status: 500 })
  }
}