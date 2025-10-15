import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

// GET /api/calendars/types - Get available calendar types
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const { searchParams } = new URL(request.url)
    const level = searchParams.get("level")

    let query = "SELECT * FROM calendar_types WHERE 1=1"
    const params: unknown[] = []

    if (level) {
      query += " AND level = ?"
      params.push(level)
    }

    // Filter based on user permissions
    if (user.role.name !== "super_admin" && user.role.name !== "network_admin") {
      // Regular users can only see certain calendar types
      query += ' AND level IN ("church", "ministry", "personal")'
    }

    query += " ORDER BY level, name"

    const calendarTypes = await executeQuery(query, params)

    return NextResponse.json({
      success: true,
      calendar_types: calendarTypes.map((type) => ({
        id: Number(type.id),
        name: String(type.name),
        description: String(type.description || ""),
        level: String(type.level),
        default_visibility: String(type.default_visibility),
        can_share_across_churches: Boolean(type.can_share_across_churches),
      })),
    })
  } catch (error) {
    console.error("Calendar types fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch calendar types" }, { status: 500 })
  }
}
