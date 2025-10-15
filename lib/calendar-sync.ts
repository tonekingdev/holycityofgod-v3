import { executeQuery } from "@/lib/database"
import {
  GoogleCalendarProvider,
  MicrosoftCalendarProvider,
  AppleCalendarProvider,
  type CalendarEvent,
  type CalendarSyncSettings,
} from "@/lib/calendar-providers"

export interface CalendarSyncConnection {
  id: number
  user_id: number
  calendar_provider: string
  provider_calendar_id?: string
  calendar_name?: string
  access_token: string
  refresh_token: string
  token_expires_at: Date
  sync_direction: string
  sync_frequency: string
  sync_settings?: CalendarSyncSettings
  is_primary: boolean
  sync_status: string
  error_message?: string
  last_sync_at?: Date
  created_at: Date
  icloud_email?: string
  app_password?: string
  caldav_url?: string
}

export class CalendarSyncService {
  static async getUserSyncConnections(userId: number): Promise<CalendarSyncConnection[]> {
    const connections = await executeQuery(
      "SELECT * FROM personal_calendar_sync WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC",
      [userId],
    )
    return connections as unknown as CalendarSyncConnection[]
  }

  static async syncUserCalendars(userId: number): Promise<{ success: boolean; message: string; eventsSynced: number }> {
    try {
      const connections = await this.getUserSyncConnections(userId)
      let totalEventsSynced = 0

      for (const connection of connections.filter((c) => c.sync_status === "active")) {
        try {
          let provider
          let events: CalendarEvent[] = []

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
          } else if (connection.calendar_provider === "apple") {
            if (!connection.icloud_email || !connection.app_password) {
              throw new Error("Apple Calendar requires iCloud email and app-specific password")
            }
            provider = new AppleCalendarProvider(
              connection.icloud_email,
              connection.app_password,
              connection.caldav_url,
            )
            events = await provider.getCalendarEvents(
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
              new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days ahead
            )
          }

          // Sync events to database
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
                userId,
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

          totalEventsSynced += events.length

          // Update last sync time
          await executeQuery(
            "UPDATE personal_calendar_sync SET last_sync_at = NOW(), sync_status = 'active', error_message = NULL WHERE id = ?",
            [connection.id],
          )
        } catch (error) {
          console.error(`Sync failed for connection ${connection.id}:`, error)
          await executeQuery(
            "UPDATE personal_calendar_sync SET sync_status = 'error', error_message = ?, last_sync_at = NOW() WHERE id = ?",
            [error instanceof Error ? error.message : "Unknown error", connection.id],
          )
        }
      }

      return {
        success: true,
        message: `Successfully synced ${totalEventsSynced} events from ${connections.length} calendar(s)`,
        eventsSynced: totalEventsSynced,
      }
    } catch (error) {
      console.error("Calendar sync service error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown sync error",
        eventsSynced: 0,
      }
    }
  }

  static async connectAppleCalendar(
    userId: number,
    icloudEmail: string,
    appPassword: string,
    calendarName?: string,
    caldavUrl?: string,
  ): Promise<{ success: boolean; message: string; connectionId?: number }> {
    try {
      // Test the connection first
      const provider = new AppleCalendarProvider(icloudEmail, appPassword, caldavUrl)
      const calendars = await provider.discoverCalendars()

      if (calendars.length === 0) {
        return {
          success: false,
          message: "No calendars found. Please check your credentials.",
        }
      }

      // Store the connection
      const result = await executeQuery(
        `INSERT INTO personal_calendar_sync 
         (user_id, calendar_provider, calendar_name, icloud_email, app_password, caldav_url,
          sync_direction, sync_frequency, sync_status, is_primary, created_at)
         VALUES (?, 'apple', ?, ?, ?, ?, 'import', 'hourly', 'active', false, NOW())`,
        [
          userId,
          calendarName || calendars[0].displayName,
          icloudEmail,
          appPassword,
          caldavUrl || "https://caldav.icloud.com",
        ],
      )

      const insertResult = result as unknown as { insertId: number }

      return {
        success: true,
        message: `Apple Calendar "${calendarName || calendars[0].displayName}" connected successfully`,
        connectionId: insertResult.insertId,
      }
    } catch (error) {
      console.error("Apple Calendar connection error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to connect Apple Calendar",
      }
    }
  }

  static async disconnectCalendar(userId: number, syncId: number): Promise<{ success: boolean; message: string }> {
    try {
      // Remove sync connection
      await executeQuery("DELETE FROM personal_calendar_sync WHERE id = ? AND user_id = ?", [syncId, userId])

      // Remove synced events
      await executeQuery("DELETE FROM calendar_events WHERE sync_id = ? AND user_id = ?", [syncId, userId])

      return {
        success: true,
        message: "Calendar disconnected successfully",
      }
    } catch (error) {
      console.error("Calendar disconnect error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to disconnect calendar",
      }
    }
  }
}