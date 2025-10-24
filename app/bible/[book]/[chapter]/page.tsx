import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BibleChapterView from "@/components/bible/bible-chapter-view"
import { BIBLE_BOOKS } from "@/lib/bible-data"

type Props = {
  params: Promise<{ book: string; chapter: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await the params
  const resolvedParams = await params
  const bookName = decodeURIComponent(resolvedParams.book)
  const chapter = resolvedParams.chapter

  return {
    title: `${bookName} ${chapter} - KJV Bible - Holy City of God`,
    description: `Read ${bookName} chapter ${chapter} from the King James Version Bible.`,
  }
}

export default async function BibleChapterPage({ params }: Props) {
  // Await the params
  const resolvedParams = await params
  const bookName = decodeURIComponent(resolvedParams.book)
  const chapter = Number.parseInt(resolvedParams.chapter)

  // Validate book exists
  const book = BIBLE_BOOKS.find((b) => b.name.toLowerCase() === bookName.toLowerCase())
  if (!book || chapter < 1 || chapter > book.chapters) {
    notFound()
  }

  return <BibleChapterView book={bookName} chapter={chapter} />
}