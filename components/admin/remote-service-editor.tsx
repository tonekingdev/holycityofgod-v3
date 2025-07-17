"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Save, Eye, EyeOff } from "lucide-react"

interface RemoteServiceData {
  id?: number
  church_id: number
  title: string
  message: string
  service_times: string
  dial_in_number: string
  access_code: string
  international_numbers: string
  online_meeting_id: string
  online_meeting_url: string
  additional_info: string
  is_active: boolean
  start_date: string
  end_date: string
}

interface RemoteServiceEditorProps {
  churchId: number
}

export default function RemoteServiceEditor({ churchId }: RemoteServiceEditorProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<RemoteServiceData>({
    church_id: churchId,
    title: "Important!",
    message: "You can join us in our services during this time with this info:",
    service_times: "Sundays 11 AM & Wednesdays 7 PM",
    dial_in_number: "(267) 807-9601",
    access_code: "796680#",
    international_numbers: "https://hcgd.ly/intl-dial-in",
    online_meeting_id: "100-009-769",
    online_meeting_url: "https://join.freeconferencecall.com/100-009-769",
    additional_info:
      "For additional assistance connecting to the service text 'Call Me' to the Dial-In number above and you will be called into the conference. Message and data rates may apply.",
    is_active: true,
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  })
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const loadNotification = useCallback(async () => {
    try {
      const response = await fetch(`/api/remote-service-notification/${churchId}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setFormData({
            ...data,
            start_date: data.start_date ? data.start_date.split("T")[0] : new Date().toISOString().split("T")[0],
            end_date: data.end_date ? data.end_date.split("T")[0] : "",
          })
        }
      }
    } catch (error) {
      console.error("Failed to load notification:", error)
    }
  }, [churchId])

  useEffect(() => {
    loadNotification()
  }, [loadNotification])

  const handleInputChange = (field: keyof RemoteServiceData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const method = formData.id ? "PUT" : "POST"
      const url = formData.id
        ? `/api/remote-service-notification/${churchId}`
        : `/api/remote-service-notification/${churchId}`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Remote service notification saved successfully",
          variant: "default",
        })
        await loadNotification()
      } else {
        throw new Error("Failed to save notification")
      }
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Error",
        description: "Failed to save remote service notification",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Remote Service Notification Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Important!"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="You can join us in our services during this time with this info:"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="service_times">Service Times</Label>
                <Input
                  id="service_times"
                  value={formData.service_times}
                  onChange={(e) => handleInputChange("service_times", e.target.value)}
                  placeholder="Sundays 11 AM & Wednesdays 7 PM"
                />
              </div>

              <div>
                <Label htmlFor="dial_in_number">Dial-in Number</Label>
                <Input
                  id="dial_in_number"
                  value={formData.dial_in_number}
                  onChange={(e) => handleInputChange("dial_in_number", e.target.value)}
                  placeholder="(267) 807-9601"
                />
              </div>

              <div>
                <Label htmlFor="access_code">Access Code</Label>
                <Input
                  id="access_code"
                  value={formData.access_code}
                  onChange={(e) => handleInputChange("access_code", e.target.value)}
                  placeholder="796680#"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="international_numbers">International Numbers URL</Label>
                <Input
                  id="international_numbers"
                  value={formData.international_numbers}
                  onChange={(e) => handleInputChange("international_numbers", e.target.value)}
                  placeholder="https://hcgd.ly/intl-dial-in"
                />
              </div>

              <div>
                <Label htmlFor="online_meeting_id">Online Meeting ID</Label>
                <Input
                  id="online_meeting_id"
                  value={formData.online_meeting_id}
                  onChange={(e) => handleInputChange("online_meeting_id", e.target.value)}
                  placeholder="100-009-769"
                />
              </div>

              <div>
                <Label htmlFor="online_meeting_url">Online Meeting URL</Label>
                <Input
                  id="online_meeting_url"
                  value={formData.online_meeting_url}
                  onChange={(e) => handleInputChange("online_meeting_url", e.target.value)}
                  placeholder="https://join.freeconferencecall.com/100-009-769"
                />
              </div>

              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange("start_date", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange("end_date", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="additional_info">Additional Information</Label>
            <Textarea
              id="additional_info"
              value={formData.additional_info}
              onChange={(e) => handleInputChange("additional_info", e.target.value)}
              placeholder="For additional assistance connecting to the service text 'Call Me' to the Dial-In number above..."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Notification"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              {showPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-bold text-yellow-300">{formData.title}</h3>
              </div>
              <p className="mb-4 text-purple-100">{formData.message}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <p className="text-yellow-300 font-semibold">Service Times: {formData.service_times}</p>
                  <p className="text-yellow-300 font-semibold">Dial-in: {formData.dial_in_number}</p>
                  <p className="text-yellow-300 font-semibold">Access Code: {formData.access_code}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-yellow-300 font-semibold">Meeting ID: {formData.online_meeting_id}</p>
                  <p className="text-yellow-300 font-semibold">Join Online: {formData.online_meeting_url}</p>
                </div>
              </div>
              {formData.additional_info && (
                <div className="bg-purple-700 bg-opacity-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-100">{formData.additional_info}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}