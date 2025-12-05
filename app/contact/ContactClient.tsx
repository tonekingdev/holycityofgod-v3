"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useContent } from "@/hooks/use-content"
import { CHURCH_INFO, OFFICE_HOURS, MESSAGE_TYPES } from "@/constants"
import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import { MapPin, Phone, Mail, Clock, Send, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactClient() {
  const { content, loading } = useContent("contact")
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    messageType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, messageType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          messageType: "",
          message: "",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Contact form submission error:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or call us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative px-4 py-16 text-center bg-gradient-to-r from-purple-800 to-purple-900 text-white">
        <div className="container max-w-4xl mx-auto">
          <FadeInView>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">{content.hero?.title || "Contact Us"}</h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90 text-pretty">
              {content.hero?.subtitle || "We'd love to hear from you"}
            </p>
            <p className="text-lg opacity-80 text-pretty">
              {content.hero?.description ||
                "Reach out to us for prayer requests, questions, or to learn more about our church family."}
            </p>
          </FadeInView>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto py-16 px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <DropInView>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-800 flex items-center gap-2">
                  <Send className="h-6 w-6" />
                  {content.form?.title || "Send Us a Message"}
                </CardTitle>
                <CardDescription className="text-pretty">
                  {content.form?.description ||
                    "Fill out the form below and we'll get back to you as soon as possible."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(313) 397-8240"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="messageType">Message Type</Label>
                      <Select onValueChange={handleSelectChange} value={formData.messageType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {MESSAGE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="How can we help you?"
                      rows={5}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-800 hover:bg-purple-900 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </DropInView>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Church Info */}
            <DropInView delay={0.1}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-800 flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    {content.info?.title || "Get in Touch"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-600 text-pretty">{CHURCH_INFO.contact.address.full}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <a
                        href={`tel:${CHURCH_INFO.contact.phone}`}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        {CHURCH_INFO.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <a
                        href={`mailto:${CHURCH_INFO.contact.email}`}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        {CHURCH_INFO.contact.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DropInView>

            {/* Office Hours */}
            <DropInView delay={0.2}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-800 flex items-center gap-2">
                    <Clock className="h-6 w-6" />
                    {content.hours?.title || "Office Hours"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {OFFICE_HOURS.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-gray-900">{schedule.day}</span>
                        <span className="text-gray-600">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </DropInView>
          </div>
        </div>

        {/* Map Section */}
        <DropInView delay={0.3}>
          <Card className="mt-12 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 text-center">
                {content.location?.title || "Find Us"}
              </CardTitle>
              <CardDescription className="text-center text-pretty">
                {content.location?.description || "Visit us at our location in Detroit, Michigan"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}&q=${encodeURIComponent(CHURCH_INFO.contact.address.full)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Holy City of God Christian Fellowship Location"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-pretty">{CHURCH_INFO.contact.address.full}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(CHURCH_INFO.contact.address.full)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  Get Directions
                </a>
              </div>
            </CardContent>
          </Card>
        </DropInView>
      </div>
    </div>
  )
}