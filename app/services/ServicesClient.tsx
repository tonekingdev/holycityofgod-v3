"use client"

import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import { EditPageButton } from "@/components/edit-page-button"
import { Clock, Phone, ArrowLeft, Users, Globe, Languages, Mail } from "lucide-react"
import { useContent } from "@/hooks/use-content"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CHURCH_INFO } from "@/constants"

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
  const ministries = content.ministries?.departments || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <EditPageButton pageId="services" />

      <div className="container mx-auto px-4 py-16">
        <FadeInView>
          <div className="max-w-4xl mx-auto">
            {/* Regular Services */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {content.hero?.title || "Schedule Of Services"}
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  {content.hero?.subtitle || "Join us for worship, prayer, and fellowship throughout the week"}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full sm:flex-1 bg-primary hover:bg-primary-700 text-white py-5 sm:py-6 text-base shadow-md hover:shadow-lg transition-all duration-200"
                    asChild
                  >
                    <a 
                      href="https://join.freeconferencecall.com/100-009-769" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3"
                    >
                      <Globe className="w-5 h-5" />
                      <span className="font-semibold">Join our Online Meeting</span>
                    </a>
                  </Button>
                  
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full sm:flex-1 bg-secondary hover:bg-secondary-700 text-white py-5 sm:py-6 text-base shadow-md hover:shadow-lg transition-all duration-200"
                    asChild
                  >
                    <a 
                      href="https://fccdl.in/i/100-009-769" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3"
                    >
                      <Languages className="w-5 h-5" />
                      <span className="font-semibold">Join International</span>
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {regularServices.map((service, index: number) => (
                  <DropInView key={service.name || index} delay={index * 0.1}>
                    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-secondary-500 hover:shadow-xl transition-shadow duration-300">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.name || "Service"}</h3>

                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-secondary" />
                          <span className="font-medium text-gray-700">{service.time}</span>
                        </div>
                      </div>

                      {service.description && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-secondary-50 rounded-md">
                          <Phone className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{service.description}</span>
                        </div>
                      )}

                      {/* {service.localLink && (
                        <div className="flex items-start gap-2 mt-2 p-3 bg-secondary-50 rounded-md">
                          <Globe className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            <a href={service.localLink} target="_blank" rel="noopener noreferrer">
                              Join Online Meeting
                            </a>
                          </span>
                        </div>
                      )} */}

                      {/* {service.internationalLink && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-secondary-50 rounded-md">
                          <Languages className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            <a href={service.internationalLink} target="_blank" rel="noopener noreferrer">
                              Join International Meeting
                            </a>
                          </span>
                        </div>
                      )} */}
                    </div>
                  </DropInView>
                ))}
              </div>
            </section>

            <section>
              <FadeInView>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {content.ministries?.title || "Ministries"}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {content.ministries?.subtitle || "Discover our ministry departments and get involved"}
                  </p>
                </div>
              </FadeInView>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {ministries.map((ministry, index: number) => (
                  <DropInView key={ministry.id} delay={index * 0.1}>
                    <Link href={`/our-network/ministries/${ministry.id}`}>
                      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-secondary-500 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <Users className="w-6 h-6 text-secondary" />
                          <h3 className="text-xl font-semibold text-gray-900">{ministry.name}</h3>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{ministry.description}</p>
                        {ministry.meetingTime && (
                          <div className="flex items-center gap-2 mt-4 text-sm text-secondary">
                            <Clock className="w-4 h-4" />
                            <span>{ministry.meetingTime}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </DropInView>
                ))}
              </div>

              <DropInView delay={0.3}>
                <div className="bg-secondary-50 rounded-lg p-8 text-center border border-secondary-200">
                  {/* <div className="flex justify-center mb-4">
                    <Phone className="w-8 h-8 text-secondary" />
                  </div> */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">More Information</h3>
                  <div className="flex-row items-center justify-center text-gray-700 mb-4">
                    <div className="flex items-center justify-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>(313) 397-8240</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <a
                        href={`mailto:${CHURCH_INFO.contact.email}`}
                        className="text-black hover:text-primary transition-colors"
                      >
                        info@holycityofgod.org
                      </a>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <Button asChild size="lg" variant="ghost" className="hover-lift">
                      <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <span>Back to Home</span>
                      </Link>
                    </Button>
                    {/* <Button asChild size="lg" variant="default" className="hover-lift">
                      <Link href="/contact">
                        <Phone className="mr-2 h-4 w-4 text-primary-50" />
                        <span className="text-primary-50">Contact Us</span>
                      </Link>
                    </Button> */}
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