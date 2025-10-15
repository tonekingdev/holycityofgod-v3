import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { sendEmail } from "@/lib/email"

// POST /api/events/approve - Approve or reject an event
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const body = await request.json()
    const { event_id, action, comments } = body

    // Validate approver permissions
    const approverEmail = user.email?.toLowerCase()
    const isFirstApprover = approverEmail === "ck@holycityofgod.org"
    const isFinalApprover = approverEmail === "pastor@holycityofgod.org"

    if (!isFirstApprover && !isFinalApprover) {
      return NextResponse.json({ error: "Not authorized to approve events" }, { status: 403 })
    }

    // Get event details
    const event = await executeQuery(`SELECT * FROM events WHERE id = ?`, [Number(event_id)])

    if (!event.length) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const eventData = event[0]
    let newStatus = eventData.approval_status
    const updateFields = []
    const updateValues = []

    if (action === "approve") {
      if (isFirstApprover && eventData.approval_status === "pending") {
        newStatus = "first_approved"
        updateFields.push("approval_status = ?", "first_approved_by = ?", "first_approved_at = NOW()")
        updateValues.push(newStatus, user.email)

        // Create approval record
        await executeQuery(
          `INSERT INTO event_approvals (event_id, approver_email, approver_name, approval_level, status, comments, approved_at)
           VALUES (?, ?, ?, 'first', 'approved', ?, NOW())`,
          [Number(event_id), user.email, `${user.first_name} ${user.last_name}`, comments || ""],
        )

        // Notify final approver
        await sendEmail({
          to: "pastor@holycityofgod.org" as string,
          subject: `Event Awaiting Final Approval: ${eventData.title}`,
          html: `
            <h2>Event Awaiting Final Approval</h2>
            <p>An event has been approved by First Lady Kiana King and is now awaiting your final approval.</p>
            <h3>Event Details:</h3>
            <ul>
              <li><strong>Title:</strong> ${eventData.title}</li>
              <li><strong>Date:</strong> ${eventData.event_date}</li>
              <li><strong>Time:</strong> ${eventData.start_time || "TBD"}</li>
              <li><strong>Location:</strong> ${eventData.location || "TBD"}</li>
              <li><strong>Description:</strong> ${eventData.description || "No description"}</li>
            </ul>
            ${comments ? `<p><strong>First Approver Comments:</strong> ${comments}</p>` : ""}
            <p>Please review and provide final approval.</p>
          `,
        })
      } else if (isFinalApprover && eventData.approval_status === "first_approved") {
        newStatus = "final_approved"
        updateFields.push(
          "approval_status = ?",
          "final_approved_by = ?",
          "final_approved_at = NOW()",
          "status = 'published'",
        )
        updateValues.push(newStatus, user.email)

        // Create approval record
        await executeQuery(
          `INSERT INTO event_approvals (event_id, approver_email, approver_name, approval_level, status, comments, approved_at)
           VALUES (?, ?, ?, 'final', 'approved', ?, NOW())`,
          [Number(event_id), user.email, `${user.first_name} ${user.last_name}`, comments || ""],
        )

        // Notify event creator
        const creator = await executeQuery(
          `SELECT u.email, u.first_name, u.last_name FROM users u 
           JOIN events e ON e.created_by = u.id WHERE e.id = ?`,
          [Number(event_id)],
        )

        if (creator.length) {
          await sendEmail({
            to: String(creator[0].email),
            subject: `Event Approved: ${eventData.title}`,
            html: `
              <h2>Your Event Has Been Approved!</h2>
              <p>Your event "${eventData.title}" has been fully approved and is now published.</p>
              <h3>Event Details:</h3>
              <ul>
                <li><strong>Date:</strong> ${eventData.event_date}</li>
                <li><strong>Time:</strong> ${eventData.start_time || "TBD"}</li>
                <li><strong>Location:</strong> ${eventData.location || "TBD"}</li>
              </ul>
              ${comments ? `<p><strong>Final Approver Comments:</strong> ${comments}</p>` : ""}
              <p>Your event is now visible to the congregation.</p>
            `,
          })
        }
      }
    } else if (action === "reject") {
      newStatus = "rejected"
      updateFields.push("approval_status = ?", "rejection_reason = ?")
      updateValues.push(newStatus, comments || "No reason provided")

      const approvalLevel = isFirstApprover ? "first" : "final"

      // Create rejection record
      await executeQuery(
        `INSERT INTO event_approvals (event_id, approver_email, approver_name, approval_level, status, comments)
         VALUES (?, ?, ?, ?, 'rejected', ?)`,
        [Number(event_id), user.email, `${user.first_name} ${user.last_name}`, approvalLevel, comments || ""],
      )

      // Notify event creator
      const creator = await executeQuery(
        `SELECT u.email, u.first_name, u.last_name FROM users u 
         JOIN events e ON e.created_by = u.id WHERE e.id = ?`,
        [Number(event_id)],
      )

      if (creator.length) {
        await sendEmail({
          to: String(creator[0].email),
          subject: `Event Rejected: ${eventData.title}`,
          html: `
            <h2>Event Requires Revision</h2>
            <p>Your event "${eventData.title}" has been rejected and requires revision.</p>
            <p><strong>Reason:</strong> ${comments || "No specific reason provided"}</p>
            <p>Please make the necessary changes and resubmit your event.</p>
          `,
        })
      }
    }

    // Update event
    if (updateFields.length > 0) {
      updateValues.push(Number(event_id))
      await executeQuery(`UPDATE events SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)
    }

    return NextResponse.json({
      success: true,
      message: `Event ${action}d successfully`,
      new_status: newStatus,
    })
  } catch (error) {
    console.error("Event approval error:", error)
    return NextResponse.json({ error: "Failed to process approval" }, { status: 500 })
  }
}

// GET /api/events/approve - Get pending approvals for current user
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const approverEmail = user.email?.toLowerCase()
    const isFirstApprover = approverEmail === "ck@holycityofgod.org"
    const isFinalApprover = approverEmail === "pastor@holycityofgod.org"

    if (!isFirstApprover && !isFinalApprover) {
      return NextResponse.json({ error: "Not authorized to view approvals" }, { status: 403 })
    }

    let statusFilter = ""
    if (isFirstApprover) {
      statusFilter = "e.approval_status = 'pending'"
    } else if (isFinalApprover) {
      statusFilter = "e.approval_status = 'first_approved'"
    }

    const pendingEvents = await executeQuery(
      `SELECT e.*, c.name as calendar_name, u.first_name, u.last_name, u.email as creator_email,
              ch.name as church_name
       FROM events e
       JOIN calendars c ON e.calendar_id = c.id
       LEFT JOIN users u ON e.created_by = u.id
       LEFT JOIN churches ch ON e.church_id = ch.id
       WHERE ${statusFilter}
       ORDER BY e.created_at ASC`,
      [],
    )

    return NextResponse.json({
      success: true,
      pending_events: pendingEvents.map((event) => ({
        id: Number(event.id),
        title: String(event.title),
        description: String(event.description || ""),
        event_date: String(event.event_date),
        start_time: String(event.start_time || ""),
        end_time: String(event.end_time || ""),
        location: String(event.location || ""),
        event_category: String(event.event_category),
        calendar_name: String(event.calendar_name),
        church_name: String(event.church_name || ""),
        creator_name: event.first_name ? `${String(event.first_name)} ${String(event.last_name)}` : "Unknown",
        creator_email: String(event.creator_email || ""),
        created_at: String(event.created_at),
        approval_status: String(event.approval_status),
      })),
    })
  } catch (error) {
    console.error("Get pending approvals error:", error)
    return NextResponse.json({ error: "Failed to fetch pending approvals" }, { status: 500 })
  }
}