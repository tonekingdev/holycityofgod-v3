import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID
const MICROSOFT_REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/calendar/microsoft/callback"

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const state = crypto.randomUUID()

    await executeQuery("INSERT INTO oauth_states (user_id, state, provider, expires_at) VALUES (?, ?, ?, ?)", [
      user.id,
      state,
      "microsoft",
      new Date(Date.now() + 10 * 60 * 1000),
    ])

    const authUrl = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize")
    authUrl.searchParams.set("client_id", MICROSOFT_CLIENT_ID!)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("redirect_uri", MICROSOFT_REDIRECT_URI)
    authUrl.searchParams.set("response_mode", "query")
    authUrl.searchParams.set("scope", "https://graph.microsoft.com/calendars.read offline_access")
    authUrl.searchParams.set("state", state)

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error("Microsoft OAuth initiation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}