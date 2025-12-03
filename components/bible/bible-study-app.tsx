"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Search, Heart, ChevronRight, Home } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BIBLE_VERSE } from "@/constants"
import { BIBLE_BOOKS } from "@/lib/bible-data"

export default function BibleStudyApp() {
  const router = useRouter()
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleBackHome = () => {
    router.push("/")
  }

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  const handleBookSelect = (book: string) => {
    router.push(`/bible/${encodeURIComponent(book)}/1`)
  }

  const handleGoToChapter = () => {
    if (selectedBook && selectedChapter) {
      router.push(`/bible/${encodeURIComponent(selectedBook)}/${selectedChapter}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-card to-secondary/5 py-16 px-4">
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">King James Bible</h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance">
            The Preserved and Living Word of God
          </p>

          {/* Search Section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Search Bar */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Search the Bible</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search words or verses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} className="px-6">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Book Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Select a Book</label>
                <div className="flex gap-2">
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Genesis" />
                    </SelectTrigger>
                    <SelectContent className="bg-primary-50">
                      {BIBLE_BOOKS.map((book) => (
                        <SelectItem key={book.name} value={book.name}>
                          {book.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="1" />
                    </SelectTrigger>
                    <SelectContent className="bg-primary-50">
                      {Array.from({ length: 50 }, (_, i) => i + 1).map((chapter) => (
                        <SelectItem key={chapter} value={chapter.toString()}>
                          {chapter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleGoToChapter} variant="outline">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verse of the Day */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-primary mr-2" />
                <CardTitle className="text-2xl text-primary">Verse of the Day</CardTitle>
              </div>
              <CardDescription className="text-secondary">{BIBLE_VERSE.date}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <blockquote className="text-xl md:text-2xl italic text-foreground mb-4 text-balance">
                &quot;{BIBLE_VERSE.verse}&quot;
              </blockquote>
              <cite className="text-primary font-semibold text-lg">{BIBLE_VERSE.reference}</cite>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bible Books Grid */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Old Testament */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary text-center">Old Testament</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {BIBLE_BOOKS.filter((book) => book.testament === "old").map((book) => (
                    <Button
                      key={book.name}
                      variant="ghost"
                      className="justify-start text-left h-auto py-2 hover:bg-primary/10 hover:text-primary"
                      onClick={() => handleBookSelect(book.name)}
                    >
                      {book.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* New Testament */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-secondary text-center">New Testament</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {BIBLE_BOOKS.filter((book) => book.testament === "new").map((book) => (
                    <Button
                      key={book.name}
                      variant="ghost"
                      className="justify-start text-left h-auto py-2 hover:bg-secondary/10 hover:text-secondary"
                      onClick={() => handleBookSelect(book.name)}
                    >
                      {book.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center mt-8 justify-center">
            <Button variant="outline" onClick={handleBackHome}>
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}