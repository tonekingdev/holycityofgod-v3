import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { canPerformAction } from "@/lib/permissions"
import type { Announcement, AnnouncementResponse } from "@/types"

// Import the same announcements array (in production, this would be database queries)
// For now, we'll simulate it with a simple import
const announcements: Announcement[] = []

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const announcement = announcements.find((a) => a.id === params.id)

    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    const response: AnnouncementResponse = {
      success: true,
      announcement,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[Anointed Innovations] Error fetching announcement:", error)
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!canPerformAction(authResult.user, "announcement", "edit")) {
      return NextResponse.json({ error: "Insufficient permissions to edit announcements" }, { status: 403 })
    }

    const index = announcements.findIndex((a) => a.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    const body = await request.json()
    const existingAnnouncement = announcements[index]

    const updatedAnnouncement: Announcement = {
      ...existingAnnouncement,
      ...body,
      id: params.id, // Ensure ID doesn't change
      // Preserve original author and creation info
      author_id: existingAnnouncement.author_id,
      author_name: existingAnnouncement.author_name,
      author_role: existingAnnouncement.author_role,
      created_at: existingAnnouncement.created_at,
      church_id: existingAnnouncement.church_id,
      updated_at: new Date(),
    }

    announcements[index] = updatedAnnouncement

    const response: AnnouncementResponse = {
      success: true,
      announcement: updatedAnnouncement,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[Anointed Innovations] Error updating announcement:", error)
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!canPerformAction(authResult.user, "announcement", "delete")) {
      return NextResponse.json({ error: "Insufficient permissions to delete announcements" }, { status: 403 })
    }

    const index = announcements.findIndex((a) => a.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    const deletedAnnouncement = announcements.splice(index, 1)[0]

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
      announcement: deletedAnnouncement,
    })
  } catch (error) {
    console.error("[Anointed Innovations] Error deleting announcement:", error)
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 })
  }
}