import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { canPerformAction } from "@/lib/permissions"


// GET /api/network/businesses/[id] - Get business details
export async function GET(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const businessId = params.id
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const business = await executeQuery(
      `
      SELECT pb.*, 
             u.first_name as created_by_first_name, u.last_name as created_by_last_name
      FROM partner_businesses pb
      LEFT JOIN users u ON pb.created_by = u.id
      WHERE pb.id = ?
    `,
      [Number(businessId)],
    )

    if (!business.length) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    const businessData = business[0]

    return NextResponse.json({
      success: true,
      business: {
        id: Number(businessData.id),
        name: String(businessData.name),
        business_type: String(businessData.business_type),
        contact_person: String(businessData.contact_person),
        address: String(businessData.address),
        phone: String(businessData.phone || ""),
        email: String(businessData.email || ""),
        website_url: String(businessData.website_url || ""),
        description: String(businessData.description || ""),
        is_active: Boolean(businessData.is_active),
        created_by: businessData.created_by_first_name
          ? `${String(businessData.created_by_first_name)} ${String(businessData.created_by_last_name)}`
          : "Unknown",
        created_at: String(businessData.created_at),
        updated_at: String(businessData.updated_at),
      },
    })
  } catch (error) {
    console.error("Business fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 })
  }
}

// PUT /api/network/businesses/[id] - Update business
export async function PUT(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const businessId = params.id
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

    // Check if business exists
    const business = await executeQuery("SELECT * FROM partner_businesses WHERE id = ?", [Number(businessId)])

    if (!business.length) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Check for name conflicts if name is being updated
    if (body.name && body.name !== business[0].name) {
      const existingBusiness = await executeQuery("SELECT id FROM partner_businesses WHERE name = ? AND id != ?", [
        String(body.name),
        Number(businessId),
      ])

      if (existingBusiness.length > 0) {
        return NextResponse.json({ error: "A business with this name already exists" }, { status: 409 })
      }
    }

    // Update business
    const updateFields = []
    const updateValues = []

    const allowedFields = [
      "name",
      "business_type",
      "contact_person",
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
      updateValues.push(Number(businessId))

      await executeQuery(`UPDATE partner_businesses SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)
    }

    return NextResponse.json({ success: true, message: "Business updated successfully" })
  } catch (error) {
    console.error("Business update error:", error)
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 })
  }
}

// DELETE /api/network/businesses/[id] - Delete business
export async function DELETE(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const businessId = params.id
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult

    // Check permissions
    if (!canPerformAction(user, "network", "delete")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Check if business exists
    const business = await executeQuery("SELECT * FROM partner_businesses WHERE id = ?", [Number(businessId)])

    if (!business.length) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Soft delete business
    await executeQuery("UPDATE partner_businesses SET is_active = 0, updated_at = NOW() WHERE id = ?", [
      Number(businessId),
    ])

    return NextResponse.json({ success: true, message: "Business deleted successfully" })
  } catch (error) {
    console.error("Business deletion error:", error)
    return NextResponse.json({ error: "Failed to delete business" }, { status: 500 })
  }
}