"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  type IconDefinition,
  faArrowRight,
  faCalendar,
  faHeart,
  faPray,
  faUsers,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { DropInView } from "./DropInView"
import { FadeInView } from "./FadeInView"
import { useContent } from "@/hooks/use-content"

interface FeatureItem {
  icon: string
  title: string
  description: string
  link: string
  linkText: string
}

export default function FeaturedContent() {
  const { content, loading } = useContent("home")
  const featuredContent = content?.featured || {}

  const getIcon = (iconName: string): IconDefinition => {
    switch (iconName) {
      case "faCalendar":
        return faCalendar
      case "faPray":
        return faPray
      case "faUsers":
        return faUsers
      case "faHeart":
        return faHeart
      default:
        return faCalendar
    }
  }

  const defaultFeatures: FeatureItem[] = [
    {
      icon: "faCalendar",
      title: "Upcoming Services",
      description: "Join us for worship and fellowship",
      link: "/services",
      linkText: "View Service Times",
    },
    {
      icon: "faPray",
      title: "Prayer Requests",
      description: "We're here to pray with you",
      link: "/prayer",
      linkText: "Submit Request",
    },
    {
      icon: "faUsers",
      title: "About our Church",
      description: "Learn about our mission and values",
      link: "/about",
      linkText: "Learn More",
    },
    {
      icon: "faHeart",
      title: "Donate to our Vision",
      description: "Give tithe and/or offering",
      link: "/give",
      linkText: "Support our Ministry",
    },
  ]

  if (loading) {
    return (
      <section className="py-12">
        <div className="sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-4 mx-auto max-w-md"></div>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const features = featuredContent.features || defaultFeatures

  return (
    <section className="py-12">
      <div className="sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <DropInView>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {featuredContent.title || "Welcome to Our Church Family"}
            </h2>
          </DropInView>
        </div>

        {/* Who We Are Section */}
        <FadeInView>
          <div className="card border border-purple-200 shadow-lg p-6 mb-8 text-center bg-gradient-to-br from-white to-purple-50">
            <FadeInView>
              <p className="text-gray-600 mb-4 opacity-80 leading-relaxed">
                {featuredContent.description1 ||
                  "Holy City of God Christian Fellowship is a part of the Body of Christ that is centered on Christ Himself, and His mission of reconciliation. We understand that true reconciliation to God is the process of having an intimate and loving relationship with our Creator. During this process a nurturing relationship is formed, and we find our hope, peace, love, fulfillment, and joy in Him. We believe this is our foundational relationship that hinges the success of all other relationships."}
              </p>
            </FadeInView>
            <FadeInView delay={0.3}>
              <p className="text-gray-600 mb-4 opacity-80 leading-relaxed">
                {featuredContent.description2 ||
                  'We agree with Peter when he said, "Silver and gold have I none; but such as I have give I thee: in the name of Jesus Christ of Nazareth," having Jesus is better than having silver or gold. Maintaining this relationship revolutionizes our entire lives. Holy City is dedicated to the personal success of every member. We are committed to reach beyond carnal limitations and inherit the promise of eternal life; therefore, all of our efforts are focused and directed towards this purpose.'}
              </p>
            </FadeInView>
          </div>
        </FadeInView>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature: FeatureItem, index: number) => (
            <FadeInView key={index} delay={0.8 + index * 0.15}>
              <div className="text-center p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white rounded-lg hover:scale-105 hover:border-purple-200 group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon
                    icon={getIcon(feature.icon)}
                    className="w-8 h-8 text-primary group-hover:text-purple-700 transition-colors"
                  />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-purple-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-secondary mb-4">{feature.description}</p>
                <Link
                  href={feature.link}
                  className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium group-hover:gap-3 transition-all"
                >
                  {feature.linkText}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}