import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/admin", "/dashboard", "/editor", "/api/admin", "/api/prayers", "/api/auth/me"]

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/about", "/services", "/give", "/prayer", "/contact", "/auth/login", "/auth/register"]

// Public API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/public",
  "/api/health",
  "/api/content",
  "/api/posts",
]

const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true"
const MAINTENANCE_BYPASS_IPS = process.env.MAINTENANCE_BYPASS_IPS?.split(",") || []

export const runtime = "nodejs"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (MAINTENANCE_MODE && pathname !== "/maintenance") {
    // Allow bypass for specific IP addresses (for admin access during maintenance)
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || ""
    const shouldBypass = MAINTENANCE_BYPASS_IPS.some((ip) => clientIp.includes(ip))

    if (!shouldBypass) {
      return NextResponse.redirect(new URL("/maintenance", request.url))
    }
  }

  if (!MAINTENANCE_MODE && pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url))
  }

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

  // Allow public routes and public API routes through immediately
  if (isPublicRoute || isPublicApiRoute) {
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