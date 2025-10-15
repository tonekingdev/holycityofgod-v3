"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Folder, ImageIcon, Video, Music, FileText, Search, RefreshCw, Download, Copy, Eye } from "lucide-react"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"
import type { MediaFile } from "@/types"

interface DirectoryBrowserProps {
  onFileSelect?: (file: MediaFile) => void
  selectionMode?: boolean
}

export function DirectoryBrowser({ onFileSelect, selectionMode = false }: DirectoryBrowserProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDirectory, setSelectedDirectory] = useState<"all" | "img" | "media">("all")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/media/list")
      const data = await response.json()

      if (data.success) {
        setFiles(data.files)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Failed to fetch files:", error)
      toast({
        title: "Error",
        description: "Failed to load media files",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDirectory = selectedDirectory === "all" || (file.path && file.path.includes(`/${selectedDirectory}/`))
    return matchesSearch && matchesDirectory
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon
      case "video":
        return Video
      case "audio":
        return Music
      default:
        return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-green-100 text-green-800"
      case "video":
        return "bg-blue-100 text-blue-800"
      case "audio":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const copyUrl = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
    toast({
      title: "URL Copied",
      description: "File URL has been copied to clipboard",
    })
  }

  const toggleFileSelection = (fileId: string) => {
    if (selectionMode) {
      setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
    }
  }

  const handleFileClick = (file: MediaFile) => {
    if (selectionMode) {
      toggleFileSelection(file.id)
      onFileSelect?.(file)
    } else {
      window.open(file.url, "_blank")
    }
  }

  const directories = [
    { key: "all", name: "All Files", icon: Folder, count: files.length },
    {
      key: "img",
      name: "Images",
      icon: ImageIcon,
      count: files.filter((f) => f.path && f.path.includes("/img/")).length,
    },
    {
      key: "media",
      name: "Media",
      icon: Video,
      count: files.filter((f) => f.path && f.path.includes("/media/")).length,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading media files...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-purple-200 focus:border-purple-400"
          />
        </div>
        <Button onClick={fetchFiles} variant="outline" className="border-purple-200 hover:bg-purple-50 bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Directory Navigation */}
      <div className="flex gap-2 overflow-x-auto">
        {directories.map((dir) => {
          const Icon = dir.icon
          return (
            <Button
              key={dir.key}
              variant={selectedDirectory === dir.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDirectory(dir.key as "all" | "img" | "media")}
              className={
                selectedDirectory === dir.key
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-purple-200 hover:bg-purple-50"
              }
            >
              <Icon className="mr-2 h-4 w-4" />
              {dir.name} ({dir.count})
            </Button>
          )
        })}
      </div>

      {/* Selected Files Info */}
      {selectionMode && selectedFiles.length > 0 && (
        <div className="bg-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-purple-800 font-medium">
              {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedFiles([])}
              className="border-purple-300 hover:bg-purple-200"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchTerm ? "No files match your search" : "No files found in this directory"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type)
            const isSelected = selectedFiles.includes(file.id)

            return (
              <Card
                key={file.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? "ring-2 ring-purple-500 bg-purple-50" : "hover:shadow-md"
                }`}
                onClick={() => handleFileClick(file)}
              >
                <CardContent className="p-4">
                  {/* File Preview */}
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                    {file.type === "image" ? (
                      <Image
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FileIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    {/* Selection Indicator */}
                    {selectionMode && (
                      <div className="absolute top-2 left-2">
                        <div
                          className={`w-5 h-5 rounded border-2 ${
                            isSelected ? "bg-purple-600 border-purple-600" : "bg-white border-gray-300"
                          } flex items-center justify-center`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className={getTypeColor(file.type)}>{file.type}</Badge>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.path && file.path.includes("/img/") ? "img" : "media"}</span>
                    </div>

                    {/* Quick Actions */}
                    {!selectionMode && (
                      <div className="flex justify-between pt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyUrl(file.url)
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(file.url, "_blank")
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            const link = document.createElement("a")
                            link.href = file.url
                            link.download = file.name
                            link.click()
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Directory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{files.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{files.filter((f) => f.type === "image").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{files.filter((f) => f.type === "video").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}