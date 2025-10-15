"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, Clock, Calendar, MapPin, User } from "lucide-react"
import { toast } from "sonner"

interface PendingEvent {
  id: number
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  location: string
  event_category: string
  calendar_name: string
  church_name: string
  creator_name: string
  creator_email: string
  created_at: string
  approval_status: string
}

export function EventApprovalPanel() {
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<PendingEvent | null>(null)
  const [comments, setComments] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchPendingEvents()
  }, [])

  const fetchPendingEvents = async () => {
    try {
      const response = await fetch("/api/events/approve")
      const data = await response.json()

      if (data.success) {
        setPendingEvents(data.pending_events)
      } else {
        toast.error("Failed to load pending events")
      }
    } catch (error) {
      console.error("Error fetching pending events:", error)
      toast.error("Error loading pending events")
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (eventId: number, action: "approve" | "reject") => {
    setProcessing(true)
    try {
      const response = await fetch("/api/events/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventId,
          action,
          comments,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Event ${action}d successfully`)
        setPendingEvents((prev) => prev.filter((event) => event.id !== eventId))
        setSelectedEvent(null)
        setComments("")
      } else {
        toast.error(data.error || `Failed to ${action} event`)
      }
    } catch (error) {
      console.error(`Error ${action}ing event:`, error)
      toast.error(`Error ${action}ing event`)
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "Time TBD"
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Awaiting First Approval
          </Badge>
        )
      case "first_approved":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Awaiting Final Approval
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Approvals</CardTitle>
          <CardDescription>Loading pending events...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            Event Approval Dashboard
          </CardTitle>
          <CardDescription>Review and approve events for Holy City of God Christian Fellowship</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No events pending approval</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvents.map((event) => (
                <Card key={event.id} className="border-l-4 border-l-emerald-500">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{event.calendar_name}</p>
                      </div>
                      {getStatusBadge(event.approval_status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(event.event_date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {event.location || "Location TBD"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {event.creator_name}
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">{event.description}</p>
                    )}

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                            Review Event
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Event: {event.title}</DialogTitle>
                            <DialogDescription>Provide your approval decision and any comments</DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Date:</strong> {formatDate(event.event_date)}
                              </div>
                              <div>
                                <strong>Time:</strong> {formatTime(event.start_time)} - {formatTime(event.end_time)}
                              </div>
                              <div>
                                <strong>Location:</strong> {event.location || "TBD"}
                              </div>
                              <div>
                                <strong>Category:</strong> {event.event_category}
                              </div>
                              <div>
                                <strong>Submitted by:</strong> {event.creator_name}
                              </div>
                              <div>
                                <strong>Church:</strong> {event.church_name}
                              </div>
                            </div>

                            {event.description && (
                              <div>
                                <strong>Description:</strong>
                                <p className="mt-1 text-sm bg-gray-50 p-3 rounded-lg">{event.description}</p>
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-medium mb-2">Comments (optional)</label>
                              <Textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Add any comments or feedback..."
                                rows={3}
                              />
                            </div>
                          </div>

                          <DialogFooter className="gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedEvent(null)
                                setComments("")
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => selectedEvent && handleApproval(selectedEvent.id, "reject")}
                              disabled={processing}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              onClick={() => selectedEvent && handleApproval(selectedEvent.id, "approve")}
                              disabled={processing}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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