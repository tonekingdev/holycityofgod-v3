import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    // Clear auth token cookie
    response.cookies.delete("auth-token")

    return response
  } catch (error) {
    console.error("[Anointed Innovations] Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}