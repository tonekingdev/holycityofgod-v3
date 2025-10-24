import { NextRequest, NextResponse } from "next/server"

// Using bible-api.com for KJV Bible content
export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ book: string; chapter: string }> }
) {
    try {
        // Await the params to resolve the Promise
        const params = await context.params
        const { book, chapter } = params

        // Fetch from bible-api.com with KJV translation
        const response = await fetch(
            `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=kjv`,
            { next: { revalidate: 86400 } },
        )

        if (!response.ok) {
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
        }

        const data = await response.json()

        return NextResponse.json({
            success: true,
            book: data.reference,
            chapter: Number.parseInt(chapter),
            verses: data.verses,
            text: data.text,
        })
    } catch (error) {
        console.error("Bible API error:", error)
        return NextResponse.json({ error: "Failed to fetch Bible content" }, { status: 500 })
    }
}