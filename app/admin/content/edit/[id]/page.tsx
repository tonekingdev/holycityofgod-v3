"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Eye, ArrowLeft, Calendar, User, FileText, Settings, ImageIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PageContent {
  id: string
  title: string
  slug: string
  category: string
  status: "published" | "draft" | "scheduled"
  author: string
  lastModified: string
  publishDate?: string
  metaTitle: string
  metaDescription: string
  content: {
    hero?: {
      title: string
      subtitle: string
      description: string
    }
    sections: Array<{
      id: string
      type: "text" | "image" | "card" | "list" | "quote"
      title?: string
      content: string
      imageUrl?: string
      order: number
    }>
  }
  seo: {
    canonicalUrl?: string
    keywords: string
    ogTitle?: string
    ogDescription?: string
  }
}

interface SectionUpdate {
  type?: "text" | "image" | "card" | "list" | "quote"
  title?: string
  content?: string
  imageUrl?: string
  order?: number
}

// Mock data - in real app this would come from API
const mockPageData: PageContent = {
  id: "1",
  title: "About Us - Main Page",
  slug: "about",
  category: "About",
  status: "published",
  author: "Bishop King",
  lastModified: "2024-01-15",
  metaTitle: "About Us | Holy City of God Christian Fellowship",
  metaDescription: "Learn about Holy City of God Christian Fellowship - our mission, values, beliefs, and community.",
  content: {
    hero: {
      title: "About Our Church",
      subtitle: "Holy City of God Christian Fellowship Inc.",
      description:
        "A community centered on Christ and His mission of reconciliation, dedicated to building intimate relationships with our Creator and each other.",
    },
    sections: [
      {
        id: "1",
        type: "text",
        title: "Welcome to Our Family",
        content:
          "Holy City of God Christian Fellowship is a part of the Body of Christ that is centered on Christ Himself, and His mission of reconciliation. We understand that true reconciliation to God is the process of having an intimate and loving relationship with our Creator.",
        order: 1,
      },
      {
        id: "2",
        type: "text",
        title: "Our Foundation",
        content:
          "During this process a nurturing relationship is formed, and we find our hope, peace, love, fulfillment, and joy in Him. We believe this is our foundational relationship that hinges the success of all other relationships.",
        order: 2,
      },
    ],
  },
  seo: {
    keywords: "Holy City of God, Christian Fellowship, Detroit, church, about us",
    canonicalUrl: "https://holycityofgod.org/about",
    ogTitle: "About Us | Holy City of God Christian Fellowship",
    ogDescription: "Learn about our church community and mission",
  },
}

export default function EditContentPage() {
  const router = useRouter()
  const [pageData, setPageData] = useState<PageContent>(mockPageData)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // In real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Content Saved",
        description: "Your changes have been saved successfully.",
      })
      setHasChanges(false)
    } catch {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    // Open preview in new tab
    window.open(`/preview/${pageData.slug}`, "_blank")
  }

  const updatePageData = (updates: Partial<PageContent>) => {
    setPageData((prev) => ({ ...prev, ...updates }))
    setHasChanges(true)
    if (autoSaveEnabled) {
      handleSave()
    }
  }

  const updateHeroData = (updates: Partial<NonNullable<PageContent["content"]["hero"]>>) => {
    setPageData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        hero: {
          title: prev.content.hero?.title || "",
          subtitle: prev.content.hero?.subtitle || "",
          description: prev.content.hero?.description || "",
          ...prev.content.hero,
          ...updates,
        },
      },
    }))
    setHasChanges(true)
    if (autoSaveEnabled) {
      handleSave()
    }
  }

  const updateSectionData = (sectionId: string, updates: SectionUpdate) => {
    setPageData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section,
        ),
      },
    }))
    setHasChanges(true)
    if (autoSaveEnabled) {
      handleSave()
    }
  }

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      type: "text" as const,
      title: "New Section",
      content: "Enter your content here...",
      order: pageData.content.sections.length + 1,
    }

    setPageData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: [...prev.content.sections, newSection],
      },
    }))
    setHasChanges(true)
    if (autoSaveEnabled) {
      handleSave()
    }
  }

  const removeSection = (sectionId: string) => {
    setPageData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.filter((section) => section.id !== sectionId),
      },
    }))
    setHasChanges(true)
    if (autoSaveEnabled) {
      handleSave()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()} className="border-purple-200 hover:bg-purple-50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
              <p className="text-gray-600">{pageData.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge
              className={
                pageData.status === "published"
                  ? "bg-green-100 text-green-800"
                  : pageData.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
              }
            >
              {pageData.status}
            </Badge>
            <Button
              variant="outline"
              onClick={handlePreview}
              className="border-purple-200 hover:bg-purple-50 bg-transparent"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Editor */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-purple-100">
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="seo" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  SEO
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {/* Hero Section */}
                <Card className="royal-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Hero Section
                    </CardTitle>
                    <CardDescription>The main banner area at the top of the page</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="hero-title">Hero Title</Label>
                      <Input
                        id="hero-title"
                        value={pageData.content.hero?.title || ""}
                        onChange={(e) => updateHeroData({ title: e.target.value })}
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                      <Input
                        id="hero-subtitle"
                        value={pageData.content.hero?.subtitle || ""}
                        onChange={(e) => updateHeroData({ subtitle: e.target.value })}
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-description">Hero Description</Label>
                      <Textarea
                        id="hero-description"
                        value={pageData.content.hero?.description || ""}
                        onChange={(e) => updateHeroData({ description: e.target.value })}
                        rows={3}
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Content Sections */}
                <Card className="royal-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <FileText className="mr-2 h-5 w-5" />
                          Content Sections
                        </CardTitle>
                        <CardDescription>Main content areas of the page</CardDescription>
                      </div>
                      <Button onClick={addSection} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Add Section
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {pageData.content.sections.map((section, index) => (
                      <div key={section.id} className="border border-purple-200 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">Section {index + 1}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSection(section.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>

                        <div>
                          <Label>Section Type</Label>
                          <Select
                            value={section.type}
                            onValueChange={(value) =>
                              updateSectionData(section.id, {
                                type: value as "text" | "image" | "card" | "list" | "quote",
                              })
                            }
                          >
                            <SelectTrigger className="border-purple-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="list">List</SelectItem>
                              <SelectItem value="quote">Quote</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Section Title</Label>
                          <Input
                            value={section.title || ""}
                            onChange={(e) => updateSectionData(section.id, { title: e.target.value })}
                            className="border-purple-200 focus:border-purple-400"
                          />
                        </div>

                        <div>
                          <Label>Content</Label>
                          <Textarea
                            value={section.content}
                            onChange={(e) => updateSectionData(section.id, { content: e.target.value })}
                            rows={4}
                            className="border-purple-200 focus:border-purple-400"
                          />
                        </div>

                        {section.type === "image" && (
                          <div>
                            <Label>Image URL</Label>
                            <Input
                              value={section.imageUrl || ""}
                              onChange={(e) => updateSectionData(section.id, { imageUrl: e.target.value })}
                              placeholder="/img/section-image.jpg"
                              className="border-purple-200 focus:border-purple-400"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6">
                <Card className="royal-card">
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>Optimize your page for search engines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="meta-title">Meta Title</Label>
                      <Input
                        id="meta-title"
                        value={pageData.metaTitle}
                        onChange={(e) => updatePageData({ metaTitle: e.target.value })}
                        className="border-purple-200 focus:border-purple-400"
                      />
                      <p className="text-sm text-gray-500 mt-1">{pageData.metaTitle.length}/60 characters</p>
                    </div>

                    <div>
                      <Label htmlFor="meta-description">Meta Description</Label>
                      <Textarea
                        id="meta-description"
                        value={pageData.metaDescription}
                        onChange={(e) => updatePageData({ metaDescription: e.target.value })}
                        rows={3}
                        className="border-purple-200 focus:border-purple-400"
                      />
                      <p className="text-sm text-gray-500 mt-1">{pageData.metaDescription.length}/160 characters</p>
                    </div>

                    <div>
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input
                        id="keywords"
                        value={pageData.seo.keywords}
                        onChange={(e) =>
                          updatePageData({
                            seo: { ...pageData.seo, keywords: e.target.value },
                          })
                        }
                        placeholder="keyword1, keyword2, keyword3"
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="canonical-url">Canonical URL</Label>
                      <Input
                        id="canonical-url"
                        value={pageData.seo.canonicalUrl || ""}
                        onChange={(e) =>
                          updatePageData({
                            seo: { ...pageData.seo, canonicalUrl: e.target.value },
                          })
                        }
                        placeholder="https://holycityofgod.org/about"
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="royal-card">
                  <CardHeader>
                    <CardTitle>Page Settings</CardTitle>
                    <CardDescription>Configure page visibility and publishing options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="page-title">Page Title</Label>
                      <Input
                        id="page-title"
                        value={pageData.title}
                        onChange={(e) => updatePageData({ title: e.target.value })}
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="page-slug">Page Slug</Label>
                      <Input
                        id="page-slug"
                        value={pageData.slug}
                        onChange={(e) => updatePageData({ slug: e.target.value })}
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <Label>Status</Label>
                      <Select
                        value={pageData.status}
                        onValueChange={(value) => updatePageData({ status: value as PageContent["status"] })}
                      >
                        <SelectTrigger className="border-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Category</Label>
                      <Select value={pageData.category} onValueChange={(value) => updatePageData({ category: value })}>
                        <SelectTrigger className="border-purple-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="About">About</SelectItem>
                          <SelectItem value="Services">Services</SelectItem>
                          <SelectItem value="Give">Give</SelectItem>
                          <SelectItem value="Homepage">Homepage</SelectItem>
                          <SelectItem value="Global">Global</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Page Info */}
            <Card className="royal-card">
              <CardHeader>
                <CardTitle className="text-lg">Page Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Author:</span>
                  <span className="font-medium">{pageData.author}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Modified:</span>
                  <span className="font-medium">{pageData.lastModified}</span>
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="text-gray-600">Sections:</span>
                  <span className="font-medium ml-2">{pageData.content.sections.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="royal-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-200 hover:bg-purple-50 bg-transparent"
                  onClick={handlePreview}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Page
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-200 hover:bg-purple-50 bg-transparent"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Live Page
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-200 hover:bg-purple-50 bg-transparent"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Page Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Publishing */}
            <Card className="royal-card">
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save">Auto-save</Label>
                  <Switch id="auto-save" checked={autoSaveEnabled} onCheckedChange={setAutoSaveEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Email notifications</Label>
                  <Switch id="notifications" />
                </div>
                <Separator />
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleSave}
                  disabled={!hasChanges || isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Publishing..." : "Publish Changes"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}