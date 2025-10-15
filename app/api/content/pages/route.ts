import { type NextRequest, NextResponse } from "next/server"

// Mock data - in real app this would come from database
const mockPages = [
  {
    id: "1",
    title: "About Us - Main Page",
    slug: "about",
    category: "About",
    status: "published",
    author: "Bishop King",
    lastModified: "2024-01-15",
    metaTitle: "About Us | Holy City of God Christian Fellowship",
    metaDescription: "Learn about Holy City of God Christian Fellowship - our mission, values, beliefs, and community.",
    content: {
      hero: {
        title: "About Our Church",
        subtitle: "Holy City of God Christian Fellowship Inc.",
        description: "A community centered on Christ and His mission of reconciliation.",
      },
      sections: [
        {
          id: "1",
          type: "text",
          title: "Welcome to Our Family",
          content: "Holy City of God Christian Fellowship is a part of the Body of Christ...",
          order: 1,
        },
      ],
    },
    seo: {
      keywords: "Holy City of God, Christian Fellowship, Detroit, church, about us",
      canonicalUrl: "https://holycityofgod.org/about",
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let filteredPages = [...mockPages]

    if (category && category !== "All") {
      filteredPages = filteredPages.filter((page) => page.category === category)
    }

    if (status) {
      filteredPages = filteredPages.filter((page) => page.status === status)
    }

    if (search) {
      filteredPages = filteredPages.filter(
        (page) =>
          page.title.toLowerCase().includes(search.toLowerCase()) ||
          page.metaDescription.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredPages,
      total: filteredPages.length,
    })
  } catch (error) {
    console.error("Failed to fetch pages:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json({ success: false, error: "Title and slug are required" }, { status: 400 })
    }

    // Check if slug already exists
    const existingPage = mockPages.find((page) => page.slug === body.slug)
    if (existingPage) {
      return NextResponse.json({ success: false, error: "Page with this slug already exists" }, { status: 409 })
    }

    const newPage = {
      id: Date.now().toString(),
      title: body.title,
      slug: body.slug,
      category: body.category || "General",
      status: body.status || "draft",
      author: body.author || "Unknown",
      lastModified: new Date().toISOString().split("T")[0],
      metaTitle: body.metaTitle || body.title,
      metaDescription: body.metaDescription || "",
      content: body.content || { sections: [] },
      seo: body.seo || { keywords: "" },
    }

    mockPages.push(newPage)

    return NextResponse.json(
      {
        success: true,
        data: newPage,
        message: "Page created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Failed to create page:", error)
    return NextResponse.json({ success: false, error: "Failed to create page" }, { status: 500 })
  }
}