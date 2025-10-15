"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Eye, Calendar } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import type { CreateAnnouncementPayload } from "@/types"

export default function NewAnnouncementPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<CreateAnnouncementPayload>>({
    title: "",
    content: "",
    type: "general", // Changed from category to type
    priority: "normal",
    status: "draft",
    target_audience: "all",
    published_at: undefined,
    expires_at: undefined,
  })

  const handleInputChange = (field: keyof CreateAnnouncementPayload, value: string | boolean | Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const announcementData: CreateAnnouncementPayload = {
        title: formData.title || "",
        content: formData.content || "",
        type: formData.type || "general", // Changed from category to type
        priority: formData.priority || "normal",
        status: publishNow ? "published" : formData.status || "draft",
        target_audience: formData.target_audience || "all",
        published_at: publishNow ? new Date() : formData.published_at,
        expires_at: formData.expires_at,
      }

      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcementData),
      })

      if (response.ok) {
        await response.json()
        router.push(`/admin/announcements`)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error creating announcement:", error)
      alert("Failed to create announcement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/announcements">
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Announcements
            </Button>
          </Link>
          <h1 className="text-3xl font-bold gradient-text">Create New Announcement</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading || !formData.title || !formData.content}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading || !formData.title || !formData.content}
            className="btn-primary"
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish Now
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-royal">
            <CardHeader>
              <CardTitle className="text-purple-800">Announcement Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-purple-700">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter announcement title..."
                  className="border-purple-200 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-purple-700">
                  Content *
                </Label>
                <Textarea
                  id="content"
                  value={formData.content || ""}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Write your announcement content here..."
                  rows={10}
                  className="border-purple-200 focus:border-purple-500"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Announcement Settings */}
          <Card className="card-royal">
            <CardHeader>
              <CardTitle className="text-purple-800">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="type" className="text-purple-700">
                  Type
                </Label>
                <Select value={formData.type || "general"} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="ministry">Ministry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority" className="text-purple-700">
                  Priority
                </Label>
                <Select
                  value={formData.priority || "normal"}
                  onValueChange={(value) => handleInputChange("priority", value)}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target_audience" className="text-purple-700">
                  Target Audience
                </Label>
                <Select
                  value={formData.target_audience || "all"}
                  onValueChange={(value) => handleInputChange("target_audience", value)}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="members">Members Only</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="ministry">Ministry</SelectItem>
                    <SelectItem value="youth">Youth</SelectItem>
                    <SelectItem value="adults">Adults</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-purple-700">
                  Status
                </Label>
                <Select
                  value={formData.status || "draft"}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card className="card-royal">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="published_at" className="text-purple-700">
                  Publish Date
                </Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ""}
                  onChange={(e) =>
                    handleInputChange("published_at", e.target.value ? new Date(e.target.value) : undefined)
                  }
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="expires_at" className="text-purple-700">
                  Expiration Date
                </Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={formData.expires_at ? new Date(formData.expires_at).toISOString().slice(0, 16) : ""}
                  onChange={(e) =>
                    handleInputChange("expires_at", e.target.value ? new Date(e.target.value) : undefined)
                  }
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}