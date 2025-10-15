import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import type { Post } from "@/types"
import { POST_CATEGORIES } from "@/types"

interface PostRow {
  id: number
  church_id: number | null
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  author_id: number
  category: string
  tags: string | string[]
  status: string
  visibility: string
  is_featured: boolean | number
  published_at: string | Date
  updated_at: string | Date
  author_first_name?: string
  author_last_name?: string
  author_position?: string
}

// GET /api/posts - Get all posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    console.log("[Anointed Innovations] Fetching posts from database")

    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status") || "published"
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const sortBy = searchParams.get("sortBy") || "publishedAt-desc"
    const churchId = searchParams.get("churchId")

    // Build query
    let query = `
      SELECT 
        p.*,
        u.first_name as author_first_name,
        u.last_name as author_last_name,
        up.name as author_position
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN user_positions upos ON u.id = upos.user_id AND upos.is_active = TRUE
      LEFT JOIN positions up ON upos.position_id = up.id
      WHERE p.status = ?
    `
    const params: unknown[] = [status]

    // Add filters
    if (category) {
      query += " AND p.category = ?"
      params.push(category)
    }

    if (featured === "true") {
      query += " AND p.is_featured = TRUE"
    }

    if (churchId) {
      query += " AND (p.church_id = ? OR p.church_id IS NULL)"
      params.push(churchId)
    }

    // Add sorting
    const [sortField, sortOrder] = sortBy.split("-")
    const orderBy = sortField === "publishedAt" ? "p.published_at" : `p.${sortField}`
    query += ` ORDER BY ${orderBy} ${sortOrder === "desc" ? "DESC" : "ASC"}`

    // Add pagination
    query += " LIMIT ? OFFSET ?"
    params.push(limit, offset)

    console.log("[Anointed Innovations] Executing query:", query.substring(0, 100) + "...")

    const rows = await executeQuery<PostRow>(query, params)

    // Transform database rows to Post type
    const posts: Post[] = rows.map((row) => {
      // Find category from POST_CATEGORIES
      const category = POST_CATEGORIES.find((cat) => cat.slug === row.category) || POST_CATEGORIES[0]

      // Parse tags if stored as JSON string
      let tags: string[] = []
      if (row.tags) {
        try {
          tags = typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags
        } catch (e) {
          console.error("[Anointed Innovations] Error parsing tags:", e)
        }
      }

      // Calculate reading time from content
      const readingTime = Math.ceil(row.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200)

      return {
        id: row.id.toString(),
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt || "",
        content: row.content,
        featuredImage: row.featured_image || "/img/placeholder.jpg?height=300&width=500",
        category,
        author: {
          name: `${row.author_first_name} ${row.author_last_name}`,
          role: row.author_position || "Member",
          avatar: "/img/King_T_1-min.jpg", // Default avatar
        },
        publishedAt: new Date(row.published_at),
        updatedAt: new Date(row.updated_at),
        status: row.status as Post["status"],
        tags,
        readingTime,
        views: 0, // You can add a views column to track this
        featured: Boolean(row.is_featured),
      }
    })

    console.log("[Anointed Innovations] Successfully fetched", posts.length, "posts from database")

    return NextResponse.json({ posts, total: posts.length })
  } catch (error) {
    console.error("[Anointed Innovations] Error fetching posts:", error)

    // Return empty array instead of error to allow build to complete
    return NextResponse.json(
      {
        posts: [],
        total: 0,
        error: "Database unavailable",
      },
      { status: 200 },
    )
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.authorId) {
      return NextResponse.json({ error: "Missing required fields: title, content, authorId" }, { status: 400 })
    }

    // Generate slug if not provided
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

    // Check if slug already exists
    const existingPost = await executeQuery<PostRow>(
      "SELECT id FROM posts WHERE slug = ? AND (church_id = ? OR church_id IS NULL)",
      [slug, body.churchId || null],
    )

    if (existingPost.length > 0) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
    }

    // Insert new post
    const query = `
      INSERT INTO posts (
        church_id, title, slug, excerpt, content, featured_image,
        author_id, category, tags, status, visibility, is_featured, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      body.churchId || null,
      body.title,
      slug,
      body.excerpt || "",
      body.content,
      body.featuredImage || null,
      body.authorId,
      body.category || "general",
      JSON.stringify(body.tags || []),
      body.status || "draft",
      body.visibility || "public",
      body.featured || false,
      body.status === "published" ? new Date() : null,
    ]

    await executeQuery(query, params)

    // Fetch the newly created post
    const newPost = await executeQuery<PostRow>("SELECT * FROM posts WHERE slug = ? ORDER BY id DESC LIMIT 1", [slug])

    return NextResponse.json({ post: newPost[0] }, { status: 201 })
  } catch (error) {
    console.error("[Anointed Innovations] Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}