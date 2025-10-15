import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

// GET /api/calendars/availability - Check user availability
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id") || user.id
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const includeEvents = searchParams.get("include_events") === "true"

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "start_date and end_date are required" }, { status: 400 })
    }

    // Get personal availability
    const availability = await executeQuery(
      `
      SELECT * FROM personal_availability 
      WHERE user_id = ? AND date BETWEEN ? AND ?
      ORDER BY date, start_time
    `,
      [Number(userId), startDate, endDate],
    )

    let events: Record<string, unknown>[] = []
    if (includeEvents) {
      // Get user's events in the date range
      events = await executeQuery(
        `
        SELECT e.*, c.name as calendar_name, c.color_code,
               ea.attendance_status
        FROM events e
        JOIN calendars c ON e.calendar_id = c.id
        LEFT JOIN event_attendees ea ON e.id = ea.event_id AND ea.user_id = ?
        WHERE e.event_date BETWEEN ? AND ?
        AND (e.created_by = ? OR ea.user_id = ? OR e.visibility = 'public')
        AND e.status != 'cancelled'
        ORDER BY e.event_date, e.start_time
      `,
        [Number(userId), startDate, endDate, Number(userId), Number(userId)],
      )
    }

    // Detect conflicts
    const conflicts = await executeQuery(
      `
      SELECT ec.*, e1.title as event_title, e2.title as conflicting_event_title
      FROM event_conflicts ec
      JOIN events e1 ON ec.event_id = e1.id
      LEFT JOIN events e2 ON ec.conflicting_event_id = e2.id
      WHERE ec.user_id = ? AND e1.event_date BETWEEN ? AND ?
      AND ec.resolution_status = 'unresolved'
      ORDER BY e1.event_date, e1.start_time
    `,
      [Number(userId), startDate, endDate],
    )

    return NextResponse.json({
      success: true,
      availability: availability.map((avail) => ({
        id: Number(avail.id),
        date: String(avail.date),
        start_time: String(avail.start_time),
        end_time: String(avail.end_time),
        availability_type: String(avail.availability_type),
        title: String(avail.title || ""),
        source: String(avail.source),
        is_private: Boolean(avail.is_private),
      })),
      events: events.map((event) => ({
        id: Number(event.id),
        title: String(event.title),
        event_date: String(event.event_date),
        start_time: String(event.start_time || ""),
        end_time: String(event.end_time || ""),
        calendar_name: String(event.calendar_name),
        calendar_color: String(event.color_code),
        attendance_status: String(event.attendance_status || "invited"),
      })),
      conflicts: conflicts.map((conflict) => ({
        id: Number(conflict.id),
        event_title: String(conflict.event_title),
        conflicting_event_title: String(conflict.conflicting_event_title || ""),
        conflict_type: String(conflict.conflict_type),
        conflict_severity: String(conflict.conflict_severity),
        description: String(conflict.description || ""),
      })),
    })
  } catch (error) {
    console.error("Availability fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}

// POST /api/calendars/availability - Add personal availability
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const body = await request.json()
    const { date, start_time, end_time, availability_type, title, is_private, notes } = body

    // Insert availability
    await executeQuery(
      `
      INSERT INTO personal_availability (
        user_id, date, start_time, end_time, availability_type,
        title, source, is_private, notes
      ) VALUES (?, ?, ?, ?, ?, ?, 'manual', ?, ?)
    `,
      [
        user.id,
        String(date),
        String(start_time),
        String(end_time),
        String(availability_type),
        String(title || ""),
        Boolean(is_private),
        String(notes || ""),
      ],
    )

    return NextResponse.json(
      {
        success: true,
        message: "Availability added successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Availability creation error:", error)
    return NextResponse.json({ error: "Failed to add availability" }, { status: 500 })
  }
}