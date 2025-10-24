import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  "/admin",
  "/dashboard",
  "/editor",
  "/api/admin",
  "/api/prayers",
  "/api/auth/me",
]

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/", 
  "/about", 
  "/services", 
  "/give", 
  "/prayer", 
  "/contact", 
  "/auth/login", 
  "/auth/register",
  "/posts", // Add posts page if it exists
  "/news",   // Add news page if it exists
]

// Public API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/logout", 
  "/api/public",
  "/api/health",
  "/api/content",
  "/api/posts",      // ← ADD THIS - CRITICAL FIX
  "/api/events",     // Add if you have events API
]

// Routes that should never be cached or have minimal logging
const QUIET_ROUTES = [
  "/api/health",
  "/_next",
  "/static",
  "/favicon.ico"
]

export const runtime = "nodejs"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internals (with less logging)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") && !pathname.endsWith(".html") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Reduce logging for noisy routes
  const isQuietRoute = QUIET_ROUTES.some(route => pathname.startsWith(route))
  if (!isQuietRoute) {
    console.log("[Anointed Innovations] Middleware processing:", pathname)
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) => 
    pathname === route || pathname.startsWith(route + "/")
  )
  const isPublicApiRoute = PUBLIC_API_ROUTES.some((route) => 
    pathname.startsWith(route)
  )

  // Special handling for content API to prevent loops
  if (pathname.startsWith("/api/content")) {
    console.log("[Anointed Innovations] Content API request - allowing public access")
    return NextResponse.next()
  }

  // Allow public routes and public API routes through immediately
  if (isPublicRoute || isPublicApiRoute) {
    if (!isQuietRoute) {
      console.log("[Anointed Innovations] Allowing public route/API through:", pathname)
    }
    return NextResponse.next()
  }

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => 
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    // For unknown API routes, allow them but log for debugging
    if (pathname.startsWith("/api/") && !isQuietRoute) {
      console.log("[Anointed Innovations] Unknown API route, allowing:", pathname)
    }
    return NextResponse.next()
  }

  // Get token from cookie or Authorization header
  const token = request.cookies.get("auth-token")?.value || 
                request.headers.get("Authorization")?.replace("Bearer ", "")

  if (!token) {
    console.log("[Anointed Innovations] No token found for protected route:", pathname)

    // For API routes, return 401 with no-retry header
    if (pathname.startsWith("/api/")) {
      const response = NextResponse.json(
        { 
          error: "Authentication required",
          code: "UNAUTHENTICATED"
        }, 
        { status: 401 }
      )
      // Add headers to prevent retries
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
      return response
    }

    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token
  const payload = verifyToken(token)
  if (!payload) {
    console.log("[Anointed Innovations] Invalid token for route:", pathname)

    // Clear invalid token
    const response = pathname.startsWith("/api/")
      ? NextResponse.json(
          { 
            error: "Invalid token", 
            code: "INVALID_TOKEN"
          }, 
          { status: 401 }
        )
      : NextResponse.redirect(new URL("/auth/login", request.url))

    response.cookies.delete("auth-token")
    
    // Add headers to prevent retries for API calls
    if (pathname.startsWith("/api/")) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    }
    
    return response
  }

  // Add user info to request headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", payload.id.toString())
  requestHeaders.set("x-user-email", payload.email)
  requestHeaders.set("x-user-role", payload.role)
  
  // Safely handle optional fields
  if (payload.permissions) {
    requestHeaders.set("x-user-permissions", JSON.stringify(payload.permissions))
  }
  if (payload.church_id) {
    requestHeaders.set("x-user-church-id", payload.church_id.toString())
  }

  if (!isQuietRoute) {
    console.log("[Anointed Innovations] User authenticated:", payload.email, "for route:", pathname)
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}