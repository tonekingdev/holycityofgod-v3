import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import type { SentMessageInfo } from "nodemailer"
import { generateAutoReplyTemplate, generateChurchNotificationTemplate } from "@/lib/email-templates"

interface PrayerRequestData {
  name: string
  email: string
  phone: string
  message: string
  honeypot: string
  // Removed: isUrgent and canShare
}

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: Number.parseInt(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const data: PrayerRequestData = await request.json()

    // Validate required fields - name is now optional
    if (!data.email || !data.message) {
      return NextResponse.json({ error: "Email and message are required" }, { status: 400 })
    }

    // Honeypot check - if filled, it's likely spam
    if (data.honeypot) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 })
    }

    // Additional spam checks
    const spamPatterns = [
      /https?:\/\//i, // URLs
      /\b(viagra|cialis|casino|lottery|winner|congratulations|free money|click here|act now)\b/i, // Common spam words
      /\$\d+/g, // Money amounts
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // Credit card patterns
    ]

    const messageText = data.message.toLowerCase()
    const nameText = data.name ? data.name.toLowerCase() : ""
    const email = data.email.toLowerCase()

    for (const pattern of spamPatterns) {
      if (pattern.test(messageText) || (nameText && pattern.test(nameText)) || pattern.test(email)) {
        return NextResponse.json({ error: "Content appears to be spam" }, { status: 400 })
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Length validations - name is optional, but validate if provided
    if (data.name && (data.name.length < 2 || data.name.length > 100)) {
      return NextResponse.json({ error: "Name must be between 2 and 100 characters" }, { status: 400 })
    }

    if (data.message.length < 10 || data.message.length > 2000) {
      return NextResponse.json({ error: "Message must be between 10 and 2000 characters" }, { status: 400 })
    }

    // Additional validation for suspicious patterns
    const suspiciousPatterns = [
      /(.)\1{4,}/g, // Repeated characters (aaaaa)
      /[A-Z]{10,}/g, // Too many consecutive capitals
      /\b\w*\d+\w*@\w*\d+\w*\.\w+/g, // Suspicious email patterns
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(data.message) || (data.name && pattern.test(data.name))) {
        return NextResponse.json({ error: "Content appears suspicious" }, { status: 400 })
      }
    }

    // Format the current date
    const currentDate = new Date().toLocaleString("en-US", {
      timeZone: "America/Detroit",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    // Get site URL for emails
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://holycityofgod.org"

    // Generate church notification email using your template
    const churchNotification = generateChurchNotificationTemplate({
      name: data.name || "Anonymous", // Provide default value for anonymous requests
      email: data.email,
      phone: data.phone,
      message: data.message,
      currentDate,
      siteUrl,
    })

    // Generate auto-reply email using your template
    const autoReply = generateAutoReplyTemplate({
      name: data.name || "Friend", // Provide default value for anonymous requests
      message: data.message,
      currentDate,
      siteUrl,
    })

    // Create transporter
    const transporter = createTransporter()

    // Verify SMTP connection
    try {
      await transporter.verify()
      console.log("SMTP connection verified successfully")
    } catch (error) {
      console.error("SMTP connection failed:", error)
      return NextResponse.json(
        { error: "Email service temporarily unavailable. Please try again later." },
        { status: 500 },
      )
    }

    // Church email address from environment variable
    const churchEmail = process.env.PRAYER_EMAIL || "info@holycityofgod.org"
    console.log("Sending church notification to:", churchEmail)

    // Send notification email to church
    const churchMailOptions = {
      from: `"Prayer Requests" <${process.env.SMTP_USER}>`,
      to: churchEmail,
      replyTo: data.email,
      subject: `New Prayer Request - ${data.name || "Anonymous"}`,
      text: churchNotification.text,
      html: churchNotification.html,
      priority: "normal" as "high" | "normal" | "low",
      headers: {
        "X-Prayer-Request": "true",
        "X-Can-Share": "true",
      },
    }

    // Send auto-reply email to visitor
    const autoReplyMailOptions = {
      from: `"Holy City of God" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `Prayer Request Confirmation - Holy City of God`,
      text: autoReply.text,
      html: autoReply.html,
      priority: "normal" as "high" | "normal" | "low",
      headers: {
        "X-Auto-Reply": "true",
        "X-Prayer-Confirmation": "true",
      },
    }

    // Send both emails
    console.log("Sending emails...")
    const [churchInfo, autoReplyInfo]: SentMessageInfo[] = await Promise.all([
      transporter.sendMail(churchMailOptions),
      transporter.sendMail(autoReplyMailOptions),
    ])

    console.log("Church notification email sent:", churchInfo.messageId)
    console.log("Auto-reply email sent:", autoReplyInfo.messageId)

    return NextResponse.json(
      {
        message: "Prayer request submitted successfully",
        churchMessageId: churchInfo.messageId,
        autoReplyMessageId: autoReplyInfo.messageId,
        debug: {
          churchEmail,
          siteUrl,
          // Removed: isUrgent and canShare debug info
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Prayer request submission error:", error)

    // Check if it's a nodemailer specific error
    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        return NextResponse.json(
          { error: "Email configuration error. Please contact the administrator." },
          { status: 500 },
        )
      }
      if (error.message.includes("Connection timeout")) {
        return NextResponse.json({ error: "Email service timeout. Please try again." }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 })
  }
}