import type { Post, PostCategory, PostsResponse, PostFilters } from "@/types"
import { API_CONFIG, buildApiUrl, apiRequest } from "@/lib/config"
import { POST_CATEGORIES } from "@/types"

/**
 * Ensure dates are properly converted to Date objects
 */
function normalizePosts(posts: Post[]): Post[] {
  return posts.map((post) => ({
    ...post,
    publishedAt: typeof post.publishedAt === "string" ? new Date(post.publishedAt) : post.publishedAt,
    updatedAt: typeof post.updatedAt === "string" ? new Date(post.updatedAt) : post.updatedAt,
  }))
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

    return normalizePosts(response.posts || [])
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

/**
 * Fetch a single post by its slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.POST_BY_SLUG}/${slug}`)
    const response = await apiRequest<{ post: Post }>(url)

    if (response.post) {
      const normalizedPosts = normalizePosts([response.post])
      return normalizedPosts[0]
    }
    return null
  } catch (error) {
    console.error("Error fetching post by slug:", error)
    return null
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

    return normalizePosts(response.posts || [])
  } catch (error) {
    console.error("Error fetching posts by category:", error)
    return []
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

    return normalizePosts(response.posts || [])
  } catch (error) {
    console.error("Error searching posts:", error)
    return []
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
    console.error("Error fetching related posts:", error)
    return []
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

    const normalizedPosts = normalizePosts([response.post])
    return normalizedPosts[0]
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

    const normalizedPosts = normalizePosts([response.post])
    return normalizedPosts[0]
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
  // Ensure we have a valid Date object
  const validDate = typeof date === "string" ? new Date(date) : date

  return validDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatRelativeDate(date: Date): string {
  const validDate = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - validDate.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return formatDate(validDate)
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