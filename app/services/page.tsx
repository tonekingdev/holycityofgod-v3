import type { Metadata } from "next"
import ServicesClient from "./ServicesClient"

export const metadata: Metadata = {
  title: "Services - Holy City of God Christian Fellowship",
  description: "Schedule of services and special meetings at Holy City of God Christian Fellowship.",
  keywords: "Services, Operation, Holy, City, of, God, Schedule, Worship",
}

export default function ServicesPage() {
  return <ServicesClient />
}
