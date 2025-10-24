"use client"

import type React from "react"
import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import { EditPageButton } from "@/components/edit-page-button"
import {
  Cross,
  Heart,
  TrendingUp,
  Handshake,
  MessageCircle,
  Crown,
  Star,
  Home,
  BookOpen,
  Music,
  Info,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useContent } from "@/hooks/use-content"

export default function CoreValuesPage() {
  const { content, loading } = useContent("coreValues")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading core values...</p>
        </div>
      </div>
    )
  }

  const coreValues = content?.values || [
    {
      title: "Christ-Centered",
      description: "Jesus is the reason and purpose for all that we do.",
      icon: "Cross",
    },
    {
      title: "Prayer",
      description: "Our most crucial method of communicating with our Savior.",
      icon: "MessageCircle",
    },
    {
      title: "Hospitality",
      description: "An integral part of welcoming others into our fellowship.",
      icon: "Heart",
    },
    {
      title: "Spiritual Growth",
      description: "Our primary focus in building our relationship with God.",
      icon: "TrendingUp",
    },
    {
      title: "Commitment",
      description: "We are committed to God, our fellowship, and our community.",
      icon: "Handshake",
    },
    {
      title: "Evangelism",
      description: "Our method of introducing the world to our Savior.",
      icon: "MessageCircle",
    },
    {
      title: "Leadership",
      description: "We are committed to building leaders of integrity.",
      icon: "Crown",
    },
    {
      title: "Excellence",
      description: "We do all as if we are doing it unto the Lord.",
      icon: "Star",
    },
    {
      title: "Family",
      description: "We build families as pillars of the home, church, and community.",
      icon: "Home",
    },
    {
      title: "Love for Others",
      description: "Our most important way of showing love for God.",
      icon: "Heart",
    },
    {
      title: "Discipleship",
      description: "Our foundational and continuous instruction on Jesus and His doctrine.",
      icon: "BookOpen",
    },
    {
      title: "Inspiring Worship",
      description: "Our true and sincere expression of our Love and Adoration of God.",
      icon: "Music",
    },
  ]

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Cross,
      Heart,
      TrendingUp,
      Handshake,
      MessageCircle,
      Crown,
      Star,
      Home,
      BookOpen,
      Music,
      Info,
    }
    return icons[iconName] || Heart
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <EditPageButton pageId="coreValues" />

      <div className="container mx-auto px-4 py-16">
        <FadeInView>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {content?.hero?.title || (
                  <>
                    <span className="text-secondary-500">O</span>ur <span className="text-secondary-500">C</span>ore{" "}
                    <span className="text-secondary-500">V</span>alues
                  </>
                )}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {content?.hero?.subtitle ||
                  "These core values guide our ministry and shape our community as we serve Christ and one another."}
              </p>
            </div>

            {/* Core Values Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value: { title: string; description: string; icon: string }, index: number) => {
                const IconComponent = getIcon(value.icon)
                return (
                  <DropInView key={value.title} delay={index * 0.1}>
                    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-secondary-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-secondary-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-secondary-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{value.description}</p>
                    </div>
                  </DropInView>
                )
              })}
            </div>

            {/* Call to Action */}
            <DropInView delay={0.5}>
              <div className="mt-16 text-center">
                <div className="bg-secondary-50 rounded-lg p-8 border border-secondary-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {content?.callToAction?.title || "Living Our Values"}
                  </h2>
                  <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                    {content?.callToAction?.content ||
                      "These values are not just words on a page—they are the foundation of how we live, worship, and serve together as a community of believers. We invite you to join us in living out these values as we grow in Christ together."}
                  </p>
                </div>
              </div>
            </DropInView>
          </div>
        </FadeInView>

        {/* Back to About */}
        <FadeInView>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="border-purple-300 mt-4 shadow-lg hover:bg-gold-300 font-semibold hover:text-purple-700 hover-lift bg-transparent"
            >
              <Info className="mr-2 h-5 w-5" />
              Back to About
            </Button>
          </Link>
        </FadeInView>
      </div>
    </div>
  )
}