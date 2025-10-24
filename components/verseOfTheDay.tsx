"use client"

import { BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { useEffect, useState } from "react"

interface VerseData {
  text: string
  reference: string
  date: string
}

export default function VerseofTheDay() {
  const [verse, setVerse] = useState<VerseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchVerse() {
      try {
        const response = await fetch("/api/verse-of-the-day")
        if (!response.ok) throw new Error("Failed to fetch verse")

        const data = await response.json()
        if (isMounted) {
          setVerse(data)
        }
      } catch (error) {
        console.error("Error loading verse of the day:", error)
        // Use fallback verse on error
        if (isMounted) {
          setVerse({
            text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
            reference: "Jeremiah 29:11",
            date: new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchVerse()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <section className="mb-12">
        <Card className="bg-gradient-to-r from-purple-50 to-gold-50 border-gold-300 py-6 px-4">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-purple-700 mr-2" />
              <CardTitle className="text-purple-800">Verse of the Day</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!verse) return null

  return (
    <section className="mb-12">
      <Card className="bg-gradient-to-r from-purple-50 to-gold-50 border-gold-300 py-6 px-4">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <BookOpen className="h-6 w-6 text-purple-700 mr-2" />
            <CardTitle className="text-purple-800">Verse of the Day</CardTitle>
          </div>
          <CardDescription className="text-gold-600">{verse.date}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <blockquote className="text-lg md:text-xl italic text-gray-700 mb-4">&quot;{verse.text}&quot;</blockquote>
          <cite className="text-gold-700 font-semibold">{verse.reference}</cite>
        </CardContent>
      </Card>
    </section>
  )
}