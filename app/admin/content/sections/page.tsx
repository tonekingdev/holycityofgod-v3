"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Eye,
  Search,
  MapPin,
  Clock,
  Phone,
  Mail,
  Church,
  Users,
  Settings,
  Save,
  RefreshCw,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SectionContent {
  address?: string
  phone?: string
  email?: string
  website?: string
  services?: Array<{
    name: string
    day: string
    time: string
  }>
  title?: string
  text?: string
  message?: string
  startDate?: string
  endDate?: string
  priority?: string
  facebook?: string
  instagram?: string
  youtube?: string
  twitter?: string
}

interface ContentSection {
  id: string
  name: string
  key: string
  type: "contact" | "schedule" | "text" | "announcement" | "social" | "custom"
  category: string
  content: SectionContent
  isActive: boolean
  lastModified: string
  modifiedBy: string
  usedOn: string[]
}

const mockSections: ContentSection[] = [
  {
    id: "1",
    name: "Church Contact Information",
    key: "church_contact",
    type: "contact",
    category: "Global",
    content: {
      address: "28333 Marcia Ave, Warren, MI 48093",
      phone: "(313) 397-8240",
      email: "info@holycityofgod.org",
      website: "https://holycityofgod.org",
    },
    isActive: true,
    lastModified: "2024-01-15",
    modifiedBy: "Tone King",
    usedOn: ["About Page", "Contact Page", "Footer"],
  },
  {
    id: "2",
    name: "Service Schedule",
    key: "service_schedule",
    type: "schedule",
    category: "Services",
    content: {
      services: [
        { name: "Sunday Worship", day: "Sunday", time: "10:00 AM" },
        { name: "Wednesday Bible Study", day: "Wednesday", time: "7:00 PM" },
        { name: "Friday Prayer Conference", day: "Friday", time: "6:00 AM" },
      ],
    },
    isActive: true,
    lastModified: "2024-01-14",
    modifiedBy: "Bishop King",
    usedOn: ["Homepage", "Services Page", "About Page"],
  },
  {
    id: "3",
    name: "Welcome Message",
    key: "welcome_message",
    type: "text",
    category: "Homepage",
    content: {
      title: "Welcome to Our Family",
      text: "Holy City of God Christian Fellowship is a part of the Body of Christ that is centered on Christ Himself, and His mission of reconciliation.",
    },
    isActive: true,
    lastModified: "2024-01-12",
    modifiedBy: "Krissie",
    usedOn: ["Homepage", "About Page"],
  },
  {
    id: "4",
    name: "Current Announcement",
    key: "current_announcement",
    type: "announcement",
    category: "Global",
    content: {
      title: "Special Revival Service",
      message:
        "Join us for a special revival service this Sunday at 6:00 PM. Guest speaker: Pastor Johnson from Atlanta.",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      priority: "high",
    },
    isActive: true,
    lastModified: "2024-01-16",
    modifiedBy: "Bishop King",
    usedOn: ["Homepage Banner", "Services Page"],
  },
  {
    id: "5",
    name: "Social Media Links",
    key: "social_media",
    type: "social",
    category: "Global",
    content: {
      facebook: "https://facebook.com/holycityofgod",
      instagram: "https://instagram.com/holycityofgod",
      youtube: "https://youtube.com/holycityofgod",
      twitter: "https://twitter.com/holycityofgod",
    },
    isActive: true,
    lastModified: "2024-01-10",
    modifiedBy: "Krissie",
    usedOn: ["Footer", "Contact Page", "About Page"],
  },
]

const sectionTypes = [
  { value: "contact", label: "Contact Information", icon: MapPin },
  { value: "schedule", label: "Schedule/Times", icon: Clock },
  { value: "text", label: "Text Content", icon: BookOpen },
  { value: "announcement", label: "Announcement", icon: Church },
  { value: "social", label: "Social Media", icon: Users },
  { value: "custom", label: "Custom Section", icon: Settings },
]

export default function ContentSectionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null)
  const [newSection, setNewSection] = useState({
    name: "",
    key: "",
    type: "text" as ContentSection["type"],
    category: "Global",
    content: {},
  })

  const categories = [
    { name: "All", count: mockSections.length },
    { name: "Global", count: mockSections.filter((s) => s.category === "Global").length },
    { name: "Homepage", count: mockSections.filter((s) => s.category === "Homepage").length },
    { name: "Services", count: mockSections.filter((s) => s.category === "Services").length },
  ]

  const filteredSections = mockSections.filter((section) => {
    const matchesSearch =
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.key.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || section.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getTypeIcon = (type: string) => {
    const typeConfig = sectionTypes.find((t) => t.value === type)
    return typeConfig?.icon || Settings
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "contact":
        return "bg-blue-100 text-blue-800"
      case "schedule":
        return "bg-green-100 text-green-800"
      case "text":
        return "bg-purple-100 text-purple-800"
      case "announcement":
        return "bg-orange-100 text-orange-800"
      case "social":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateSection = () => {
    // In real app, this would be an API call
    toast({
      title: "Section Created",
      description: `${newSection.name} has been created successfully.`,
    })
    setCreateDialogOpen(false)
    setNewSection({ name: "", key: "", type: "text", category: "Global", content: {} })
  }

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section)
  }

  const handleSaveSection = () => {
    toast({
      title: "Section Updated",
      description: "Your changes have been saved successfully.",
    })
    setEditingSection(null)
  }

  const toggleSectionStatus = () => {
    toast({
      title: "Section Status Updated",
      description: "Section visibility has been updated.",
    })
  }

  const duplicateSection = (section: ContentSection) => {
    toast({
      title: "Section Duplicated",
      description: `${section.name} has been duplicated.`,
    })
  }

  const renderSectionContent = (section: ContentSection) => {
    switch (section.type) {
      case "contact":
        return (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{section.content.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{section.content.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{section.content.email}</span>
            </div>
          </div>
        )
      case "schedule":
        return (
          <div className="space-y-2 text-sm">
            {section.content.services?.map((service, index) => (
              <div key={index} className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>
                  {service.name}: {service.day} {service.time}
                </span>
              </div>
            )) || <span className="text-gray-500">No services configured</span>}
          </div>
        )
      case "text":
        return (
          <div className="text-sm">
            <h4 className="font-medium mb-1">{section.content.title}</h4>
            <p className="text-gray-600 line-clamp-2">{section.content.text}</p>
          </div>
        )
      case "announcement":
        return (
          <div className="text-sm">
            <h4 className="font-medium mb-1">{section.content.title}</h4>
            <p className="text-gray-600 line-clamp-2">{section.content.message}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {section.content.startDate} - {section.content.endDate}
              </Badge>
              <Badge
                className={
                  section.content.priority === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                }
              >
                {section.content.priority}
              </Badge>
            </div>
          </div>
        )
      default:
        return <p className="text-sm text-gray-600">Custom content section</p>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Sections</h1>
              <p className="text-gray-600 text-lg">Manage reusable content blocks and global site elements</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-purple-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Section
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Section</DialogTitle>
                    <DialogDescription>Create a reusable content section for your website</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="section-name">Section Name</Label>
                      <Input
                        id="section-name"
                        value={newSection.name}
                        onChange={(e) => setNewSection((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Church Contact Info"
                        className="border-purple-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="section-key">Section Key</Label>
                      <Input
                        id="section-key"
                        value={newSection.key}
                        onChange={(e) => setNewSection((prev) => ({ ...prev, key: e.target.value }))}
                        placeholder="e.g., church_contact"
                        className="border-purple-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="section-type">Section Type</Label>
                      <Select
                        value={newSection.type}
                        onValueChange={(value) =>
                          setNewSection((prev) => ({ ...prev, type: value as ContentSection["type"] }))
                        }
                      >
                        <SelectTrigger className="border-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {sectionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="section-category">Category</Label>
                      <Select
                        value={newSection.category}
                        onValueChange={(value) => setNewSection((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="border-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Global">Global</SelectItem>
                          <SelectItem value="Homepage">Homepage</SelectItem>
                          <SelectItem value="Services">Services</SelectItem>
                          <SelectItem value="About">About</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateSection} className="bg-primary hover:bg-purple-700">
                        Create Section
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="border-purple-200 hover:bg-purple-50 bg-transparent">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className={
                    selectedCategory === category.name
                      ? "bg-primary hover:bg-purple-700 text-white"
                      : "border-purple-200 hover:bg-purple-50"
                  }
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid gap-6">
          {filteredSections.map((section) => {
            const TypeIcon = getTypeIcon(section.type)

            return (
              <Card key={section.id} className="royal-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <TypeIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{section.name}</h3>
                          <Badge className={getTypeColor(section.type)}>{section.type}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {section.category}
                          </Badge>
                          <div className="flex items-center">
                            <Switch checked={section.isActive} onCheckedChange={() => toggleSectionStatus()} />
                            <span className="ml-2 text-sm text-gray-600">
                              {section.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Key: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{section.key}</code>
                        </p>

                        {/* Section Content Preview */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">{renderSectionContent(section)}</div>

                        {/* Usage Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            Last modified {section.lastModified} by {section.modifiedBy}
                          </span>
                          <span>•</span>
                          <span>Used on: {section.usedOn.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => duplicateSection(section)}
                        className="border-purple-200 hover:bg-purple-50"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 hover:bg-purple-50 bg-transparent"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditSection(section)}
                        className="bg-primary hover:bg-purple-700 text-white"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 hover:bg-red-50 text-red-600 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Edit Section Dialog */}
        <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Section: {editingSection?.name}</DialogTitle>
              <DialogDescription>Update the content and settings for this section</DialogDescription>
            </DialogHeader>

            {editingSection && (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  {editingSection.type === "contact" && (
                    <div className="space-y-4">
                      <div>
                        <Label>Address</Label>
                        <Input defaultValue={editingSection.content.address} className="border-purple-200" />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input defaultValue={editingSection.content.phone} className="border-purple-200" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input defaultValue={editingSection.content.email} className="border-purple-200" />
                      </div>
                    </div>
                  )}

                  {editingSection.type === "text" && (
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input defaultValue={editingSection.content.title} className="border-purple-200" />
                      </div>
                      <div>
                        <Label>Content</Label>
                        <Textarea defaultValue={editingSection.content.text} rows={4} className="border-purple-200" />
                      </div>
                    </div>
                  )}

                  {editingSection.type === "announcement" && (
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input defaultValue={editingSection.content.title} className="border-purple-200" />
                      </div>
                      <div>
                        <Label>Message</Label>
                        <Textarea
                          defaultValue={editingSection.content.message}
                          rows={3}
                          className="border-purple-200"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            defaultValue={editingSection.content.startDate}
                            className="border-purple-200"
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            defaultValue={editingSection.content.endDate}
                            className="border-purple-200"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select defaultValue={editingSection.content.priority}>
                          <SelectTrigger className="border-purple-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div>
                    <Label>Section Name</Label>
                    <Input defaultValue={editingSection.name} className="border-purple-200" />
                  </div>
                  <div>
                    <Label>Section Key</Label>
                    <Input defaultValue={editingSection.key} className="border-purple-200" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select defaultValue={editingSection.category}>
                      <SelectTrigger className="border-purple-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Global">Global</SelectItem>
                        <SelectItem value="Homepage">Homepage</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="About">About</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked={editingSection.isActive} />
                    <Label>Active</Label>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingSection(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSection} className="bg-primary hover:bg-purple-700">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockSections.length}</div>
            </CardContent>
          </Card>
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mockSections.filter((s) => s.isActive).length}</div>
            </CardContent>
          </Card>
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Global Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockSections.filter((s) => s.category === "Global").length}
              </div>
            </CardContent>
          </Card>
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Most Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(...mockSections.map((s) => s.usedOn.length))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}