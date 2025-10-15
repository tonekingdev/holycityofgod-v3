interface GoogleCalendarEvent {
  id: string
  summary?: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  location?: string
  attendees?: Array<{ email: string }>
  recurrence?: string[]
  status?: string
}

interface GoogleCalendarResponse {
  items?: GoogleCalendarEvent[]
}

interface MicrosoftCalendarEvent {
  id: string
  subject?: string
  body?: {
    content?: string
  }
  start: {
    dateTime: string
  }
  end: {
    dateTime: string
  }
  isAllDay?: boolean
  location?: {
    displayName?: string
  }
  attendees?: Array<{
    emailAddress: {
      address: string
    }
  }>
  recurrence?: unknown
  showAs?: string
}

interface MicrosoftCalendarResponse {
  value?: MicrosoftCalendarEvent[]
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  allDay: boolean
  location?: string
  attendees?: string[]
  recurrenceRule?: string
  status: string
}

export interface CalendarSyncSettings {
  syncDirection?: "import" | "export" | "bidirectional"
  eventTypes?: string[]
  reminderSettings?: {
    enabled: boolean
    defaultMinutes?: number
  }
}

export class GoogleCalendarProvider {
  private accessToken: string
  private refreshToken: string

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  async refreshAccessToken(): Promise<string> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: this.refreshToken,
        grant_type: "refresh_token",
      }),
    })

    const tokens = await response.json()
    if (!response.ok) {
      throw new Error(`Failed to refresh Google token: ${tokens.error}`)
    }

    this.accessToken = tokens.access_token
    return tokens.access_token
  }

  async getCalendarEvents(timeMin?: Date, timeMax?: Date): Promise<CalendarEvent[]> {
    try {
      const params = new URLSearchParams({
        singleEvents: "true",
        orderBy: "startTime",
        maxResults: "250",
      })

      if (timeMin) params.set("timeMin", timeMin.toISOString())
      if (timeMax) params.set("timeMax", timeMax.toISOString())

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      if (response.status === 401) {
        // Token expired, refresh and retry
        await this.refreshAccessToken()
        return this.getCalendarEvents(timeMin, timeMax)
      }

      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.statusText}`)
      }

      const data: GoogleCalendarResponse = await response.json()

      return (
        data.items?.map((event: GoogleCalendarEvent) => ({
          id: event.id,
          title: event.summary || "Untitled Event",
          description: event.description,
          startTime: new Date(event.start.dateTime || event.start.date || ""),
          endTime: new Date(event.end.dateTime || event.end.date || ""),
          allDay: !event.start.dateTime,
          location: event.location,
          attendees: event.attendees?.map((a) => a.email) || [],
          recurrenceRule: event.recurrence?.[0],
          status: event.status || "confirmed",
        })) || []
      )
    } catch (error) {
      console.error("Google Calendar fetch error:", error)
      throw error
    }
  }
}

export class MicrosoftCalendarProvider {
  private accessToken: string
  private refreshToken: string

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  async refreshAccessToken(): Promise<string> {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        refresh_token: this.refreshToken,
        grant_type: "refresh_token",
      }),
    })

    const tokens = await response.json()
    if (!response.ok) {
      throw new Error(`Failed to refresh Microsoft token: ${tokens.error}`)
    }

    this.accessToken = tokens.access_token
    return tokens.access_token
  }

  async getCalendarEvents(timeMin?: Date, timeMax?: Date): Promise<CalendarEvent[]> {
    try {
      let url = "https://graph.microsoft.com/v1.0/me/events?$top=250&$orderby=start/dateTime"

      if (timeMin || timeMax) {
        const filters = []
        if (timeMin) filters.push(`start/dateTime ge '${timeMin.toISOString()}'`)
        if (timeMax) filters.push(`start/dateTime le '${timeMax.toISOString()}'`)
        url += `&$filter=${filters.join(" and ")}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      if (response.status === 401) {
        // Token expired, refresh and retry
        await this.refreshAccessToken()
        return this.getCalendarEvents(timeMin, timeMax)
      }

      if (!response.ok) {
        throw new Error(`Microsoft Graph API error: ${response.statusText}`)
      }

      const data: MicrosoftCalendarResponse = await response.json()

      return (
        data.value?.map((event: MicrosoftCalendarEvent) => ({
          id: event.id,
          title: event.subject || "Untitled Event",
          description: event.body?.content,
          startTime: new Date(event.start.dateTime),
          endTime: new Date(event.end.dateTime),
          allDay: event.isAllDay || false,
          location: event.location?.displayName,
          attendees: event.attendees?.map((a) => a.emailAddress.address) || [],
          recurrenceRule: event.recurrence ? JSON.stringify(event.recurrence) : undefined,
          status: event.showAs || "busy",
        })) || []
      )
    } catch (error) {
      console.error("Microsoft Calendar fetch error:", error)
      throw error
    }
  }
}

import { CalDAVClient, type CalDAVEvent } from "./caldav-client"

export class AppleCalendarProvider {
  private caldavClient: CalDAVClient
  private calendarUrl: string

  constructor(icloudEmail: string, appPassword: string, calendarUrl?: string) {
    // Default to iCloud CalDAV server
    const baseUrl = calendarUrl || "https://caldav.icloud.com"
    this.caldavClient = new CalDAVClient(baseUrl, icloudEmail, appPassword)
    this.calendarUrl = calendarUrl || `${baseUrl}/${icloudEmail}/calendars/`
  }

  async discoverCalendars() {
    try {
      return await this.caldavClient.discoverCalendars()
    } catch (error) {
      console.error("Apple Calendar discovery error:", error)
      throw error
    }
  }

  async getCalendarEvents(timeMin?: Date, timeMax?: Date): Promise<CalendarEvent[]> {
    try {
      // First discover available calendars
      const calendars = await this.caldavClient.discoverCalendars()

      if (calendars.length === 0) {
        throw new Error("No calendars found in Apple Calendar")
      }

      // Get events from the first available calendar (primary)
      const primaryCalendar = calendars[0]
      const caldavEvents = await this.caldavClient.getCalendarEvents(primaryCalendar.url, timeMin, timeMax)

      // Convert CalDAV events to standard CalendarEvent format
      return caldavEvents.map((event: CalDAVEvent) => ({
        id: event.uid,
        title: event.summary || "Untitled Event",
        description: event.description,
        startTime: this.parseICalDateTime(event.dtstart),
        endTime: this.parseICalDateTime(event.dtend),
        allDay: this.isAllDayEvent(event.dtstart),
        location: event.location,
        attendees: [], // CalDAV attendees parsing would require more complex implementation
        recurrenceRule: event.rrule,
        status: event.status || "confirmed",
      }))
    } catch (error) {
      console.error("Apple Calendar fetch error:", error)
      throw error
    }
  }

  private parseICalDateTime(icalDateTime: string): Date {
    // Handle both DATE and DATETIME formats
    if (icalDateTime.length === 8) {
      // DATE format: YYYYMMDD
      const year = Number.parseInt(icalDateTime.substr(0, 4))
      const month = Number.parseInt(icalDateTime.substr(4, 2)) - 1
      const day = Number.parseInt(icalDateTime.substr(6, 2))
      return new Date(year, month, day)
    } else {
      // DATETIME format: YYYYMMDDTHHMMSSZ
      const year = Number.parseInt(icalDateTime.substr(0, 4))
      const month = Number.parseInt(icalDateTime.substr(4, 2)) - 1
      const day = Number.parseInt(icalDateTime.substr(6, 2))
      const hour = Number.parseInt(icalDateTime.substr(9, 2))
      const minute = Number.parseInt(icalDateTime.substr(11, 2))
      const second = Number.parseInt(icalDateTime.substr(13, 2))

      if (icalDateTime.endsWith("Z")) {
        return new Date(Date.UTC(year, month, day, hour, minute, second))
      } else {
        return new Date(year, month, day, hour, minute, second)
      }
    }
  }

  private isAllDayEvent(dtstart: string): boolean {
    // All-day events in iCal are represented as DATE (8 characters) instead of DATETIME
    return dtstart.length === 8
  }
}