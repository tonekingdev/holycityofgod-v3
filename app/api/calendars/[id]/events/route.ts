import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

// GET /api/calendars/[id] - Get specific calendar
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

    const calendar = await executeQuery(
      `
      SELECT c.*, ct.name as type_name, ct.level as type_level 
      FROM calendars c
      JOIN calendar_types ct ON c.calendar_type_id = ct.id
      WHERE c.id = ? AND c.is_active = 1
      `,
      [Number(calendarId)]
    )

    if (!calendar.length) {
      return NextResponse.json({ error: "Calendar not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      calendar: {
        id: Number(calendar[0].id),
        name: String(calendar[0].name),
        description: String(calendar[0].description || ""),
        color: String(calendar[0].color),
        type_name: String(calendar[0].type_name),
        type_level: String(calendar[0].type_level),
        is_active: Boolean(calendar[0].is_active),
        created_at: String(calendar[0].created_at),
        updated_at: String(calendar[0].updated_at),
      }
    })
  } catch (error) {
    console.error("Calendar fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 })
  }
}

// PUT /api/calendars/[id] - Update specific calendar
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

    const body = await request.json()
    
    // Check if calendar exists and user has permission to edit
    const existingCalendar = await executeQuery(
      "SELECT * FROM calendars WHERE id = ?",
      [Number(calendarId)]
    )

    if (!existingCalendar.length) {
      return NextResponse.json({ error: "Calendar not found" }, { status: 404 })
    }

    // Update calendar
    await executeQuery(
      `
      UPDATE calendars 
      SET name = ?, description = ?, color = ?, updated_at = NOW()
      WHERE id = ?
      `,
      [body.name, body.description, body.color, Number(calendarId)]
    )

    return NextResponse.json({ 
      success: true, 
      message: "Calendar updated successfully" 
    })
  } catch (error) {
    console.error("Calendar update error:", error)
    return NextResponse.json({ error: "Failed to update calendar" }, { status: 500 })
  }
}

// DELETE /api/calendars/[id] - Delete specific calendar
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

    // Check if calendar exists
    const existingCalendar = await executeQuery(
      "SELECT * FROM calendars WHERE id = ?",
      [Number(calendarId)]
    )

    if (!existingCalendar.length) {
      return NextResponse.json({ error: "Calendar not found" }, { status: 404 })
    }

    // Soft delete the calendar
    await executeQuery(
      "UPDATE calendars SET is_active = 0, updated_at = NOW() WHERE id = ?",
      [Number(calendarId)]
    )

    return NextResponse.json({ 
      success: true, 
      message: "Calendar deleted successfully" 
    })
  } catch (error) {
    console.error("Calendar delete error:", error)
    return NextResponse.json({ error: "Failed to delete calendar" }, { status: 500 })
  }
}