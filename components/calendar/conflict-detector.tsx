"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Clock, Users, MapPin, CheckCircle } from "lucide-react"

interface ConflictDetectorProps {
  eventId?: string
  userId?: string
  proposedDateTime?: Date
  duration?: number
}

interface Conflict {
  id: string
  type: "time_overlap" | "resource_conflict" | "person_conflict" | "location_conflict"
  severity: "minor" | "major" | "critical"
  description: string
  conflicting_event?: {
    title: string
    start_time: string
    end_time: string
    location?: string
  }
  affected_users?: string[]
  resolution_suggestions?: string[]
}

export function ConflictDetector({ eventId, userId, proposedDateTime, duration = 60 }: ConflictDetectorProps) {
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [loading, setLoading] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  const checkForConflicts = useCallback(async () => {
    if (!proposedDateTime) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        date: proposedDateTime.toISOString().split("T")[0],
        start_time: proposedDateTime.toTimeString().slice(0, 5),
        duration: duration.toString(),
        ...(userId && { user_id: userId }),
        ...(eventId && { event_id: eventId }),
      })

      const response = await fetch(`/api/events/conflicts?${params}`)
      const data = await response.json()

      if (data.success) {
        setConflicts(data.conflicts || [])
      }
    } catch (error) {
      console.error("Failed to check for conflicts:", error)
    } finally {
      setLoading(false)
      setHasChecked(true)
    }
  }, [proposedDateTime, duration, userId, eventId])

  useEffect(() => {
    if (proposedDateTime) {
      checkForConflicts()
    }
  }, [proposedDateTime, checkForConflicts])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200"
      case "major":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "minor":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "major":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "minor":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getConflictTypeLabel = (type: string) => {
    switch (type) {
      case "time_overlap":
        return "Time Overlap"
      case "resource_conflict":
        return "Resource Conflict"
      case "person_conflict":
        return "Person Unavailable"
      case "location_conflict":
        return "Location Conflict"
      default:
        return "Conflict"
    }
  }

  if (!proposedDateTime) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Conflict Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Checking for conflicts...</p>
          </div>
        ) : !hasChecked ? (
          <div className="text-center py-4">
            <Button onClick={checkForConflicts} variant="outline">
              Check for Conflicts
            </Button>
          </div>
        ) : conflicts.length === 0 ? (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              No conflicts detected! This time slot appears to be available.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                {conflicts.length} conflict{conflicts.length > 1 ? "s" : ""} detected for this time slot.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {conflicts.map((conflict) => (
                <Card key={conflict.id} className={`border ${getSeverityColor(conflict.severity).split(" ")[2]}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(conflict.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(conflict.severity)}>
                            {conflict.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{getConflictTypeLabel(conflict.type)}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{conflict.description}</p>

                        {conflict.conflicting_event && (
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <h4 className="font-medium text-sm mb-2">Conflicting Event:</h4>
                            <div className="space-y-1 text-sm">
                              <p className="font-medium">{conflict.conflicting_event.title}</p>
                              <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {conflict.conflicting_event.start_time} - {conflict.conflicting_event.end_time}
                                </div>
                                {conflict.conflicting_event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {conflict.conflicting_event.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {conflict.affected_users && conflict.affected_users.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-medium text-sm mb-1">Affected People:</h4>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {conflict.affected_users.join(", ")}
                              </span>
                            </div>
                          </div>
                        )}

                        {conflict.resolution_suggestions && conflict.resolution_suggestions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Suggestions:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {conflict.resolution_suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-emerald-600 mt-0.5">•</span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={checkForConflicts} variant="outline" size="sm">
                Recheck Conflicts
              </Button>
              <Button variant="outline" size="sm">
                Suggest Alternative Times
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}