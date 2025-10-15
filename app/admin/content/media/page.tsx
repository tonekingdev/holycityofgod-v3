"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, FolderOpen, Settings, RefreshCw } from "lucide-react"
import { DirectoryBrowser } from "@/components/admin/directory-browser"
import { FileUpload } from "@/components/admin/file-upload"
import type { MediaFile } from "@/types"

export default function MediaLibraryPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadComplete = (uploadedFiles: MediaFile[]) => {
    console.log(`Successfully uploaded ${uploadedFiles.length} files:`, uploadedFiles)
    // Refresh the directory browser
    setRefreshKey((prev) => prev + 1)
    setUploadDialogOpen(false)
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Media Library</h1>
              <p className="text-gray-600 text-lg">
                Manage images, videos, documents, and other media assets for Holy City of God
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Media
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload Media Files</DialogTitle>
                    <DialogDescription>
                      Upload images to /img directory and videos/documents to /media directory
                    </DialogDescription>
                  </DialogHeader>
                  <FileUpload onUploadComplete={handleUploadComplete} onClose={() => setUploadDialogOpen(false)} />
                </DialogContent>
              </Dialog>

              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-purple-200 hover:bg-purple-50 bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-purple-100">
            <TabsTrigger value="browse" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <FolderOpen className="mr-2 h-4 w-4" />
              Browse Files
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <DirectoryBrowser key={refreshKey} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-6">
              <Card className="royal-card">
                <CardHeader>
                  <CardTitle>Storage Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Image Directory</h3>
                      <p className="text-sm text-gray-600 mb-2">Images are stored in:</p>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">/public/img/</code>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Media Directory</h3>
                      <p className="text-sm text-gray-600 mb-2">Videos and documents are stored in:</p>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">/public/media/</code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="royal-card">
                <CardHeader>
                  <CardTitle>Upload Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium text-green-800 mb-2">Images</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• PNG, JPG, JPEG, GIF, WebP, SVG</li>
                        <li>• Max size: 50MB</li>
                        <li>• Stored in /img directory</li>
                        <li>• Optimized for web display</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800 mb-2">Videos</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• MP4, AVI, MOV, WMV, FLV</li>
                        <li>• Max size: 50MB</li>
                        <li>• Stored in /media directory</li>
                        <li>• Compressed for streaming</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-800 mb-2">Documents</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• PDF, DOC, DOCX</li>
                        <li>• Max size: 50MB</li>
                        <li>• Stored in /media directory</li>
                        <li>• Searchable content</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="royal-card">
                <CardHeader>
                  <CardTitle>File Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Auto-organize uploads</h4>
                        <p className="text-sm text-gray-600">Automatically sort files by type and date</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Image optimization</h4>
                        <p className="text-sm text-gray-600">Compress images for better performance</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Backup settings</h4>
                        <p className="text-sm text-gray-600">Automatic backup of media files</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}