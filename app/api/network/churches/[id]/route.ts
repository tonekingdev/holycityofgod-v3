import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { canPerformAction } from "@/lib/permissions"

// GET /api/network/churches/[id] - Get church details
export async function GET(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const churchId = params.id
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const church = await executeQuery(
      `
      SELECT fc.*, 
             COUNT(CASE WHEN e.is_network_event = 1 AND e.status = 'published' THEN 1 END) as network_events_count,
             u.first_name as created_by_first_name, u.last_name as created_by_last_name
      FROM fellowship_churches fc
      LEFT JOIN events e ON e.church_id = fc.id
      LEFT JOIN users u ON fc.created_by = u.id
      WHERE fc.id = ?
      GROUP BY fc.id
    `,
      [Number(churchId)],
    )

    if (!church.length) {
      return NextResponse.json({ error: "Church not found" }, { status: 404 })
    }

    const churchData = church[0]

    return NextResponse.json({
      success: true,
      church: {
        id: Number(churchData.id),
        name: String(churchData.name),
        pastor_name: String(churchData.pastor_name),
        address: String(churchData.address),
        phone: String(churchData.phone || ""),
        email: String(churchData.email || ""),
        website_url: String(churchData.website_url || ""),
        description: String(churchData.description || ""),
        is_active: Boolean(churchData.is_active),
        network_events_count: Number(churchData.network_events_count || 0),
        created_by: churchData.created_by_first_name
          ? `${String(churchData.created_by_first_name)} ${String(churchData.created_by_last_name)}`
          : "Unknown",
        created_at: String(churchData.created_at),
        updated_at: String(churchData.updated_at),
      },
    })
  } catch (error) {
    console.error("Church fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch church" }, { status: 500 })
  }
}

// PUT /api/network/churches/[id] - Update church
export async function PUT(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const churchId = params.id
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const body = await request.json()

    // Check permissions
    if (!canPerformAction(user, "network", "edit")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Check if church exists
    const church = await executeQuery("SELECT * FROM fellowship_churches WHERE id = ?", [Number(churchId)])

    if (!church.length) {
      return NextResponse.json({ error: "Church not found" }, { status: 404 })
    }

    // Check for name conflicts if name is being updated
    if (body.name && body.name !== church[0].name) {
      const existingChurch = await executeQuery("SELECT id FROM fellowship_churches WHERE name = ? AND id != ?", [
        String(body.name),
        Number(churchId),
      ])

      if (existingChurch.length > 0) {
        return NextResponse.json({ error: "A church with this name already exists" }, { status: 409 })
      }
    }

    // Update church
    const updateFields = []
    const updateValues = []

    const allowedFields = [
      "name",
      "pastor_name",
      "address",
      "phone",
      "email",
      "website_url",
      "description",
      "is_active",
    ]

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`)
        updateValues.push(body[field])
      }
    })

    if (updateFields.length > 0) {
      updateFields.push("updated_at = NOW()")
      updateValues.push(Number(churchId))

      await executeQuery(`UPDATE fellowship_churches SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)
    }

    return NextResponse.json({ success: true, message: "Church updated successfully" })
  } catch (error) {
    console.error("Church update error:", error)
    return NextResponse.json({ error: "Failed to update church" }, { status: 500 })
  }
}

// DELETE /api/network/churches/[id] - Delete church
export async function DELETE(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const churchId = params.id
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult

    // Check permissions
    if (!canPerformAction(user, "network", "delete")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Check if church exists
    const church = await executeQuery("SELECT * FROM fellowship_churches WHERE id = ?", [Number(churchId)])

    if (!church.length) {
      return NextResponse.json({ error: "Church not found" }, { status: 404 })
    }

    // Soft delete church
    await executeQuery("UPDATE fellowship_churches SET is_active = 0, updated_at = NOW() WHERE id = ?", [
      Number(churchId),
    ])

    return NextResponse.json({ success: true, message: "Church deleted successfully" })
  } catch (error) {
    console.error("Church deletion error:", error)
    return NextResponse.json({ error: "Failed to delete church" }, { status: 500 })
  }
}