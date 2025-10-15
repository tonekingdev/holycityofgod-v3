import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"


// POST /api/events/[id]/rsvp - RSVP to event
export async function POST(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const eventId = params.id
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const body = await request.json()
    const { attendance_status, special_requirements, attendee_name, attendee_email, attendee_phone } = body

    // Check if event exists
    const event = await executeQuery('SELECT * FROM events WHERE id = ? AND status != "cancelled"', [Number(eventId)])

    if (!event.length) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const evt = event[0]

    // Check if registration is still open
    if (evt.registration_deadline && new Date(String(evt.registration_deadline)) < new Date()) {
      return NextResponse.json({ error: "Registration deadline has passed" }, { status: 400 })
    }

    // Check if event is at capacity
    if (evt.max_attendees) {
      const currentAttendees = await executeQuery(
        'SELECT COUNT(*) as count FROM event_attendees WHERE event_id = ? AND attendance_status = "attending"',
        [Number(eventId)],
      )

      if (Number(currentAttendees[0].count) >= Number(evt.max_attendees)) {
        return NextResponse.json({ error: "Event is at full capacity" }, { status: 400 })
      }
    }

    // Insert or update RSVP
    await executeQuery(
      `
      INSERT INTO event_attendees (
        event_id, user_id, attendee_name, attendee_email, attendee_phone,
        church_id, attendance_status, special_requirements, response_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        attendance_status = VALUES(attendance_status),
        special_requirements = VALUES(special_requirements),
        response_at = NOW()
    `,
      [
        Number(eventId),
        user.id,
        String(attendee_name || `${user.first_name} ${user.last_name}`),
        String(attendee_email || user.email),
        String(attendee_phone || ""),
        user.primary_church_id,
        String(attendance_status || "attending"),
        String(special_requirements || ""),
      ],
    )

    return NextResponse.json({
      success: true,
      message: "RSVP recorded successfully",
    })
  } catch (error) {
    console.error("RSVP error:", error)
    return NextResponse.json({ error: "Failed to record RSVP" }, { status: 500 })
  }
}

// GET /api/events/[id]/rsvp - Get user's RSVP status
export async function GET(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const eventId = params.id
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult

    const rsvp = await executeQuery("SELECT * FROM event_attendees WHERE event_id = ? AND user_id = ?", [
      Number(eventId),
      user.id,
    ])

    return NextResponse.json({
      success: true,
      rsvp:
        rsvp.length > 0
          ? {
              attendance_status: String(rsvp[0].attendance_status),
              special_requirements: String(rsvp[0].special_requirements || ""),
              response_at: String(rsvp[0].response_at),
            }
          : null,
    })
  } catch (error) {
    console.error("RSVP fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch RSVP" }, { status: 500 })
  }
}
