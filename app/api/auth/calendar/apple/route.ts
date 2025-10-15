import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "iCloud email and app-specific password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // For Apple Calendar, we don't have a traditional OAuth flow
    // Instead, we validate the credentials by attempting a CalDAV connection
    const { CalDAVClient } = await import("@/lib/caldav-client")
    const caldavClient = new CalDAVClient("https://caldav.icloud.com", email, password)

    try {
      // Test the connection by discovering calendars
      const calendars = await caldavClient.discoverCalendars()

      if (calendars.length === 0) {
        return NextResponse.json({ error: "No calendars found. Please check your credentials." }, { status: 401 })
      }

      // Store credentials securely (in a real app, encrypt these)
      // For now, we'll return a success response with calendar info
      return NextResponse.json({
        success: true,
        message: "Apple Calendar connected successfully",
        calendars: calendars.map((cal) => ({
          name: cal.displayName,
          url: cal.url,
        })),
        provider: "apple",
        email: email,
      })
    } catch (caldavError) {
      console.error("CalDAV connection error:", caldavError)
      return NextResponse.json(
        {
          error: "Failed to connect to Apple Calendar. Please check your iCloud email and app-specific password.",
          details: "Make sure you have generated an app-specific password in your Apple ID settings.",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Apple Calendar auth error:", error)
    return NextResponse.json({ error: "Internal server error during Apple Calendar authentication" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    provider: "apple",
    authType: "credentials",
    instructions: [
      "1. Use your iCloud email address",
      "2. Generate an app-specific password at appleid.apple.com",
      "3. Go to Sign-In and Security > App-Specific Passwords",
      "4. Create a new password for this calendar integration",
      "5. Use the generated password (not your regular iCloud password)",
    ],
  })
}
