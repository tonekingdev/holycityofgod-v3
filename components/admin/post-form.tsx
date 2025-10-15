"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, X } from "lucide-react"
import { POST_CATEGORIES, POST_TAGS } from "@/types"
import type { Post, CreatePostPayload, UpdatePostPayload } from "@/types"

interface PostFormProps {
  post?: Post
  onSubmit: (data: CreatePostPayload | UpdatePostPayload, publish?: boolean) => Promise<void>
  loading?: boolean
}

export function PostForm({ post, onSubmit, loading = false }: PostFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(post?.tags || [])
  const [formData, setFormData] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    featuredImage: post?.featuredImage || "",
    categoryId: post?.category?.id || "",
    status: post?.status || "draft",
    featured: post?.featured || false,
    seoTitle: post?.seoTitle || "",
    seoDescription: post?.seoDescription || "",
    canonicalUrl: post?.canonicalUrl || "",
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) => (prev.includes(tagName) ? prev.filter((tag) => tag !== tagName) : [...prev, tagName]))
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      tags: selectedTags,
      status: publish ? "published" : formData.status,
      publishedAt: publish && (!post || post.status === "draft") ? new Date() : undefined,
    }

    if (post) {
      await onSubmit({ id: post.id, ...submitData } as UpdatePostPayload, publish)
    } else {
      await onSubmit(submitData as CreatePostPayload, publish)
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-secondary-200">
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
                value={formData.title}
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
                value={formData.excerpt}
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
                value={formData.content}
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
                value={formData.seoTitle}
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
                value={formData.seoDescription}
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
                value={formData.canonicalUrl}
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
        {/* Form Actions */}
        <Card className="bg-primary-50">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="outline"
                disabled={loading || !formData.title || !formData.excerpt || !formData.content}
                className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading || !formData.title || !formData.excerpt || !formData.content || !formData.categoryId}
                className="btn-primary"
              >
                <Eye className="h-4 w-4 mr-2" />
                {post?.status === "published" ? "Update & Publish" : "Publish Now"}
              </Button>
            </div>
          </CardContent>
        </Card>

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
              <Select value={formData.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
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
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
              />
            </div>

            <div>
              <Label htmlFor="featuredImage" className="text-purple-700">
                Featured Image URL
              </Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
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
  )
}