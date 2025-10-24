"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getPosts } from "@/lib/posts"
import { PostCard } from "./post-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/types"

export function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let isMounted = true

    async function fetchPosts() {
      try {
        const fetchedPosts = await getPosts({
          limit: 3,
          status: "published",
          sortBy: "publishedAt-desc",
        })
        if (isMounted) {
          setPosts(fetchedPosts)
          setError(false)
        }
      } catch (err) {
        console.error("[Anointed Innovations] Error fetching posts:", err)
        if (isMounted) {
          setError(true)
          toast({
            title: "Error Loading Posts",
            description: "Failed to load latest posts. Please try refreshing the page.",
            variant: "destructive",
          })
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPosts()

    return () => {
      isMounted = false
    }
  }, [toast])

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error || posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <DropInView>
            <h2 className="text-4xl font-bold text-gray-900">Latest Posts</h2>
          </DropInView>
          <DropInView delay={0.2}>
            <Link href="/posts">
              <Button
                variant="outline"
                className="group bg-transparent border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
              >
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </DropInView>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <FadeInView key={post.id} delay={0.4 + index * 0.2}>
              <PostCard post={post} />
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}