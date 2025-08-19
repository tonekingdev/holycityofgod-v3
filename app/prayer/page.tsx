import type { Metadata } from "next"
import PrayerRequestClient from "./PrayerRequestClient"

export const metadata: Metadata = {
  title: "Prayer Request | Holy City of God Christian Fellowship",
  description:
    "Submit your prayer request to Holy City of God Christian Fellowship. Our prayer team will lift up your needs in prayer.",
  keywords: "prayer request, prayer, Holy City of God, Christian fellowship, Detroit, Warren, Michigan",
  openGraph: {
    title: "Prayer Request | Holy City of God Christian Fellowship",
    description:
      "Submit your prayer request to Holy City of God Christian Fellowship. Our prayer team will lift up your needs in prayer.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Prayer Request | Holy City of God Christian Fellowship",
    description:
      "Submit your prayer request to Holy City of God Christian Fellowship. Our prayer team will lift up your needs in prayer.",
  },
}

export default function PrayerRequestPage() {
  return <PrayerRequestClient />
}
