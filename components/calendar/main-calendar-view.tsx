"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarIcon, ChevronLeft, ChevronRight, Filter, Plus, Users, MapPin, Clock } from "lucide-react"
import {
  format,
  addDays,
  addMonths,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns"
import type { CalendarEvent, Calendar as CalendarType } from "@/types"

interface MainCalendarViewProps {
  userId?: string
  churchId?: string
  showAllCalendars?: boolean
}

type ViewType = "month" | "week" | "day" | "agenda"

export function MainCalendarView({ userId, churchId, showAllCalendars = false }: MainCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>("month")
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [calendars, setCalendars] = useState<CalendarType[]>([])
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCalendars = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (churchId) params.append("church_id", churchId)
      if (showAllCalendars) params.append("include_shared", "true")

      const response = await fetch(`/api/calendars?${params}`)
      const data = await response.json()

      if (data.success) {
        setCalendars(data.calendars)
        // Auto-select all calendars initially
        if (selectedCalendars.length === 0) {
          setSelectedCalendars(data.calendars.map((cal: CalendarType) => cal.id))
        }
      }
    } catch (error) {
      console.error("Failed to fetch calendars:", error)
    }
  }, [churchId, showAllCalendars, selectedCalendars.length])

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams()

      // Set date range based on view type
      let startDate: Date, endDate: Date
      switch (viewType) {
        case "month":
          startDate = startOfMonth(currentDate)
          endDate = endOfMonth(currentDate)
          break
        case "week":
          startDate = startOfWeek(currentDate)
          endDate = addDays(startOfWeek(currentDate), 6)
          break
        case "day":
          startDate = currentDate
          endDate = currentDate
          break
        case "agenda":
          startDate = currentDate
          endDate = addDays(currentDate, 30)
          break
      }

      params.append("start_date", format(startDate, "yyyy-MM-dd"))
      params.append("end_date", format(endDate, "yyyy-MM-dd"))

      if (selectedCalendars.length > 0) {
        params.append("calendar_ids", selectedCalendars.join(","))
      }
      if (userId) params.append("user_id", userId)
      if (churchId) params.append("church_id", churchId)

      const response = await fetch(`/api/events?${params}`)
      const data = await response.json()

      if (data.success) {
        setEvents(data.events)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }, [currentDate, viewType, selectedCalendars, userId, churchId])

  useEffect(() => {
    fetchCalendars()
    fetchEvents()
  }, [fetchCalendars, fetchEvents])

  const navigateDate = (direction: "prev" | "next") => {
    switch (viewType) {
      case "month":
        setCurrentDate((prev) => addMonths(prev, direction === "next" ? 1 : -1))
        break
      case "week":
        setCurrentDate((prev) => addDays(prev, direction === "next" ? 7 : -7))
        break
      case "day":
        setCurrentDate((prev) => addDays(prev, direction === "next" ? 1 : -1))
        break
      case "agenda":
        setCurrentDate((prev) => addDays(prev, direction === "next" ? 30 : -30))
        break
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.event_date), date))
  }

  const getEventCategoryColor = (category: string) => {
    const colors = {
      service: "bg-blue-100 text-blue-800 border-blue-200",
      meeting: "bg-emerald-100 text-emerald-800 border-emerald-200",
      convention: "bg-purple-100 text-purple-800 border-purple-200",
      outreach: "bg-orange-100 text-orange-800 border-orange-200",
      fellowship: "bg-pink-100 text-pink-800 border-pink-200",
      training: "bg-indigo-100 text-indigo-800 border-indigo-200",
      conference: "bg-red-100 text-red-800 border-red-200",
      special: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const toggleCalendar = (calendarId: string) => {
    setSelectedCalendars((prev) =>
      prev.includes(calendarId) ? prev.filter((id) => id !== calendarId) : [...prev, calendarId],
    )
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = addDays(startOfWeek(monthEnd), 6)

    const days = []
    let day = startDate

    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Header */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="p-2 text-center font-medium text-muted-foreground border-b">
            {dayName}
          </div>
        ))}

        {/* Days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b cursor-pointer hover:bg-gray-50 ${
                !isCurrentMonth ? "bg-gray-50 text-muted-foreground" : ""
              } ${isDayToday ? "bg-emerald-50 border-emerald-200" : ""}`}
              onClick={() => {
                setCurrentDate(day)
                setViewType("day")
              }}
            >
              <div className={`text-sm font-medium mb-1 ${isDayToday ? "text-emerald-700" : ""}`}>
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded cursor-pointer truncate ${getEventCategoryColor(event.event_category)}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEvent(event)
                    }}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="grid grid-cols-8 gap-1 h-[600px]">
        {/* Time column */}
        <div className="border-r">
          <div className="h-12 border-b"></div>
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="h-6 border-b text-xs text-muted-foreground p-1">
              {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDate(day)
          const isDayToday = isToday(day)

          return (
            <div key={index} className="border-r">
              <div className={`h-12 border-b p-2 text-center ${isDayToday ? "bg-emerald-50 text-emerald-700" : ""}`}>
                <div className="font-medium">{format(day, "EEE")}</div>
                <div className="text-sm">{format(day, "d")}</div>
              </div>
              <div className="relative">
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="h-6 border-b"></div>
                ))}
                {/* Events overlay */}
                {dayEvents.map((event) => {
                  const startHour = event.start_time ? Number.parseInt(event.start_time.split(":")[0]) : 9
                  const duration =
                    event.end_time && event.start_time
                      ? Number.parseInt(event.end_time.split(":")[0]) -
                          Number.parseInt(event.start_time.split(":")[0]) || 1
                      : 1

                  return (
                    <div
                      key={event.id}
                      className={`absolute left-1 right-1 rounded text-xs p-1 cursor-pointer ${getEventCategoryColor(event.event_category)}`}
                      style={{
                        top: `${startHour * 24}px`,
                        height: `${duration * 24 - 2}px`,
                      }}
                      onClick={() => setSelectedEvent(event)}
                      title={event.title}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      {event.location && <div className="truncate opacity-75">{event.location}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate)

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{format(currentDate, "EEEE, MMMM d, yyyy")}</h2>
          {isToday(currentDate) && <Badge className="mt-2 bg-emerald-100 text-emerald-700">Today</Badge>}
        </div>

        {dayEvents.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No events scheduled</h3>
            <p className="text-muted-foreground">This day is free for new events.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayEvents
              .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""))
              .map((event) => (
                <Card
                  key={event.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
                  style={{ borderLeftColor: event.calendar?.color_code || "#059669" }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getEventCategoryColor(event.event_category)}>{event.event_category}</Badge>
                          {event.is_network_event && (
                            <Badge variant="outline" className="border-purple-200 text-purple-700">
                              Network Event
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                        {event.description && (
                          <p className="text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {event.start_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.start_time} - {event.end_time || ""}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                          {event.current_attendees > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.current_attendees} attending
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    )
  }

  const renderAgendaView = () => {
    const upcomingEvents = events
      .filter((event) => new Date(event.event_date) >= currentDate)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      .slice(0, 20)

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
            <p className="text-muted-foreground">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedEvent(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getEventCategoryColor(event.event_category)}>{event.event_category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(event.event_date), "MMM d, yyyy")}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {event.start_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.start_time}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  const getViewTitle = () => {
    switch (viewType) {
      case "month":
        return format(currentDate, "MMMM yyyy")
      case "week":
        const weekStart = startOfWeek(currentDate)
        const weekEnd = addDays(weekStart, 6)
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy")
      case "agenda":
        return "Agenda View"
      default:
        return ""
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading calendar...</div>
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h1 className="text-xl font-bold">{getViewTitle()}</h1>
            </div>

            <div className="flex items-center gap-2">
              <Select value={viewType} onValueChange={(value: ViewType) => setViewType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                </SelectContent>
              </Select>

              <Dialog>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Calendars
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Calendars</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {calendars.map((calendar) => (
                      <label
                        key={calendar.id}
                        className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCalendars.includes(calendar.id)}
                          onChange={() => toggleCalendar(calendar.id)}
                          className="rounded"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: calendar.color_code }}></div>
                          <div>
                            <div className="font-medium">{calendar.name}</div>
                            <div className="text-sm text-muted-foreground">{calendar.calendar_type?.level}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-0">
          {viewType === "month" && renderMonthView()}
          {viewType === "week" && renderWeekView()}
          {viewType === "day" && renderDayView()}
          {viewType === "agenda" && renderAgendaView()}
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge className={getEventCategoryColor(selectedEvent.event_category)}>
                  {selectedEvent.event_category}
                </Badge>
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedEvent.description && <p className="text-muted-foreground">{selectedEvent.description}</p>}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Date:</strong> {format(new Date(selectedEvent.event_date), "EEEE, MMMM d, yyyy")}
                </div>
                <div>
                  <strong>Time:</strong> {selectedEvent.start_time} - {selectedEvent.end_time}
                </div>
                {selectedEvent.location && (
                  <div className="col-span-2">
                    <strong>Location:</strong> {selectedEvent.location}
                  </div>
                )}
                <div>
                  <strong>Calendar:</strong> {selectedEvent.calendar?.name}
                </div>
                <div>
                  <strong>Visibility:</strong> {selectedEvent.visibility}
                </div>
              </div>

              {selectedEvent.registration_required && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">Registration Required</p>
                  <p className="text-blue-700 text-sm">This event requires registration to attend.</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to My Calendar
                </Button>
                {selectedEvent.registration_required && (
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}