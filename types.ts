// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "member" | "visitor"
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
}

export interface AuthUser extends User {
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

// Content Management Types
export interface ContentItem {
  id: string
  title: string
  content: string
  type: "announcement" | "sermon" | "event" | "news" | "page"
  status: "draft" | "published" | "archived"
  author: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  featuredImage?: string
  excerpt?: string
  tags?: string[]
  category?: string
}

export interface PageContent {
  id: string
  slug: string
  title: string
  content: string
  metaDescription?: string
  isPublished: boolean
  lastModified: Date
}

// Content Section Types
export type IconName =
  | 'heart' | 'users' | 'book' | 'pray'
  | 'clock' | 'calendar' | 'mappin'
  | 'lock' | 'exclamation-triangle' | 'user' | 'eye' | 'eye-slash' // Added for login page icons

export interface ContentValue {
  icon: IconName
  title: string
  description: string
}

export interface Mission {
  title: string
  description: string
}

export interface Service {
  name: string
  day: string
  time: string
  location: string
  description: string
}

export interface OnlineInfo {
  title: string
  description: string
  phone: string
  meetingId: string
  accessCode: string
}

export interface MinistryFocusItem {
  title: string
  description: string
}

export interface Pastor {
  image?: string
  name: string
  title: string
  bio: string[]
  ministryFocus?: MinistryFocusItem[]
}

export interface ContactInfo {
  icon: IconName
  label: string
  value: string | string[]
}

export interface AboutSection {
  type: 'about'
  title: string
  description?: string
  values?: ContentValue[]
  mission?: Mission
}

export interface ServicesSection {
  type: 'services'
  title: string
  description?: string
  services?: Service[]
  onlineInfo?: OnlineInfo
}

export interface PastorSection {
  type: 'pastor'
  title: string
  pastor: Pastor
}

export interface ContactSection {
  type: 'contact'
  title: string
  description?: string
  contactInfo?: ContactInfo[]
}

export type ContentSection = AboutSection | ServicesSection | PastorSection | ContactSection

export interface ContentPageResponse {
  success: boolean
  content: {
    sections: ContentSection[]
  }
}

// Form Data Types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type: string
}

export interface PrayerRequestData {
  id: number
  name: string
  email?: string
  phone?: string
  request: string
  date?: string
  category: "healing" | "guidance" | "thanksgiving" | "family" | "health" | "financial" | "other"
  status: "new"
  isUrgent: boolean
  isAnonymous: boolean
}

// New interface for Login Form Data
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Event and Sermon Types
export interface Event {
  id: string
  title: string
  description: string
  date: Date
  time: string
  location: string
  category: "worship" | "study" | "fellowship" | "outreach" | "youth" | "ministry"
  isRecurring: boolean
  recurringPattern?: "weekly" | "monthly" | "yearly"
  registrationRequired: boolean
  maxAttendees?: number
  currentAttendees: number
  featuredImage?: string
  contactPerson?: string
  contactEmail?: string
  contactPhone?: string
}

export interface Sermon {
  id: string
  title: string
  speaker: string
  date: Date
  scripture: string
  series?: string
  description: string
  audioUrl?: string
  videoUrl?: string
  transcript?: string
  notes?: string
  tags: string[]
  duration?: number
}

// Ministry Types
export interface Ministry {
  id: string
  name: string
  description: string
  leader: string
  leaderEmail?: string
  leaderPhone?: string
  meetingTime?: string
  meetingLocation?: string
  targetAudience: string
  isActive: boolean
  image?: string
  activities: string[]
  requirements?: string[]
}

// Navigation Types
export interface NavItem {
  name: string
  href: string
  icon?: string
  children?: NavItem[]
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// CMS Types
export interface CMSSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  serviceSchedule: {
    sunday: string[]
    wednesday?: string[]
    friday?: string[]
  }
  features: {
    onlineGiving: boolean
    eventRegistration: boolean
    memberPortal: boolean
    prayerRequests: boolean
    sermonArchive: boolean
  }
}

// Component Props Types
export interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  ctaText?: string
  ctaLink?: string
}

export interface CardProps {
  title: string
  content: string
  image?: string
  link?: string
  category?: string
  date?: Date
  author?: string
}

// Utility Types
export type Status = "active" | "inactive" | "pending" | "archived"
export type Priority = "low" | "normal" | "high" | "urgent"
export type Theme = "light" | "dark" | "system"

// Database Types (for future use)
export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl?: boolean
}

// Email Types
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
}

export interface EmailData {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

// Search Types
export interface SearchResult {
  id: string
  title: string
  content: string
  type: string
  url: string
  relevance: number
}

export interface SearchFilters {
  type?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  category?: string[]
  author?: string
}

// Posts types
export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  category: PostCategory
  author: PostAuthor
  publishedAt: Date
  updatedAt: Date
  status: "draft" | "published" | "archived"
  tags?: string[]
  readingTime?: number
  views?: number
  featured?: boolean
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
}

export interface PostAuthor {
  id?: string
  name: string
  role?: string
  avatar?: string
  bio?: string
  email?: string
  socialLinks?: {
    twitter?: string
    facebook?: string
    linkedin?: string
    website?: string
  }
}

export interface PostCategory {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  parentId?: string
  postCount?: number
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface PostTag {
  id: string
  name: string
  slug: string
  description?: string
  postCount?: number
  color?: string
}

export interface PostComment {
  id: string
  postId: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
  parentId?: string // For nested comments
  replies?: PostComment[]
}

export interface PostMeta {
  key: string
  value: string
}

export interface PostRevision {
  id: string
  postId: string
  title: string
  content: string
  excerpt: string
  authorId: string
  createdAt: Date
  changeNote?: string
}

// Predefined post categories for the church
export const POST_CATEGORIES: PostCategory[] = [
  {
    id: "1",
    name: "Faith",
    slug: "faith",
    color: "bg-yellow-500 text-white",
    description: "Posts about faith and spiritual growth",
    isActive: true,
    postCount: 0,
  },
  {
    id: "2",
    name: "Prayer",
    slug: "prayer",
    color: "bg-yellow-500 text-white",
    description: "Prayer insights and guidance",
    isActive: true,
    postCount: 0,
  },
  {
    id: "3",
    name: "Service",
    slug: "service",
    color: "bg-yellow-500 text-white",
    description: "Community service and outreach",
    isActive: true,
    postCount: 0,
  },
  {
    id: "4",
    name: "Worship",
    slug: "worship",
    color: "bg-purple-600 text-white",
    description: "Worship and praise",
    isActive: true,
    postCount: 0,
  },
  {
    id: "5",
    name: "Community",
    slug: "community",
    color: "bg-green-600 text-white",
    description: "Church community and fellowship",
    isActive: true,
    postCount: 0,
  },
  {
    id: "6",
    name: "Youth",
    slug: "youth",
    color: "bg-blue-600 text-white",
    description: "Youth ministry and activities",
    isActive: true,
    postCount: 0,
  },
  {
    id: "7",
    name: "Events",
    slug: "events",
    color: "bg-indigo-600 text-white",
    description: "Church events and announcements",
    isActive: true,
    postCount: 0,
  },
  {
    id: "8",
    name: "Testimonies",
    slug: "testimonies",
    color: "bg-pink-600 text-white",
    description: "Personal testimonies and stories",
    isActive: true,
    postCount: 0,
  },
  {
    id: "9",
    name: "Bible Study",
    slug: "bible-study",
    color: "bg-teal-600 text-white",
    description: "Bible study materials and insights",
    isActive: true,
    postCount: 0,
  },
  {
    id: "10",
    name: "Announcements",
    slug: "announcements",
    color: "bg-orange-600 text-white",
    description: "Important church announcements",
    isActive: true,
    postCount: 0,
  },
]

// Common post tags
export const POST_TAGS: PostTag[] = [
  { id: "1", name: "Faith", slug: "faith", color: "bg-blue-100 text-blue-800", postCount: 0 },
  { id: "2", name: "Prayer", slug: "prayer", color: "bg-green-100 text-green-800", postCount: 0 },
  { id: "3", name: "Community", slug: "community", color: "bg-purple-100 text-purple-800", postCount: 0 },
  { id: "4", name: "Worship", slug: "worship", color: "bg-yellow-100 text-yellow-800", postCount: 0 },
  { id: "5", name: "Service", slug: "service", color: "bg-red-100 text-red-800", postCount: 0 },
  { id: "6", name: "Youth", slug: "youth", color: "bg-indigo-100 text-indigo-800", postCount: 0 },
  { id: "7", name: "Family", slug: "family", color: "bg-pink-100 text-pink-800", postCount: 0 },
  { id: "8", name: "Ministry", slug: "ministry", color: "bg-teal-100 text-teal-800", postCount: 0 },
  { id: "9", name: "Outreach", slug: "outreach", color: "bg-orange-100 text-orange-800", postCount: 0 },
  { id: "10", name: "Discipleship", slug: "discipleship", color: "bg-gray-100 text-gray-800", postCount: 0 },
]

// Post status options
export const POST_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
  { value: "published", label: "Published", color: "bg-green-100 text-green-800" },
  { value: "archived", label: "Archived", color: "bg-yellow-100 text-yellow-800" },
] as const

// Post sorting options
export const POST_SORT_OPTIONS = [
  { value: "publishedAt-desc", label: "Newest First" },
  { value: "publishedAt-asc", label: "Oldest First" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "views-desc", label: "Most Popular" },
  { value: "readingTime-asc", label: "Quick Reads" },
  { value: "readingTime-desc", label: "Long Reads" },
] as const

// Post filters interface
export interface PostFilters {
  category?: string
  tag?: string
  author?: string
  status?: Post["status"]
  featured?: boolean
  dateFrom?: Date
  dateTo?: Date
  search?: string
  sortBy?: (typeof POST_SORT_OPTIONS)[number]["value"]
  limit?: number
  offset?: number
}

// Post creation/update payload
export interface CreatePostPayload {
  title: string
  slug?: string
  excerpt: string
  content: string
  featuredImage?: string
  categoryId: string
  authorId: string
  status: Post["status"]
  tags?: string[]
  featured?: boolean
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
  publishedAt?: Date
}

export interface UpdatePostPayload extends Partial<CreatePostPayload> {
  id: string
}

// API response types
export interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PostResponse {
  post: Post
  relatedPosts?: Post[]
  comments?: PostComment[]
}

// Search result type
export interface PostSearchResult {
  id: string
  title: string
  excerpt: string
  slug: string
  category: PostCategory
  author: PostAuthor
  publishedAt: Date
  relevanceScore: number
  highlightedContent?: string
}

// Analytics types
export interface PostAnalytics {
  postId: string
  views: number
  uniqueViews: number
  averageReadTime: number
  bounceRate: number
  socialShares: {
    facebook: number
    twitter: number
    linkedin: number
    email: number
  }
  topReferrers: Array<{
    source: string
    visits: number
  }>
  readingProgress: {
    "25%": number
    "50%": number
    "75%": number
    "100%": number
  }
}

// Content management types
export interface PostSchedule {
  id: string
  postId: string
  scheduledFor: Date
  status: "pending" | "published" | "failed"
  createdAt: Date
  error?: string
}

export interface PostSeries {
  id: string
  name: string
  slug: string
  description?: string
  featuredImage?: string
  posts: Post[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Export utility type for post status
export type PostStatus = Post["status"]

// Export utility type for sort options
export type PostSortOption = (typeof POST_SORT_OPTIONS)[number]["value"]

