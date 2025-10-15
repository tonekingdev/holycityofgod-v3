"use client"

import { MINISTRIES } from "@/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Target } from "lucide-react"
import { useContent } from "@/hooks/use-content"

export default function MinistriesPage() {
  const { content } = useContent("ourNetwork")

  const heroContent = content?.ministries || {
    title: "Our Ministries",
    description: `Discover the various ways you can serve and grow in your faith`,
    callToAction: "Get involved in a ministry that matches your passion and calling",
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
        {/* Call to Action */}
        {heroContent.callToAction && (
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">{heroContent.callToAction}</p>
          </div>
        )}

        {/* Ministries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MINISTRIES.map((ministry) => (
            <Card key={ministry.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700">{ministry.name}</CardTitle>
                <CardDescription>{ministry.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{ministry.leader}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{ministry.meetingTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>{ministry.targetAudience}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {ministry.activities.map((activity) => (
                    <Badge key={activity} variant="secondary">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}