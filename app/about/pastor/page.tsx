"use client"

import type React from "react"
import { useState } from "react"
import { DropInView } from "@/components/DropInView"
import { FadeInView } from "@/components/FadeInView"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MeetingRequestModal } from "@/components/pastor/meeting-request-modal"
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Award,
  BookOpen,
  Users,
  Heart,
  GraduationCap,
  Building,
  Star,
  Clock,
  Info,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useContent } from "@/hooks/use-content"

export default function PastorPage() {
  const { content, loading } = useContent("pastor")
  const [showMeetingModal, setShowMeetingModal] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pastor page...</p>
        </div>
      </div>
    )
  }

  const achievements = content?.achievements?.items || [
    {
      icon: "Award",
      title: "Kentucky Colonel",
      description: "Highest Humanitarian Award from Commonwealth of Kentucky (1995)",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: "Users",
      title: "300+ Mentored",
      description: "Successfully mentored over 300 people in professional and entrepreneurial careers",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: "Building",
      title: "Community Leader",
      description: "Founded OOPS and helped develop Field of Dreams Community Development Corporation",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: "Star",
      title: "Military Service",
      description: "US Army Gulf War Era veteran with multiple leadership awards",
      color: "bg-purple-100 text-purple-700",
    },
  ]

  const education = content?.education?.items || [
    {
      degree: "Doctorate in Discipleship (In Progress)",
      school: "Liberty University",
      focus: "Spiritual Formation",
      icon: "GraduationCap",
    },
    {
      degree: "Master of Arts",
      school: "Liberty University",
      focus: "Christian Ministry",
      icon: "BookOpen",
    },
    {
      degree: "Bachelor of Administration",
      school: "Cleary University",
      focus: "Information Technology Management",
      icon: "Building",
    },
  ]

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Award,
      Users,
      Building,
      Star,
      GraduationCap,
      BookOpen,
      Heart,
    }
    return icons[iconName] || Heart
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <DropInView>
                  <div className="relative w-80 h-80 mx-auto lg:mx-0 rounded-full overflow-hidden bg-white p-2 shadow-2xl">
                    <Image
                      src={content?.hero?.image || "/img/King_T_1-min.jpg"}
                      alt={content?.hero?.name || "Bishop Anthony King, Sr."}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                </DropInView>
              </div>

              <div className="text-center lg:text-left">
                <DropInView delay={0.3}>
                  <Badge className="bg-gold-100 text-gold-800 mb-4 text-lg px-4 py-2">
                    {content?.hero?.title || "Presiding Bishop"}
                  </Badge>
                </DropInView>

                <DropInView delay={0.5}>
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                    {content?.hero?.name || "Bishop Anthony King, Sr."}
                  </h1>
                </DropInView>

                <FadeInView delay={0.7}>
                  <p className="text-xl mb-8 opacity-90 leading-relaxed">
                    {content?.hero?.subtitle || (
                      <>
                        Founding Pastor of Holy City of God Christian Fellowship, Inc.
                        <br />
                        First Assistant Presiding Bishop of Maranatha Faith Fellowship International, Inc.
                      </>
                    )}
                  </p>
                </FadeInView>

                <FadeInView delay={0.9}>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <Button
                      size="lg"
                      className="bg-gold-600 hover:bg-gold-700 text-white"
                      onClick={() => setShowMeetingModal(true)}
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Request Meeting
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-purple-800 bg-transparent"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Contact Pastor
                    </Button>
                  </div>
                </FadeInView>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministry Vision */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <DropInView>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                {content?.vision?.title || "Ministry Vision & Mandate"}
              </h2>
            </DropInView>

            <FadeInView delay={0.3}>
              <Card className="border-purple-200 shadow-lg bg-gradient-to-br from-white to-purple-50">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">
                      {content?.vision?.verse || "Hebrews 6:1"}
                    </Badge>
                  </div>
                  <blockquote className="text-2xl font-medium text-gray-800 mb-6 italic">
                    {content?.vision?.quote || '"Let us go on to perfection (maturity)"'}
                  </blockquote>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {content?.vision?.description ||
                      content?.vision?.content ||
                      "Bishop King's leadership inspiration and divine mandate, received in a vision in 1998, has become his mandate and mantra. His greatest joy is to see God's people mature in Him. He truly enjoys recognizing and developing potential in those whom he leads."}
                  </p>
                </CardContent>
              </Card>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <DropInView>
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                {content?.biography?.title || "About Bishop King"}
              </h2>
            </DropInView>

            <div className="space-y-8">
              {(
                content?.biography?.sections || [
                  {
                    title: "Ministry Foundation",
                    content:
                      "Bishop Anthony K. King, Sr. is the founding pastor of Holy City of God Christian Fellowship, Inc., in Detroit, Michigan. Bishop King also serves as First Assistant Presiding Bishop of Maranatha Faith Fellowship International, Inc, in McDonough, Georgia. His ministry has shaped and encouraged the lives of thousands of people in his over 25-year ministry tenure. Therefore, Spiritual Formation is the foundation of his leadership. Bishop King's greatest passion is building people and helping them recognize that God is at work in their lives.",
                    icon: "Heart",
                    quote: "It is ALL good, no matter how it looks or feels. - Bishop King's life motto",
                  },
                  {
                    title: "Leadership Background",
                    content:
                      "Bishop King's leadership background includes leadership on various levels throughout his walk with Christ. His leadership skills excelled as he trained and led troops in the United States Army during the Gulf War Era. During his military tenure, he received multiple leadership awards, commendations, and recognition for Training Excellence, Good Conduct, and Achievement on various levels. He was commissioned a Kentucky Colonel (the highest Humanitarian Award given by the Commonwealth of Kentucky) in 1995 for his leadership in several community projects throughout the Commonwealth of Kentucky.",
                    icon: "Users",
                  },
                  {
                    title: "Community Impact",
                    content:
                      "As a leader in the community, Bishop King has been instrumental in developing several organizations designed to transform communities and people. He founded Overcoming Obstacles for People's Success (OOPS), an organization that assists members of the community in securing employment, tutoring, interview coaching, IT training, Life Skills, and much more. He was also instrumental in helping to develop the Field of Dreams Community Development Corporation, created to assist various communities in rebuilding Detroit.",
                    icon: "Building",
                    highlight:
                      "Bishop King has successfully mentored over 300 people in their professional and entrepreneurial careers.",
                  },
                  {
                    title: "Personal Interests",
                    content:
                      "Bishop King enjoys reading, traveling, spending time with family and friends, walks on the beach, nature, live performances, a variety of music, and art. He is a father, grandfather, brother, cousin, nephew, and friend to countless people as well as an inspirer to all with whom he comes in contact. His warm personality and genuine care for others makes him approachable and beloved by the community.",
                    icon: "Heart",
                  },
                ]
              ).map(
                (
                  section: { title: string; content: string; icon: string; quote?: string; highlight?: string },
                  index: number,
                ) => {
                  const IconComponent = getIcon(section.icon)
                  return (
                    <FadeInView key={section.title} delay={0.3 + index * 0.2}>
                      <Card className="border-purple-200 shadow-lg">
                        <CardContent className="p-8">
                          <div className="flex items-start gap-4 mb-6">
                            <div
                              className={`p-3 bg-${section.icon === "Heart" ? "purple" : section.icon === "Users" ? "blue" : section.icon === "Building" ? "green" : "orange"}-100 rounded-lg`}
                            >
                              <IconComponent
                                className={`h-6 w-6 text-${section.icon === "Heart" ? "purple" : section.icon === "Users" ? "blue" : section.icon === "Building" ? "green" : "orange"}-700`}
                              />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h3>
                              <p className="text-gray-700 leading-relaxed">{section.content}</p>
                            </div>
                          </div>

                          {section.quote && (
                            <div className="bg-purple-50 p-6 rounded-lg">
                              <p className="text-purple-800 font-medium text-center italic">&quot;{section.quote}&quot;</p>
                            </div>
                          )}

                          {section.highlight && (
                            <div className="bg-green-50 p-6 rounded-lg">
                              <p className="text-green-800 font-medium text-center">{section.highlight}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </FadeInView>
                  )
                },
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <DropInView>
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                {content?.achievements?.title || "Notable Achievements"}
              </h2>
            </DropInView>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map(
                (achievement: { icon: string; title: string; description: string; color: string }, index: number) => {
                  const IconComponent = getIcon(achievement.icon)
                  return (
                    <FadeInView key={achievement.title} delay={0.3 + index * 0.1}>
                      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-purple-100">
                        <CardContent className="p-6 text-center">
                          <div
                            className={`inline-flex p-4 rounded-full ${achievement.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent className="h-8 w-8" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
                        </CardContent>
                      </Card>
                    </FadeInView>
                  )
                },
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <DropInView>
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                {content?.education?.title || "Educational Background"}
              </h2>
            </DropInView>

            <div className="space-y-6">
              {education.map((edu: { degree: string; school: string; focus: string; icon: string }, index: number) => {
                const IconComponent = getIcon(edu.icon)
                return (
                  <FadeInView key={edu.degree} delay={0.3 + index * 0.2}>
                    <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <IconComponent className="h-6 w-6 text-purple-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.degree}</h3>
                            <p className="text-purple-700 font-medium mb-1">{edu.school}</p>
                            <p className="text-gray-600">Focus: {edu.focus}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeInView>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-r from-purple-800 to-purple-900 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <DropInView>
              <h2 className="text-4xl font-bold mb-8">{content?.contact?.title || "Connect with Bishop King"}</h2>
            </DropInView>

            <FadeInView delay={0.3}>
              <p className="text-xl mb-12 opacity-90">
                {content?.contact?.description ||
                  "Whether you need spiritual guidance, counseling, or want to learn more about our ministry, Bishop King is here to serve you."}
              </p>
            </FadeInView>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <FadeInView delay={0.5}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-8 w-8 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">Phone</h3>
                    <p className="opacity-90">
                      {content?.contact?.phone || content?.contact?.info?.phone || "(313) 555-0123"}
                    </p>
                  </CardContent>
                </Card>
              </FadeInView>

              <FadeInView delay={0.7}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <Mail className="h-8 w-8 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">Email</h3>
                    <p className="opacity-90">
                      {content?.contact?.email || content?.contact?.info?.email || "pastor@holycityofgod.org"}
                    </p>
                  </CardContent>
                </Card>
              </FadeInView>

              <FadeInView delay={0.9}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">Office Hours</h3>
                    <p className="opacity-90">
                      {content?.contact?.hours || content?.contact?.info?.hours || "Mon-Fri: 9AM-5PM"}
                    </p>
                  </CardContent>
                </Card>
              </FadeInView>
            </div>

            <FadeInView delay={1.1}>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gold-600 hover:bg-gold-700 text-white"
                  onClick={() => setShowMeetingModal(true)}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Request Meeting
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-800 bg-transparent"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Visit Our Church
                </Button>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-purple-800 bg-transparent"
                  >
                    <Info className="mr-2 h-5 w-5" />
                    Back to About
                  </Button>
                </Link>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Meeting Request Modal */}
      <MeetingRequestModal open={showMeetingModal} onOpenChange={setShowMeetingModal} />
    </div>
  )
}