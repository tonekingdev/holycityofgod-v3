import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/types"
import { formatDate } from "@/lib/posts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  // Ensure publishedAt is a Date object
  const publishedDate = typeof post.publishedAt === "string" ? new Date(post.publishedAt) : post.publishedAt

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover-lift overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.featuredImage || "/img/placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className={post.category.color}>{post.category.name}</Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <time dateTime={publishedDate.toISOString()}>{formatDate(publishedDate)}</time>
          {post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{post.readingTime} min read</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
          <Link href={`/posts/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="h-3 w-3" />
            <span>By {post.author.name}</span>
          </div>

          <Link
            href={`/posts/${post.slug}`}
            className="text-primary hover:text-purple-800 font-medium text-sm hover:underline"
          >
            Read More
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}