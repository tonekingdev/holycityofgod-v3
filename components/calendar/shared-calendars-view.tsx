"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Church, Eye, Edit, Users, Clock } from "lucide-react"
import type { Calendar as CalendarType, CalendarEvent, Church as ChurchType, CalendarPermission } from "@/types"

interface ExtendedCalendar extends CalendarType {
  permissions?: CalendarPermission[]
  church?: ChurchType
}

interface SharedCalendarsViewProps {
  currentChurch: ChurchType
}

export function SharedCalendarsView({ currentChurch }: SharedCalendarsViewProps) {
  const [sharedCalendars, setSharedCalendars] = useState<ExtendedCalendar[]>([])
  const [networkEvents, setNetworkEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSharedCalendars = useCallback(async () => {
    try {
      const response = await fetch(`/api/calendars?shared_with=${currentChurch.id}`)
      const data = await response.json()
      setSharedCalendars(data)
    } catch (error) {
      console.error("Failed to fetch shared calendars:", error)
    }
  }, [currentChurch.id])

  const fetchNetworkEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events?type=network&upcoming=true")
      const data = await response.json()
      setNetworkEvents(data.slice(0, 5)) // Show next 5 network events
    } catch (error) {
      console.error("Failed to fetch network events:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSharedCalendars()
    fetchNetworkEvents()
  }, [fetchSharedCalendars, fetchNetworkEvents])

  if (loading) {
    return <div className="text-center py-8">Loading shared calendars...</div>
  }

  return (
    <div className="space-y-6">
      {/* Network Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            Upcoming Network Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {networkEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No upcoming network events.</p>
          ) : (
            <div className="space-y-3">
              {networkEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.event_date).toLocaleDateString()} at {event.start_time || "TBD"}
                        </span>
                        {event.location && <span className="text-sm text-muted-foreground">• {event.location}</span>}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">Network</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shared Church Calendars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="h-5 w-5 text-emerald-600" />
            Calendars Shared With Us
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sharedCalendars.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No calendars have been shared with your church yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sharedCalendars.map((calendar) => (
                <Card key={calendar.id} className="border-l-4 border-l-emerald-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{calendar.name}</CardTitle>
                      <Badge variant={calendar.permissions?.[0]?.permission_type === "edit" ? "default" : "secondary"}>
                        {calendar.permissions?.[0]?.permission_type === "edit" ? (
                          <>
                            <Edit className="h-3 w-3 mr-1" /> Edit
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" /> View
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Shared by: <span className="font-medium">{calendar.church?.name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Type: <span className="capitalize">{calendar.calendar_type?.name || "Standard"}</span>
                      </p>
                      {calendar.description && <p className="text-sm">{calendar.description}</p>}
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          View Calendar
                        </Button>
                        {calendar.permissions?.[0]?.permission_type === "edit" && (
                          <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                            Manage Events
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}