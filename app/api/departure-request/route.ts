import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import type { SentMessageInfo } from "nodemailer"

interface DepartureRequestData {
  name: string
  email: string
  phone: string
  churchName: string
  departureType: "fellowship" | "church"
  reason: string
  honeypot: string
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
    const data: DepartureRequestData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.reason || !data.departureType) {
      return NextResponse.json({ error: "Name, email, departure type, and reason are required" }, { status: 400 })
    }

    // Honeypot check - if filled, it's likely spam
    if (data.honeypot) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Length validations
    if (data.name.length < 2 || data.name.length > 100) {
      return NextResponse.json({ error: "Name must be between 2 and 100 characters" }, { status: 400 })
    }

    if (data.reason.length < 10 || data.reason.length > 2000) {
      return NextResponse.json({ error: "Reason must be between 10 and 2000 characters" }, { status: 400 })
    }

    // Format the email content
    const departureTypeText =
      data.departureType === "fellowship" ? "Leaving Fellowship" : "Transferring to Another Church"
    const phoneText = data.phone ? data.phone : "Not provided"
    const currentDate = new Date().toLocaleString("en-US", {
      timeZone: "America/Detroit",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    // Determine recipient based on church affiliation
    // If headquarters (Holy City of God Christian Fellowship), send to Bishop Anthony King
    // Otherwise, send to their pastor
    const isHeadquarters =
      data.churchName?.toLowerCase().includes("holy city of god") ||
      data.churchName?.toLowerCase().includes("headquarters") ||
      !data.churchName

    const recipientEmail = isHeadquarters ? "pastor@holycityofgod.org" : "pastor@holycityofgod.org"
    const recipientName = isHeadquarters ? "Bishop Anthony King" : "Pastor"

    // HTML email template for church notification
    const churchNotificationHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Departure Request - ${data.name}</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c2d92 0%, #5a1a6b 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
              📋 Departure Request
            </h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">
              Holy City of God Christian Fellowship
            </p>
          </div>

          <!-- Main content -->
          <div style="padding: 30px 20px;">
            
            <!-- Member Information -->
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
              <h2 style="color: #7c2d92; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
                👤 Member Information
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #555;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Email:</td>
                  <td style="padding: 8px 0; color: #555;">
                    <a href="mailto:${data.email}" style="color: #7c2d92; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Phone:</td>
                  <td style="padding: 8px 0; color: #555;">${phoneText}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Current Church:</td>
                  <td style="padding: 8px 0; color: #555;">${data.churchName || "Holy City of God Christian Fellowship"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Request Type:</td>
                  <td style="padding: 8px 0; color: #555;">
                    <span style="background-color: #dc3545; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                      ${departureTypeText}
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Departure Reason -->
            <div style="background-color: white; padding: 25px; border: 2px solid #e9ecef; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #7c2d92; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
                📝 Departure Reason
              </h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #7c2d92;">
                <p style="white-space: pre-wrap; line-height: 1.8; margin: 0; color: #333; font-size: 16px;">
                  ${data.reason}
                </p>
              </div>
            </div>

            <!-- Footer Information -->
            <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #6c757d;">
                📅 <strong>Submitted:</strong> ${currentDate} (Detroit Time)
              </p>
              <p style="margin: 0; font-size: 12px; color: #6c757d;">
                This departure request was submitted through the member profile page.
              </p>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin-top: 25px;">
              <a href="mailto:${data.email}?subject=Re: Your Departure Request" 
                 style="display: inline-block; background-color: #7c2d92; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px;">
                📧 Reply to ${data.name}
              </a>
            </div>
          </div>
        </div>

        <!-- Email Footer -->
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>Holy City of God Christian Fellowship</p>
          <p>16606 James Couzens Fwy, Detroit, MI 48221</p>
          <p>This is an automated message from the church website.</p>
        </div>
      </body>
      </html>
    `

    // Plain text version for church notification
    const churchNotificationText = `
Departure Request - ${data.name}
Holy City of God Christian Fellowship

Member Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${phoneText}
- Current Church: ${data.churchName || "Holy City of God Christian Fellowship"}
- Request Type: ${departureTypeText}

Departure Reason:
${data.reason}

Submitted: ${currentDate} (Detroit Time)
This departure request was submitted through the member profile page.
    `

    // Auto-reply HTML template
    const autoReplyHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Departure Request Confirmation</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c2d92 0%, #5a1a6b 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
              Holy City of God
            </h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">
              Christian Fellowship Inc.
            </p>
          </div>

          <!-- Main content -->
          <div style="padding: 30px 20px;">
            <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #7c2d92; font-weight: bold; text-align: center;">
              Dear ${data.name},
            </h2>
            
            <div style="background-color: #faf7fc; padding: 25px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                <strong>Your departure request has been received.</strong> We understand that this is a significant decision, and we want you to know that you remain in our prayers.
              </p>
              <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Your request will be reviewed by ${recipientName}, and you can expect a response within 5-7 business days. If you have any immediate concerns or questions, please don't hesitate to reach out directly.
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                <em>"The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you." - Numbers 6:24-25</em>
              </p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
              <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #7c2d92; font-weight: bold;">
                Need to speak with someone?
              </h3>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                📧 Email: <a href="mailto:${recipientEmail}" style="color: #7c2d92; text-decoration: none;">${recipientEmail}</a>
              </p>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                📞 Phone: <a href="tel:3133978240" style="color: #7c2d92; text-decoration: none;">(313) 397-8240</a>
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="margin: 0 0 10px 0; font-size: 16px; color: #333333; font-style: italic;">
                God's blessings upon your journey,
              </p>
              <p style="margin: 0; font-size: 18px; color: #7c2d92; font-weight: bold;">
                Holy City of God Leadership Team
              </p>
            </div>
          </div>
        </div>

        <!-- Email Footer -->
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>Holy City of God Christian Fellowship</p>
          <p>16606 James Couzens Fwy, Detroit, MI 48221</p>
          <p>This is an automated confirmation from the church website.</p>
        </div>
      </body>
      </html>
    `

    // Auto-reply plain text
    const autoReplyText = `
Dear ${data.name},

Your departure request has been received. We understand that this is a significant decision, and we want you to know that you remain in our prayers.

Your request will be reviewed by ${recipientName}, and you can expect a response within 5-7 business days. If you have any immediate concerns or questions, please don't hesitate to reach out directly.

"The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you." - Numbers 6:24-25

NEED TO SPEAK WITH SOMEONE?
Email: ${recipientEmail}
Phone: (313) 397-8240

God's blessings upon your journey,
Holy City of God Leadership Team

---
Holy City of God Christian Fellowship
16606 James Couzens Fwy, Detroit, MI 48221
This is an automated confirmation from the church website.
    `

    // Create transporter
    const transporter = createTransporter()

    // Verify SMTP connection
    try {
      await transporter.verify()
    } catch (error) {
      console.error("SMTP connection failed:", error)
      return NextResponse.json(
        { error: "Email service temporarily unavailable. Please try again later." },
        { status: 500 },
      )
    }

    // Send notification email to church leadership
    const churchMailOptions = {
      from: `"Departure Requests" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      cc: "info@holycityofgod.org", // Always CC the main church email
      replyTo: data.email,
      subject: `Departure Request - ${data.name} (${departureTypeText})`,
      text: churchNotificationText,
      html: churchNotificationHtml,
      priority: "high" as "high" | "normal" | "low",
      headers: {
        "X-Departure-Request": "true",
        "X-Departure-Type": data.departureType,
        "X-Church": data.churchName || "Holy City of God Christian Fellowship",
      },
    }

    // Send auto-reply email to member
    const autoReplyMailOptions = {
      from: `"Holy City of God" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `Departure Request Confirmation - Holy City of God`,
      text: autoReplyText,
      html: autoReplyHtml,
      priority: "normal" as "high" | "normal" | "low",
      headers: {
        "X-Auto-Reply": "true",
        "X-Departure-Confirmation": "true",
      },
    }

    // Send both emails
    const [churchInfo, autoReplyInfo]: SentMessageInfo[] = await Promise.all([
      transporter.sendMail(churchMailOptions),
      transporter.sendMail(autoReplyMailOptions),
    ])

    console.log("Departure request email sent:", churchInfo.messageId)
    console.log("Auto-reply email sent:", autoReplyInfo.messageId)

    return NextResponse.json(
      {
        message: "Departure request submitted successfully",
        churchMessageId: churchInfo.messageId,
        autoReplyMessageId: autoReplyInfo.messageId,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Departure request submission error:", error)

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