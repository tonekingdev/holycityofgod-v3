import { type NextRequest, NextResponse } from "next/server"

// Fetch specific verse
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ book: string; chapter: string; verse: string }> },
) {
  try {
    // Await the params to resolve the Promise
    const params = await context.params
    const { book, chapter, verse } = params

    // Fetch from bible-api.com with KJV translation
    const response = await fetch(
      `https://bible-api.com/${encodeURIComponent(book)}+${chapter}:${verse}?translation=kjv`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Verse not found" }, { status: 404 })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      reference: data.reference,
      verses: data.verses,
      text: data.text,
    })
  } catch (error) {
    console.error("Bible API error:", error)
    return NextResponse.json({ error: "Failed to fetch Bible verse" }, { status: 500 })
  }
}