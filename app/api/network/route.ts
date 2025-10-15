import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

// GET /api/network - Get network overview and statistics
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get churches statistics
    const churchStats = await executeQuery(`
      SELECT 
        COUNT(*) as total_churches,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_churches,
        COUNT(CASE WHEN is_active = 0 THEN 1 END) as inactive_churches,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month
      FROM fellowship_churches
    `)

    // Get businesses statistics
    const businessStats = await executeQuery(`
      SELECT 
        COUNT(*) as total_businesses,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_businesses,
        COUNT(CASE WHEN is_active = 0 THEN 1 END) as inactive_businesses,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month,
        COUNT(DISTINCT business_type) as business_types_count
      FROM partner_businesses
    `)

    // Get recent activity
    const recentActivity = await executeQuery(`
      (
        SELECT 'church' as type, name, created_at, updated_at, is_active
        FROM fellowship_churches 
        ORDER BY updated_at DESC 
        LIMIT 5
      )
      UNION ALL
      (
        SELECT 'business' as type, name, created_at, updated_at, is_active
        FROM partner_businesses 
        ORDER BY updated_at DESC 
        LIMIT 5
      )
      ORDER BY updated_at DESC
      LIMIT 10
    `)

    // Get business types distribution
    const businessTypes = await executeQuery(`
      SELECT business_type, COUNT(*) as count
      FROM partner_businesses 
      WHERE is_active = 1
      GROUP BY business_type
      ORDER BY count DESC
    `)

    const churchData = churchStats[0]
    const businessData = businessStats[0]

    return NextResponse.json({
      success: true,
      statistics: {
        churches: {
          total: Number(churchData.total_churches),
          active: Number(churchData.active_churches),
          inactive: Number(churchData.inactive_churches),
          newThisMonth: Number(churchData.new_this_month),
        },
        businesses: {
          total: Number(businessData.total_businesses),
          active: Number(businessData.active_businesses),
          inactive: Number(businessData.inactive_businesses),
          newThisMonth: Number(businessData.new_this_month),
          typesCount: Number(businessData.business_types_count),
        },
        network: {
          totalPartners: Number(churchData.total_churches) + Number(businessData.total_businesses),
          activePartners: Number(churchData.active_churches) + Number(businessData.active_businesses),
        },
      },
      recentActivity: recentActivity.map((activity) => ({
        type: String(activity.type),
        name: String(activity.name),
        isActive: Boolean(activity.is_active),
        createdAt: String(activity.created_at),
        updatedAt: String(activity.updated_at),
      })),
      businessTypes: businessTypes.map((type) => ({
        name: String(type.business_type),
        count: Number(type.count),
      })),
    })
  } catch (error) {
    console.error("Network overview error:", error)
    return NextResponse.json({ error: "Failed to fetch network overview" }, { status: 500 })
  }
}