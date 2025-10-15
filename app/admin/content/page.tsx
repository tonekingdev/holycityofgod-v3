"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ContentEditor } from "@/components/admin/content-editor"
import { useContent } from "@/hooks/use-content"
import {
  FileText,
  Edit3,
  Eye,
  Search,
  Plus,
  Users,
  Church,
  BookOpen,
  Home,
  DollarSign,
  Settings,
  RefreshCw,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

const editablePages = [
  { id: "home", title: "Home Page", category: "Homepage", icon: Home },
  { id: "give", title: "Give Page", category: "Give", icon: DollarSign },
  { id: "prayer", title: "Prayer Page", category: "Services", icon: Church },
  { id: "services", title: "Services Page", category: "Services", icon: Church },
  { id: "about", title: "About Page", category: "About", icon: Users },
  { id: "coreValues", title: "Core Values", category: "About", icon: BookOpen },
  { id: "mission", title: "Mission Page", category: "About", icon: BookOpen },
  { id: "pastor", title: "Pastor Page", category: "About", icon: Users },
  { id: "statementOfFaith", title: "Statement of Faith", category: "About", icon: BookOpen },
] as const

type EditablePageId = (typeof editablePages)[number]["id"]

export default function ContentManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTab, setSelectedTab] = useState("editable")
  const [editingPage, setEditingPage] = useState<EditablePageId | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  const { content: allContent, loading, updateContent } = useContent("home")
  const { content: editingContent, loading: editingLoading } = useContent(editingPage || "home")

  const categories = [
    { name: "All", icon: FileText, count: editablePages.length },
    { name: "About", icon: Users, count: editablePages.filter((page) => page.category === "About").length },
    { name: "Services", icon: Church, count: editablePages.filter((page) => page.category === "Services").length },
    { name: "Give", icon: DollarSign, count: editablePages.filter((page) => page.category === "Give").length },
    { name: "Homepage", icon: Home, count: editablePages.filter((page) => page.category === "Homepage").length },
  ]

  const filteredPages = editablePages.filter((page) => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || page.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleEditPage = (pageId: EditablePageId) => {
    setEditingPage(pageId)
    setSaveStatus("idle")
  }

  const handleSaveContent = async (pageId: EditablePageId, newContent: Record<string, unknown>) => {
    setIsSaving(true)
    setSaveStatus("idle")

    try {
      await updateContent(pageId, newContent)
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      console.error("Failed to save content:", error)
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBackToList = () => {
    setEditingPage(null)
    setSaveStatus("idle")
  }

  if (editingPage) {
    const page = editablePages.find((p) => p.id === editingPage)
    if (!page) return null

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleBackToList}
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50 bg-transparent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Content List
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Edit {page.title}</h1>
                  <p className="text-gray-600">Make changes to the page content</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {saveStatus === "success" && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span className="text-sm">Saved successfully</span>
                  </div>
                )}
                {saveStatus === "error" && (
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    <span className="text-sm">Save failed</span>
                  </div>
                )}
                <Button
                  onClick={() => handleSaveContent(editingPage, editingContent as Record<string, unknown>)}
                  disabled={isSaving || editingLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>

            {saveStatus === "error" && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Failed to save changes. Please try again or check your connection.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Content Editor */}
          {editingLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading content...</p>
              </div>
            </div>
          ) : (
            <ContentEditor
              content={editingContent as Record<string, unknown>}
              onChange={(newContent) => handleSaveContent(editingPage, newContent)}
              pageType={editingPage}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Management</h1>
              <p className="text-gray-600 text-lg">Manage all website content, pages, and media assets</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
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
                placeholder="Search content..."
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
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "border-purple-200 hover:bg-purple-50"
                  }
                >
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-purple-100">
            <TabsTrigger value="editable" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Edit3 className="mr-2 h-4 w-4" />
              Editable Pages
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Settings className="mr-2 h-4 w-4" />
              All Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editable" className="space-y-4">
            <div className="grid gap-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading content...</p>
                  </div>
                </div>
              ) : (
                filteredPages.map((page) => {
                  const Icon = page.icon
                  const hasContent = allContent && (allContent as Record<string, unknown>)[page.id]
                  return (
                    <Card key={page.id} className="royal-card hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Icon className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                              <p className="text-sm text-gray-600">
                                {page.category} • {hasContent ? "Content available" : "No content yet"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge
                              className={hasContent ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                            >
                              {hasContent ? "Ready" : "Setup needed"}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-200 hover:bg-purple-50 bg-transparent"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={() => handleEditPage(page.id)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4"></TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Editable Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{editablePages.length}</div>
            </CardContent>
          </Card>
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Content Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{allContent ? Object.keys(allContent).length : 0}</div>
            </CardContent>
          </Card>
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">About Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {editablePages.filter((page) => page.category === "About").length}
              </div>
            </CardContent>
          </Card>
          <Card className="royal-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Service Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {editablePages.filter((page) => page.category === "Services").length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}