"use client"

// import { AnnouncementsList } from "@/components/AnnouncementsList"
import CTASection from "@/components/cta-section"
import { DropInView } from "@/components/DropInView"
import { FadeInView } from "@/components/FadeInView"
import FeaturedContent from "@/components/featuredContent"
import { LatestPosts } from "@/components/posts/latest-posts"
// import RemoteServiceNotification from "@/components/remote-service-notification"
import { SlideInView } from "@/components/SlideInView"
import VerseofTheDay from "@/components/verseOfTheDay"
import { useContent } from "@/hooks/use-content"
import { CHURCH_INFO } from "@/constants"
import { Heart, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { EditPageButton } from "@/components/edit-page-button"

export default function Home() {
  const { content } = useContent("home")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <EditPageButton pageId="home" />

      {/* Hero Section */}
      <section className="relative px-4 py-16 text-center text-white min-h-screen flex items-center">
        {content.hero?.backgroundVideo ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={content.hero.backgroundVideo} type="video/mp4" />
          </video>
        ) : content.hero?.backgroundImage ? (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${content.hero.backgroundImage})` }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-800 to-purple-900" />
        )}

        <div
          className="absolute inset-0 gradient-hero"
          style={{ opacity: (content.hero?.overlayOpacity ?? 40) / 100 }}
        />

        {/* Content */}
        <div className="container relative z-10">
          {/* <SlideInView>
            <RemoteServiceNotification />
          </SlideInView> */}
          <FadeInView>
            <div className="flex justify-center mb-6">
              <div className="relative h-24 w-24 bg-white rounded-full p-3 shadow-2xl overflow-hidden">
                <Image
                  src="/img/church-logo.png"
                  alt="Holy City of God Christian Fellowship Inc."
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Holy City of God</h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">Christian Fellowship Inc.</p>
            <p className="text-sm md:text-xl mb-8 opacity-90">{CHURCH_INFO.contact.address.full}</p>
            <p className="text-sm md:text-xl italic font-light mb-8 opacity-80">{CHURCH_INFO.subtitle}</p>
          </FadeInView>
          <DropInView>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="btn-primary hover:bg-gold-300 hover:text-purple-900 font-semibold inline-flex hover-lift"
              >
                <Users className="mr-2 h-5 w-5" />
                Join Our Services
              </Link>
              <Link href="/give" className="btn-outline inline-flex hover:text-gold-500 hover-lift">
                <Heart className="mr-2 h-5 w-5" />
                Give Online
              </Link>
            </div>
          </DropInView>
        </div>
      </section>

      {/* Announcements Section */}
      {/* <section className="container py-8">
        <FadeInView>
          <AnnouncementsList limit={3} showActions={false} className="mb-0" />
        </FadeInView>
      </section> */}

      <section className="container">
        {/* Verse of the Day */}
        <SlideInView>
          <VerseofTheDay />
        </SlideInView>
      </section>

      <section className="bg-gradient-to-r from-gray-50 to-gray-200">
        <div className="container">
          {/* Feature Content */}
          <FeaturedContent />
        </div>
      </section>

      <section className="container">
        {/* Latest Post */}
        <LatestPosts />
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}