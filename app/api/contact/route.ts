import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, messageType, message } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Here you would typically:
    // 1. Save to your MySQL database
    // 2. Send email notification to church staff
    // 3. Send confirmation email to the sender

    // For now, we'll just log the contact form submission
    console.log("Contact form submission:", {
      name,
      email,
      phone,
      messageType,
      message,
      timestamp: new Date().toISOString(),
    })

    // Mock successful response
    return NextResponse.json({ message: "Contact form submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}