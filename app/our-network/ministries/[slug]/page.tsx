import type { Metadata } from "next"
import MinistryDetailClient from "@/components/MinistryDetailClient"

export const metadata: Metadata = {
  title: "Ministry | Holy City of God",
  description: "Learn more about our ministry departments and how you can get involved",
}

export default async function MinistryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <MinistryDetailClient slug={slug} />
}