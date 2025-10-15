import { NextResponse } from "next/server"

interface WordDocument {
  id: string
  title: string
  speaker: string
  role: string
  uploadDate: string
  fileSize: string
  fileType: string
  status: "active" | "archived"
  downloadUrl: string
}

export async function GET() {
  try {
    const documents: WordDocument[] = [
      // Mock data structure - replace with actual database query
    ]

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching Word documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}