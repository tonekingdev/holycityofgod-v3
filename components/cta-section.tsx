"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import { Heart, Phone, Users } from "lucide-react"
import { useContent } from "@/hooks/use-content"

interface ActionCard {
  icon: "Users" | "Heart" | "Phone"
  title: string
  description: string
  buttonText: string
  link: string
}

export default function CTASection() {
  const { content, loading } = useContent("home")
  const ctaContent = content?.cta || {}

  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded mb-6 mx-auto max-w-md"></div>
              <div className="h-6 bg-white/20 rounded mb-4 mx-auto max-w-2xl"></div>
              <div className="h-4 bg-white/20 rounded mb-12 mx-auto max-w-xl"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Header */}
          <DropInView>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{ctaContent.title || "Partner with Us"}</h2>
          </DropInView>

          <FadeInView delay={0.3}>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              {ctaContent.subtitle ||
                "Experience the love, fellowship, and spiritual growth that comes from being part of our community."}
            </p>
          </FadeInView>

          <FadeInView delay={0.5}>
            <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
              {ctaContent.verse || '"For where two or three gather in my name, there am I with them." - Matthew 18:20'}
            </p>
          </FadeInView>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {(
              ctaContent.actionCards || [
                {
                  icon: "Users" as const,
                  title: "Join Our Services",
                  description:
                    "Sunday School at 10:00 AM\nSunday Worship at 11:00 AM\nWednesday Bible Study at 7:00 PM\n16606 James Couzens Fwy, Detroit, MI 48221",
                  buttonText: "View Service Times",
                  link: "/services",
                },
                {
                  icon: "Heart" as const,
                  title: "Give & Support",
                  description:
                    "Support our ministry and community outreach through your generous giving. Every contribution makes a difference.",
                  buttonText: "Give Online",
                  link: "/give",
                },
                {
                  icon: "Phone" as const,
                  title: "Get Connected",
                  description:
                    "Have questions or need prayer? We're here for you. Reach out and let us know how we can serve you.",
                  buttonText: "Contact Us",
                  link: "/contact",
                },
              ]
            ).map((card: ActionCard, index: number) => {
              const IconComponent = card.icon === "Users" ? Users : card.icon === "Heart" ? Heart : Phone
              return (
                <FadeInView key={index} delay={0.7 + index * 0.2}>
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl text-white font-bold mb-4">{card.title}</h3>
                      <p className="text-white/80 mb-6 leading-relaxed whitespace-pre-line">{card.description}</p>
                      <Button
                        asChild
                        variant="secondary"
                        className="bg-white text-purple-800 hover:bg-white/90 font-semibold"
                      >
                        <Link href={card.link}>{card.buttonText}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </FadeInView>
              )
            })}
          </div>

          {/* Final CTA */}
          <FadeInView delay={1.3}>
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-gold-600 hover:bg-gold-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover-lift transition-all"
              >
                <Link href={ctaContent.finalCta?.link || "/about"}>
                  {ctaContent.finalCta?.text || "Learn about HCOG"}
                </Link>
              </Button>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}