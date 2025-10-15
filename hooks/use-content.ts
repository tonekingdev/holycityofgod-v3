"use client"

import { useState, useEffect, useCallback } from "react"

interface ServiceSchedule {
  name: string
  time: string
  description?: string
  service?: string
  [key: string]: unknown // Added index signature for compatibility
}

interface HeroSection {
  title: string
  subtitle: string
  description?: string
  content?: string
  backgroundImage?: string
  image?: string
  ctaText?: string
  ctaLink?: string
  name?: string // Added name property for PastorContent compatibility
  [key: string]: unknown // Added index signature for compatibility
}

interface GivingMethod {
  method: string
  description: string
  link: string
  [key: string]: unknown // Added index signature for compatibility
}

interface CoreValue {
  title: string
  description: string
  icon: string
  [key: string]: unknown // Added index signature for compatibility
}

interface ActionCard {
  icon: "Users" | "Heart" | "Phone"
  title: string
  description: string
  buttonText: string
  link: string
  [key: string]: unknown // Added index signature for compatibility
}

interface FeatureItem {
  icon: string
  title: string
  description: string
  link: string
  linkText: string
  [key: string]: unknown // Added index signature for compatibility
}

interface HomeContent {
  hero: HeroSection
  about: {
    title: string
    content: string
    image: string
    [key: string]: unknown
  }
  services: {
    title: string
    content: string
    schedule: ServiceSchedule[]
    [key: string]: unknown
  }
  featured: {
    title: string
    description1: string
    description2: string
    features: FeatureItem[]
    [key: string]: unknown
  }
  cta: {
    title: string
    subtitle: string
    verse: string
    actionCards: ActionCard[]
    finalCta: {
      text: string
      link: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  [key: string]: unknown // Added index signature for compatibility
}

interface GiveContent {
  hero: HeroSection
  methods: {
    title: string
    options: GivingMethod[]
    [key: string]: unknown
  }
  [key: string]: unknown // Added index signature for compatibility
}

interface PrayerContent {
  hero: HeroSection
  form: {
    title: string
    description: string
    [key: string]: unknown
  }
  [key: string]: unknown // Added index signature for compatibility
}

interface AboutSectionItem {
  title: string
  description: string
  icon: string
  href: string
  color: string
  [key: string]: unknown
}

interface PastorSection {
  title: string
  name: string
  image: string
  badge: string
  bio: string
  quote: string
  [key: string]: unknown
}

interface ContactInfo {
  title: string
  location: {
    title: string
    address: string
  }
  serviceTimes: {
    title: string
    times: string
  }
  contact: {
    title: string
    phone: string
    email: string
    description?: string
    hours?: string
    info?: {
      phone: string
      email: string
      hours: string
    }
  }
  ctaText: string
  [key: string]: unknown
}

interface VisionPoint {
  text: string
  [key: string]: unknown
}

interface VisionSection {
  title: string
  content: string
  icon: string
  [key: string]: unknown
}

interface FaithSection {
  title: string
  content: string
  verse: string
  icon: string
  [key: string]: unknown
}

interface AboutContent {
  hero: HeroSection
  story: {
    title: string
    content: string
    additionalContent: string[]
    [key: string]: unknown
  }
  sections: {
    title: string
    description: string
    items: AboutSectionItem[]
    [key: string]: unknown
  }
  pastor: PastorSection
  contact: ContactInfo
  [key: string]: unknown
}

interface CoreValuesContent {
  hero: HeroSection
  values: CoreValue[]
  callToAction: {
    title: string
    content: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface MissionContent {
  hero: HeroSection
  statement: {
    title: string
    content: string
    [key: string]: unknown
  }
  missionStatement: string
  vision: {
    title: string
    content: string
    description: string
    points: VisionPoint[]
    image: string
    verse: string
    quote: string
    [key: string]: unknown
  }
  visionPoints: VisionPoint[]
  visionExpounded: {
    title: string
    sections: VisionSection[]
    [key: string]: unknown
  }
  visionSections: VisionSection[]
  [key: string]: unknown
}

interface Ministry {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly leader: string
  readonly meetingTime: string
  readonly targetAudience: string
  readonly activities: readonly string[]
  readonly contact?: string
  [key: string]: unknown
}

interface OutreachProgram {
  name: string
  description: string
  impact?: string
  image?: string
  link?: string
  schedule?: string
  [key: string]: unknown
}

interface OurNetworkContent {
  hero: HeroSection
  ministries: {
    title: string
    description: string
    callToAction?: string
    items?: Ministry[] // Using Ministry type
    [key: string]: unknown
  }
  outreach: {
    title: string
    description: string
    programs: OutreachProgram[] // Using OutreachProgram type
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface ServicesContent {
  hero: HeroSection
  schedule?: {
    services: ServiceSchedule[]
    [key: string]: unknown
  }
  words: {
    hero: {
      title: string
      subtitle: string
      description: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface NewsContent {
  hero: HeroSection
  description: {
    title: string
    content: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface PostsContent {
  hero: HeroSection
  events: {
    title: string
    description: string
    [key: string]: unknown
  }
  news: NewsContent
  [key: string]: unknown
}

interface StatementOfFaithContent {
  hero: HeroSection
  faithSections: FaithSection[]
  chicagoStatement: {
    title: string
    content: string
    [key: string]: unknown
  }
  inerrancy: {
    title: string
    quotes: Array<{ quote?: string; text?: string; author: string }>
    [key: string]: unknown
  }
  inerrantSection: {
    title: string
    quotes: Array<{ quote?: string; text?: string; author: string }>
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface AllContent {
  home: HomeContent
  give: GiveContent
  prayer: PrayerContent
  about: AboutContent
  coreValues: CoreValuesContent
  mission: MissionContent
  pastor: PastorContent
  statementOfFaith: StatementOfFaithContent
  contact: {
    hero: HeroSection
    info: { title: string }
    hours: { title: string }
    location: { title: string; description: string }
    form: { title: string; description: string }
  }
  ourNetwork: OurNetworkContent
  services: ServicesContent
  posts: PostsContent
  news: NewsContent
}

type PageContent<T extends keyof AllContent> = AllContent[T]

interface ContentHook<T extends keyof AllContent> {
  content: PageContent<T>
  loading: boolean
  error: string | null
  updateContent: (page: string, newContent: Partial<PageContent<T>>) => Promise<void>
}

export function useContent<T extends keyof AllContent>(page: T): ContentHook<T> {
  const getDefaultContent = useCallback((): PageContent<T> => {
    const pageDefaults: Partial<AllContent> = {
      home: {
        hero: { title: "", subtitle: "", name: "" },
        about: { title: "", content: "", image: "" },
        services: { title: "", content: "", schedule: [] },
        featured: { title: "", description1: "", description2: "", features: [] },
        cta: {
          title: "",
          subtitle: "",
          verse: "",
          actionCards: [],
          finalCta: { text: "", link: "" },
        },
      },
      give: {
        hero: { title: "", subtitle: "", name: "" },
        methods: { title: "", options: [] },
      },
      prayer: {
        hero: { title: "", subtitle: "", name: "" },
        form: { title: "", description: "" },
      },
      about: {
        hero: { title: "", subtitle: "", name: "" },
        story: { title: "", content: "", additionalContent: [] },
        sections: { title: "", description: "", items: [] },
        pastor: { title: "", name: "", image: "", badge: "", bio: "", quote: "" },
        contact: {
          title: "",
          hero: { title: "", subtitle: "", name: "" },
          location: { title: "", address: "" },
          serviceTimes: { title: "", times: "" },
          contact: { title: "", phone: "", email: "" },
          ctaText: "",
        },
      },
      coreValues: {
        hero: { title: "", subtitle: "", name: "" },
        values: [],
        callToAction: { title: "", content: "" },
      },
      mission: {
        hero: { title: "", subtitle: "", name: "" },
        statement: { title: "", content: "" },
        missionStatement: "",
        vision: { title: "", content: "", description: "", points: [], image: "", verse: "", quote: "" },
        visionPoints: [],
        visionExpounded: { title: "", sections: [] },
        visionSections: [],
      },
      pastor: {
        hero: { title: "", subtitle: "", name: "" },
        bio: { title: "", content: "", image: "" },
        vision: { title: "", points: [] },
        location: { title: "", address: "" },
        serviceTimes: { title: "", times: "" },
        contact: { title: "", phone: "", email: "" },
        ctaText: "",
      },
      statementOfFaith: {
        hero: { title: "", subtitle: "", name: "" },
        faithSections: [],
        chicagoStatement: { title: "", content: "" },
        inerrancy: { title: "", quotes: [] },
        inerrantSection: { title: "", quotes: [] },
      },
      ourNetwork: {
        hero: { title: "", subtitle: "", name: "" },
        ministries: { title: "", description: "", callToAction: "" },
        outreach: { title: "", description: "", programs: [] },
      },
      contact: {
        hero: { title: "", subtitle: "", name: "" },
        info: { title: "" },
        hours: { title: "" },
        location: { title: "", description: "" },
        form: { title: "", description: "" },
      },
      services: {
        hero: { title: "", subtitle: "", name: "" },
        schedule: { services: [] },
        words: {
          hero: {
            title: "Words from God",
            subtitle: "Messages from our spiritual leaders",
            description: "Access sermons, teachings, and prophetic words shared during our services",
          },
        },
      },
      posts: {
        hero: { title: "", subtitle: "", name: "" },
        events: { title: "Upcoming Events", description: "Join us for special services and gatherings" },
        news: { hero: { title: "", subtitle: "" }, description: { title: "", content: "" } },
      },
      news: {
        hero: {
          title: "Church News",
          subtitle: "Stay informed about what's happening",
        },
        description: { title: "", content: "" },
      },
    }

    return (pageDefaults[page] || {}) as PageContent<T>
  }, [page]) // Empty dependency array since it doesn't depend on any props or state

  const [content, setContent] = useState<PageContent<T>>(getDefaultContent())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true)
      console.log("[Anointed Innovations] Fetching content for page:", page)
      console.log("[Anointed Innovations] Fetch URL:", `/api/content?page=${page}`)

      const response = await fetch(`/api/content?page=${page}`)
      console.log("[Anointed Innovations] Response status:", response.status)
      console.log("[Anointed Innovations] Response ok:", response.ok)
      console.log("[Anointed Innovations] Response headers:", Object.fromEntries(response.headers.entries()))

      // The API should be public and never return 401 for GET requests
      if (!response.ok) {
        console.warn(`[Anointed Innovations] Content API returned ${response.status} for page ${page}`)

        const responseText = await response.text()
        console.log("[Anointed Innovations] Response text:", responseText)

        // Try to parse the response anyway in case there's useful data
        try {
          const data = JSON.parse(responseText)
          console.log("[Anointed Innovations] Parsed error response data:", data)
          if (data.content && Object.keys(data.content).length > 0) {
            console.log("[Anointed Innovations] Using content from error response")
            setContent(data.content as PageContent<T>)
            setError(null)
            return
          }
        } catch (parseError) {
          console.warn("[Anointed Innovations] Could not parse error response:", parseError)
        }

        // If we can't get content from API, use defaults
        throw new Error(`Failed to fetch content: ${response.status}`)
      }

      const data = await response.json()
      console.log("[Anointed Innovations] Content data received, keys:", Object.keys(data.content || {}))
      console.log("[Anointed Innovations] Full content data:", JSON.stringify(data, null, 2))

      if (data.content && Object.keys(data.content).length > 0) {
        console.log("[Anointed Innovations] Setting content from API")
        setContent(data.content as PageContent<T>)
        setError(null)
      } else {
        console.warn(`[Anointed Innovations] Empty content received for page ${page}, using defaults`)
        setContent(getDefaultContent())
        setError(null)
      }
    } catch (err) {
      console.error(`[Anointed Innovations] Content fetch failed for page ${page}:`, err)
      console.error("[Anointed Innovations] Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err)))
      setContent(getDefaultContent())
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [page, getDefaultContent])

  const updateContent = async (page: string, newContent: Partial<PageContent<T>>) => {
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, content: newContent }),
      })

      if (!response.ok) {
        throw new Error("Failed to update content")
      }

      const data = await response.json()
      setContent(data.content as PageContent<T>)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update content")
      throw err
    }
  }

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  return { content, loading, error, updateContent }
}

export function useAdminContent() {
  const [content, setContent] = useState<AllContent>({} as AllContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/content")

      if (response.status === 401) {
        setError("Authentication required")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch content")
      }

      const data = await response.json()
      setContent(data.content as AllContent)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const updateContent = async (page: string, newContent: Partial<AllContent[keyof AllContent]>) => {
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, content: newContent }),
      })

      if (!response.ok) {
        throw new Error("Failed to update content")
      }

      fetchContent() // Refetch all content
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update content")
      throw err
    }
  }

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  return { content, loading, error, updateContent }
}

export type { Ministry, OutreachProgram }

interface Achievement {
  icon: string
  title: string
  description: string
  color: string
  [key: string]: unknown
}

interface Education {
  degree: string
  school: string
  focus: string
  icon: string
  [key: string]: unknown
}

interface BiographySection {
  title: string
  content: string
  icon: string
  quote?: string
  highlight?: string
  [key: string]: unknown
}

interface PastorContent {
  hero: HeroSection
  bio: {
    title: string
    content: string
    image: string
  }
  vision: {
    title: string
    points: VisionPoint[]
    verse?: string
    quote?: string
    description?: string
    content?: string
  }
  biography?: {
    title: string
    sections: BiographySection[]
  }
  achievements?: {
    title: string
    items: Achievement[]
  }
  education?: {
    title: string
    items: Education[]
  }
  calendar?: {
    title: string
    description: string
  }
  location: {
    title: string
    address: string
  }
  serviceTimes: {
    title: string
    times: string
  }
  contact: {
    title: string
    phone: string
    email: string
    description?: string
    hours?: string
    info?: {
      phone: string
      email: string
      hours: string
    }
  }
  ctaText: string
  [key: string]: unknown
}