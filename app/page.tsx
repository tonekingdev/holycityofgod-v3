import FeaturedContent from "@/components/featuredContent";
import RemoteServiceNotification from "@/components/remote-service-notification";
import VerseofTheDay from "@/components/verseOfTheDay";
import { CHURCH_INFO } from "@/constants";
import { Heart, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative px-4 text-center bg-gradient-to-r from-purple-800 to-purple-900 text-white">
        <div className="container">
          <RemoteServiceNotification />
          <div className="flex justify-center mb-6">
            <div className="relative h-24 w-24 bg-white rounded-full p-3 shadow-2xl overflow overflow-hidden">
              <Image 
                src="/img/church-logo.png"
                alt="Holy City of God Christian Fellowship Inc."
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Holy City of God</h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">Christian Fellowship Inc.</p>
          <p className="text-sm md:text-xl italic font-light mb-8 opacity-80">
            {CHURCH_INFO.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="btn-primary hover:bg-gold-300 hover:text-purple-900 font-semibold inline-flex hover-lift"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Our Services
            </Link>
            <Link
              href="/give"
              className="btn-outline inline-flex hover:text-gold-500 hover-lift" 
            >
              <Heart className="mr-2 h-5 w-5" />
              Give Online
            </Link>
          </div>
       </div>
      </section>
      
      <section className="container">
        {/* Verse of the Day */}
        <VerseofTheDay />
      </section>

      <section className="bg-gradient-to-r from-gray-50 to-gray-200">
        <div className="container">
          {/* Feature Content */}
          <FeaturedContent />
        </div>
      </section>
    </div>
  )
}
