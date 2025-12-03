"use client"

import { useContent } from "@/hooks/use-content"
import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, Phone, CheckCircle } from "lucide-react"
import { notFound } from "next/navigation"

interface MinistryDetailClientProps {
  slug: string
}

export default function MinistryDetailClient({ slug }: MinistryDetailClientProps) {
  const { content, loading } = useContent("services")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ministry details...</p>
        </div>
      </div>
    )
  }

  const ministries = content.ministries?.departments || []
  const ministry = ministries.find((m) => m.id === slug)

  if (!ministry) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4">
          <FadeInView>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{ministry.name}</h1>
              <p className="text-xl text-primary-50 leading-relaxed">{ministry.description}</p>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Ministry Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Leadership */}
              <DropInView delay={0.1}>
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-secondary-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-gray-900">Leadership</h2>
                  </div>
                  <p className="text-gray-700 text-lg">{ministry.leader}</p>
                </div>
              </DropInView>

              {/* Meeting Time */}
              <DropInView delay={0.2}>
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-secondary-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-gray-900">Meeting Time</h2>
                  </div>
                  <p className="text-gray-700 text-lg">{ministry.meetingTime}</p>
                </div>
              </DropInView>
            </div>

            {/* Target Audience */}
            <DropInView delay={0.3}>
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-t-4 border-secondary-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Should Join</h2>
                <p className="text-gray-700 text-lg">{ministry.targetAudience}</p>
              </div>
            </DropInView>

            {/* Activities */}
            <DropInView delay={0.4}>
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-t-4 border-secondary-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Do</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {ministry.activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DropInView>

            {/* Contact & Get Involved */}
            <DropInView delay={0.5}>
              <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg p-8 text-center border border-secondary-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Involved</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {ministry.contact || "Contact the church office for more information about joining this ministry."}
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Button asChild size="lg" variant="ghost" className="hover-lift">
                    <Link href="/services">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      <span>Back to Services</span>
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="default" className="hover-lift">
                    <Link href="/contact">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>Contact Us</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </DropInView>
          </div>
        </div>
      </section>
    </div>
  )
}