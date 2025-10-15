import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const CONTENT_FILE_PATH = path.join(process.cwd(), "data", "content.json")

export async function GET(request: NextRequest) {
  console.log("[Anointed Innovations] [API Content] GET request received")
  console.log("[Anointed Innovations] [API Content] Request URL:", request.url)
  console.log("[Anointed Innovations] [API Content] Content file path:", CONTENT_FILE_PATH)
  console.log("[Anointed Innovations] [API Content] Working directory:", process.cwd())

  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")
    console.log("[Anointed Innovations] [API Content] Page parameter:", page)

    try {
      await fs.access(CONTENT_FILE_PATH)
      console.log("[Anointed Innovations] [API Content] Content file exists and is accessible")
    } catch (accessError) {
      console.error(
        "[Anointed Innovations] [API Content] Content file does not exist or is not accessible:",
        accessError,
      )

      try {
        const dataDir = path.join(process.cwd(), "data")
        const files = await fs.readdir(dataDir)
        console.log("[Anointed Innovations] [API Content] Files in data directory:", files)
      } catch (dirError) {
        console.error("[Anointed Innovations] [API Content] Could not read data directory:", dirError)
      }

      return NextResponse.json(
        {
          error: "Content file not found",
          path: CONTENT_FILE_PATH,
          cwd: process.cwd(),
          message: "The data/content.json file is missing. Please ensure it exists in your deployment.",
        },
        { status: 404 },
      )
    }

    const fileContents = await fs.readFile(CONTENT_FILE_PATH, "utf8")
    const content = JSON.parse(fileContents)
    console.log(
      "[Anointed Innovations] [API Content] Content loaded successfully, pages available:",
      Object.keys(content),
    )

    if (page) {
      const pageContent = content[page]
      if (!pageContent) {
        console.warn("[Anointed Innovations] [API Content] Page not found in content:", page)
        return NextResponse.json(
          { error: `Page '${page}' not found in content`, availablePages: Object.keys(content) },
          { status: 404 },
        )
      }
      console.log("[Anointed Innovations] [API Content] Returning page content for:", page)
      return NextResponse.json({ content: pageContent }, { status: 200 })
    }

    console.log("[Anointed Innovations] [API Content] Returning all content")
    return NextResponse.json({ content }, { status: 200 })
  } catch (error) {
    console.error("[Anointed Innovations] [API Content] Error reading content:", error)
    return NextResponse.json(
      {
        error: "Failed to load content",
        details: error instanceof Error ? error.message : "Unknown error",
        path: CONTENT_FILE_PATH,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { page, content: newContent } = await request.json()

    if (!page || !newContent) {
      return NextResponse.json({ error: "Page and content are required" }, { status: 400 })
    }

    // Read current content
    const fileContents = await fs.readFile(CONTENT_FILE_PATH, "utf8")
    const content = JSON.parse(fileContents)

    // Update the specific page content
    content[page] = newContent

    // Write back to file
    await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(content, null, 2))

    return NextResponse.json({ success: true, content: content[page] })
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}