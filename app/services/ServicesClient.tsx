"use client"

import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import { ArrowLeft, Clock, Phone } from "lucide-react"
import { useContent } from "@/hooks/use-content"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServicesClient() {
  const { content, loading } = useContent("services")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  const regularServices = content.schedule?.services || []
  const specialServices: string[] = [
    "Revival Services",
    "Youth Ministry",
    "Women's Fellowship",
    "Men's Ministry",
    "Children's Church",
    "Community Outreach",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <FadeInView>
          <div className="max-w-4xl mx-auto">
            {/* Regular Services */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {content.hero?.title || "Schedule Of Services"}
                </h1>
                <p className="text-lg text-gray-600">
                  {content.hero?.subtitle || "Join us for worship, prayer, and fellowship throughout the week"}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {regularServices.map((service, index: number) => (
                  <DropInView key={service.name || index} delay={index * 0.1}>
                    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-secondary-500 hover:shadow-xl transition-shadow duration-300">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.name || "Service"}</h3>

                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-secondary-600" />
                          <span className="font-medium text-gray-700">{service.time}</span>
                        </div>
                      </div>

                      {service.description && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-secondary-50 rounded-md">
                          <Phone className="w-4 h-4 text-secondary-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{service.description}</span>
                        </div>
                      )}
                    </div>
                  </DropInView>
                ))}
              </div>
            </section>

            {/* Special Services */}
            <section>
              <FadeInView>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Special Services & Meetings</h2>
                </div>
              </FadeInView>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {specialServices.map((service: string, index: number) => (
                  <DropInView key={service} delay={index * 0.1}>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-secondary-500 hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-lg font-semibold text-gray-900">{service}</h3>
                    </div>
                  </DropInView>
                ))}
              </div>

              <DropInView delay={0.3}>
                <div className="bg-secondary-50 rounded-lg p-8 text-center border border-secondary-200">
                  <div className="flex justify-center mb-4">
                    <Phone className="w-8 h-8 text-secondary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">More Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Call the office for more information and for dates & times of our special services and meetings.
                  </p>
                  <div className="flex justify-center items-center gap-4">
                    <Button
                        asChild
                        size="lg"
                        variant="ghost"
                        className="hover-lift"
                    >
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            <span>Back to Home</span>
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="default"
                        className="hover-lift"
                    >
                        <Link href="/contact">
                            <Phone className="mr-2 h-4 w-4 text-primary-50" />
                            <span className="text-primary-50">Contact Us</span>
                        </Link>
                    </Button>
                  </div>
                </div>
              </DropInView>
            </section>
          </div>
        </FadeInView>
      </div>
    </div>
  )
}