import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

// GET /api/calendars/sync - Get user's calendar sync settings
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult

    const syncSettings = await executeQuery(
      "SELECT * FROM personal_calendar_sync WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC",
      [user.id],
    )

    return NextResponse.json({
      success: true,
      sync_settings: syncSettings.map((sync) => ({
        id: Number(sync.id),
        calendar_provider: String(sync.calendar_provider),
        calendar_name: String(sync.calendar_name || ""),
        sync_direction: String(sync.sync_direction),
        sync_frequency: String(sync.sync_frequency),
        last_sync_at: sync.last_sync_at ? String(sync.last_sync_at) : null,
        sync_status: String(sync.sync_status),
        error_message: String(sync.error_message || ""),
        is_primary: Boolean(sync.is_primary),
      })),
    })
  } catch (error) {
    console.error("Calendar sync fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch sync settings" }, { status: 500 })
  }
}

// POST /api/calendars/sync - Add new calendar sync
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const body = await request.json()
    const {
      calendar_provider,
      provider_calendar_id,
      calendar_name,
      sync_direction,
      sync_frequency,
      sync_settings,
      is_primary,
    } = body

    // If this is primary, unset other primary syncs
    if (is_primary) {
      await executeQuery("UPDATE personal_calendar_sync SET is_primary = 0 WHERE user_id = ?", [user.id])
    }

    // Insert new sync setting
    await executeQuery(
      `
      INSERT INTO personal_calendar_sync (
        user_id, calendar_provider, provider_calendar_id, calendar_name,
        sync_direction, sync_frequency, sync_settings, is_primary, sync_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `,
      [
        user.id,
        String(calendar_provider),
        String(provider_calendar_id),
        String(calendar_name || ""),
        String(sync_direction || "import_only"),
        String(sync_frequency || "daily"),
        sync_settings ? JSON.stringify(sync_settings) : null,
        Boolean(is_primary),
      ],
    )

    return NextResponse.json(
      {
        success: true,
        message: "Calendar sync added successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Calendar sync creation error:", error)
    return NextResponse.json({ error: "Failed to add calendar sync" }, { status: 500 })
  }
}