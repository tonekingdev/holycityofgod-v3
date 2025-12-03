"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Clock, Users, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { useContent } from "@/hooks/use-content"

interface Event {
  id: string
  title: string
  description: string
  start_time: string
  end_time?: string
  location?: string
  max_attendees?: number
  attendee_count?: number
  category?: string
  is_featured?: boolean
  registration_required?: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { content } = useContent("posts")
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events?upcoming=true&limit=20")
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error("[Anointed Innovations] Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackButton = () => {
    router.back()
  }

  const heroContent = content?.events || {
    title: "Upcoming Events",
    description: "Join us for special services, conferences, and community gatherings",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroContent.title}</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">{heroContent.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No upcoming events at this time. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: Event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl text-purple-700 flex-1">{event.title}</CardTitle>
                    {event.is_featured && (
                      <Badge variant="default" className="bg-purple-600">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.start_time), "PPP")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(event.start_time), "p")}
                      {event.end_time && ` - ${format(new Date(event.end_time), "p")}`}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                  {event.max_attendees && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.attendee_count || 0} / {event.max_attendees} attendees
                      </span>
                    </div>
                  )}
                  {event.category && (
                    <Badge variant="secondary" className="w-fit">
                      {event.category}
                    </Badge>
                  )}

                  {event.registration_required && (
                    <Button size="sm" className="mt-auto bg-purple-600 hover:bg-purple-700">
                      Register Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Button variant="outline" onClick={handleBackButton}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  )
}