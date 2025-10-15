import type { Metadata } from "next"
import ContactClient from "./ContactClient"
import { CHURCH_INFO } from "@/constants"

export const metadata: Metadata = {
  title: `Contact Us - ${CHURCH_INFO.name}`,
  description: `Get in touch with ${CHURCH_INFO.name}. Send us a message, find our location, or view our office hours. We'd love to hear from you.`,
}

export default function ContactPage() {
  return <ContactClient />
}
