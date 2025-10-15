"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, MessageSquare, Mic, TrendingUp, Clock, Megaphone } from "lucide-react"

interface DashboardStats {
  totalPosts: number
  totalUsers: number
  totalPrayers: number
  totalWords: number
  totalAnnouncements: number
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalUsers: 0,
    totalPrayers: 0,
    totalWords: 0,
    totalAnnouncements: 0,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("24h")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    const savedFormat = localStorage.getItem("timeFormat") as "12h" | "24h"
    if (savedFormat) {
      setTimeFormat(savedFormat)
    }
  }, [])

  const toggleTimeFormat = () => {
    const newFormat = timeFormat === "12h" ? "24h" : "12h"
    setTimeFormat(newFormat)
    localStorage.setItem("timeFormat", newFormat)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
        return diffInMinutes < 1 ? "Just now" : `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`
      }
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`
    }

    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })

    const timeStr =
      timeFormat === "12h"
        ? date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })

    return `${dateStr} at ${timeStr}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-primary-50">
              <CardContent className="p-6">
                <div className="h-16 bg-purple-100 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-purple-600 font-medium">Welcome to the Holy City of God CMS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary-50 border-primary-200 hover:shadow-primary transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-700">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{stats.totalPosts}</div>
            <p className="text-xs text-purple-600">Published articles and content</p>
          </CardContent>
        </Card>

        <Card className="bg-primary-50 border-primary-200 hover:shadow-primary transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-700">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{stats.totalUsers}</div>
            <p className="text-xs text-purple-600">Registered members and staff</p>
          </CardContent>
        </Card>

        <Card className="bg-primary-50 border-primary-200 hover:shadow-primary transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-700">Prayer Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{stats.totalPrayers}</div>
            <p className="text-xs text-purple-600">Pending and approved requests</p>
          </CardContent>
        </Card>

        <Card className="bg-primary-50 border-primary-200 hover:shadow-primary transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-700">Words</CardTitle>
            <Mic className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{stats.totalWords}</div>
            <p className="text-xs text-purple-600">Audio and video messages</p>
          </CardContent>
        </Card>

        <Card className="bg-primary-50 border-primary-200 hover:shadow-primary transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-700">
              Announcements
            </CardTitle>
            <Megaphone className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-800">
              {stats.totalAnnouncements}
            </div>
            <p className="text-xs text-primary">Active and scheduled</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-primary-50 border-primary-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Recent Activity
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTimeFormat}
              className="flex items-center gap-2 text-primary-700 border-primary-200 hover:bg-purple-50 bg-transparent"
            >
              <Clock className="h-4 w-4" />
              {timeFormat === "12h" ? "12-hour" : "24-hour"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-800">{activity.message}</p>
                    <p className="text-xs text-purple-600">{formatTimestamp(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-purple-600 text-center py-8">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}