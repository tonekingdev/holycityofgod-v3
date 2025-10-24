"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MeetingRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MeetingRequestModal({ open, onOpenChange }: MeetingRequestModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_date: "",
    preferred_time: "",
    meeting_type: "counseling",
    reason: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/meetings/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Meeting Request Submitted",
          description:
            "Your meeting request has been sent for approval. You will receive an email confirmation shortly.",
        })
        onOpenChange(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          preferred_date: "",
          preferred_time: "",
          meeting_type: "counseling",
          reason: "",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit meeting request",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Meeting request error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while submitting your request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-secondary-200 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request Meeting with Bishop King</DialogTitle>
          <DialogDescription>
            Fill out the form below to request a meeting. Your request will be reviewed by First Lady, then Bishop King
            for final approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(313) 555-0123"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferred_date">Preferred Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="preferred_date"
                    type="date"
                    required
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    className="pl-10"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="preferred_time">Preferred Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="preferred_time"
                    type="time"
                    required
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="meeting_type">Meeting Type *</Label>
              <select
                id="meeting_type"
                required
                value={formData.meeting_type}
                onChange={(e) => setFormData({ ...formData, meeting_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="counseling">Spiritual Counseling</option>
                <option value="guidance">Ministry Guidance</option>
                <option value="prayer">Prayer Session</option>
                <option value="consultation">General Consultation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Meeting *</Label>
              <Textarea
                id="reason"
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Please briefly describe the purpose of your meeting..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Note:</strong> Your meeting request will be reviewed by First Lady for initial approval, then by
              Bishop King for final approval. You will receive email notifications at each stage of the approval
              process.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}