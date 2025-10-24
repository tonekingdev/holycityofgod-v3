import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { sendEmail } from "@/lib/email"

// Define the result type for INSERT operations
interface InsertResult {
  insertId: number
  affectedRows: number
  warningStatus: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, preferred_date, preferred_time, meeting_type, reason } = body

    // Insert meeting request into database
    const insertQuery = `
      INSERT INTO meeting_requests (name, email, phone, preferred_date, preferred_time, meeting_type, reason, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `

    const result = await executeQuery<InsertResult>(insertQuery, [
      name,
      email,
      phone,
      preferred_date,
      preferred_time,
      meeting_type,
      reason,
    ])

    // Since executeQuery returns an array, we need to access the first element
    const insertResult = result[0] as InsertResult
    const meetingId = insertResult.insertId

    // Send notification to First Lady for initial approval
    await sendEmail({
      to: "ck@holycityofgod.org",
      subject: `New Meeting Request Awaiting Approval: ${name}`,
      html: `
        <h2>New Meeting Request Submitted</h2>
        <p><strong>Requester:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Date:</strong> ${preferred_date}</p>
        <p><strong>Preferred Time:</strong> ${preferred_time}</p>
        <p><strong>Meeting Type:</strong> ${meeting_type}</p>
        <p><strong>Reason:</strong></p>
        <p>${reason}</p>
        <p>Please review and approve this meeting request.</p>
      `,
    })

    // Send confirmation to requester
    await sendEmail({
      to: email,
      subject: "Meeting Request Received - Holy City of God",
      html: `
        <h2>Meeting Request Received</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your meeting request with Bishop Anthony King, Sr. Your request has been received and is being reviewed.</p>
        <p><strong>Request Details:</strong></p>
        <ul>
          <li><strong>Preferred Date:</strong> ${preferred_date}</li>
          <li><strong>Preferred Time:</strong> ${preferred_time}</li>
          <li><strong>Meeting Type:</strong> ${meeting_type}</li>
        </ul>
        <p>You will receive an email notification once your request has been reviewed and approved.</p>
        <p>Blessings,<br>Holy City of God</p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Meeting request submitted successfully",
      meetingId,
    })
  } catch (error) {
    console.error("Error creating meeting request:", error)
    return NextResponse.json({ error: "Failed to submit meeting request" }, { status: 500 })
  }
}