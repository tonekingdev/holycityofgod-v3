"use client"

import { useState, useEffect, useCallback } from "react"
import { AnnouncementCard } from "./AnnouncementCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Announcement, AnnouncementFilters } from "@/types"
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_PRIORITIES } from "@/types"

interface AnnouncementsListProps {
  showActions?: boolean
  limit?: number
  is_featured?: boolean
  className?: string // Added className prop to interface
  onCreateNew?: () => void
  onEdit?: (announcement: Announcement) => void
  onDelete?: (announcement: Announcement) => void
}

export function AnnouncementsList({
  showActions = false,
  limit,
  is_featured,
  className, // Added className to destructured props
  onCreateNew,
  onEdit,
  onDelete,
}: AnnouncementsListProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast() // Added toast hook for error notifications
  const [filters, setFilters] = useState<AnnouncementFilters>({
    limit,
    is_featured,
    status: "published",
  })
  const [searchQuery, setSearchQuery] = useState("")

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      if (searchQuery) {
        params.append("search", searchQuery)
      }

      const response = await fetch(`/api/announcements?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch announcements")
      }

      const data = await response.json()
      setAnnouncements(data.announcements)
      setError(null)
    } catch (err) {
      console.error("[v0] Error fetching announcements:", err)
      const errorMessage = "Failed to load announcements"
      setError(errorMessage)
      toast({
        title: "Error Loading Announcements",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, searchQuery, toast])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const handleFilterChange = (key: keyof AnnouncementFilters, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }))
  }

  const clearFilters = () => {
    setFilters({ limit, is_featured, status: "published" })
    setSearchQuery("")
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    if (!showActions) {
      return null
    }
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchAnnouncements} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (announcements.length === 0) {
    if (!showActions) {
      return null
    }
    return (
      <div className={`space-y-6 ${className || ""}`}>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No announcements found</p>
          {onCreateNew && (
            <Button onClick={onCreateNew} variant="outline">
              Create First Announcement
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {showActions && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select
                value={filters.type || "all"}
                onValueChange={(value) => handleFilterChange("type", value === "all" ? undefined : value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Types</SelectItem>
                  {ANNOUNCEMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.priority || "all"}
                onValueChange={(value) => handleFilterChange("priority", value === "all" ? undefined : value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Priorities</SelectItem>
                  {ANNOUNCEMENT_PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filters.type || filters.priority || searchQuery) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>

            {showActions && onCreateNew && (
              <Button onClick={onCreateNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Announcement
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {(filters.type || filters.priority || searchQuery) && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && <Badge variant="secondary">Search: {searchQuery}</Badge>}
              {filters.type && (
                <Badge variant="secondary">
                  Type: {ANNOUNCEMENT_TYPES.find((t) => t.value === filters.type)?.label}
                </Badge>
              )}
              {filters.priority && (
                <Badge variant="secondary">
                  Priority: {ANNOUNCEMENT_PRIORITIES.find((p) => p.value === filters.priority)?.label}
                </Badge>
              )}
            </div>
          )}
        </>
      )}

      {/* Announcements Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            showActions={showActions}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}