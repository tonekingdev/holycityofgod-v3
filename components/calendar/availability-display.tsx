"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, AlertCircle } from "lucide-react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import type { PersonalAvailability } from "@/types"

interface AvailabilityDisplayProps {
  userId?: string
  userName?: string
  showControls?: boolean
  selectedDate?: Date
}

export function AvailabilityDisplay({
  userId,
  userName,
  showControls = false,
  selectedDate = new Date(),
}: AvailabilityDisplayProps) {
  const [availability, setAvailability] = useState<PersonalAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(selectedDate)

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const startDate = format(startOfWeek(currentWeek), "yyyy-MM-dd")
        const endDate = format(addDays(startOfWeek(currentWeek), 6), "yyyy-MM-dd")

        const url = userId
          ? `/api/calendars/availability?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`
          : `/api/calendars/availability?start_date=${startDate}&end_date=${endDate}`

        const response = await fetch(url)
        const data = await response.json()

        if (data.success) {
          setAvailability(data.availability)
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [userId, currentWeek])

  const getAvailabilityForDate = (date: Date) => {
    return availability.filter((avail) => isSameDay(new Date(avail.date), date))
  }

  const getAvailabilityTypeColor = (type: string) => {
    switch (type) {
      case "busy":
        return "bg-red-100 text-red-700 border-red-200"
      case "free":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "tentative":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "out_of_office":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getAvailabilityIcon = (type: string) => {
    switch (type) {
      case "busy":
        return "🔴"
      case "free":
        return "🟢"
      case "tentative":
        return "🟡"
      case "out_of_office":
        return "⚫"
      default:
        return "⚪"
    }
  }

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek)
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => addDays(prev, direction === "next" ? 7 : -7))
  }

  if (loading) {
    return <div className="text-center py-8">Loading availability...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            {userName ? `${userName}'s Availability` : "My Availability"}
          </CardTitle>
          {showControls && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => navigateWeek("prev")}>
                ←
              </Button>
              <span className="text-sm font-medium">
                {format(startOfWeek(currentWeek), "MMM d")} -{" "}
                {format(addDays(startOfWeek(currentWeek), 6), "MMM d, yyyy")}
              </span>
              <Button size="sm" variant="outline" onClick={() => navigateWeek("next")}>
                →
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {getWeekDays().map((day, index) => {
            const dayAvailability = getAvailabilityForDate(day)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border rounded-lg ${
                  isToday ? "border-emerald-300 bg-emerald-50" : "border-gray-200"
                }`}
              >
                <div className="font-medium text-sm mb-2 text-center">{format(day, "d")}</div>

                <div className="space-y-1">
                  {dayAvailability.length === 0 ? (
                    <div className="text-center py-2">
                      <Badge className="bg-emerald-100 text-emerald-700">🟢 Available</Badge>
                    </div>
                  ) : (
                    dayAvailability.map((avail) => (
                      <div
                        key={avail.id}
                        className={`text-xs p-1 rounded border ${getAvailabilityTypeColor(avail.availability_type)}`}
                        title={avail.is_private ? "Private event" : avail.title || ""}
                      >
                        <div className="flex items-center gap-1">
                          <span>{getAvailabilityIcon(avail.availability_type)}</span>
                          <span className="font-medium">
                            {avail.start_time.slice(0, 5)} - {avail.end_time.slice(0, 5)}
                          </span>
                        </div>
                        {!avail.is_private && avail.title && <div className="mt-1 truncate">{avail.title}</div>}
                        {avail.is_private && <div className="mt-1 text-xs opacity-75">Private</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Availability Legend
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span>🟢</span>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔴</span>
              <span>Busy</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🟡</span>
              <span>Tentative</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚫</span>
              <span>Out of Office</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Availability is automatically synced from connected personal calendars. Personal event details remain
            private.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}