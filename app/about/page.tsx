"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import { EditPageButton } from "@/components/edit-page-button"
import { Heart, Users, BookOpen, Church, ArrowRight, MapPin, Clock, Phone } from "lucide-react"
import { useContent } from "@/hooks/use-content"

interface AboutSection {
  title: string
  description: string
  icon: string
  href: string
  color: string
}

export default function AboutPage() {
  const { content, loading } = useContent("about")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about page...</p>
        </div>
      </div>
    )
  }

  const aboutSections: AboutSection[] = content?.sections?.items || [
    {
      title: "Our Mission",
      description: "Discover our calling to spread God's love and build His kingdom",
      icon: "Heart",
      href: "/about/mission",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    {
      title: "Core Values",
      description: "The fundamental principles that guide our church community",
      icon: "Users",
      href: "/about/core-values",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      title: "Our Services",
      description: "Worship times, special events, and ministry opportunities",
      icon: "Church",
      href: "/services",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      title: "Statement of Faith",
      description: "Our biblical beliefs and doctrinal foundations",
      icon: "BookOpen",
      href: "/about/statement-of-faith",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  ]

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Heart,
      Users,
      BookOpen,
      Church,
    }
    return icons[iconName] || Heart
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <EditPageButton pageId="about" />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <DropInView>
              <div className="flex justify-center mb-8">
                <div className="relative h-32 w-32 bg-white rounded-full p-4 shadow-2xl overflow-hidden">
                  <Image
                    src="/img/church-logo.png"
                    alt="Holy City of God Christian Fellowship"
                    height={100}
                    width={100}
                    className="object-contain"
                  />
                </div>
              </div>
            </DropInView>

            <DropInView delay={0.2}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">{content?.hero?.title || "About Our Church"}</h1>
            </DropInView>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <DropInView>
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                {content?.story?.title || "Who we are"}
              </h2>
            </DropInView>

            <FadeInView delay={0.3}>
              <Card className="border-purple-200 shadow-lg bg-gradient-to-br from-white to-purple-50">
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="mb-6">
                      {content?.story?.content ||
                        "Holy City of God Christian Fellowship is a part of the Body of Christ that is centered on Christ Himself, and His mission of reconciliation. We understand that true reconciliation to God is the process of having an intimate and loving relationship with our Creator."}
                    </p>
                    {(content?.story?.additionalContent || []).map((paragraph: string, index: number) => (
                      <p key={index} className="mb-6">
                        {paragraph}
                      </p>
                    )) || (
                      <>
                        <p className="mb-6">
                          During this process a nurturing relationship is formed, and we find our hope, peace, love,
                          fulfillment, and joy in Him. We believe this is our foundational relationship that hinges the
                          success of all other relationships.
                        </p>
                        <p className="mb-6">
                          We agree with Peter when he said, &ldquo;Silver and gold have I none; but such as I have give
                          I thee: in the name of Jesus Christ of Nazareth,&rdquo; having Jesus is better than having
                          silver or gold. Maintaining this relationship revolutionizes our entire lives.
                        </p>
                        <p>
                          Holy City is dedicated to the personal success of every member. We are committed to reach
                          beyond carnal limitations and inherit the promise of eternal life; therefore, all of our
                          efforts are focused and directed towards this purpose.
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* About Sections Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container">
          <DropInView>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              {content?.sections?.title || "Learn about HCOG"}
            </h2>
          </DropInView>

          <FadeInView delay={0.3}>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              {content?.sections?.description ||
                "Explore the different aspects of our church community and discover how you can be part of God's work here."}
            </p>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {aboutSections.map((section: AboutSection, index: number) => {
              const IconComponent = getIcon(section.icon)
              return (
                <FadeInView key={section.href} delay={0.5 + index * 0.1}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-purple-100 hover:border-purple-200 bg-white">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-lg ${section.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                            {section.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">{section.description}</p>
                          <Link
                            href={section.href}
                            className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium group-hover:gap-2 transition-all duration-300"
                          >
                            Learn More
                            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeInView>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pastor Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <DropInView>
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                {content?.pastor?.title || "Meet Our Pastor"}
              </h2>
            </DropInView>

            <FadeInView delay={0.3}>
              <Card className="border-purple-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div className="text-center">
                      <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-purple-100">
                        <Image
                          src={content?.pastor?.image || "/img/placeholder.jpg?height=200&width=200&text=Pastor+Photo"}
                          alt={content?.pastor?.name || "Bishop Anthony King, Sr."}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        {content?.pastor?.badge || "Presiding Bishop"}
                      </Badge>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {content?.pastor?.name || "Bishop Anthony K. King, Sr."}
                      </h3>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {content?.pastor?.bio ||
                          "Our pastor brings years of ministry experience and a heart for serving God's people. With a passion for teaching God's Word and building authentic community, they lead our congregation with wisdom, compassion, and dedication to Christ's mission."}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {content?.pastor?.quote ||
                          '"My prayer is that every person who walks through our doors will encounter the transforming love of Jesus Christ and discover their purpose in God\'s kingdom."'}
                      </p>
                      <div className="mt-2 space-y-2">
                        <Link href="/about/pastor">
                          <Button variant="ghost" className="bg-transparent">
                            Read More
                            <span className="ml-2">
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <DropInView>
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                {content?.contact?.title || "Visit Us This Sunday"}
              </h2>
            </DropInView>

            <div className="grid md:grid-cols-3 gap-8">
              <FadeInView delay={0.3}>
                <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{content?.contact?.location?.title || "Location"}</h3>
                    <p className="text-gray-600">
                      {content?.contact?.location?.address || "123 Faith Street\nHoly City, HC 12345"}
                    </p>
                  </CardContent>
                </Card>
              </FadeInView>

              <FadeInView delay={0.5}>
                <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {content?.contact?.serviceTimes?.title || "Service Times"}
                    </h3>
                    <p className="text-gray-600">
                      {content?.contact?.serviceTimes?.times ||
                        "Sunday Worship: 10:00 AM\nWednesday Bible Study: 7:00 PM"}
                    </p>
                  </CardContent>
                </Card>
              </FadeInView>

              <FadeInView delay={0.7}>
                <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{content?.contact?.contact?.title || "Contact"}</h3>
                    <p className="text-gray-600">
                      {content?.contact?.contact?.phone || "(555) 123-HOLY"}
                      <br />
                      {content?.contact?.contact?.email || "info@holycityofgod.org"}
                    </p>
                  </CardContent>
                </Card>
              </FadeInView>
            </div>

            <FadeInView delay={0.9}>
              <div className="flex items-center justify-center gap-3 mt-12">
                <Button asChild size="lg" className="bg-gray-200 text-black hover:bg-gray-300 px-8 py-4 text-lg">
                  <Link href="/" className="text-black hover:text-primary transition-colors">
                    Back to Home
                  </Link>
                </Button>
                <Button asChild size="lg" className="bg-purple-600 hover:bg-secondary-300 px-8 py-4 text-lg">
                  <Link href="/contact" className="text-gold-100 hover:text-secondary-400 transition-colors">
                    {content?.contact?.ctaText || "Plan Your Visit"}
                  </Link>
                </Button>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>
    </div>
  )
}