import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"

export interface JWTPayload {
  id: number
  email: string
  role: string
  permissions: string[]
  church_id: number
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error("[Anointed Innovations] Token verification error:", error)
    return null
  }
}