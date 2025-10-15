import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET
const MICROSOFT_REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/calendar/microsoft/callback"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=oauth_denied`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=invalid_oauth`)
    }

    const stateData = await executeQuery(
      "SELECT user_id FROM oauth_states WHERE state = ? AND provider = 'microsoft' AND expires_at > NOW()",
      [state],
    )

    if (!stateData || stateData.length === 0) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=invalid_state`)
    }

    const userId = stateData[0].user_id

    // Exchange code for tokens
    const tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID!,
        client_secret: MICROSOFT_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: MICROSOFT_REDIRECT_URI,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error("Microsoft token exchange error:", tokens)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=token_exchange_failed`)
    }

    await executeQuery(
      `INSERT INTO personal_calendar_sync 
       (user_id, calendar_provider, access_token, refresh_token, token_expires_at, sync_status, created_at) 
       VALUES (?, 'microsoft', ?, ?, ?, 'active', NOW())
       ON DUPLICATE KEY UPDATE 
       access_token = VALUES(access_token), 
       refresh_token = VALUES(refresh_token), 
       token_expires_at = VALUES(token_expires_at),
       sync_status = 'active'`,
      [userId, tokens.access_token, tokens.refresh_token, new Date(Date.now() + tokens.expires_in * 1000)],
    )

    // Clean up OAuth state
    await executeQuery("DELETE FROM oauth_states WHERE state = ?", [state])

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile?success=microsoft_connected`)
  } catch (error) {
    console.error("Microsoft OAuth callback error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile?error=oauth_callback_failed`)
  }
}