"use client"

import type React from "react"
import { useState, useEffect, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Trash2, X } from "lucide-react"
import Link from "next/link"
import { POST_CATEGORIES, POST_TAGS } from "@/types"
import type { Post, UpdatePostPayload } from "@/types"
import { useAuth } from "@/context/auth-context"

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState<Post | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [formData, setFormData] = useState<Partial<UpdatePostPayload>>({})

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${resolvedParams.id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data.post)
        setSelectedTags(data.post.tags || [])
        setFormData({
          title: data.post.title,
          excerpt: data.post.excerpt,
          content: data.post.content,
          featuredImage: data.post.featuredImage,
          categoryId: data.post.category.id,
          status: data.post.status,
          featured: data.post.featured,
          seoTitle: data.post.seoTitle,
          seoDescription: data.post.seoDescription,
          canonicalUrl: data.post.canonicalUrl,
          tags: data.post.tags || [],
        })
      } else {
        router.push("/admin/posts")
      }
    } catch (error) {
      console.error("Error fetching post:", error)
      router.push("/admin/posts")
    }
  }, [resolvedParams.id, router])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleInputChange = (field: keyof UpdatePostPayload, value: string | boolean) => {
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
    if (!user || !post) return

    setLoading(true)
    try {
      const updateData: UpdatePostPayload = {
        id: post.id,
        ...formData,
        tags: selectedTags,
        status: publishNow ? "published" : (formData.status as "draft" | "published" | "archived"),
        publishedAt: publishNow && post.status === "draft" ? new Date() : undefined,
      }

      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const result = await response.json()
        setPost(result.post)
        alert("Post updated successfully!")
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error updating post:", error)
      alert("Failed to update post")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!post || !confirm("Are you sure you want to delete this post? This action cannot be undone.")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/admin/posts")
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    } finally {
      setLoading(false)
    }
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading post...</p>
        </div>
      </div>
    )
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
          <div>
            <h1 className="text-3xl font-bold gradient-text">Edit Post</h1>
            <p className="text-purple-600 mt-1">Last updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={loading}
            className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading || !formData.categoryId}
            className="btn-primary"
          >
            <Eye className="h-4 w-4 mr-2" />
            {post.status === "published" ? "Update & Publish" : "Publish Now"}
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
                  <SelectContent className="bg-white">
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
                  <SelectContent className="bg-white">
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

          {/* Post Stats */}
          <Card className="bg-primary-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Post Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-600">Views:</span>
                <span className="font-medium">{post.views || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-600">Reading Time:</span>
                <span className="font-medium">{post.readingTime || 0} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-600">Created:</span>
                <span className="font-medium">{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}