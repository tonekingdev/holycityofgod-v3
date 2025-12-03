import bcrypt from "bcryptjs"
import { executeQuery } from "../lib/database"

async function checkPassword() {
  const email = "tone@tonekingdev.com"
  const testPassword = "admin123" // Enter what you think the password should be

  try {
    console.log("[Anointed Innovations] Checking password for:", email)

    // Get the stored hash
    const users = await executeQuery<{ password_hash: string }>("SELECT password_hash FROM users WHERE email = ?", [
      email,
    ])

    if (users.length === 0) {
      console.log("[Anointed Innovations] User not found")
      return
    }

    const storedHash = users[0].password_hash
    console.log("[Anointed Innovations] Stored hash:", storedHash)
    console.log("[Anointed Innovations] Hash length:", storedHash.length)
    console.log("[Anointed Innovations] Hash starts with $2a$ or $2b$:", storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$"))

    // Test the password
    const isValid = await bcrypt.compare(testPassword, storedHash)
    console.log("[Anointed Innovations] Password match:", isValid)

    if (!isValid) {
      console.log("[Anointed Innovations] Password does not match. You may need to reset it.")
    }
  } catch (error) {
    console.error("[Anointed Innovations] Error checking password:", error)
  }
}

checkPassword()