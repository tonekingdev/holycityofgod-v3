import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { verifyAuth } from "@/lib/auth"
import { canPerformAction, logSecurityEvent } from "@/lib/permissions"

export const runtime = "nodejs"

// POST /api/word/upload - Upload Word media files (audio, video, slides, notes)
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error || "Authentication required" }, { status: 401 })
    }
    const user = authResult.user

    // Check permissions
    if (!canPerformAction(user, "word", "create")) {
      logSecurityEvent(user, "word_upload_denied", "word", false)
      return NextResponse.json({ error: "Insufficient permissions to upload Word content" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const fileType = formData.get("type") as string // 'audio', 'video', 'slides', 'notes'
    const wordId = formData.get("wordId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!fileType || !["audio", "video", "slides", "notes"].includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type. Must be audio, video, slides, or notes" }, { status: 400 })
    }

    // Validate file size (max 500MB for video, 100MB for others)
    const maxSize = fileType === "video" ? 500 * 1024 * 1024 : 100 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${fileType === "video" ? "500MB" : "100MB"}`,
        },
        { status: 400 },
      )
    }

    // Validate file types
    const allowedTypes = {
      audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a"],
      video: ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"],
      slides: [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ],
      notes: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ],
    }

    if (!allowedTypes[fileType as keyof typeof allowedTypes].includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file format for ${fileType}. Allowed types: ${allowedTypes[fileType as keyof typeof allowedTypes].join(", ")}`,
        },
        { status: 400 },
      )
    }

    const uploadDir = join(process.cwd(), "public", "uploads", "word", fileType)
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${user.id}_${timestamp}_${wordId || "new"}.${fileExtension}`
    const filePath = join(uploadDir, fileName)
    const publicUrl = `/uploads/word/${fileType}/${fileName}`

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Log security event
    logSecurityEvent(user, "word_file_uploaded", "word", true, {
      file_type: fileType,
      file_name: fileName,
      file_size: file.size,
      word_id: wordId,
    })

    return NextResponse.json({
      message: "File uploaded successfully",
      url: publicUrl,
      fileName,
      fileType,
      fileSize: file.size,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Anointed Innovations] Error uploading Word file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}