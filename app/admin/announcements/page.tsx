"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"
import { Megaphone, Plus, Search, Edit3, Eye, Trash2, RefreshCw, AlertTriangle, Clock, Users } from "lucide-react"
import Link from "next/link"
import type { Announcement, AnnouncementFilters } from "@/types"

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<AnnouncementFilters>({
    status: "all",
    priority: "all",
    type: "all", // Changed from category to type to match the Announcement interface
  })

  const fetchAnnouncements = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status && filters.status !== "all") params.append("status", filters.status)
      if (filters.priority && filters.priority !== "all") params.append("priority", filters.priority)
      if (filters.type && filters.type !== "all") params.append("type", filters.type)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/announcements?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements)
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }, [filters, searchTerm])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setAnnouncements(announcements.filter((a) => a.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete announcement:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!user) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>You must be logged in to access this page.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Announcements</h1>
          <p className="text-purple-600 font-medium">Manage church announcements and notifications</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={fetchAnnouncements}
            variant="outline"
            className="border-purple-200 hover:bg-purple-50 bg-transparent"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/admin/announcements/new">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-secondary-50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-400"
              />
            </div>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => setFilters({ ...filters, status: value as AnnouncementFilters["status"] })}
            >
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.priority || "all"}
              onValueChange={(value) => setFilters({ ...filters, priority: value as AnnouncementFilters["priority"] })}
            >
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) => setFilters({ ...filters, type: value as AnnouncementFilters["type"] })}
            >
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="celebration">Celebration</SelectItem>
                <SelectItem value="ministry">Ministry</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading announcements...</p>
          </div>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <Card className="bg-secondary-50">
          <CardContent className="p-12 text-center">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filters.status !== "all" || filters.priority !== "all" || filters.type !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first announcement"}
            </p>
            <Link href="/admin/announcements/new">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Announcement
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="bg-secondary-50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                      {getStatusBadge(announcement.status)}
                      {getPriorityBadge(announcement.priority)}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {announcement.published_at
                          ? `Published ${new Date(announcement.published_at).toLocaleDateString()}`
                          : "Not published"}
                      </div>
                      {announcement.expires_at && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          Expires {new Date(announcement.expires_at).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {announcement.target_audience}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-purple-200 hover:bg-purple-50 bg-transparent">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/admin/announcements/${announcement.id}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 hover:bg-purple-50 bg-transparent"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-secondary-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{announcements.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-secondary-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {announcements.filter((a) => a.status === "published").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {announcements.filter((a) => a.status === "draft").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {announcements.filter((a) => a.status === "scheduled").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}