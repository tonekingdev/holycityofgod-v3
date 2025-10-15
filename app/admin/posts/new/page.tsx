"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, X } from "lucide-react"
import Link from "next/link"
import { POST_CATEGORIES, POST_TAGS } from "@/types"
import type { CreatePostPayload } from "@/types"
import { useAuth } from "@/context/auth-context"

export default function NewPostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [formData, setFormData] = useState<Partial<CreatePostPayload>>({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    categoryId: "",
    status: "draft",
    featured: false,
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    tags: [],
  })

  const handleInputChange = (field: keyof CreatePostPayload, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tagName) ? prev.filter((tag) => tag !== tagName) : [...prev, tagName]

      setFormData((prevForm) => ({
        ...prevForm,
        tags: newTags,
      }))

      return newTags
    })
  }

  const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const postData: CreatePostPayload = {
        title: formData.title || "",
        excerpt: formData.excerpt || "",
        content: formData.content || "",
        featuredImage: formData.featuredImage,
        categoryId: formData.categoryId || "",
        authorId: user.id,
        status: publishNow ? "published" : (formData.status as "draft" | "published" | "archived"),
        tags: selectedTags,
        featured: formData.featured || false,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        canonicalUrl: formData.canonicalUrl,
        publishedAt: publishNow ? new Date() : undefined,
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/admin/posts/${result.post.id}/edit`)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
          <h1 className="text-3xl font-bold gradient-text">Create New Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading || !formData.title || !formData.excerpt || !formData.content}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading || !formData.title || !formData.excerpt || !formData.content || !formData.categoryId}
            className="btn-primary"
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish Now
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-primary-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-purple-700">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter post title..."
                  className="border-purple-200 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-purple-700">
                  Excerpt *
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt || ""}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Brief description of the post..."
                  rows={3}
                  className="border-purple-200 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-purple-700">
                  Content *
                </Label>
                <Textarea
                  id="content"
                  value={formData.content || ""}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Write your post content here..."
                  rows={15}
                  className="border-purple-200 focus:border-purple-500"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card className="bg-primary-50">
            <CardHeader>
              <CardTitle className="text-purple-800">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle" className="text-purple-700">
                  SEO Title
                </Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle || ""}
                  onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                  placeholder="SEO optimized title..."
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="seoDescription" className="text-purple-700">
                  SEO Description
                </Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription || ""}
                  onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                  placeholder="SEO meta description..."
                  rows={3}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="canonicalUrl" className="text-purple-700">
                  Canonical URL
                </Label>
                <Input
                  id="canonicalUrl"
                  value={formData.canonicalUrl || ""}
                  onChange={(e) => handleInputChange("canonicalUrl", e.target.value)}
                  placeholder="https://example.com/canonical-url"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Settings */}
          <Card className="bg-primary-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category" className="text-purple-700">
                  Category *
                </Label>
                <Select
                  value={formData.categoryId || ""}
                  onValueChange={(value) => handleInputChange("categoryId", value)}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-purple-700">
                  Status
                </Label>
                <Select
                  value={formData.status || "draft"}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="text-purple-700">
                  Featured Post
                </Label>
                <Switch
                  id="featured"
                  checked={formData.featured || false}
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
                />
              </div>

              <div>
                <Label htmlFor="featuredImage" className="text-purple-700">
                  Featured Image URL
                </Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage || ""}
                  onChange={(e) => handleInputChange("featuredImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-primary-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {POST_TAGS.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag.name)
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "border-purple-200 text-purple-600 hover:bg-purple-50"
                    }`}
                    onClick={() => handleTagToggle(tag.name)}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.name) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}