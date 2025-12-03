import { NextResponse } from "next/server"
import { getTodaysVerse, formatVerseReference, getEasternTimeDate } from "@/lib/verse-of-the-day"

export async function GET() {
  try {
    const { book, chapter, verse } = getTodaysVerse()

    // Fetch verse text from Bible API
    const bibleApiUrl = `https://bible-api.com/${book}+${chapter}:${verse}?translation=kjv`
    const response = await fetch(bibleApiUrl)

    if (!response.ok) {
      throw new Error("Failed to fetch verse from Bible API")
    }

    const data = await response.json()

    // Format the response with Eastern Time date
    const verseData = {
      text: data.text?.trim() || "",
      reference: formatVerseReference(book, chapter, verse),
      book,
      chapter,
      verse,
      date: getEasternTimeDate(), // Uses Eastern Time automatically
    }

    return NextResponse.json(verseData)
  } catch (error) {
    console.error("Error fetching verse of the day:", error)

    // Fallback verse with Eastern Time date
    return NextResponse.json({
      text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
      reference: "Jeremiah 29:11",
      book: "Jeremiah",
      chapter: 29,
      verse: 11,
      date: getEasternTimeDate(), // Uses Eastern Time for fallback too
    })
  }
}