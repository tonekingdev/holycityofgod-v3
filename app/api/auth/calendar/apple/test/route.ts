import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, calendarUrl } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { AppleCalendarProvider } = await import("@/lib/calendar-providers")

    try {
      const provider = new AppleCalendarProvider(email, password, calendarUrl)

      // Test by fetching recent events
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7) // Last 7 days

      const events = await provider.getCalendarEvents(startDate, endDate)

      return NextResponse.json({
        success: true,
        message: `Successfully connected to Apple Calendar`,
        eventCount: events.length,
        sampleEvents: events.slice(0, 3).map((event) => ({
          title: event.title,
          startTime: event.startTime,
          allDay: event.allDay,
        })),
      })
    } catch (providerError) {
      console.error("Apple Calendar provider error:", providerError)
      return NextResponse.json(
        {
          error: "Failed to connect to Apple Calendar",
          details: providerError instanceof Error ? providerError.message : "Unknown error",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Apple Calendar test error:", error)
    return NextResponse.json({ error: "Internal server error during connection test" }, { status: 500 })
  }
}