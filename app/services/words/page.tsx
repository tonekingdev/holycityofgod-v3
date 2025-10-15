"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Play, Download, FileText } from "lucide-react"
import { format } from "date-fns"
import { useContent } from "@/hooks/use-content"

interface Word {
  id: string
  title: string
  description?: string
  summary?: string
  word_date?: string
  created_at: string
  first_name?: string
  last_name?: string
  service_type?: string
  is_featured?: boolean
  audio_url?: string
  video_url?: string
  slides_url?: string
  notes_url?: string
}

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const { content } = useContent("services")

  useEffect(() => {
    fetchWords()
  }, [])

  const fetchWords = async () => {
    try {
      const response = await fetch("/api/word?status=published&limit=20")
      if (response.ok) {
        const data = await response.json()
        setWords(data.words || [])
      }
    } catch (error) {
      console.error("[Anointed Innovations] Error fetching words:", error)
    } finally {
      setLoading(false)
    }
  }

  const heroContent = content?.words?.hero || {
    title: "Words from God",
    subtitle: "Messages from our spiritual leaders",
    description: "Access sermons, teachings, and prophetic words shared during our services",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroContent.title}</h1>
          <p className="text-xl text-purple-100 mb-2">{heroContent.subtitle}</p>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto">{heroContent.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading words...</p>
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No words available at this time. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {words.map((word: Word) => (
              <Card key={word.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl text-purple-700 flex-1">{word.title}</CardTitle>
                    {word.is_featured && (
                      <Badge variant="default" className="bg-purple-600">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">{word.description || word.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(word.word_date || word.created_at), "PPP")}</span>
                  </div>
                  {(word.first_name || word.last_name) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>
                        {word.first_name} {word.last_name}
                      </span>
                    </div>
                  )}
                  {word.service_type && (
                    <Badge variant="secondary" className="w-fit">
                      {word.service_type}
                    </Badge>
                  )}

                  {/* Media Links */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4">
                    {word.audio_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={word.audio_url} target="_blank" rel="noopener noreferrer">
                          <Play className="h-3 w-3 mr-1" />
                          Audio
                        </a>
                      </Button>
                    )}
                    {word.video_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={word.video_url} target="_blank" rel="noopener noreferrer">
                          <Play className="h-3 w-3 mr-1" />
                          Video
                        </a>
                      </Button>
                    )}
                    {word.slides_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={word.slides_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-3 w-3 mr-1" />
                          Slides
                        </a>
                      </Button>
                    )}
                    {word.notes_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={word.notes_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-3 w-3 mr-1" />
                          Notes
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}