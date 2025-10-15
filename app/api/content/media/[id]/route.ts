import { type NextRequest, NextResponse } from "next/server"

// Mock media data - same as above
const mockMedia = [
  {
    id: "1",
    name: "church-logo.png",
    type: "image",
    url: "/img/church-logo.png",
    thumbnail: "/img/church-logo.png",
    size: 45000,
    dimensions: { width: 200, height: 200 },
    uploadDate: "2024-01-15",
    uploadedBy: "Bishop King",
    category: "Branding",
    alt: "Holy City of God Christian Fellowship Logo",
    description: "Main church logo for website header",
  },
]

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const media = mockMedia.find((m) => m.id === params.id)

    if (!media) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: media,
    })
  } catch (error) {
    console.error("Failed to fetch media:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch media" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const body = await request.json()
    const mediaIndex = mockMedia.findIndex((m) => m.id === params.id)

    if (mediaIndex === -1) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 })
    }

    // Update the media metadata
    mockMedia[mediaIndex] = {
      ...mockMedia[mediaIndex],
      ...body,
    }

    return NextResponse.json({
      success: true,
      data: mockMedia[mediaIndex],
      message: "Media updated successfully",
    })
  } catch (error) {
    console.error("Failed to update media:", error)
    return NextResponse.json({ success: false, error: "Failed to update media" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const mediaIndex = mockMedia.findIndex((m) => m.id === params.id)

    if (mediaIndex === -1) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 })
    }

    const deletedMedia = mockMedia.splice(mediaIndex, 1)[0]

    // In real app, you would also delete the file from storage

    return NextResponse.json({
      success: true,
      data: deletedMedia,
      message: "Media deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete media:", error)
    return NextResponse.json({ success: false, error: "Failed to delete media" }, { status: 500 })
  }
}