import type { Metadata } from "next"
import BibleStudyApp from "@/components/bible/bible-study-app"

export const metadata: Metadata = {
  title: "Bible Study - Holy City of God",
  description:
    "Study the King James Version Bible with Holy City of God. Search scriptures, read daily verses, and grow in your faith.",
}

export default function BiblePage() {
  return <BibleStudyApp />
}