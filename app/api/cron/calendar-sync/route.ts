import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { GoogleCalendarProvider, MicrosoftCalendarProvider, type CalendarEvent } from "@/lib/calendar-providers"
import type { CalendarSyncConnection } from "@/lib/calendar-sync"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const syncConnections = await executeQuery(
      `SELECT * FROM personal_calendar_sync 
       WHERE sync_status = 'active' 
       AND (last_sync_at IS NULL OR last_sync_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE))`,
    )

    const results = []

    for (const connection of syncConnections as unknown as CalendarSyncConnection[]) {
      try {
        let provider
        let events: CalendarEvent[] = []

        // Initialize the appropriate provider
        if (connection.calendar_provider === "google") {
          provider = new GoogleCalendarProvider(connection.access_token, connection.refresh_token)
          events = await provider.getCalendarEvents(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days ahead
          )
        } else if (connection.calendar_provider === "microsoft") {
          provider = new MicrosoftCalendarProvider(connection.access_token, connection.refresh_token)
          events = await provider.getCalendarEvents(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days ahead
          )
        }

        for (const event of events) {
          await executeQuery(
            `INSERT INTO calendar_events 
             (user_id, sync_id, external_event_id, title, description, start_time, end_time, 
              all_day, location, attendees, recurrence_rule, status, last_synced_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE 
             title = VALUES(title), description = VALUES(description), 
             start_time = VALUES(start_time), end_time = VALUES(end_time),
             all_day = VALUES(all_day), location = VALUES(location),
             attendees = VALUES(attendees), recurrence_rule = VALUES(recurrence_rule),
             status = VALUES(status), last_synced_at = NOW()`,
            [
              connection.user_id,
              connection.id,
              event.id,
              event.title,
              event.description || null,
              event.startTime,
              event.endTime,
              event.allDay,
              event.location || null,
              event.attendees ? JSON.stringify(event.attendees) : null,
              event.recurrenceRule || null,
              event.status,
            ],
          )
        }

        // Update last sync time
        await executeQuery(
          "UPDATE personal_calendar_sync SET last_sync_at = NOW(), sync_status = 'active', error_message = NULL WHERE id = ?",
          [connection.id],
        )

        results.push({
          connectionId: connection.id,
          provider: connection.calendar_provider,
          userId: connection.user_id,
          eventsSynced: events.length,
          status: "success",
        })
      } catch (error) {
        console.error(`Sync failed for connection ${connection.id}:`, error)

        // Update sync status with error
        await executeQuery(
          "UPDATE personal_calendar_sync SET sync_status = 'error', error_message = ?, last_sync_at = NOW() WHERE id = ?",
          [error instanceof Error ? error.message : "Unknown error", connection.id],
        )

        results.push({
          connectionId: connection.id,
          provider: connection.calendar_provider,
          userId: connection.user_id,
          eventsSynced: 0,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      message: "Calendar sync completed",
      connectionsProcessed: syncConnections.length,
      results,
    })
  } catch (error) {
    console.error("Calendar sync cron job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}