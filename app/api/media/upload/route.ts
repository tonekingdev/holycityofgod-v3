import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const category = (formData.get("category") as string) || "general"

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const uploadedFiles = []

    for (const file of files) {
      if (!file.name) continue

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Determine directory based on file type
      const fileType = file.type.split("/")[0]
      let directory = "media"

      if (fileType === "image") {
        directory = "img"
      } else if (fileType === "video") {
        directory = "media"
      } else {
        directory = "media"
      }

      // Create directory if it doesn't exist
      const uploadDir = join(process.cwd(), "public", directory)
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filename = `${timestamp}_${sanitizedName}`
      const filepath = join(uploadDir, filename)

      // Write file
      await writeFile(filepath, buffer)

      // Create file info
      const fileInfo = {
        id: timestamp.toString(),
        name: filename,
        originalName: file.name,
        type: fileType,
        mimeType: file.type,
        size: file.size,
        url: `/${directory}/${filename}`,
        category: category,
        uploadDate: new Date().toISOString(),
        uploadedBy: "Admin", // In real app, get from auth context
      }

      uploadedFiles.push(fileInfo)
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: "Failed to upload files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}