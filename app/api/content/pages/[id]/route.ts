import { type NextRequest, NextResponse } from "next/server"

// Mock data - same as above
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
        backgroundImage: "/img/church-hero.jpg",
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

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const page = mockPages.find((p) => p.id === params.id)

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: page,
    })
  } catch (error) {
    console.error("Failed to fetch page:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch page" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const body = await request.json()
    const pageIndex = mockPages.findIndex((p) => p.id === params.id)

    if (pageIndex === -1) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 })
    }

    // Update the page
    mockPages[pageIndex] = {
      ...mockPages[pageIndex],
      ...body,
      lastModified: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({
      success: true,
      data: mockPages[pageIndex],
      message: "Page updated successfully",
    })
  } catch (error) {
    console.error("Failed to update page:", error)
    return NextResponse.json({ success: false, error: "Failed to update page" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const pageIndex = mockPages.findIndex((p) => p.id === params.id)

    if (pageIndex === -1) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 })
    }

    const deletedPage = mockPages.splice(pageIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedPage,
      message: "Page deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete page:", error)
    return NextResponse.json({ success: false, error: "Failed to delete page" }, { status: 500 })
  }
}