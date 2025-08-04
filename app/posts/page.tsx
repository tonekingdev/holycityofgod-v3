import { getPosts } from "@/lib/posts"
import { PostCard } from "@/components/posts/post-card"
import { POST_CATEGORIES } from "@/types"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Church Posts</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay connected with our church community through inspiring messages, updates, and spiritual insights.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link href="/posts">
            <Badge variant="outline" className="hover:bg-purple-50 cursor-pointer">
              All Posts
            </Badge>
          </Link>
          {POST_CATEGORIES.map((category) => (
            <Link key={category.id} href={`/posts/category/${category.slug}`}>
              <Badge className={`${category.color} hover:opacity-80 cursor-pointer`}>{category.name}</Badge>
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts available at this time.</p>
          </div>
        )}
      </div>
    </div>
  )
}