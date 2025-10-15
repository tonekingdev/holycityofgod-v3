import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/calendar/google/callback"

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult

    // Generate state parameter for security
    const state = crypto.randomUUID()

    await executeQuery("INSERT INTO oauth_states (user_id, state, provider, expires_at) VALUES (?, ?, ?, ?)", [
      user.id,
      state,
      "google",
      new Date(Date.now() + 10 * 60 * 1000),
    ])

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID!)
    authUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/calendar.readonly")
    authUrl.searchParams.set("access_type", "offline")
    authUrl.searchParams.set("prompt", "consent")
    authUrl.searchParams.set("state", state)

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error("Google OAuth initiation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}