"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, CalendarDays, Clock, MapPin, Users, Plus, Edit, Trash2, Share2, Eye, Filter } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Calendar as CalendarType, CalendarEvent, CalendarPermission } from "@/types"

export default function CalendarManagementPage() {
  const [calendars, setCalendars] = useState<CalendarType[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [permissions, setPermissions] = useState<CalendarPermission[]>([])
  const [selectedCalendar, setSelectedCalendar] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [createCalendarOpen, setCreateCalendarOpen] = useState(false)
  const [createEventOpen, setCreateEventOpen] = useState(false)

  const fetchCalendars = useCallback(async () => {
    try {
      const response = await fetch("/api/calendars")
      const data = await response.json()
      if (data.success) {
        setCalendars(data.calendars)
        if (data.calendars.length > 0 && !selectedCalendar) {
          setSelectedCalendar(data.calendars[0].id)
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch calendars",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [selectedCalendar])

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()
      if (data.success) {
        setEvents(data.events)
      }
    } catch {
      console.error("Failed to fetch events")
    }
  }, [])

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await fetch("/api/calendars/permissions")
      const data = await response.json()
      if (data.success) {
        setPermissions(data.permissions)
      }
    } catch {
      console.error("Failed to fetch permissions")
    }
  }, [])

  useEffect(() => {
    fetchCalendars()
    fetchEvents()
    fetchPermissions()
  }, [fetchCalendars, fetchEvents, fetchPermissions])

  const handleCreateCalendar = async (formData: FormData) => {
    try {
      const response = await fetch("/api/calendars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          calendar_type_id: formData.get("calendar_type_id"),
          color_code: formData.get("color_code") || "#059669",
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Calendar created successfully",
        })
        setCreateCalendarOpen(false)
        fetchCalendars()
      } else {
        throw new Error(data.error)
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create calendar",
        variant: "destructive",
      })
    }
  }

  const handleCreateEvent = async (formData: FormData) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendar_id: selectedCalendar,
          title: formData.get("title"),
          description: formData.get("description"),
          event_date: formData.get("event_date"),
          start_time: formData.get("start_time"),
          end_time: formData.get("end_time"),
          location: formData.get("location"),
          event_category: formData.get("event_category"),
          visibility: formData.get("visibility"),
          registration_required: formData.get("registration_required") === "on",
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Event created successfully",
        })
        setCreateEventOpen(false)
        fetchEvents()
      } else {
        throw new Error(data.error)
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      })
    }
  }

  const getEventCategoryColor = (category: string) => {
    const colors = {
      service: "bg-blue-100 text-blue-800",
      meeting: "bg-green-100 text-green-800",
      convention: "bg-purple-100 text-purple-800",
      outreach: "bg-orange-100 text-orange-800",
      fellowship: "bg-pink-100 text-pink-800",
      training: "bg-indigo-100 text-indigo-800",
      conference: "bg-red-100 text-red-800",
      special: "bg-yellow-100 text-yellow-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Calendar Management</h1>
          <p className="text-muted-foreground">Manage your church network calendars and events</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={createCalendarOpen} onOpenChange={setCreateCalendarOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Calendar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-secondary-50">
              <DialogHeader>
                <DialogTitle>Create New Calendar</DialogTitle>
                <DialogDescription>Create a new calendar for your church network</DialogDescription>
              </DialogHeader>
              <form action={handleCreateCalendar} className="space-y-4">
                <div>
                  <Label htmlFor="name">Calendar Name</Label>
                  <Input id="name" name="name" placeholder="Enter calendar name" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Calendar description" />
                </div>
                <div>
                  <Label htmlFor="calendar_type_id">Calendar Type</Label>
                  <Select name="calendar_type_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select calendar type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Network Calendar</SelectItem>
                      <SelectItem value="2">Church Calendar</SelectItem>
                      <SelectItem value="3">Ministry Calendar</SelectItem>
                      <SelectItem value="4">Personal Calendar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="color_code">Color</Label>
                  <Input id="color_code" name="color_code" type="color" defaultValue="#059669" />
                </div>
                <DialogFooter>
                  <Button type="submit" className="btn-primary">
                    Create Calendar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={createEventOpen} onOpenChange={setCreateEventOpen}>
            <DialogTrigger asChild>
              <Button className="btn-secondary">
                <CalendarDays className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-secondary-100">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Add a new event to your selected calendar</DialogDescription>
              </DialogHeader>
              <form action={handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" name="title" placeholder="Enter event title" required />
                  </div>
                  <div>
                    <Label htmlFor="event_category">Category</Label>
                    <Select name="event_category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="convention">Convention</SelectItem>
                        <SelectItem value="outreach">Outreach</SelectItem>
                        <SelectItem value="fellowship">Fellowship</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="special">Special Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Event description" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="event_date">Date</Label>
                    <Input id="event_date" name="event_date" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input id="start_time" name="start_time" type="time" />
                  </div>
                  <div>
                    <Label htmlFor="end_time">End Time</Label>
                    <Input id="end_time" name="end_time" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="Event location" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select name="visibility" defaultValue="public">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="members">Members Only</SelectItem>
                        <SelectItem value="leadership">Leadership Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch id="registration_required" name="registration_required" />
                    <Label htmlFor="registration_required">Requires Registration</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="btn-primary">
                    Create Event
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calendars</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calendars.length}</div>
            <p className="text-xs opacity-80">Across all levels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Calendars</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground">Cross-church sharing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.filter((e) => new Date(e.event_date) > new Date()).length}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="calendars" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendars">Calendars</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="permissions">Sharing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Calendars Tab */}
        <TabsContent value="calendars" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calendars.map((calendar) => (
              <Card key={calendar.id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: calendar.color_code }}></div>
                      <CardTitle className="text-lg">{calendar.name}</CardTitle>
                    </div>
                    <Badge variant="outline">{calendar.calendar_type?.name || "Unknown"}</Badge>
                  </div>
                  <CardDescription>{calendar.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {calendar.church_name && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {calendar.church_name}
                      </div>
                    )}
                    {calendar.owner_name && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {calendar.owner_name}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCalendar(calendar.id)}
                      className={selectedCalendar === calendar.id ? "bg-primary text-primary-foreground" : ""}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {selectedCalendar === calendar.id ? "Selected" : "Select"}
                    </Button>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Events</CardTitle>
                  <CardDescription>Manage events across all calendars</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Calendar</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.slice(0, 10).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          {event.location && (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: event.calendar?.color_code }}
                          ></div>
                          <span className="text-sm">{event.calendar?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(event.event_date).toLocaleDateString()}</div>
                          {event.start_time && (
                            <div className="text-muted-foreground">
                              {event.start_time} - {event.end_time}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEventCategoryColor(event.event_category)}>{event.event_category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {event.current_attendees}
                          {event.max_attendees && ` / ${event.max_attendees}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Users className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Sharing & Permissions</CardTitle>
              <CardDescription>Manage cross-church calendar access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{permission.calendar?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Shared with {permission.granted_to} • {permission.permission_type} access
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline">{permission.permission_type}</Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Settings</CardTitle>
              <CardDescription>Configure calendar system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-sync with external calendars</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync with Google Calendar, Outlook, etc.
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email notifications for new events</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications when events are created</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow cross-church event sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable sharing events between churches in the network
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}