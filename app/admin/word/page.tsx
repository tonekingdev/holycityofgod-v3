"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Upload,
  Search,
  Grid3X3,
  List,
  Trash2,
  Edit,
  Download,
  Copy,
  Eye,
  Calendar,
  User,
  HardDrive,
  Play,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface WordDocument {
  id: string
  title: string
  speaker: string
  speakerId: string
  type: "slides" | "notes" | "audio" | "video"
  fileName: string
  fileUrl: string
  fileSize: number
  uploadDate: string
  scheduledDate?: string
  status: "draft" | "scheduled" | "live" | "archived"
  description?: string
  tags: string[]
  isShared: boolean
  viewCount: number
}

const mockWordDocuments: WordDocument[] = [
  {
    id: "1",
    title: "Faith Over Fear",
    speaker: "Bishop Anthony King, Sr.",
    speakerId: "bishop-king",
    type: "slides",
    fileName: "faith-over-fear.pptx",
    fileUrl: "/uploads/word/slides/faith-over-fear.pptx",
    fileSize: 2500000,
    uploadDate: "2024-01-15",
    scheduledDate: "2024-01-21",
    status: "scheduled",
    description: "Sunday morning PowerPoint presentation about overcoming fear through faith",
    tags: ["faith", "fear", "courage", "sunday"],
    isShared: false,
    viewCount: 0,
  },
  {
    id: "2",
    title: "Walking in Purpose",
    speaker: "Minister Sarah Johnson",
    speakerId: "minister-sarah",
    type: "slides",
    fileName: "walking-in-purpose.pptx",
    fileUrl: "/uploads/word/slides/walking-in-purpose.pptx",
    fileSize: 1800000,
    uploadDate: "2024-01-12",
    scheduledDate: "2024-01-14",
    status: "archived",
    description: "Wednesday Bible study PowerPoint on discovering God's purpose for your life",
    tags: ["purpose", "calling", "bible-study"],
    isShared: true,
    viewCount: 45,
  },
  {
    id: "3",
    title: "The Power of Prayer",
    speaker: "Elder Grace Thompson",
    speakerId: "elder-grace",
    type: "notes",
    fileName: "power-of-prayer-notes.docx",
    fileUrl: "/uploads/word/notes/power-of-prayer-notes.docx",
    fileSize: 150000,
    uploadDate: "2024-01-10",
    status: "draft",
    description: "Teaching notes on effective prayer life",
    tags: ["prayer", "spiritual-growth"],
    isShared: false,
    viewCount: 0,
  },
  {
    id: "4",
    title: "Love in Action",
    speaker: "Deacon Robert Davis",
    speakerId: "deacon-robert",
    type: "slides",
    fileName: "love-in-action.pptx",
    fileUrl: "/uploads/word/slides/love-in-action.pptx",
    fileSize: 3200000,
    uploadDate: "2024-01-08",
    scheduledDate: "2024-01-07",
    status: "live",
    description: "Currently being presented - community service message",
    tags: ["love", "service", "community"],
    isShared: true,
    viewCount: 12,
  },
]

const speakers = [
  { id: "bishop-king", name: "Bishop Anthony King, Sr.", role: "Senior Pastor" },
  { id: "minister-sarah", name: "Minister Sarah Johnson", role: "Youth Minister" },
  { id: "elder-grace", name: "Elder Grace Thompson", role: "Senior Saints Leader" },
  { id: "deacon-robert", name: "Deacon Robert Davis", role: "Men's Ministry Leader" },
]

const documentTypes = [
  { value: "slides", label: "PowerPoint Slides", icon: FileText, color: "bg-blue-100 text-blue-800" },
  { value: "notes", label: "Speaker Notes", icon: FileText, color: "bg-green-100 text-green-800" },
  { value: "audio", label: "Audio Recording", icon: Play, color: "bg-orange-100 text-orange-800" },
  { value: "video", label: "Video Recording", icon: Play, color: "bg-purple-100 text-purple-800" },
]

export default function WordManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpeaker, setSelectedSpeaker] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const filteredDocuments = mockWordDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpeaker = selectedSpeaker === "All" || doc.speaker === selectedSpeaker
    const matchesType = selectedType === "All" || doc.type === selectedType
    const matchesStatus = selectedStatus === "All" || doc.status === selectedStatus
    return matchesSearch && matchesSpeaker && matchesType && matchesStatus
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "live":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return Edit
      case "scheduled":
        return Clock
      case "live":
        return CheckCircle
      case "archived":
        return XCircle
      default:
        return AlertCircle
    }
  }

  const getTypeInfo = (type: string) => {
    return documentTypes.find((t) => t.value === type) || documentTypes[0]
  }

  const handleUpload = () => {
    toast({
      title: "Upload Started",
      description: "Your Word document is being uploaded...",
    })
    setUploadDialogOpen(false)
  }

  const handleGoLive = (doc: WordDocument) => {
    toast({
      title: "Document Shared Live",
      description: `"${doc.title}" is now being shared for presentation.`,
    })
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL Copied",
      description: "Document URL has been copied to clipboard.",
    })
  }

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Word Management</h1>
              <p className="text-gray-600 text-lg">
                Manage PowerPoint presentations and sermon materials for preaching leaders
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-700 text-white">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Word
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Word Document</DialogTitle>
                    <DialogDescription>
                      Upload PowerPoint presentations, speaker notes, or recordings for your sermon
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="word-title">Message Title</Label>
                      <Input id="word-title" placeholder="Enter message title..." className="border-purple-200" />
                    </div>
                    <div>
                      <Label htmlFor="word-speaker">Speaker</Label>
                      <Select>
                        <SelectTrigger className="border-purple-200">
                          <SelectValue placeholder="Select speaker" />
                        </SelectTrigger>
                        <SelectContent>
                          {speakers.map((speaker) => (
                            <SelectItem key={speaker.id} value={speaker.id}>
                              {speaker.name} - {speaker.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="word-type">Document Type</Label>
                      <Select>
                        <SelectTrigger className="border-purple-200">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="word-file">Select File</Label>
                      <Input
                        id="word-file"
                        type="file"
                        accept=".pptx,.ppt,.pdf,.mp3,.mp4,.wav"
                        className="border-purple-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="word-description">Description (Optional)</Label>
                      <Textarea
                        id="word-description"
                        placeholder="Brief description of the message..."
                        className="border-purple-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduled-date">Scheduled Date (Optional)</Label>
                      <Input id="scheduled-date" type="datetime-local" className="border-purple-200" />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpload} className="bg-primary hover:bg-primary-700">
                        Upload
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="border-purple-200 hover:bg-purple-50"
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search Word documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
                <SelectTrigger className="w-48 border-purple-200">
                  <SelectValue placeholder="All Speakers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Speakers</SelectItem>
                  {speakers.map((speaker) => (
                    <SelectItem key={speaker.id} value={speaker.name}>
                      {speaker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 border-purple-200">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40 border-purple-200">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Items Actions */}
          {selectedItems.length > 0 && (
            <div className="bg-purple-100 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-purple-800 font-medium">
                  {selectedItems.length} document{selectedItems.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-purple-300 hover:bg-purple-200 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="border-purple-300 hover:bg-purple-200 bg-transparent">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 hover:bg-red-100 text-red-600 bg-transparent"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedItems([])}
                    className="border-purple-300 hover:bg-purple-200"
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => {
              const typeInfo = getTypeInfo(doc.type)
              const StatusIcon = getStatusIcon(doc.status)
              const isSelected = selectedItems.includes(doc.id)

              return (
                <Card
                  key={doc.id}
                  className={`royal-card hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    isSelected ? "ring-2 ring-purple-500 bg-purple-50" : ""
                  }`}
                  onClick={() => toggleSelection(doc.id)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                      <div className="flex items-center justify-center h-full">
                        <typeInfo.icon className="h-16 w-16 text-gray-400" />
                      </div>

                      {/* Selection Checkbox */}
                      <div className="absolute top-2 left-2">
                        <div
                          className={`w-5 h-5 rounded border-2 ${
                            isSelected ? "bg-primary border-primary" : "bg-primary-50 border-gray-300"
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

                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(doc.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {doc.status}
                        </Badge>
                      </div>

                      {/* Live Indicator */}
                      {doc.status === "live" && (
                        <div className="absolute bottom-2 left-2">
                          <div className="flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                            <div className="w-2 h-2 bg-primary-50 rounded-full mr-1 animate-pulse"></div>
                            LIVE
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-gray-900 truncate" title={doc.title}>
                        {doc.title}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">{doc.speaker}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                        <span>{formatFileSize(doc.fileSize)}</span>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex justify-between pt-2">
                        {doc.status === "live" ? (
                          <Button
                            size="sm"
                            className="h-6 px-2 text-xs bg-red-500 hover:bg-red-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              toast({
                                title: "Presentation Active",
                                description: "This document is currently being presented live.",
                              })
                            }}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleGoLive(doc)
                            }}
                            className="h-6 px-2 text-xs"
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyUrl(doc.fileUrl)
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
                            window.open(doc.fileUrl, "_blank")
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((doc) => {
              const typeInfo = getTypeInfo(doc.type)
              const StatusIcon = getStatusIcon(doc.status)
              const isSelected = selectedItems.includes(doc.id)

              return (
                <Card
                  key={doc.id}
                  className={`royal-card hover:shadow-md transition-all duration-300 cursor-pointer ${
                    isSelected ? "ring-2 ring-purple-500 bg-purple-50" : ""
                  }`}
                  onClick={() => toggleSelection(doc.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Selection Checkbox */}
                      <div
                        className={`w-5 h-5 rounded border-2 ${
                          isSelected ? "bg-primary border-primary" : "bg-primary-50 border-gray-300"
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

                      {/* Document Icon */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="flex items-center justify-center h-full">
                          <typeInfo.icon className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>

                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                          <Badge className={getStatusColor(doc.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {doc.status}
                          </Badge>
                          {doc.status === "live" && (
                            <div className="flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                              <div className="w-2 h-2 bg-primary-50 rounded-full mr-1 animate-pulse"></div>
                              LIVE
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{doc.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {doc.speaker}
                          </span>
                          <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                          <span className="flex items-center">
                            <HardDrive className="mr-1 h-3 w-3" />
                            {formatFileSize(doc.fileSize)}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {doc.uploadDate}
                          </span>
                          {doc.isShared && (
                            <span className="flex items-center text-green-600">
                              <Eye className="mr-1 h-3 w-3" />
                              {doc.viewCount} views
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        {doc.status === "live" ? (
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              toast({
                                title: "Presentation Active",
                                description: "This document is currently being presented live.",
                              })
                            }}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleGoLive(doc)
                            }}
                            className="border-purple-200 hover:bg-purple-50"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyUrl(doc.fileUrl)
                          }}
                          className="border-purple-200 hover:bg-purple-50"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(doc.fileUrl, "_blank")
                          }}
                          className="border-purple-200 hover:bg-purple-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary-700 text-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockWordDocuments.length}</div>
            </CardContent>
          </Card>
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockWordDocuments.filter((doc) => doc.status === "scheduled").length}
              </div>
            </CardContent>
          </Card>
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Live Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockWordDocuments.filter((doc) => doc.status === "live").length}
              </div>
            </CardContent>
          </Card>
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mockWordDocuments.reduce((total, doc) => total + doc.viewCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}