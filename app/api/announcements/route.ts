import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { canPerformAction } from "@/lib/permissions"
import type {
  Announcement,
  AnnouncementFilters,
  AnnouncementsResponse,
  AnnouncementType,
  Priority,
  AnnouncementStatus,
} from "@/types"

// In-memory storage for announcements (replace with database in production)
const announcements: Announcement[] = [
  {
    id: "1",
    title: "Welcome New Members Service",
    content:
      "Join us this Sunday as we welcome our new church family members. We'll have a special reception following the morning service with refreshments and fellowship.",
    type: "service",
    priority: "high",
    status: "published",
    author_id: "1",
    author_name: "Bishop Anthony King, Sr.",
    author_role: "Presiding Bishop",
    church_id: "1",
    target_audience: "all",
    is_pinned: false,
    is_featured: true,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    featured_image: "/img/welcome-service.jpg",
    expires_at: new Date("2024-01-21T23:59:59Z"),
    created_at: new Date("2024-01-14T09:00:00Z"),
    published_at: new Date("2024-01-15T10:00:00Z"),
    updated_at: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: "2",
    title: "Community Food Drive",
    content:
      "Help us serve our community! We're collecting non-perishable food items for local families in need. Drop-off locations are available in the church lobby.",
    type: "general",
    priority: "normal",
    status: "published",
    author_id: "2",
    author_name: "Deacon Michael Brown",
    author_role: "Community Outreach Director",
    church_id: "1",
    target_audience: "all",
    is_pinned: false,
    is_featured: false,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    expires_at: new Date("2024-02-14T23:59:59Z"),
    created_at: new Date("2024-01-13T15:30:00Z"),
    published_at: new Date("2024-01-14T08:00:00Z"),
    updated_at: new Date("2024-01-14T08:00:00Z"),
  },
  {
    id: "3",
    title: "Youth Ministry Meeting",
    content:
      "All youth ages 13-18 are invited to our monthly planning meeting. We'll discuss upcoming events and service opportunities.",
    type: "ministry",
    priority: "normal",
    status: "published",
    author_id: "3",
    author_name: "Pastor James Wilson",
    author_role: "Youth Pastor",
    church_id: "1",
    target_audience: "youth",
    is_pinned: false,
    is_featured: false,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    expires_at: new Date("2024-01-20T23:59:59Z"),
    created_at: new Date("2024-01-12T14:00:00Z"),
    published_at: new Date("2024-01-13T12:00:00Z"),
    updated_at: new Date("2024-01-13T12:00:00Z"),
  },
]

function applyFilters(announcements: Announcement[], filters: AnnouncementFilters): Announcement[] {
  let filtered = [...announcements]

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter((a) => a.status === filters.status)
  }

  // Filter by type
  if (filters.type) {
    filtered = filtered.filter((a) => a.type === filters.type)
  }

  // Filter by priority
  if (filters.priority) {
    filtered = filtered.filter((a) => a.priority === filters.priority)
  }

  if (filters.is_featured !== undefined) {
    filtered = filtered.filter((a) => a.is_featured === filters.is_featured)
  }

  if (filters.church_id) {
    filtered = filtered.filter((a) => a.church_id === filters.church_id)
  }

  // Filter by search query
  if (filters.search) {
    const query = filters.search.toLowerCase()
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query) ||
        a.type.toLowerCase().includes(query),
    )
  }

  if (filters.date_from) {
    filtered = filtered.filter((a) => a.published_at && a.published_at >= filters.date_from!)
  }
  if (filters.date_to) {
    filtered = filtered.filter((a) => a.published_at && a.published_at <= filters.date_to!)
  }

  // Filter out expired announcements unless specifically requested
  if (filters.status !== "archived") {
    const now = new Date()
    filtered = filtered.filter((a) => !a.expires_at || a.expires_at > now)
  }

  // Sort announcements
  if (filters.sort_by) {
    const sortBy = filters.sort_by
    filtered.sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date

      if (sortBy === "created_at-desc" || sortBy === "created_at-asc") {
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
      } else if (sortBy === "priority-desc") {
        const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
        aValue = priorityOrder[a.priority]
        bValue = priorityOrder[b.priority]
      } else if (sortBy === "expires_at-asc") {
        aValue = a.expires_at ? new Date(a.expires_at).getTime() : 0
        bValue = b.expires_at ? new Date(b.expires_at).getTime() : 0
      } else if (sortBy === "title-asc" || sortBy === "title-desc") {
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
      } else {
        return 0
      }

      const isDesc = sortBy.includes("-desc")
      if (isDesc) {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })
  } else {
    // Default sort: priority desc, then published_at desc
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      const aPublished = a.published_at ? new Date(a.published_at).getTime() : 0
      const bPublished = b.published_at ? new Date(b.published_at).getTime() : 0
      return bPublished - aPublished
    })
  }

  return filtered
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: AnnouncementFilters = {
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
      offset: searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined,
      type: (searchParams.get("type") as AnnouncementType) || undefined,
      priority: (searchParams.get("priority") as Priority) || undefined,
      status: (searchParams.get("status") as AnnouncementStatus) || "published",
      is_featured: searchParams.get("featured") ? searchParams.get("featured") === "true" : undefined,
      search: searchParams.get("search") || undefined,
      sort_by: (searchParams.get("sortBy") as AnnouncementFilters["sort_by"]) || undefined,
      date_from: searchParams.get("dateFrom") ? new Date(searchParams.get("dateFrom")!) : undefined,
      date_to: searchParams.get("dateTo") ? new Date(searchParams.get("dateTo")!) : undefined,
      church_id: searchParams.get("churchId") || undefined,
    }

    let filtered = applyFilters(announcements, filters)
    const total = filtered.length

    // Apply pagination after filtering and sorting
    if (filters.offset || filters.limit) {
      const start = filters.offset || 0
      const end = filters.limit ? start + filters.limit : undefined
      filtered = filtered.slice(start, end)
    }

    const response: AnnouncementsResponse = {
      success: true,
      announcements: filtered,
      pagination: {
        total,
        page: Math.floor((filters.offset || 0) / (filters.limit || 10)) + 1,
        limit: filters.limit || 10,
        totalPages: Math.ceil(total / (filters.limit || 10)),
        hasNext: (filters.offset || 0) + (filters.limit || 10) < total,
        hasPrev: (filters.offset || 0) > 0,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[Anointed Innovations] Error fetching announcements:", error)
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!canPerformAction(authResult.user, "announcement", "create")) {
      return NextResponse.json({ error: "Insufficient permissions to create announcements" }, { status: 403 })
    }

    const body = await request.json()
    const now = new Date()

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      type: body.type || "general",
      priority: body.priority || "normal",
      status: body.status || "draft",
      author_id: authResult.user.id.toString(),
      author_name: `${authResult.user.first_name} ${authResult.user.last_name}`,
      author_role: authResult.user.position?.name || authResult.user.role.name,
      church_id: authResult.user.primary_church_id?.toString(),
      target_audience: body.target_audience || "all",
      featured_image: body.featured_image,
      expires_at: body.expires_at ? new Date(body.expires_at) : undefined,
      scheduled_for: body.scheduled_for ? new Date(body.scheduled_for) : undefined,
      is_pinned: body.is_pinned || false,
      is_featured: body.is_featured || false,
      view_count: 0,
      like_count: 0,
      share_count: 0,
      tags: body.tags,
      metadata: body.metadata,
      created_at: now,
      published_at: body.status === "published" ? (body.published_at ? new Date(body.published_at) : now) : now,
      updated_at: now,
    }

    announcements.unshift(newAnnouncement)

    return NextResponse.json({ success: true, announcement: newAnnouncement }, { status: 201 })
  } catch (error) {
    console.error("[Anointed Innovations] Error creating announcement:", error)
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
  }
}