import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { verifyAuth } from "@/lib/auth"
import { canPerformAction, logSecurityEvent } from "@/lib/permissions"


// GET /api/word/[id] - Get specific Word message
export async function GET(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const wordId = params.id

    // Get Word message with speaker and church info
    const query = `
      SELECT 
        w.*,
        u.first_name,
        u.last_name,
        u.profile_image,
        u.bio,
        p.name as position_name,
        c.name as church_name,
        c.code as church_code,
        c.city,
        c.state
      FROM word w
      LEFT JOIN users u ON w.speaker_id = u.id
      LEFT JOIN positions p ON u.position_id = p.id
      LEFT JOIN churches c ON w.church_id = c.id
      WHERE w.id = ?
    `

    const words = await executeQuery<Record<string, unknown>>(query, [wordId])

    if (words.length === 0) {
      return NextResponse.json({ error: "Word message not found" }, { status: 404 })
    }

    const word = words[0]

    // Increment view count
    await executeQuery("UPDATE word SET view_count = view_count + 1 WHERE id = ?", [wordId])

    // Get recent sharing sessions
    const sessions = await executeQuery<Record<string, unknown>>(
      `
      SELECT 
        ws.*,
        u.first_name as shared_by_name,
        u.last_name as shared_by_lastname
      FROM word_sharing_sessions ws
      LEFT JOIN users u ON ws.shared_by = u.id
      WHERE ws.word_id = ?
      ORDER BY ws.shared_at DESC
      LIMIT 5
    `,
      [wordId],
    )

    return NextResponse.json({
      word: {
        ...word,
        view_count: Number(word.view_count) + 1,
      },
      sessions,
    })
  } catch (error) {
    console.error("[Anointed Innovations] Error fetching Word message:", error)
    return NextResponse.json({ error: "Failed to fetch Word message" }, { status: 500 })
  }
}

// PUT /api/word/[id] - Update Word message
export async function PUT(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const wordId = params.id

    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error || "Authentication required" }, { status: 401 })
    }
    const user = authResult.user

    const body = await request.json()

    // Get existing Word message
    const existing = await executeQuery<Record<string, unknown>>("SELECT * FROM word WHERE id = ?", [wordId])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Word message not found" }, { status: 404 })
    }

    const existingWord = existing[0]

    // Check permissions - user can edit their own Word or if they have edit permissions
    const canEdit = Number(existingWord.speaker_id) === user.id || canPerformAction(user, "word", "edit")
    if (!canEdit) {
      logSecurityEvent(user, "word_edit_denied", "word", false, { word_id: wordId })
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const updateQuery = `
      UPDATE word SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        word_date = COALESCE(?, word_date),
        service_type = COALESCE(?, service_type),
        series_name = COALESCE(?, series_name),
        series_part = COALESCE(?, series_part),
        scripture_reference = COALESCE(?, scripture_reference),
        key_points = COALESCE(?, key_points),
        audio_url = COALESCE(?, audio_url),
        video_url = COALESCE(?, video_url),
        slides_url = COALESCE(?, slides_url),
        notes_url = COALESCE(?, notes_url),
        transcript = COALESCE(?, transcript),
        summary = COALESCE(?, summary),
        tags = COALESCE(?, tags),
        duration = COALESCE(?, duration),
        is_featured = COALESCE(?, is_featured),
        status = COALESCE(?, status),
        visibility = COALESCE(?, visibility),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `

    const updateParams = [
      body.title || null,
      body.description || null,
      body.word_date || null,
      body.service_type || null,
      body.series_name || null,
      body.series_part || null,
      body.scripture_reference || null,
      body.key_points ? JSON.stringify(body.key_points) : null,
      body.audio_url || null,
      body.video_url || null,
      body.slides_url || null,
      body.notes_url || null,
      body.transcript || null,
      body.summary || null,
      body.tags ? JSON.stringify(body.tags) : null,
      body.duration || null,
      body.is_featured !== undefined ? body.is_featured : null,
      body.status || null,
      body.visibility || null,
      wordId,
    ]

    await executeQuery(updateQuery, updateParams)

    // Log security event
    logSecurityEvent(user, "word_updated", "word", true, { word_id: wordId })

    // Get updated Word message
    const updated = await executeQuery<Record<string, unknown>>(
      `
      SELECT w.*, u.first_name, u.last_name, c.name as church_name
      FROM word w
      LEFT JOIN users u ON w.speaker_id = u.id
      LEFT JOIN churches c ON w.church_id = c.id
      WHERE w.id = ?
    `,
      [wordId],
    )

    return NextResponse.json({ word: updated[0] })
  } catch (error) {
    console.error("[Anointed Innovations] Error updating Word message:", error)
    return NextResponse.json({ error: "Failed to update Word message" }, { status: 500 })
  }
}

// DELETE /api/word/[id] - Delete Word message
export async function DELETE(request: NextRequest, context: { params: Promise<{id: string }> }) {
  try {
    const params = await context.params
    const wordId = params.id

    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error || "Authentication required" }, { status: 401 })
    }
    const user = authResult.user

    // Get existing Word message
    const existing = await executeQuery<Record<string, unknown>>("SELECT * FROM word WHERE id = ?", [wordId])
    if (existing.length === 0) {
      return NextResponse.json({ error: "Word message not found" }, { status: 404 })
    }

    const existingWord = existing[0]

    // Check permissions
    const canDelete = Number(existingWord.speaker_id) === user.id || canPerformAction(user, "word", "delete")
    if (!canDelete) {
      logSecurityEvent(user, "word_delete_denied", "word", false, { word_id: wordId })
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Delete Word message (cascade will handle related records)
    await executeQuery("DELETE FROM word WHERE id = ?", [wordId])

    // Log security event
    logSecurityEvent(user, "word_deleted", "word", true, { word_id: wordId, title: String(existingWord.title) })

    return NextResponse.json({ message: "Word message deleted successfully" })
  } catch (error) {
    console.error("[Anointed Innovations] Error deleting Word message:", error)
    return NextResponse.json({ error: "Failed to delete Word message" }, { status: 500 })
  }
}