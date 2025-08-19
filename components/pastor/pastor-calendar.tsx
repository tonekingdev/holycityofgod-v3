"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Plus, ExternalLink, Users, MapPin, Edit, Trash2, Settings, FolderSyncIcon as Sync } from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay } from "date-fns"

interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: Date
  time: string
  duration: number
  type: 'meeting' | 'counseling' | 'event' | 'service' | 'personal'
  attendees?: string[]
  location?: string
  isPrivate: boolean
  canEdit: boolean
}

interface CalendarIntegration {
  name: string
  icon: string
  status: 'connected' | 'disconnected' | 'syncing'
  lastSync?: Date
  color: string
}

export default function PastorCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [userRole] = useState<'admin' | 'member' | 'visitor'>('visitor')
  const [showIntegrations, setShowIntegrations] = useState(false)

  // Mock events data
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Sunday Worship Service',
        description: 'Main worship service with communion',
        date: new Date(2024, 11, 15, 11, 0),
        time: '11:00 AM',
        duration: 120,
        type: 'service',
        location: 'Main Sanctuary',
        isPrivate: false,
        canEdit: userRole === 'admin'
      },
      {
        id: '2',
        title: 'Marriage Counseling Session',
        description: 'Private counseling session',
        date: new Date(2024, 11, 16, 14, 0),
        time: '2:00 PM',
        duration: 60,
        type: 'counseling',
        location: 'Pastor\'s Office',
        isPrivate: true,
        canEdit: userRole === 'admin'
      },
      {
        id: '3',
        title: 'Leadership Meeting',
        description: 'Monthly leadership team meeting',
        date: new Date(2024, 11, 17, 19, 0),
        time: '7:00 PM',
        duration: 90,
        type: 'meeting',
        attendees: ['Deacon Smith', 'Sister Johnson', 'Elder Williams'],
        location: 'Conference Room',
        isPrivate: false,
        canEdit: userRole === 'admin'
      },
      {
        id: '4',
        title: 'Community Outreach Planning',
        description: 'Planning session for upcoming community events',
        date: new Date(2024, 11, 18, 10, 0),
        time: '10:00 AM',
        duration: 120,
        type: 'meeting',
        location: 'Fellowship Hall',
        isPrivate: false,
        canEdit: userRole === 'admin'
      },
      {
        id: '5',
        title: 'Bible Study',
        description: 'Wednesday evening Bible study',
        date: new Date(2024, 11, 18, 19, 0),
        time: '7:00 PM',
        duration: 90,
        type: 'service',
        location: 'Fellowship Hall',
        isPrivate: false,
        canEdit: userRole === 'admin'
      }
    ]
    setEvents(mockEvents)
  }, [userRole])

  // Bishop King's calendar integrations
  const integrations: CalendarIntegration[] = [
    {
      name: 'Google Calendar',
      icon: '📅',
      status: 'connected',
      lastSync: new Date(2024, 11, 8, 10, 30),
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      name: 'Outlook Calendar',
      icon: '📧',
      status: 'connected',
      lastSync: new Date(2024, 11, 8, 10, 25),
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      name: 'Apple Calendar',
      icon: '🍎',
      status: 'syncing',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  ]

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'service': return 'bg-purple-100 text-purple-700'
      case 'meeting': return 'bg-blue-100 text-blue-700'
      case 'counseling': return 'bg-green-100 text-green-700'
      case 'event': return 'bg-orange-100 text-orange-700'
      case 'personal': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date))
  }

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate)
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  const handleEventClick = (event: CalendarEvent) => {
    if (!event.isPrivate || userRole === 'admin') {
      setSelectedEvent(event)
    }
  }

  const handleBookAppointment = () => {
    // This would integrate with a booking system
    alert('Appointment booking functionality would be implemented here')
  }

  const handleSyncCalendar = (integrationName: string) => {
    // This would trigger actual calendar sync
    alert(`Syncing with ${integrationName}...`)
  }

  const getStatusBadge = (status: CalendarIntegration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700">Connected</Badge>
      case 'syncing':
        return <Badge className="bg-yellow-100 text-yellow-700">Syncing...</Badge>
      case 'disconnected':
        return <Badge className="bg-red-100 text-red-700">Disconnected</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Bishop's Calendar Integration Panel - Only visible to admin */}
      {userRole === 'admin' && (
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Bishop King&apos;s Calendar Integration
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowIntegrations(!showIntegrations)}
              >
                {showIntegrations ? 'Hide' : 'Show'} Integrations
              </Button>
            </div>
          </CardHeader>
          {showIntegrations && (
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage Bishop King&apos;s personal calendar synchronization with external calendar services.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {integrations.map((integration) => (
                  <Card key={integration.name} className={`border ${integration.color.split(' ')[2]}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{integration.icon}</span>
                          <h4 className="font-medium">{integration.name}</h4>
                        </div>
                        {getStatusBadge(integration.status)}
                      </div>
                      
                      {integration.lastSync && (
                        <p className="text-xs text-gray-500 mb-3">
                          Last sync: {format(integration.lastSync, 'MMM d, h:mm a')}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleSyncCalendar(integration.name)}
                          disabled={integration.status === 'syncing'}
                        >
                          <Sync className="mr-1 h-3 w-3" />
                          {integration.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
                        </Button>
                        <Button size="sm" variant="ghost" className="px-2">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Integration Features:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Automatic two-way sync with Bishop King&apos;s personal calendars</li>
                  <li>• Events created here appear in his Google, Outlook, and Apple calendars</li>
                  <li>• Personal events from his calendars can be imported (with privacy settings)</li>
                  <li>• Conflict detection prevents double-booking</li>
                  <li>• Automatic reminders sent to Bishop King&apos;s devices</li>
                </ul>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Main Calendar */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {format(selectedDate, 'MMMM yyyy')}
              </CardTitle>
              {userRole === 'admin' && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Event</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Event Title</Label>
                        <Input id="title" placeholder="Enter event title" />
                      </div>
                      <div>
                        <Label htmlFor="type">Event Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="counseling">Counseling</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Event description" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input id="date" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input id="time" type="time" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="Event location" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="syncToPersonal" />
                        <Label htmlFor="syncToPersonal" className="text-sm">
                          Sync to Bishop King&apos;s personal calendars
                        </Label>
                      </div>
                      <Button className="w-full">Create Event</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getWeekDays().map((day, index) => {
                  const dayEvents = getEventsForDate(day)
                  const isSelected = isSameDay(day, selectedDate)
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-purple-100 border-purple-300' 
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="font-medium text-sm mb-1">
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded cursor-pointer ${getEventTypeColor(event.type)}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEventClick(event)
                            }}
                          >
                            {event.isPrivate && userRole !== 'admin' ? 'Private' : event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Details & Booking */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                {format(selectedDate, 'EEEE, MMMM d')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getEventsForDate(selectedDate).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No events scheduled</p>
                ) : (
                  getEventsForDate(selectedDate).map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getEventTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                            {userRole === 'admin' && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <h4 className="font-medium">
                            {event.isPrivate && userRole !== 'admin' ? 'Private Appointment' : event.title}
                          </h4>
                          <p className="text-sm text-gray-600">{event.time}</p>
                          {event.location && (
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <MapPin className="mr-1 h-3 w-3" />
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Book Appointment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Book Appointment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Schedule a meeting with Bishop King for counseling, spiritual guidance, or ministry discussions.
              </p>
              <div className="space-y-3">
                <Button className="w-full text-purple-50" onClick={handleBookAppointment}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Request Appointment
                </Button>
                <Button variant="outline" className="w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  View Available Times
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {userRole === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Recurring Event
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Sync className="mr-2 h-4 w-4" />
                    Sync All Calendars
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Export Calendar
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Permissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge className={getEventTypeColor(selectedEvent.type)}>
                  {selectedEvent.type}
                </Badge>
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedEvent.description && (
                <p className="text-gray-600">{selectedEvent.description}</p>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Date:</strong> {format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}
                </div>
                <div>
                  <strong>Time:</strong> {selectedEvent.time}
                </div>
                {selectedEvent.location && (
                  <div className="col-span-2">
                    <strong>Location:</strong> {selectedEvent.location}
                  </div>
                )}
                {selectedEvent.attendees && (
                  <div className="col-span-2">
                    <strong>Attendees:</strong> {selectedEvent.attendees.join(', ')}
                  </div>
                )}
              </div>
              {userRole !== 'admin' && selectedEvent.type === 'service' && (
                <Button className="w-full">
                  Add to My Calendar
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
