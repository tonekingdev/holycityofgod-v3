"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Calendar, CalendarDays, Users, Settings, Filter, Eye, EyeOff } from "lucide-react"
import type { Calendar as CalendarType } from "@/types"

interface CalendarFilters {
  showNetworkEvents: boolean
  showChurchEvents: boolean
  showMinistryEvents: boolean
  showPersonalEvents: boolean
  showPastEvents: boolean
}

interface CalendarSidebarProps {
  selectedCalendars: string[]
  onCalendarToggle: (calendarId: string) => void
  onFilterChange: (filters: CalendarFilters) => void
}

export default function CalendarSidebar({ selectedCalendars, onCalendarToggle, onFilterChange }: CalendarSidebarProps) {
  const [calendars, setCalendars] = useState<CalendarType[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CalendarFilters>({
    showNetworkEvents: true,
    showChurchEvents: true,
    showMinistryEvents: true,
    showPersonalEvents: true,
    showPastEvents: false,
  })

  useEffect(() => {
    fetchCalendars()
  }, [])

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const fetchCalendars = async () => {
    try {
      const response = await fetch("/api/calendars")
      const data = await response.json()
      if (data.success) {
        setCalendars(data.calendars)
      }
    } catch (error) {
      console.error("Failed to fetch calendars:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCalendarsByLevel = (level: string) => {
    return calendars.filter((cal) => cal.calendar_type?.level === level)
  }

  interface CalendarGroupProps {
    title: string
    level: string
    icon: React.ComponentType<{ className?: string }>
  }

  const CalendarGroup = ({ title, level, icon: Icon }: CalendarGroupProps) => {
    const levelCalendars = getCalendarsByLevel(level)

    if (levelCalendars.length === 0) return null

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Icon className="w-4 h-4" />
          <span>{title}</span>
        </div>
        <div className="space-y-1 ml-6">
          {levelCalendars.map((calendar) => (
            <div key={calendar.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
              <div className="flex items-center space-x-2 flex-1">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: calendar.color_code }} />
                <span className="text-sm truncate">{calendar.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onCalendarToggle(calendar.id)} className="p-1 h-auto">
                {selectedCalendars.includes(calendar.id) ? (
                  <Eye className="w-4 h-4 text-primary" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-80 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 space-y-4">
      {/* Calendar Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Calendar Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-2 bg-muted rounded">
              <div className="font-semibold">{calendars.length}</div>
              <div className="text-muted-foreground">Calendars</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <div className="font-semibold">{selectedCalendars.length}</div>
              <div className="text-muted-foreground">Visible</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <CalendarDays className="w-5 h-5 mr-2" />
            My Calendars
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CalendarGroup title="Network" level="network" icon={Users} />
          <CalendarGroup title="Church" level="church" icon={Calendar} />
          <CalendarGroup title="Ministry" level="ministry" icon={CalendarDays} />
          <CalendarGroup title="Personal" level="personal" icon={Settings} />
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Network Events</span>
              <Switch
                checked={filters.showNetworkEvents}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, showNetworkEvents: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Church Events</span>
              <Switch
                checked={filters.showChurchEvents}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, showChurchEvents: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ministry Events</span>
              <Switch
                checked={filters.showMinistryEvents}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, showMinistryEvents: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Personal Events</span>
              <Switch
                checked={filters.showPersonalEvents}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, showPersonalEvents: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Past Events</span>
              <Switch
                checked={filters.showPastEvents}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, showPastEvents: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Sync External Calendars
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Manage Permissions
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Calendar Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}