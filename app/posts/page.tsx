"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { PostCard } from "@/components/posts/post-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, Plus, Settings } from "lucide-react"
import type { Post } from "@/types"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function PostsPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<(string | { id: string; name: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("publishedAt-desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "9",
        sortBy,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== "all" && { category: selectedCategory }),
      })

      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()

      setPosts(data.posts || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, sortBy, searchTerm, selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/posts/categories")
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchPosts()
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSortBy("publishedAt-desc")
    setCurrentPage(1)
  }

  const canCreatePost = () => {
    if (!user) return false
    return (
      user.role.permissions.includes("all") ||
      user.role.permissions.includes("content_manage") ||
      ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister", "elder"].includes(user.role.name)
    )
  }

  const canManagePosts = () => {
    if (!user) return false
    return (
      user.role.permissions.includes("all") ||
      user.role.permissions.includes("content_manage") ||
      ["super_admin", "network_admin", "first_lady", "bishop", "pastor"].includes(user.role.name)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-900 to-purple-800 text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Church Posts</h1>
            <p className="text-xl text-purple-100">
              Discover inspiring messages, community updates, and spiritual insights from our church family.
            </p>

            {user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                {canCreatePost() && (
                  <Link href="/admin/posts/new">
                    <Button className="bg-primary-50 text-purple-900 hover:bg-purple-50">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Post
                    </Button>
                  </Link>
                )}
                {canManagePosts() && (
                  <Link href="/admin/posts">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-primary-50 hover:text-purple-900 bg-transparent"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Posts
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-primary-50 border-b">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {user && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700">
                      Welcome back, <span className="font-semibold">{user.name}</span>
                    </p>
                    <p className="text-xs text-purple-600 capitalize">
                      {user.role.name.replace("_", " ")} • {user.position?.name || "Member"}
                    </p>
                  </div>
                  {canCreatePost() && (
                    <Link href="/admin/posts/new">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="mr-1 h-3 w-3" />
                        New Post
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={typeof category === "string" ? category : category.id}
                      value={typeof category === "string" ? category : category.name}
                    >
                      {typeof category === "string" ? category : category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="publishedAt-desc">Newest First</SelectItem>
                  <SelectItem value="publishedAt-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="views-desc">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" className="md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </form>

            {(searchTerm || selectedCategory !== "all") && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchTerm}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {selectedCategory}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="aspect-[16/10] bg-gray-200" />
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-3" />
                      <div className="h-6 bg-gray-200 rounded mb-3" />
                      <div className="h-4 bg-gray-200 rounded mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          )
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2">
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No posts found</h3>
                <p className="text-gray-600 mb-8">
                  {user && canCreatePost()
                    ? "Be the first to share something with the community!"
                    : "Try adjusting your search terms or filters to find what you're looking for."}
                </p>
                {user && canCreatePost() ? (
                  <Link href="/admin/posts/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Post
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={clearFilters}>Clear Filters</Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}