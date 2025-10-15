import { type NextRequest, NextResponse } from "next/server"
import { getUserById } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await getUserById(Number.parseInt(userId))

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        position: user.position,
        church: user.church,
        accessible_churches: user.accessible_churches,
      },
    })
  } catch (error) {
    console.error("[Anointed Innovations] Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}