import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { executeQuery } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  primary_church_id: number
  accessible_churches: number[] | null
  position_id: number | null
  role_id: number
  is_active: boolean
  last_login: Date | null
  profile_image: string | null
  bio: string | null
  role: {
    id: number
    name: string
    permissions: string[]
  }
  position: {
    id: number
    name: string
    hierarchy_level: number
    is_leadership: boolean
    is_clergy: boolean
    can_upload_word: boolean
  } | null
  church: {
    id: number
    name: string
    code: string
    church_type: string
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

interface JWTPayload {
  id: number
  email: string
  role: string
  permissions: string[]
  church_id: number
}

// Generate JWT token
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    id: user.id,
    email: user.email,
    role: user.role.name,
    permissions: user.role.permissions,
    church_id: user.primary_church_id,
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions)
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error("[Anointed Innovations] Token verification error:", error)
    return null
  }
}

// Authenticate user with email and password
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    console.log("[Anointed Innovations] Authenticating user:", credentials.email)

    console.log("[Anointed Innovations] Testing database connection...")
    await executeQuery("SELECT 1") // Test query to check database connection
    console.log("[Anointed Innovations] Database connection test passed")

    // Get user with role, position, and church information
    const users = await executeQuery<Record<string, unknown>>(
      `
      SELECT 
        u.*,
        r.name as role_name,
        r.permissions as role_permissions,
        p.name as position_name,
        p.hierarchy_level,
        p.is_leadership,
        p.is_clergy,
        p.can_upload_word,
        c.name as church_name,
        c.code as church_code,
        c.church_type
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN positions p ON u.position_id = p.id
      JOIN churches c ON u.primary_church_id = c.id
      WHERE u.email = ? AND u.is_active = TRUE AND r.is_active = TRUE
    `,
      [credentials.email],
    )

    console.log("[Anointed Innovations] Database query completed, found", users.length, "users")

    if (users.length === 0) {
      console.log("[Anointed Innovations] No user found with email:", credentials.email)
      return { success: false, message: "Invalid email or password" }
    }

    const userData = users[0]
    console.log("[Anointed Innovations] User found:", userData.email)

    // Verify password
    const isValidPassword = await verifyPassword(credentials.password, String(userData.password_hash))
    if (!isValidPassword) {
      console.log("[Anointed Innovations] Password verification failed for:", credentials.email)
      return { success: false, message: "Invalid email or password" }
    }

    console.log("[Anointed Innovations] Password verified successfully")

    // Parse JSON fields
    const accessibleChurches = userData.accessible_churches ? JSON.parse(userData.accessible_churches as string) : null
    const rolePermissions = userData.role_permissions ? JSON.parse(userData.role_permissions as string) : []

    const user: User = {
      id: userData.id as number,
      username: userData.username as string,
      email: userData.email as string,
      first_name: userData.first_name as string,
      last_name: userData.last_name as string,
      primary_church_id: userData.primary_church_id as number,
      accessible_churches: accessibleChurches,
      position_id: userData.position_id ? (userData.position_id as number) : null,
      role_id: userData.role_id as number,
      is_active: Boolean(userData.is_active),
      last_login: userData.last_login ? new Date(userData.last_login as string) : null,
      profile_image: userData.profile_image ? (userData.profile_image as string) : null,
      bio: userData.bio ? (userData.bio as string) : null,
      role: {
        id: userData.role_id as number,
        name: userData.role_name as string,
        permissions: rolePermissions,
      },
      position: userData.position_id
        ? {
            id: userData.position_id as number,
            name: userData.position_name as string,
            hierarchy_level: userData.hierarchy_level as number,
            is_leadership: Boolean(userData.is_leadership),
            is_clergy: Boolean(userData.is_clergy),
            can_upload_word: Boolean(userData.can_upload_word),
          }
        : null,
      church: {
        id: userData.primary_church_id as number,
        name: userData.church_name as string,
        code: userData.church_code as string,
        church_type: userData.church_type as string,
      },
    }

    // Update last login
    await executeQuery("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id])

    // Generate token
    const token = generateToken(user)

    console.log("[Anointed Innovations] User authenticated successfully:", user.email)
    return { success: true, user, token }
  } catch (error) {
    console.error("[Anointed Innovations] Authentication error:", error)
    if (error instanceof Error && error.message.includes("ETIMEDOUT")) {
      return { success: false, message: "Database connection timeout - please check your local MySQL server" }
    }
    return { success: false, message: "Authentication failed" }
  }
}

// Get user by ID with full details
export async function getUserById(userId: number): Promise<User | null> {
  try {
    const users = await executeQuery<Record<string, unknown>>(
      `
      SELECT 
        u.*,
        r.name as role_name,
        r.permissions as role_permissions,
        p.name as position_name,
        p.hierarchy_level,
        p.is_leadership,
        p.is_clergy,
        p.can_upload_word,
        c.name as church_name,
        c.code as church_code,
        c.church_type
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN positions p ON u.position_id = p.id
      JOIN churches c ON u.primary_church_id = c.id
      WHERE u.id = ? AND u.is_active = TRUE
    `,
      [userId],
    )

    if (users.length === 0) {
      return null
    }

    const userData = users[0]

    // Parse JSON fields
    const accessibleChurches = userData.accessible_churches ? JSON.parse(userData.accessible_churches as string) : null
    const rolePermissions = userData.role_permissions ? JSON.parse(userData.role_permissions as string) : []

    return {
      id: userData.id as number,
      username: userData.username as string,
      email: userData.email as string,
      first_name: userData.first_name as string,
      last_name: userData.last_name as string,
      primary_church_id: userData.primary_church_id as number,
      accessible_churches: accessibleChurches,
      position_id: userData.position_id ? (userData.position_id as number) : null,
      role_id: userData.role_id as number,
      is_active: Boolean(userData.is_active),
      last_login: userData.last_login ? new Date(userData.last_login as string) : null,
      profile_image: userData.profile_image ? (userData.profile_image as string) : null,
      bio: userData.bio ? (userData.bio as string) : null,
      role: {
        id: userData.role_id as number,
        name: userData.role_name as string,
        permissions: rolePermissions,
      },
      position: userData.position_id
        ? {
            id: userData.position_id as number,
            name: userData.position_name as string,
            hierarchy_level: userData.hierarchy_level as number,
            is_leadership: Boolean(userData.is_leadership),
            is_clergy: Boolean(userData.is_clergy),
            can_upload_word: Boolean(userData.can_upload_word),
          }
        : null,
      church: {
        id: userData.primary_church_id as number,
        name: userData.church_name as string,
        code: userData.church_code as string,
        church_type: userData.church_type as string,
      },
    }
  } catch (error) {
    console.error("[Anointed Innovations] Error getting user by ID:", error)
    return null
  }
}

// Check if user has specific permission
export function hasPermission(user: User, permission: string): boolean {
  if (!user || !user.role) return false

  // Super admin has all permissions
  if (user.role.permissions.includes("all")) return true

  // Check specific permission
  return user.role.permissions.includes(permission)
}

// Check if user can access specific church
export function canAccessChurch(user: User, churchId: number): boolean {
  if (!user) return false

  // Super admin can access all churches
  if (hasPermission(user, "all")) return true

  // User's primary church
  if (user.primary_church_id === churchId) return true

  // Check accessible churches list
  if (user.accessible_churches && user.accessible_churches.includes(churchId)) {
    return true
  }

  return false
}

// Check if user can edit content
export function canEditContent(user: User): boolean {
  return hasPermission(user, "content_manage")
}

// Check if user can create new pages (only webmasters/super admins)
export function canCreatePages(user: User): boolean {
  return hasPermission(user, "all") || hasPermission(user, "network_admin")
}

export function canUploadWord(user: User): boolean {
  return hasPermission(user, "word_upload") || (user.position?.can_upload_word ?? false)
}

export async function verifyAuth(request: Request): Promise<{ user: User | null; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization")
    const cookieHeader = request.headers.get("cookie")

    let token: string | null = null

    // Check Authorization header first
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    }
    // Check cookies as fallback
    else if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=")
          acc[key] = value
          return acc
        },
        {} as Record<string, string>,
      )

      token = cookies["auth-token"]
    }

    if (!token) {
      return { user: null, error: "No authentication token provided" }
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return { user: null, error: "Invalid or expired token" }
    }

    // Get user details
    const user = await getUserById(decoded.id)
    if (!user) {
      return { user: null, error: "User not found" }
    }

    return { user }
  } catch (error) {
    console.error("[Anointed Innovations] Auth verification error:", error)
    return { user: null, error: "Authentication failed" }
  }
}