import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { logSecurityEvent } from "@/lib/permissions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Authenticate user
    const result = await authenticateUser({ email, password })

    if (!result.success) {
      logSecurityEvent(null, "LOGIN_FAILED", "auth", false, { email })
      return NextResponse.json({ error: result.message }, { status: 401 })
    }

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user!.id,
        email: result.user!.email,
        first_name: result.user!.first_name,
        last_name: result.user!.last_name,
        role: result.user!.role,
        position: result.user!.position,
        church: result.user!.church,
      },
    })

    // Set auth token cookie
    response.cookies.set("auth-token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    logSecurityEvent(result.user!, "LOGIN_SUCCESS", "auth", true)

    return response
  } catch (error) {
    console.error("[Anointed Innovations] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}