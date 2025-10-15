import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeTransaction } from "@/lib/database"
import { verifyAuth } from "@/lib/auth"
import { canPerformAction, logSecurityEvent } from "@/lib/permissions"


interface DatabaseResult {
  insertId: number
  affectedRows: number
}

// POST /api/word/[id]/share - Share Word during live service
export async function POST(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error || "Authentication required" }, { status: 401 })
    }
    const user = authResult.user

    const wordId = params.id
    const body = await request.json()

    // Get Word message
    const words = await executeQuery<Record<string, unknown>>("SELECT * FROM word WHERE id = ?", [wordId])
    if (words.length === 0) {
      return NextResponse.json({ error: "Word message not found" }, { status: 404 })
    }

    const word = words[0]

    // Check permissions - user can share their own Word or if they have permissions
    const canShare = Number(word.speaker_id) === user.id || canPerformAction(user, "word", "edit")
    if (!canShare) {
      logSecurityEvent(user, "word_share_denied", "word", false, { word_id: wordId })
      return NextResponse.json({ error: "Insufficient permissions to share this Word" }, { status: 403 })
    }

    const queries = [
      // Mark Word as live
      {
        query:
          "UPDATE word SET is_live = ?, live_shared_at = CURRENT_TIMESTAMP, share_count = share_count + 1 WHERE id = ?",
        params: [true, wordId],
      },
      // Create sharing session record
      {
        query: `
          INSERT INTO word_sharing_sessions (
            word_id, church_id, session_name, shared_by, session_start_time, 
            attendee_count, notes, is_recorded
          ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
        `,
        params: [
          wordId,
          Number(word.church_id),
          body.session_name || `${body.service_type || "Service"} - ${new Date().toLocaleDateString()}`,
          user.id,
          body.attendee_count || 0,
          body.notes || null,
          body.is_recorded || false,
        ],
      },
    ]

    const results = await executeTransaction(queries)
    const sessionId = (results[1] as DatabaseResult).insertId

    // Log security event
    logSecurityEvent(user, "word_shared_live", "word", true, {
      word_id: wordId,
      session_id: sessionId,
      session_name: body.session_name,
    })

    // Get updated Word with session info
    const updatedWord = await executeQuery<Record<string, unknown>>(
      `
      SELECT 
        w.*,
        ws.id as session_id,
        ws.session_name,
        ws.session_start_time,
        u.first_name,
        u.last_name,
        c.name as church_name
      FROM word w
      LEFT JOIN word_sharing_sessions ws ON ws.id = ?
      LEFT JOIN users u ON w.speaker_id = u.id
      LEFT JOIN churches c ON w.church_id = c.id
      WHERE w.id = ?
    `,
      [sessionId, wordId],
    )

    return NextResponse.json({
      message: "Word is now being shared live",
      word: updatedWord[0],
      session_id: sessionId,
    })
  } catch (error) {
    console.error("[Anointed Innovations] Error sharing Word live:", error)
    return NextResponse.json({ error: "Failed to share Word live" }, { status: 500 })
  }
}

// PUT /api/word/[id]/share - End live sharing session
export async function PUT(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error || "Authentication required" }, { status: 401 })
    }
    const user = authResult.user

    const wordId = params.id
    const body = await request.json()

    // Get current live session
    const sessions = await executeQuery<Record<string, unknown>>(
      `
      SELECT ws.*, w.speaker_id 
      FROM word_sharing_sessions ws
      JOIN word w ON ws.word_id = w.id
      WHERE ws.word_id = ? AND ws.session_end_time IS NULL
      ORDER BY ws.session_start_time DESC
      LIMIT 1
    `,
      [wordId],
    )

    if (sessions.length === 0) {
      return NextResponse.json({ error: "No active sharing session found" }, { status: 404 })
    }

    const session = sessions[0]

    // Check permissions
    const canEndSession =
      Number(session.shared_by) === user.id ||
      Number(session.speaker_id) === user.id ||
      canPerformAction(user, "word", "edit")
    if (!canEndSession) {
      logSecurityEvent(user, "word_share_end_denied", "word", false, { word_id: wordId })
      return NextResponse.json({ error: "Insufficient permissions to end sharing session" }, { status: 403 })
    }

    const queries = [
      // Mark Word as no longer live
      {
        query: "UPDATE word SET is_live = ? WHERE id = ?",
        params: [false, wordId],
      },
      // End sharing session
      {
        query: `
          UPDATE word_sharing_sessions SET 
            session_end_time = CURRENT_TIMESTAMP,
            attendee_count = COALESCE(?, attendee_count),
            notes = COALESCE(?, notes),
            feedback = COALESCE(?, feedback),
            recording_url = COALESCE(?, recording_url)
          WHERE id = ?
        `,
        params: [
          body.attendee_count || null,
          body.notes || null,
          body.feedback ? JSON.stringify(body.feedback) : null,
          body.recording_url || null,
          Number(session.id),
        ],
      },
    ]

    await executeTransaction(queries)

    // Log security event
    logSecurityEvent(user, "word_share_ended", "word", true, {
      word_id: wordId,
      session_id: Number(session.id),
    })

    return NextResponse.json({
      message: "Live sharing session ended successfully",
      session_id: Number(session.id),
    })
  } catch (error) {
    console.error("[Anointed Innovations] Error ending Word sharing session:", error)
    return NextResponse.json({ error: "Failed to end sharing session" }, { status: 500 })
  }
}