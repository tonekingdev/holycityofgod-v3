// Popular verses that are meaningful and appropriate for daily inspiration
const POPULAR_VERSES = [
  { book: "John", chapter: 3, verse: 16 },
  { book: "Psalms", chapter: 23, verse: 1 },
  { book: "Proverbs", chapter: 3, verse: 5 },
  { book: "Romans", chapter: 8, verse: 28 },
  { book: "Philippians", chapter: 4, verse: 13 },
  { book: "Isaiah", chapter: 40, verse: 31 },
  { book: "Matthew", chapter: 6, verse: 33 },
  { book: "Jeremiah", chapter: 29, verse: 11 },
  { book: "2 Timothy", chapter: 1, verse: 7 },
  { book: "1 Corinthians", chapter: 13, verse: 4 },
  { book: "Psalms", chapter: 46, verse: 1 },
  { book: "Joshua", chapter: 1, verse: 9 },
  { book: "Proverbs", chapter: 16, verse: 3 },
  { book: "Romans", chapter: 12, verse: 2 },
  { book: "Ephesians", chapter: 2, verse: 8 },
  { book: "Colossians", chapter: 3, verse: 23 },
  { book: "Hebrews", chapter: 11, verse: 1 },
  { book: "James", chapter: 1, verse: 5 },
  { book: "1 Peter", chapter: 5, verse: 7 },
  { book: "Revelation", chapter: 21, verse: 4 },
  { book: "Matthew", chapter: 5, verse: 16 },
  { book: "John", chapter: 14, verse: 6 },
  { book: "Psalms", chapter: 119, verse: 105 },
  { book: "Proverbs", chapter: 22, verse: 6 },
  { book: "Isaiah", chapter: 41, verse: 10 },
  { book: "Matthew", chapter: 11, verse: 28 },
  { book: "Romans", chapter: 5, verse: 8 },
  { book: "Galatians", chapter: 5, verse: 22 },
  { book: "Philippians", chapter: 4, verse: 6 },
  { book: "1 John", chapter: 4, verse: 19 },
] as const

/**
 * Generate a consistent random index based on the current date
 * Same date = same verse all day
 */
export function getDailyVerseIndex(): number {
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

  // Simple hash function to convert date string to number
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get index within range
  return Math.abs(hash) % POPULAR_VERSES.length
}

/**
 * Get today's verse reference
 */
export function getTodaysVerse() {
  const index = getDailyVerseIndex()
  return POPULAR_VERSES[index]
}

/**
 * Format verse reference for display
 */
export function formatVerseReference(book: string, chapter: number, verse: number): string {
  return `${book} ${chapter}:${verse}`
}