"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BIBLE_BOOKS } from "@/lib/bible-data"

interface Verse {
  book_name: string
  chapter: number
  verse: number
  text: string
}

interface BibleChapterViewProps {
  book: string
  chapter: number
}

export default function BibleChapterView({ book, chapter }: BibleChapterViewProps) {
  const router = useRouter()
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentBook = BIBLE_BOOKS.find((b) => b.name.toLowerCase() === book.toLowerCase())
  const currentBookIndex = BIBLE_BOOKS.findIndex((b) => b.name.toLowerCase() === book.toLowerCase())

  useEffect(() => {
    async function fetchChapter() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/bible/${encodeURIComponent(book)}/${chapter}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to load chapter")
        }

        setVerses(data.verses)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chapter")
      } finally {
        setLoading(false)
      }
    }

    fetchChapter()
  }, [book, chapter])

  const handlePreviousChapter = () => {
    if (chapter > 1) {
      router.push(`/bible/${encodeURIComponent(book)}/${chapter - 1}`)
    } else if (currentBookIndex > 0) {
      const prevBook = BIBLE_BOOKS[currentBookIndex - 1]
      router.push(`/bible/${encodeURIComponent(prevBook.name)}/${prevBook.chapters}`)
    }
  }

  const handleNextChapter = () => {
    if (currentBook && chapter < currentBook.chapters) {
      router.push(`/bible/${encodeURIComponent(book)}/${chapter + 1}`)
    } else if (currentBookIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[currentBookIndex + 1]
      router.push(`/bible/${encodeURIComponent(nextBook.name)}/1`)
    }
  }

  const handleBookChange = (newBook: string) => {
    router.push(`/bible/${encodeURIComponent(newBook)}/1`)
  }

  const handleChapterChange = (newChapter: string) => {
    router.push(`/bible/${encodeURIComponent(book)}/${newChapter}`)
  }

  const handleVerseClick = (verseNumber: number) => {
    const element = document.getElementById(`verse-${verseNumber}`)
    element?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Chapter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push("/bible")}>Return to Bible</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">
                {book} {chapter}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Select value={book} onValueChange={handleBookChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BIBLE_BOOKS.map((b) => (
                    <SelectItem key={b.name} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={chapter.toString()} onValueChange={handleChapterChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentBook &&
                    Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((ch) => (
                      <SelectItem key={ch} value={ch.toString()}>
                        Chapter {ch}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              {verses.map((verse) => (
                <div
                  key={verse.verse}
                  id={`verse-${verse.verse}`}
                  className="flex gap-3 group hover:bg-muted/50 p-2 rounded-lg transition-colors"
                >
                  <button
                    onClick={() => handleVerseClick(verse.verse)}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {verse.verse}
                  </button>
                  <p className="text-foreground leading-relaxed flex-1">{verse.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePreviousChapter} disabled={currentBookIndex === 0 && chapter === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Chapter
          </Button>
          <Button
            variant="outline"
            onClick={handleNextChapter}
            disabled={currentBookIndex === BIBLE_BOOKS.length - 1 && currentBook && chapter === currentBook.chapters}
          >
            Next Chapter
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}