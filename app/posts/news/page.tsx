"use client"

import Link from "next/link"
import { useContent } from "@/hooks/use-content"
import { Newspaper } from "lucide-react"

export default function NewsPage() {
  const { content } = useContent("news")

  const heroContent = content?.hero || {
    title: "Church News",
    subtitle: "Stay informed about what's happening",
    description: "Latest updates, announcements, and stories from our church family",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Newspaper className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroContent.title}</h1>
          <p className="text-xl text-purple-100 mb-2">{heroContent.subtitle}</p>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto">{heroContent.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4 text-lg">
            Our news section is currently being updated. Please check our{" "}
            <Link href="/posts" className="text-purple-700 hover:underline font-medium">
              Posts page
            </Link>{" "}
            for the latest updates and announcements.
          </p>
        </div>
      </div>
    </div>
  )
}