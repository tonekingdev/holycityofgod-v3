import Link from "next/link"
import { getPosts } from "@/lib/posts"
import { PostCard } from "./post-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { DropInView } from "@/components/DropInView"
import { FadeInView } from "@/components/FadeInView"

export async function LatestPosts() {
  const posts = await getPosts({
    limit: 3,
    status: "published",
    sortBy: "publishedAt-desc",
  }) // Get latest 3 published posts

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="container">
        <DropInView>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Latest Posts</h2>
            <Link href="/posts">
              <Button variant="outline" className="group bg-transparent hover:bg-purple-50 hover:border-purple-300">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </DropInView>

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