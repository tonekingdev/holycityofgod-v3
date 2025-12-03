"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText, ImageIcon, Video, Music } from "lucide-react"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"
import type { MediaFile } from "@/types"

interface FileUploadProps {
  onUploadComplete?: (files: MediaFile[]) => void
  onClose?: () => void
}

interface UploadFile extends File {
  id: string
  progress: number
  status: "pending" | "uploading" | "complete" | "error"
  preview?: string
}

export function FileUpload({ onUploadComplete, onClose }: FileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [category, setCategory] = useState("general")
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "pending",
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".flv"],
      "audio/*": [".mp3", ".wav", ".ogg", ".aac"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.startsWith("video/")) return Video
    if (file.type.startsWith("audio/")) return Music
    return FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })
      formData.append("category", category)

      // Update progress for all files
      setFiles((prev) => prev.map((file) => ({ ...file, status: "uploading", progress: 0 })))

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        // Update all files to complete
        setFiles((prev) => prev.map((file) => ({ ...file, status: "complete", progress: 100 })))

        toast({
          title: "Upload Successful",
          description: result.message,
        })

        const uploadedFiles = result.files as MediaFile[]
        onUploadComplete?.(uploadedFiles)

        // Clear files after a delay
        setTimeout(() => {
          setFiles([])
          onClose?.()
        }, 2000)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setFiles((prev) => prev.map((file) => ({ ...file, status: "error", progress: 0 })))

      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="branding">Branding</SelectItem>
            <SelectItem value="pastor">Pastor</SelectItem>
            <SelectItem value="backgrounds">Backgrounds</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="documents">Documents</SelectItem>
            <SelectItem value="events">Events</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-purple-400 bg-purple-50"
            : "border-purple-200 hover:border-purple-300 hover:bg-purple-25"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-purple-400 mb-4" />
        {isDragActive ? (
          <p className="text-purple-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">Drag & drop files here, or click to select</p>
            <p className="text-sm text-gray-500">Supports images, videos, audio, and documents (max 50MB each)</p>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Files to Upload ({files.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file) => {
              const FileIcon = getFileIcon(file)
              return (
                <Card key={file.id} className="p-3">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3">
                      {/* File Preview/Icon */}
                      <div className="flex-shrink-0">
                        {file.preview ? (
                          <Image
                            src={file.preview || "/img/placeholder.jpg"}
                            alt={file.name}
                            className="w-10 h-10 object-cover rounded"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <FileIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>

                        {/* Progress Bar */}
                        {file.status === "uploading" && <Progress value={file.progress} className="mt-1 h-1" />}

                        {/* Status */}
                        <div className="flex items-center mt-1">
                          {file.status === "complete" && <span className="text-xs text-green-600">✓ Uploaded</span>}
                          {file.status === "error" && <span className="text-xs text-red-600">✗ Failed</span>}
                          {file.status === "pending" && <span className="text-xs text-gray-500">Ready to upload</span>}
                        </div>
                      </div>

                      {/* Remove Button */}
                      {file.status !== "uploading" && (
                        <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="flex-shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Upload Actions */}
      {files.length > 0 && (
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setFiles([])} disabled={uploading}>
            Clear All
          </Button>
          <Button
            onClick={uploadFiles}
            disabled={uploading || files.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {uploading ? "Uploading..." : `Upload ${files.length} File${files.length > 1 ? "s" : ""}`}
          </Button>
        </div>
      )}
    </div>
  )
}