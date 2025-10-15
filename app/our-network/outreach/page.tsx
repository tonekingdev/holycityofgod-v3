"use client"

import { CardDescription } from "@/components/ui/card"

import { MINISTRIES } from "@/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, HandHeart, Clock } from "lucide-react"
import { useContent, type OutreachProgram } from "@/hooks/use-content"

export default function OutreachPage() {
  const { content } = useContent("ourNetwork")
  const outreachMinistry = MINISTRIES.find((m) => m.id === "outreach")

  const heroContent = content?.outreach || {
    title: "Community Outreach",
    description: "Making a difference in our community through service and love",
    programs: [
      {
        name: "Food Pantry",
        description: "Providing food assistance to families in need",
        schedule: "Every Saturday, 9:00 AM - 12:00 PM",
      },
      {
        name: "Youth Mentorship",
        description: "Guiding young people toward their God-given potential",
        schedule: "Tuesdays and Thursdays, 4:00 PM - 6:00 PM",
      },
      {
        name: "Senior Care",
        description: "Supporting our senior community with love and practical help",
        schedule: "Wednesdays, 10:00 AM - 2:00 PM",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroContent.title}</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">{heroContent.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Ministry Overview */}
        {outreachMinistry && (
          <Card className="mb-8 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl text-purple-700">{outreachMinistry.name}</CardTitle>
              <CardDescription className="text-lg">{outreachMinistry.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Ministry Leader</h3>
                <p className="text-gray-600">{outreachMinistry.leader}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Meeting Time</h3>
                <p className="text-gray-600">{outreachMinistry.meetingTime}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Our Outreach Programs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {outreachMinistry.activities.map((activity) => (
                    <div key={activity} className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <HandHeart className="h-6 w-6 text-purple-700" />
                      <span className="font-medium">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Outreach Programs from content.json */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Our Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {heroContent.programs.map((program: OutreachProgram) => (
              <Card key={program.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Heart className="h-12 w-12 text-purple-700 mb-4" />
                  <CardTitle>{program.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600">{program.description}</p>
                  <div className="flex items-center gap-2 text-sm text-purple-700 font-medium">
                    <Clock className="h-4 w-4" />
                    <span>{program.schedule}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}