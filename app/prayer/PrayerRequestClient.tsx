"use client"

import type React from "react"

import { DropInView } from "@/components/DropInView"
import { FadeInView } from "@/components/FadeInView"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HandHeart, Phone, Mail, User, MessageSquare, AlertTriangle, CheckCircle, Loader2, Home } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface FormData {
  name: string
  email: string
  phone: string
  message: string
  isUrgent: boolean
  canShare: boolean
  honeypot: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
  general?: string
}

export default function PrayerRequestClient() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    isUrgent: false,
    canShare: true,
    honeypot: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, "")

    // Format based on length
    if (phoneNumber.length <= 3) {
      return phoneNumber.length > 0 ? `(${phoneNumber}` : phoneNumber
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3)}`
    } else {
      return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData((prev) => ({ ...prev, phone: formatted }))

    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }))
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name must be less than 100 characters"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && formData.phone.replace(/\D/g, "").length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Prayer request message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please provide more details (at least 10 characters)"
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = "Message must be less than 2000 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch("/api/prayers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit prayer request")
      }

      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        isUrgent: false,
        canShare: true,
        honeypot: "",
      })
    } catch (error) {
      console.error("Prayer request submission error:", error)
      setErrors({
        general: error instanceof Error ? error.message : "Failed to submit prayer request. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <FadeInView>
            <Card className="border-2 border-secondary-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <CheckCircle className="h-16 w-16 text-secondary-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Prayer Request Submitted</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Thank you for sharing your prayer request with us. Our prayer team has been notified and will be
                    praying for you.
                  </p>
                  <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700">
                      <strong>What happens next:</strong>
                      <br />• Our prayer team will begin praying for your request immediately
                      <br />• You&apos;ll receive a confirmation email with additional information
                      <br />• If you marked your request as urgent, it will receive priority attention
                      <br />• Someone from our team may reach out to you if appropriate
                      <br />• All prayer requests are kept confidential
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                      <Button className="bg-primary hover:bg-primary-700 text-white w-full sm:w-auto">
                        <Home className="mr-2 h-4 w-4" />
                        Return to Home
                      </Button>
                    </Link>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto"
                    >
                      <HandHeart className="mr-2 h-4 w-4" />
                      Submit Another Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInView>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <FadeInView>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <HandHeart className="h-8 w-8 text-secondary-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Prayer <span className="text-primary">Request</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We believe in the power of prayer and would be honored to pray for you. Share your request with us, and
              our prayer team will lift you up in prayer.
            </p>
          </div>
        </FadeInView>

        {/* Bible Verse */}
        <DropInView delay={0.2}>
          <div className="bg-secondary-50 border-l-4 border-secondary-500 p-6 mb-12 rounded-r-lg">
            <blockquote className="text-lg italic text-gray-700 font-light">
              &quot;I exhort therefore, that, first of all, supplications, prayers, intercessions, and giving of thanks, be made for all men;&quot;
            </blockquote>
            <cite className="text-secondary font-semibold">1 Timothy 2:1</cite>
          </div>
        </DropInView>

        {/* Prayer Request Form */}
        <DropInView delay={0.4}>
          <Card className="border-2 border-secondary-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary to-primary-700 text-white">
              <CardTitle className="text-2xl font-bold text-center">Share Your Prayer Request</CardTitle>
              <CardDescription className="text-center text-primary-100">
                All requests are kept confidential and seen only by our prayer team
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              {errors.general && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{errors.general}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="website"
                  value={formData.honeypot}
                  onChange={(e) => handleInputChange("honeypot", e.target.value)}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Your Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`pl-10 ${errors.name ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-primary"}`}
                      maxLength={100}
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-primary"}`}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(123)456-7890"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`pl-10 ${errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-primary"}`}
                      maxLength={13}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                  <p className="text-xs text-gray-500">Phone number will be formatted automatically as you type</p>
                </div>

                {/* Prayer Request Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                    Prayer Request <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="message"
                      placeholder="Please share your prayer request here. Be as specific as you'd like - we're here to pray for you."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className={`pl-10 min-h-[120px] resize-none ${errors.message ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-primary"}`}
                      maxLength={2000}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
                    <p className="text-xs text-gray-500 ml-auto">{formData.message.length}/2000 characters</p>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="isUrgent"
                      checked={formData.isUrgent}
                      onCheckedChange={(checked) => handleInputChange("isUrgent", checked as boolean)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="isUrgent" className="text-sm font-medium text-gray-700 cursor-pointer">
                        This is an urgent prayer request
                      </Label>
                      <p className="text-xs text-gray-500">
                        Check this if you need immediate prayer attention (serious illness, crisis, etc.)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="canShare"
                      checked={formData.canShare}
                      onCheckedChange={(checked) => handleInputChange("canShare", checked as boolean)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="canShare" className="text-sm font-medium text-gray-700 cursor-pointer">
                        You may share this request with our prayer team
                      </Label>
                      <p className="text-xs text-gray-500">If unchecked, only pastoral staff will see your request</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-700 text-white py-3 text-lg font-semibold disabled:opacity-50"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Prayer Request...
                      </>
                    ) : (
                      <>
                        <HandHeart className="mr-2 h-4 w-4" />
                        Submit Prayer Request
                      </>
                    )}
                  </Button>
                </div>

                {/* Privacy Notice */}
                <div className="text-center pt-4">
                  <p className="text-xs text-gray-500">
                    Your privacy is important to us. All prayer requests are kept confidential and are only shared with
                    our trained prayer team members.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </DropInView>
      </div>
    </div>
  )
}