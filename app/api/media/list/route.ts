import { NextResponse } from "next/server"
import { readdir, stat, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET() {
  try {
    const publicDir = join(process.cwd(), "public")
    const imgDir = join(publicDir, "img")
    const mediaDir = join(publicDir, "media")

    const files = []

    try {
      if (!existsSync(imgDir)) {
        await mkdir(imgDir, { recursive: true })
      }
      if (!existsSync(mediaDir)) {
        await mkdir(mediaDir, { recursive: true })
      }
    } catch (mkdirError) {
      console.warn("Could not create directories:", mkdirError)
    }

    // Read img directory
    if (existsSync(imgDir)) {
      try {
        const imgFiles = await readdir(imgDir)
        for (const file of imgFiles) {
          const filePath = join(imgDir, file)
          const stats = await stat(filePath)

          if (stats.isFile()) {
            files.push({
              id: `img_${file}`,
              name: file,
              type: "image",
              url: `/img/${file}`,
              size: stats.size,
              uploadDate: stats.mtime.toISOString(),
              category: "Images",
              directory: "img",
            })
          }
        }
      } catch (imgError) {
        console.warn("Error reading img directory:", imgError)
      }
    }

    // Read media directory
    if (existsSync(mediaDir)) {
      try {
        const mediaFiles = await readdir(mediaDir)
        for (const file of mediaFiles) {
          const filePath = join(mediaDir, file)
          const stats = await stat(filePath)

          if (stats.isFile()) {
            const extension = file.split(".").pop()?.toLowerCase()
            let type = "document"

            if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) {
              type = "image"
            } else if (["mp4", "avi", "mov", "wmv", "flv"].includes(extension || "")) {
              type = "video"
            } else if (["mp3", "wav", "ogg", "aac"].includes(extension || "")) {
              type = "audio"
            }

            files.push({
              id: `media_${file}`,
              name: file,
              type: type,
              url: `/media/${file}`,
              size: stats.size,
              uploadDate: stats.mtime.toISOString(),
              category: "Media",
              directory: "media",
            })
          }
        }
      } catch (mediaError) {
        console.warn("Error reading media directory:", mediaError)
      }
    }

    return NextResponse.json({
      success: true,
      files: files.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()),
    })
  } catch (error) {
    console.error("List files error:", error)
    return NextResponse.json(
      {
        error: "Failed to list files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}