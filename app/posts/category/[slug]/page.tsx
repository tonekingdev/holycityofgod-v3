import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostsByCategory } from "@/lib/posts"
import { POST_CATEGORIES } from "@/types"
import { PostCard } from "@/components/posts/post-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = POST_CATEGORIES.find((cat) => cat.slug === params.slug)

  if (!category) {
    notFound()
  }

  const posts = await getPostsByCategory(params.slug)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/posts">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Posts
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{category.name} Posts</h1>
          {category.description && <p className="text-xl text-gray-600 max-w-2xl mx-auto">{category.description}</p>}
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
            <p className="text-gray-500 text-lg">No posts in the {category.name} category yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}