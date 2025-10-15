export interface CalDAVEvent {
  uid: string
  summary?: string
  description?: string
  dtstart: string
  dtend: string
  location?: string
  rrule?: string
  status?: string
}

export interface CalDAVCalendar {
  displayName: string
  url: string
  ctag: string
  color?: string
}

export class CalDAVClient {
  private baseUrl: string
  private username: string
  private password: string

  constructor(baseUrl: string, username: string, password: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "") // Remove trailing slash
    this.username = username
    this.password = password
  }

  private getAuthHeaders(): Record<string, string> {
    const credentials = btoa(`${this.username}:${this.password}`)
    return {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/xml; charset=utf-8",
      Depth: "1",
    }
  }

  async discoverCalendars(): Promise<CalDAVCalendar[]> {
    const propfindBody = `<?xml version="1.0" encoding="utf-8" ?>
      <d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav" xmlns:cs="http://calendarserver.org/ns/">
        <d:prop>
          <d:displayname />
          <d:resourcetype />
          <c:calendar-description />
          <cs:getctag />
          <c:supported-calendar-component-set />
        </d:prop>
      </d:propfind>`

    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: "PROPFIND",
        headers: this.getAuthHeaders(),
        body: propfindBody,
      })

      if (!response.ok) {
        throw new Error(`CalDAV discovery failed: ${response.statusText}`)
      }

      const xmlText = await response.text()
      return this.parseCalendarList(xmlText)
    } catch (error) {
      console.error("CalDAV calendar discovery error:", error)
      throw error
    }
  }

  async getCalendarEvents(calendarUrl: string, timeMin?: Date, timeMax?: Date): Promise<CalDAVEvent[]> {
    const reportBody = `<?xml version="1.0" encoding="utf-8" ?>
      <c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
        <d:prop>
          <d:getetag />
          <c:calendar-data />
        </d:prop>
        <c:filter>
          <c:comp-filter name="VCALENDAR">
            <c:comp-filter name="VEVENT">
              ${
                timeMin || timeMax
                  ? `
                <c:time-range ${timeMin ? `start="${timeMin.toISOString().replace(/[-:]/g, "").split(".")[0]}Z"` : ""} 
                             ${timeMax ? `end="${timeMax.toISOString().replace(/[-:]/g, "").split(".")[0]}Z"` : ""} />
              `
                  : ""
              }
            </c:comp-filter>
          </c:comp-filter>
        </c:filter>
      </c:calendar-query>`

    try {
      const response = await fetch(calendarUrl, {
        method: "REPORT",
        headers: this.getAuthHeaders(),
        body: reportBody,
      })

      if (!response.ok) {
        throw new Error(`CalDAV events fetch failed: ${response.statusText}`)
      }

      const xmlText = await response.text()
      return this.parseEventList(xmlText)
    } catch (error) {
      console.error("CalDAV events fetch error:", error)
      throw error
    }
  }

  private parseCalendarList(xmlText: string): CalDAVCalendar[] {
    const calendars: CalDAVCalendar[] = []

    // Simple XML parsing for calendar discovery
    const responseRegex = /<d:response[^>]*>([\s\S]*?)<\/d:response>/g
    const responses = xmlText.match(responseRegex) || []

    for (const response of responses) {
      const hrefMatch = response.match(/<d:href[^>]*>(.*?)<\/d:href>/)
      const displayNameMatch = response.match(/<d:displayname[^>]*>(.*?)<\/d:displayname>/)
      const ctagMatch = response.match(/<cs:getctag[^>]*>(.*?)<\/cs:getctag>/)
      const resourceTypeMatch = response.match(/<c:calendar\s*\/?>/)

      if (hrefMatch && displayNameMatch && resourceTypeMatch) {
        calendars.push({
          displayName: displayNameMatch[1],
          url: this.baseUrl + hrefMatch[1],
          ctag: ctagMatch?.[1] || "",
        })
      }
    }

    return calendars
  }

  private parseEventList(xmlText: string): CalDAVEvent[] {
    const events: CalDAVEvent[] = []

    // Extract calendar data from XML responses
    const calendarDataRegex = /<c:calendar-data[^>]*>([\s\S]*?)<\/c:calendar-data>/g
    const calendarDataMatches = xmlText.match(calendarDataRegex) || []

    for (const calendarData of calendarDataMatches) {
      const icalData = calendarData.replace(/<\/?c:calendar-data[^>]*>/g, "").trim()
      const event = this.parseICalEvent(icalData)
      if (event) {
        events.push(event)
      }
    }

    return events
  }

  private parseICalEvent(icalData: string): CalDAVEvent | null {
    try {
      const lines = icalData.split(/\r?\n/)
      const event: Partial<CalDAVEvent> = {}

      for (const line of lines) {
        const [key, ...valueParts] = line.split(":")
        const value = valueParts.join(":")

        switch (key.split(";")[0]) {
          case "UID":
            event.uid = value
            break
          case "SUMMARY":
            event.summary = value
            break
          case "DESCRIPTION":
            event.description = value
            break
          case "DTSTART":
            event.dtstart = value
            break
          case "DTEND":
            event.dtend = value
            break
          case "LOCATION":
            event.location = value
            break
          case "RRULE":
            event.rrule = value
            break
          case "STATUS":
            event.status = value
            break
        }
      }

      return event.uid && event.dtstart && event.dtend ? (event as CalDAVEvent) : null
    } catch (error) {
      console.error("iCal parsing error:", error)
      return null
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
}