import bcrypt from "bcryptjs"
import { executeQuery } from "../lib/database"

async function resetPassword() {
  const email = "moderator@renewedremnant.org"
  const newPassword = "mod123" // Change this to your desired password

  try {
    console.log("[Anointed Innovations] Resetting password for:", email)

    // Hash the new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    console.log("[Anointed Innovations] Generated hash:", hashedPassword)

    // Update the password in the database
    const result = await executeQuery("UPDATE users SET password_hash = ? WHERE email = ?", [hashedPassword, email])

    console.log("[Anointed Innovations] Password reset result:", result)
    console.log("[Anointed Innovations] Password successfully reset for:", email)
    console.log("[Anointed Innovations] You can now login with the new password")
  } catch (error) {
    console.error("[Anointed Innovations] Error resetting password:", error)
  }
}

resetPassword()