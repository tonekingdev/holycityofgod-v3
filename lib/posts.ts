import type { Post, PostCategory, PostsResponse, PostFilters } from "@/types"
import { API_CONFIG, buildApiUrl, apiRequest } from "@/lib/config"
import { POST_CATEGORIES } from "@/types"

// Sample posts data - used as fallback when API is unavailable
const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    title: "Walking in Faith During Difficult Times",
    slug: "walking-in-faith-during-difficult-times",
    excerpt: "Discover how to maintain your faith when life gets challenging and find strength in God's promises.",
    content: `
      <p>Life often presents us with challenges that test our faith and resolve. During these difficult times, it's natural to question, to feel overwhelmed, and to wonder where God is in our struggles.</p>
      
      <h2>Finding Strength in Scripture</h2>
      <p>The Bible is filled with promises and examples of God's faithfulness during trials. Consider the story of Job, who maintained his faith despite losing everything, or David, who found strength in the Lord during his darkest hours.</p>
      
      <h2>Practical Steps for Difficult Times</h2>
      <ul>
        <li>Maintain daily prayer and Bible reading</li>
        <li>Stay connected with your church community</li>
        <li>Remember God's past faithfulness in your life</li>
        <li>Seek counsel from mature believers</li>
      </ul>
      
      <p>Remember, faith isn't the absence of doubt or fear—it's choosing to trust God despite our circumstances. He is with us in every valley and will see us through to victory.</p>
    `,
    featuredImage: "/placeholder.svg?height=300&width=500",
    category: POST_CATEGORIES[0], // Faith
    author: {
      name: "Bishop Anthony King, Sr.",
      role: "Senior Pastor",
      avatar: "/img/King_T_1-min.jpg",
    },
    publishedAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    status: "published",
    tags: ["faith", "trials", "encouragement"],
    readingTime: 5,
  },
  {
    id: "2",
    title: "The Power of Community Prayer",
    slug: "the-power-of-community-prayer",
    excerpt: "Learn about the incredible impact of praying together as a church family and community.",
    content: `
      <p>There's something powerful that happens when believers come together in prayer. Jesus himself said, "Where two or three gather in my name, there am I with them" (Matthew 18:20).</p>
      
      <h2>Biblical Foundation</h2>
      <p>Throughout the New Testament, we see examples of the early church praying together. In Acts 2:42, we read that the believers "devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer."</p>
      
      <h2>Benefits of Community Prayer</h2>
      <ul>
        <li>Strengthens church unity and fellowship</li>
        <li>Provides support during difficult times</li>
        <li>Amplifies our prayers before God</li>
        <li>Builds faith through shared testimonies</li>
      </ul>
      
      <p>Join us every Wednesday at 7 PM for our community prayer meeting. Experience the power of united prayer and see how God moves when His people come together.</p>
    `,
    featuredImage: "/placeholder.svg?height=300&width=500",
    category: POST_CATEGORIES[1], // Prayer
    author: {
      name: "Minister Sarah Johnson",
      role: "Prayer Ministry Leader",
    },
    publishedAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    status: "published",
    tags: ["prayer", "community", "fellowship"],
    readingTime: 4,
  },
  {
    id: "3",
    title: "Serving Others with Love",
    slug: "serving-others-with-love",
    excerpt: "Explore practical ways to serve your community and show God's love through action.",
    content: `
      <p>Jesus came not to be served, but to serve (Mark 10:45). As His followers, we're called to follow His example by serving others with love and compassion.</p>
      
      <h2>The Heart of Service</h2>
      <p>True service comes from a heart transformed by God's love. When we understand how much God has served us through Christ, we're motivated to serve others not out of obligation, but out of gratitude and love.</p>
      
      <h2>Ways to Serve</h2>
      <ul>
        <li>Volunteer at our community food pantry</li>
        <li>Visit elderly members of our congregation</li>
        <li>Participate in neighborhood cleanup events</li>
        <li>Mentor young people in our community</li>
        <li>Support local families in need</li>
      </ul>
      
      <p>Remember, no act of service is too small. Whether it's a smile, a helping hand, or a listening ear, every act of love makes a difference in someone's life.</p>
    `,
    featuredImage: "/placeholder.svg?height=300&width=500",
    category: POST_CATEGORIES[2], // Service
    author: {
      name: "Deacon Michael Brown",
      role: "Community Outreach Director",
    },
    publishedAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
    status: "published",
    tags: ["service", "community", "outreach"],
    readingTime: 6,
  },
  {
    id: "4",
    title: "Preparing Your Heart for Worship",
    slug: "preparing-your-heart-for-worship",
    excerpt: "Discover how to prepare spiritually for meaningful worship experiences.",
    content: `
      <p>Worship is more than singing songs or attending church—it's about connecting with God with our whole heart, mind, and soul.</p>
      
      <h2>Before You Arrive</h2>
      <p>Preparation for worship begins before you enter the sanctuary. Take time during the week to pray, read Scripture, and quiet your heart before God.</p>
      
      <h2>During Worship</h2>
      <ul>
        <li>Focus on God, not distractions</li>
        <li>Participate fully in singing and prayer</li>
        <li>Listen actively to God's Word</li>
        <li>Allow the Holy Spirit to speak to your heart</li>
      </ul>
      
      <p>True worship transforms us. When we come before God with open hearts, He meets us and changes us from the inside out.</p>
    `,
    featuredImage: "/placeholder.svg?height=300&width=500",
    category: POST_CATEGORIES[3], // Worship
    author: {
      name: "Minister David Brown",
      role: "Minister of Music",
    },
    publishedAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    status: "published",
    tags: ["worship", "preparation", "spiritual growth"],
    readingTime: 4,
  },
]

/**
 * Apply filters to sample posts (fallback filtering)
 */
function filterSamplePosts(posts: Post[], filters?: PostFilters): Post[] {
  let filteredPosts = [...posts]

  // Filter by status
  if (filters?.status) {
    filteredPosts = filteredPosts.filter((post) => post.status === filters.status)
  }

  // Filter by category
  if (filters?.category) {
    filteredPosts = filteredPosts.filter((post) => post.category.slug === filters.category)
  }

  // Filter by featured
  if (filters?.featured !== undefined) {
    filteredPosts = filteredPosts.filter((post) => Boolean(post.featured) === filters.featured)
  }

  // Filter by search query
  if (filters?.search) {
    const query = filters.search.toLowerCase()
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  // Filter by date range
  if (filters?.dateFrom) {
    filteredPosts = filteredPosts.filter((post) => post.publishedAt >= filters.dateFrom!)
  }
  if (filters?.dateTo) {
    filteredPosts = filteredPosts.filter((post) => post.publishedAt <= filters.dateTo!)
  }

  // Sort posts
  if (filters?.sortBy) {
    const [field, direction] = filters.sortBy.split("-") as [string, "asc" | "desc"]
    filteredPosts.sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date

      switch (field) {
        case "publishedAt":
          aValue = a.publishedAt.getTime()
          bValue = b.publishedAt.getTime()
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "views":
          aValue = a.views || 0
          bValue = b.views || 0
          break
        case "readingTime":
          aValue = a.readingTime || 0
          bValue = b.readingTime || 0
          break
        default:
          return 0
      }

      if (direction === "desc") {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })
  }

  // Apply pagination
  if (filters?.offset || filters?.limit) {
    const start = filters.offset || 0
    const end = filters.limit ? start + filters.limit : undefined
    filteredPosts = filteredPosts.slice(start, end)
  }

  return filteredPosts
}

/**
 * Fetch posts with optional filtering and pagination
 */
export async function getPosts(filters?: PostFilters): Promise<Post[]> {
  try {
    const params: Record<string, string | number> = {}

    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset) params.offset = filters.offset
    if (filters?.category) params.category = filters.category
    if (filters?.tag) params.tag = filters.tag
    if (filters?.author) params.author = filters.author
    if (filters?.status) params.status = filters.status
    if (filters?.featured !== undefined) params.featured = filters.featured.toString()
    if (filters?.search) params.search = filters.search
    if (filters?.sortBy) params.sortBy = filters.sortBy
    if (filters?.dateFrom) params.dateFrom = filters.dateFrom.toISOString()
    if (filters?.dateTo) params.dateTo = filters.dateTo.toISOString()

    const url = buildApiUrl(API_CONFIG.ENDPOINTS.POSTS, params)
    const response = await apiRequest<PostsResponse>(url)

    return response.posts || []
  } catch (error) {
    console.warn("API unavailable, using sample posts:", error)
    // Fallback to sample posts with filtering
    return filterSamplePosts(SAMPLE_POSTS, filters)
  }
}

/**
 * Fetch a single post by its slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.POST_BY_SLUG}/${slug}`)
    const response = await apiRequest<{ post: Post }>(url)

    return response.post || null
  } catch (error) {
    console.warn("API unavailable, searching sample posts:", error)
    // Fallback to sample posts
    const post = SAMPLE_POSTS.find((p) => p.slug === slug)
    return post || null
  }
}

/**
 * Fetch posts by category slug
 */
export async function getPostsByCategory(categorySlug: string, limit?: number): Promise<Post[]> {
  try {
    const params: Record<string, string | number> = {}
    if (limit) params.limit = limit

    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.POSTS_BY_CATEGORY}/${categorySlug}`, params)
    const response = await apiRequest<PostsResponse>(url)

    return response.posts || []
  } catch (error) {
    console.warn("API unavailable, filtering sample posts by category:", error)
    // Fallback to sample posts filtered by category
    return filterSamplePosts(SAMPLE_POSTS, { category: categorySlug, limit })
  }
}

/**
 * Fetch all post categories
 */
export async function getPostCategories(): Promise<PostCategory[]> {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.POST_CATEGORIES)
    const response = await apiRequest<{ categories: PostCategory[] }>(url)

    return response.categories || []
  } catch (error) {
    console.warn("API unavailable, using default categories:", error)
    // Fallback to predefined categories
    return POST_CATEGORIES
  }
}

/**
 * Search posts by query
 */
export async function searchPosts(query: string, filters?: Omit<PostFilters, "search">): Promise<Post[]> {
  try {
    const params: Record<string, string | number> = { search: query }

    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset) params.offset = filters.offset
    if (filters?.category) params.category = filters.category
    if (filters?.tag) params.tag = filters.tag
    if (filters?.author) params.author = filters.author
    if (filters?.status) params.status = filters.status
    if (filters?.sortBy) params.sortBy = filters.sortBy

    const url = buildApiUrl(API_CONFIG.ENDPOINTS.POST_SEARCH, params)
    const response = await apiRequest<PostsResponse>(url)

    return response.posts || []
  } catch (error) {
    console.warn("API unavailable, searching sample posts:", error)
    // Fallback to sample posts with search
    return filterSamplePosts(SAMPLE_POSTS, { ...filters, search: query })
  }
}

/**
 * Fetch featured posts
 */
export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  return getPosts({ featured: true, limit, status: "published" })
}

/**
 * Fetch latest posts
 */
export async function getLatestPosts(limit = 5): Promise<Post[]> {
  return getPosts({
    limit,
    status: "published",
    sortBy: "publishedAt-desc",
  })
}

/**
 * Fetch related posts based on category and tags
 */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  try {
    // First try to get posts from the same category
    let relatedPosts = await getPostsByCategory(post.category.slug, limit + 1)

    // Remove the current post from results
    relatedPosts = relatedPosts.filter((p) => p.id !== post.id)

    // If we don't have enough posts, search by tags
    if (relatedPosts.length < limit && post.tags && post.tags.length > 0) {
      const tagQuery = post.tags.join(" ")
      const tagPosts = await searchPosts(tagQuery, { limit: limit * 2 })

      // Add unique posts that aren't already in the results
      const existingIds = new Set([post.id, ...relatedPosts.map((p) => p.id)])
      const additionalPosts = tagPosts.filter((p) => !existingIds.has(p.id))

      relatedPosts = [...relatedPosts, ...additionalPosts]
    }

    return relatedPosts.slice(0, limit)
  } catch (error) {
    console.warn("Error fetching related posts, using fallback:", error)
    // Fallback: filter sample posts by category, excluding current post
    const categoryPosts = SAMPLE_POSTS.filter((p) => p.category.slug === post.category.slug && p.id !== post.id)
    return categoryPosts.slice(0, limit)
  }
}

/**
 * Create a new post
 */
export async function createPost(postData: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.POSTS)
    const response = await apiRequest<{ post: Post }>(url, {
      method: "POST",
      body: JSON.stringify(postData),
    })

    return response.post
  } catch (error) {
    console.error("Error creating post:", error)
    throw new Error("Failed to create post - API unavailable")
  }
}

/**
 * Update an existing post
 */
export async function updatePost(id: string, postData: Partial<Post>): Promise<Post> {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.POSTS}/${id}`)
    const response = await apiRequest<{ post: Post }>(url, {
      method: "PUT",
      body: JSON.stringify(postData),
    })

    return response.post
  } catch (error) {
    console.error("Error updating post:", error)
    throw new Error(`Failed to update post with id: ${id} - API unavailable`)
  }
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<void> {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.POSTS}/${id}`)
    await apiRequest(url, { method: "DELETE" })
  } catch (error) {
    console.error("Error deleting post:", error)
    throw new Error(`Failed to delete post with id: ${id} - API unavailable`)
  }
}

/**
 * Increment post view count
 */
export async function incrementPostViews(id: string): Promise<void> {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.POSTS}/${id}/views`)
    await apiRequest(url, { method: "POST" })
  } catch (error) {
    console.warn("Error incrementing post views (non-critical):", error)
    // Don't throw error for analytics - it's not critical
  }
}

// Utility functions
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return formatDate(date)
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, "") + "..."
}