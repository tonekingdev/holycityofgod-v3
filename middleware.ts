import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  "/admin",
  "/dashboard",
  "/editor",
  "/api/admin",
  "/api/prayers",
  "/api/auth/me", // Added /api/auth/me to protected routes
]

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/about", "/services", "/give", "/prayer", "/contact", "/auth/login", "/auth/register"]

// Public API routes that don't require authentication
const PUBLIC_API_ROUTES = ["/api/auth/login", "/api/auth/logout", "/api/public", "/api/health", "/api/content"]

export const runtime = "nodejs"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log("[Anointed Innovations] Middleware processing:", pathname)

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))
  const isPublicApiRoute = PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))

  if (pathname.startsWith("/api/content")) {
    console.log("[Anointed Innovations] Content API request detected")
    console.log("[Anointed Innovations] Is public API route:", isPublicApiRoute)
    console.log("[Anointed Innovations] PUBLIC_API_ROUTES:", PUBLIC_API_ROUTES)
  }

  // Allow public routes and public API routes through immediately
  if (isPublicRoute || isPublicApiRoute) {
    console.log("[Anointed Innovations] Allowing public route/API through:", pathname)
    return NextResponse.next()
  }

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get token from cookie or Authorization header
  const token = request.cookies.get("auth-token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "")

  if (!token) {
    console.log("[Anointed Innovations] No token found, redirecting to login")

    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token
  const payload = verifyToken(token)
  if (!payload) {
    console.log("[Anointed Innovations] Invalid token, redirecting to login")

    // Clear invalid token
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Invalid token" }, { status: 401 })
      : NextResponse.redirect(new URL("/auth/login", request.url))

    response.cookies.delete("auth-token")
    return response
  }

  // Add user info to request headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", payload.id.toString())
  requestHeaders.set("x-user-email", payload.email)
  requestHeaders.set("x-user-role", payload.role)
  requestHeaders.set("x-user-permissions", JSON.stringify(payload.permissions))
  requestHeaders.set("x-user-church-id", payload.church_id.toString())

  console.log("[Anointed Innovations] User authenticated:", payload.email)

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