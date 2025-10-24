// API Configuration
export const API_CONFIG = {
  BASE_URL:
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" // Server-side: use absolute URL
      : "", // Client-side: use relative paths
  ENDPOINTS: {
    POSTS: "/posts",
    POST_BY_SLUG: "/posts/slug",
    POSTS_BY_CATEGORY: "/posts/category",
    POST_CATEGORIES: "/posts/categories",
    POST_TAGS: "/posts/tags",
    POST_SEARCH: "/posts/search",
    POST_ANALYTICS: "/posts/analytics",
  },
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: typeof window === "undefined" ? 3 : 1, // Server: 3 retries, Client: 1 retry
}

// Helper function to build full API URLs
export function buildApiUrl(endpoint: string, params?: Record<string, string | number>): string {
  const baseUrl = API_CONFIG.BASE_URL
  const apiPath = endpoint.startsWith("/api") ? endpoint : `/api${endpoint}`

  // On server-side, construct full URL with base
  // On client-side, use relative path
  let url = baseUrl ? `${baseUrl}${apiPath}` : apiPath

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value.toString())
    })
    url += `?${searchParams.toString()}`
  }

  return url
}

// API request helper with error handling and retries
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  retries: number = API_CONFIG.RETRY_ATTEMPTS,
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (retries > 0 && error instanceof Error && error.name !== "AbortError") {
      // Retry with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, (API_CONFIG.RETRY_ATTEMPTS - retries + 1) * 1000))
      return apiRequest<T>(url, options, retries - 1)
    }

    throw error
  }
}