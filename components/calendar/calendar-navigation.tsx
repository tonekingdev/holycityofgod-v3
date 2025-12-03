"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar, Trophy as Today } from "lucide-react"
import { format, addDays, addMonths, addWeeks } from "date-fns"

interface CalendarNavigationProps {
  currentDate: Date
  viewType: "month" | "week" | "day" | "agenda"
  onDateChange: (date: Date) => void
  onViewChange: (view: "month" | "week" | "day" | "agenda") => void
}

export function CalendarNavigation({ currentDate, viewType, onDateChange, onViewChange }: CalendarNavigationProps) {
  const navigateDate = (direction: "prev" | "next") => {
    let newDate: Date

    switch (viewType) {
      case "month":
        newDate = addMonths(currentDate, direction === "next" ? 1 : -1)
        break
      case "week":
        newDate = addWeeks(currentDate, direction === "next" ? 1 : -1)
        break
      case "day":
        newDate = addDays(currentDate, direction === "next" ? 1 : -1)
        break
      case "agenda":
        newDate = addDays(currentDate, direction === "next" ? 30 : -30)
        break
      default:
        newDate = currentDate
    }

    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  const getDateTitle = () => {
    switch (viewType) {
      case "month":
        return format(currentDate, "MMMM yyyy")
      case "week":
        const weekStart = addDays(currentDate, -currentDate.getDay())
        const weekEnd = addDays(weekStart, 6)
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy")
      case "agenda":
        return "Upcoming Events"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b">
      {/* Date Navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={goToToday} className="h-8 px-3 bg-transparent">
            <Today className="h-4 w-4 mr-1" />
            Today
          </Button>

          <Button variant="outline" size="sm" onClick={() => navigateDate("next")} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-lg font-semibold text-balance">{getDateTitle()}</h2>
      </div>

      {/* View Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={viewType} onValueChange={onViewChange}>
          <SelectTrigger className="w-28 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="agenda">Agenda</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
