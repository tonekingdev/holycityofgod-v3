"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ChurchIcon, Building2, Phone, Mail, MapPin } from "lucide-react"
import { FadeInView } from "@/components/FadeInView"
import { SlideInView } from "@/components/SlideInView"

interface ChurchData {
  id: number
  name: string
  description: string
  website_url: string
  address: string
  phone: string
  email: string
  pastor_name: string
  image_url: string
  is_active: boolean
}

interface BusinessData {
  id: number
  name: string
  description: string
  website_url: string
  business_type: string
  address: string
  phone: string
  email: string
  contact_person: string
  image_url: string
  is_active: boolean
}

export default function OurNetworkPage() {
  const [churches, setChurches] = useState<ChurchData[]>([])
  const [businesses, setBusinesses] = useState<BusinessData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        setLoading(true)

        // Fetch churches
        const churchesResponse = await fetch("/api/network/churches?is_active=true")
        if (churchesResponse.ok) {
          const churchesData = await churchesResponse.json()
          if (churchesData.success) {
            setChurches(churchesData.churches)
          }
        }

        // Fetch businesses
        const businessesResponse = await fetch("/api/network/businesses?is_active=true")
        if (businessesResponse.ok) {
          const businessesData = await businessesResponse.json()
          if (businessesData.success) {
            setBusinesses(businessesData.businesses)
          }
        }
      } catch (error) {
        console.error("Error fetching network data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNetworkData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading our network...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative px-4 text-center bg-gradient-to-r from-purple-800 to-purple-900 text-white">
        <div className="container mx-auto py-16">
          <FadeInView>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Our Network</h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90 text-balance">Fellowship Churches & Partner Businesses</p>
            <p className="text-lg mb-8 opacity-80 max-w-3xl mx-auto text-pretty">
              Discover the vibrant community of fellowship churches and trusted businesses that share our values and
              commitment to serving God and our community.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Fellowship Churches Section */}
      <section className="container mx-auto px-4 py-16">
        <SlideInView>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <ChurchIcon className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Fellowship Churches</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Connect with our partner churches that share our mission of spreading God&apos;s love and building His
              kingdom in our communities.
            </p>
          </div>
        </SlideInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {churches.map((church, index) => (
            <FadeInView key={church.id} delay={index * 0.1}>
              <Card className="h-full hover-lift bg-card border-border">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={church.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={church.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{church.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{church.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-pretty">{church.address}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{church.phone}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="break-all">{church.email}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium text-primary mb-3">Pastor: {church.pastor_name}</p>

                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      <a
                        href={church.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>
          ))}
        </div>
      </section>

      {/* Partner Businesses Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-16">
          <SlideInView>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-3xl md:text-4xl font-bold text-balance">Partner Businesses</h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Support local businesses that share our values and are committed to serving our community with integrity
                and excellence.
              </p>
            </div>
          </SlideInView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business, index) => (
              <FadeInView key={business.id} delay={index * 0.1}>
                <Card className="h-full hover-lift bg-card border-border">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={business.image_url || "/placeholder.svg?height=200&width=300"}
                      alt={business.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-primary text-balance">{business.name}</CardTitle>
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {business.business_type}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground text-pretty">
                      {business.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-pretty">{business.address}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{business.phone}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="break-all">{business.email}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm font-medium text-primary mb-3">
                        Contact: {business.contact_person}
                      </p>

                      <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <a
                          href={business.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <FadeInView>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Join Our Network</h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Are you a church or business that shares our values? We&apos;d love to connect with you and explore
              opportunities for fellowship and partnership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="hover-lift bg-secondary-300 hover:bg-secondary-500 font-semibold">
                <a href="mailto:info@holycityofgod.org">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Us
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary-100 hover-lift hover:text-white bg-transparent"
              >
                <a href="/about">Learn More About Us</a>
              </Button>
            </div>
          </div>
        </FadeInView>
      </section>
    </div>
  )
}