import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getPostBySlug, formatDate } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User, Calendar } from "lucide-react"

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Ensure publishedAt is a Date object
  const publishedDate = typeof post.publishedAt === "string" ? new Date(post.publishedAt) : post.publishedAt

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/posts">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Posts
            </Button>
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              <Badge className={post.category.color}>{post.category.name}</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={publishedDate.toISOString()}>{formatDate(publishedDate)}</time>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
                {post.author.role && <span className="text-gray-400">• {post.author.role}</span>}
              </div>

              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>

            <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
              <Image src={post.featuredImage || "img/placeholder.jpg"} alt={post.title} fill className="object-cover" />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-a:hover:text-purple-800"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start gap-4">
              {post.author.avatar && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post.author.avatar || "/img/placeholder.jpg"}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{post.author.name}</h3>
                {post.author.role && <p className="text-gray-600">{post.author.role}</p>}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}