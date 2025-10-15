import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

// GET /api/events - Get all events (regular route, NOT dynamic)
export async function GET(
  request: NextRequest, 
  context: { params: Promise<Record<string, never>> } // Use Record<string, never> instead of {}
) {
  try {
    await context.params // Awaited but not used since this is a regular route
    
    const authResult = await verifyAuth(request)
    
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Your regular events listing logic here
    const events = await executeQuery(`
      SELECT * FROM events 
      WHERE status != 'cancelled' 
      ORDER BY event_date DESC
    `)

    return NextResponse.json({ success: true, events })
  } catch (error) {
    console.error("Events fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// POST /api/events - Create new event (regular route)
export async function POST(
  request: NextRequest, 
  context: { params: Promise<Record<string, never>> } // Use Record<string, never> instead of {}
) {
  try {
    await context.params // Awaited but not used since this is a regular route
    
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, event_date, start_time, end_time, location, event_category, calendar_id } = body

    // Your create event logic here
    await executeQuery(
      `
      INSERT INTO events (title, description, event_date, start_time, end_time, location, event_category, calendar_id, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        String(title),
        String(description || ""),
        String(event_date),
        String(start_time || ""),
        String(end_time || ""),
        String(location || ""),
        String(event_category),
        Number(calendar_id),
        authResult.user.id,
      ]
    )

    return NextResponse.json({ success: true, message: "Event created successfully" })
  } catch (error) {
    console.error("Event creation error:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}