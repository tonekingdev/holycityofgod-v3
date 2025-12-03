import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth, hashPassword, verifyPassword } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { logSecurityEvent } from "@/lib/permissions"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { user, error } = await verifyAuth(request)
    if (!user || error) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new passwords are required" }, { status: 400 })
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 })
    }

    // Get current password hash
    const users = await executeQuery<{ password_hash: string }>("SELECT password_hash FROM users WHERE id = ?", [
      user.id,
    ])

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, users[0].password_hash)
    if (!isValidPassword) {
      logSecurityEvent(user, "PASSWORD_CHANGE_FAILED", "auth", false, { reason: "Invalid current password" })
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password
    await executeQuery("UPDATE users SET password_hash = ? WHERE id = ?", [newPasswordHash, user.id])

    logSecurityEvent(user, "PASSWORD_CHANGED", "auth", true)

    return NextResponse.json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    console.error("[Anointed Innovations] Change password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}