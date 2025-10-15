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
  type: "announcement" | "word" | "event" | "news" | "page"
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
  | "heart"
  | "users"
  | "book"
  | "pray"
  | "clock"
  | "calendar"
  | "mappin"
  | "lock"
  | "exclamation-triangle"
  | "user"
  | "eye"
  | "eye-slash" // Added for login page icons
  | "megaphone" // Added for announcement type icons
  | "star" // Added for announcement type icons

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
  type: "about"
  title: string
  description?: string
  values?: ContentValue[]
  mission?: Mission
}

export interface ServicesSection {
  type: "services"
  title: string
  description?: string
  services?: Service[]
  onlineInfo?: OnlineInfo
}

export interface PastorSection {
  type: "pastor"
  title: string
  pastor: Pastor
}

export interface ContactSection {
  type: "contact"
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
  email: string
  password: string
  rememberMe: boolean
}

// Event and Word Types
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
    wordArchive: boolean
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

// Announcement Types
export interface Announcement {
  id: string
  title: string
  content: string
  excerpt?: string
  type: "event" | "service" | "general" | "urgent" | "celebration" | "ministry"
  priority: Priority
  status: "draft" | "published" | "archived" | "scheduled"
  author_id: string
  author_name: string
  author_role?: string
  church_id?: string
  target_audience: "all" | "members" | "leadership" | "ministry" | "youth" | "adults"
  featured_image?: string
  expires_at?: Date | string
  scheduled_for?: Date | string
  is_pinned: boolean
  is_featured: boolean
  view_count: number
  like_count: number
  share_count: number
  tags?: string[]
  metadata?: {
    event_date?: Date | string
    event_location?: string
    contact_person?: string
    contact_phone?: string
    contact_email?: string
    registration_required?: boolean
    max_attendees?: number
    cost?: number
    [key: string]: unknown
  }
  created_at: Date | string
  updated_at: Date | string
  published_at?: Date | string
}

export interface CreateAnnouncementPayload {
  title: string
  content: string
  excerpt?: string
  type: Announcement["type"]
  priority?: Priority
  status?: Announcement["status"]
  published_at?: Date | string | null
  target_audience?: Announcement["target_audience"]
  featured_image?: string
  expires_at?: Date | string
  scheduled_for?: Date | string
  is_pinned?: boolean
  is_featured?: boolean
  tags?: string[]
  metadata?: Announcement["metadata"]
}

export interface UpdateAnnouncementPayload extends Partial<CreateAnnouncementPayload> {
  id: string
  status?: Announcement["status"]
}

export interface AnnouncementFilters {
  type?: Announcement["type"] | "all"
  priority?: Priority | "all"
  status?: Announcement["status"] | "all"
  category?: Announcement["type"] | "all" // Alias for type
  target_audience?: Announcement["target_audience"]
  author_id?: string
  church_id?: string
  is_pinned?: boolean
  is_featured?: boolean
  is_active?: boolean // Not expired
  search?: string
  tags?: string[]
  date_from?: Date | string
  date_to?: Date | string
  sort_by?: "created_at-desc" | "created_at-asc" | "priority-desc" | "expires_at-asc" | "title-asc" | "title-desc"
  limit?: number
  offset?: number
}

export interface AnnouncementsResponse {
  success: boolean
  announcements: Announcement[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface AnnouncementResponse {
  success: boolean
  announcement: Announcement
}

export interface AnnouncementInteraction {
  id: string
  announcement_id: string
  user_id?: string
  interaction_type: "view" | "like" | "share" | "click"
  ip_address?: string
  user_agent?: string
  created_at: Date | string
}

// Announcement constants
export const ANNOUNCEMENT_TYPES = [
  { value: "event", label: "Event", color: "bg-blue-500 text-white", icon: "calendar" },
  { value: "service", label: "Service", color: "bg-purple-500 text-white", icon: "clock" },
  { value: "general", label: "General", color: "bg-gray-500 text-white", icon: "megaphone" },
  { value: "urgent", label: "Urgent", color: "bg-red-500 text-white", icon: "exclamation-triangle" },
  { value: "celebration", label: "Celebration", color: "bg-yellow-500 text-white", icon: "star" },
  { value: "ministry", label: "Ministry", color: "bg-green-500 text-white", icon: "users" },
] as const

export const ANNOUNCEMENT_PRIORITIES = [
  { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
  { value: "normal", label: "Normal", color: "bg-blue-100 text-blue-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
] as const

export const ANNOUNCEMENT_TARGET_AUDIENCES = [
  { value: "all", label: "Everyone", description: "All website visitors" },
  { value: "members", label: "Members", description: "Church members only" },
  { value: "leadership", label: "Leadership", description: "Church leadership team" },
  { value: "ministry", label: "Ministry", description: "Ministry leaders and volunteers" },
  { value: "youth", label: "Youth", description: "Youth and young adults" },
  { value: "adults", label: "Adults", description: "Adult members" },
] as const

export const ANNOUNCEMENT_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
  { value: "published", label: "Published", color: "bg-green-100 text-green-800" },
  { value: "scheduled", label: "Scheduled", color: "bg-blue-100 text-blue-800" },
  { value: "archived", label: "Archived", color: "bg-yellow-100 text-yellow-800" },
] as const

// Export utility types for announcements
export type AnnouncementType = Announcement["type"]
export type AnnouncementStatus = Announcement["status"]
export type AnnouncementTargetAudience = Announcement["target_audience"]

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

// Posts types - Updated to handle both Date objects and strings
export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  category: PostCategory
  author: PostAuthor
  publishedAt: Date | string
  updatedAt: Date | string
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
    color: "bg-teal-600 text-teal-800",
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

// Post sorting options - Fixed to include all valid combinations
export const POST_SORT_OPTIONS = [
  { value: "publishedAt-desc", label: "Newest First" },
  { value: "publishedAt-asc", label: "Oldest First" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "views-desc", label: "Most Popular" },
  { value: "views-asc", label: "Least Popular" },
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

// Word types
export interface Word {
  id: string
  title: string
  description?: string
  speaker_id: string
  speaker_name: string
  speaker_title?: string
  speaker?: {
    id: string
    name: string
    title?: string
    avatar?: string
    bio?: string
  }
  church_id: string
  church?: {
    id: string
    name: string
    code: string
    city?: string
    state?: string
  }
  word_date: Date | string
  service_type: string
  series_name?: string
  series_part?: number
  scripture_reference?: string
  key_points?: string[]
  audio_url?: string
  video_url?: string
  slides_url?: string
  notes_url?: string
  transcript?: string
  summary?: string
  tags?: string[]
  duration?: number
  is_featured: boolean
  is_live: boolean
  live_shared_at?: Date | string
  download_count: number
  view_count: number
  like_count: number
  share_count: number
  status: "draft" | "published" | "archived" | "live"
  visibility: "public" | "members" | "leadership"
  created_by: string
  approved_by?: string
  approved_at?: Date | string
  created_at: Date | string
  updated_at: Date | string
}

export interface WordSharingSession {
  id: string
  word_id: string
  church_id: string
  session_name?: string
  shared_by: string
  shared_by_name?: string
  shared_at: Date | string
  session_start_time?: Date | string
  session_end_time?: Date | string
  attendee_count: number
  notes?: string
  feedback?: {
    rating?: number
    comments?: string
    suggestions?: string
    would_recommend?: boolean
    [key: string]: unknown
  }
  is_recorded: boolean
  recording_url?: string
  created_at: Date | string
}

export interface WordInteraction {
  id: string
  word_id: string
  user_id?: string
  interaction_type: "view" | "like" | "share" | "download" | "comment" | "bookmark"
  ip_address?: string
  user_agent?: string
  created_at: Date | string
}

export interface WordComment {
  id: string
  word_id: string
  user_id?: string
  commenter_name?: string
  commenter_email?: string
  comment: string
  parent_comment_id?: string
  is_approved: boolean
  approved_by?: string
  approved_at?: Date | string
  is_featured: boolean
  created_at: Date | string
  updated_at: Date | string
  replies?: WordComment[]
}

export interface CreateWordPayload {
  title: string
  description?: string
  church_id: string
  word_date: Date | string
  service_type: string
  series_name?: string
  series_part?: number
  scripture_reference?: string
  key_points?: string[]
  audio_url?: string
  video_url?: string
  slides_url?: string
  notes_url?: string
  transcript?: string
  summary?: string
  tags?: string[]
  duration?: number
  is_featured?: boolean
  status?: Word["status"]
  visibility?: Word["visibility"]
}

export interface UpdateWordPayload extends Partial<CreateWordPayload> {
  id: string
}

export interface WordFilters {
  church_id?: string
  speaker_id?: string
  status?: Word["status"]
  is_live?: boolean
  is_featured?: boolean
  service_type?: string
  series_name?: string
  date_from?: Date
  date_to?: Date
  search?: string
  tags?: string[]
  sort_by?: "word_date-desc" | "word_date-asc" | "title-asc" | "title-desc" | "view_count-desc" | "like_count-desc"
  limit?: number
  offset?: number
}

export interface WordsResponse {
  words: Word[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface WordResponse {
  word: Word
  sessions?: WordSharingSession[]
  comments?: WordComment[]
  related_words?: Word[]
}

// Calendar System Types
export interface CalendarType {
  id: string
  name: string
  description?: string
  level: "network" | "church" | "ministry" | "personal"
  default_visibility: "public" | "members" | "leadership" | "private"
  can_share_across_churches: boolean
  created_at: Date | string
  updated_at: Date | string
}

export interface Calendar {
  id: string
  name: string
  description?: string
  calendar_type_id: string
  calendar_type?: CalendarType
  owner_church_id?: string
  owner_user_id?: string
  owner_ministry_id?: string
  church_name?: string
  owner_name?: string
  ministry_name?: string
  color_code: string
  is_active: boolean
  is_default: boolean
  settings?: {
    notifications?: boolean
    auto_sync?: boolean
    default_duration?: number
    reminder_minutes?: number[]
    visibility?: "public" | "private" | "church_only"
    [key: string]: unknown
  }
  created_by: string
  created_at: Date | string
  updated_at: Date | string
}

export interface CalendarEvent {
  id: string
  calendar_id: string
  calendar?: Calendar
  church_id?: string
  title: string
  description?: string
  event_date: Date | string
  start_time?: string
  end_time?: string
  location?: string
  address?: string
  event_category:
    | "service"
    | "meeting"
    | "convention"
    | "outreach"
    | "fellowship"
    | "training"
    | "conference"
    | "special"
  event_type?: string
  recurrence_pattern?: RecurrencePattern
  parent_event_id?: string
  is_network_event: boolean
  requires_approval: boolean
  approval_status: "pending" | "first_approved" | "final_approved" | "rejected"
  first_approved_by?: string
  first_approved_at?: Date | string
  final_approved_by?: string
  final_approved_at?: Date | string
  rejection_reason?: string
  max_attendees?: number
  current_attendees: number
  registration_required: boolean
  registration_deadline?: Date | string
  cost: number
  contact_person?: string
  contact_phone?: string
  contact_email?: string
  featured_image?: string
  reminder_settings?: ReminderSettings
  external_calendar_sync: boolean
  zoom_link?: string
  meeting_password?: string
  materials_url?: string
  livestream_url?: string
  status: "draft" | "published" | "cancelled"
  visibility: "public" | "members" | "leadership"
  created_by: string
  created_at: Date | string
  updated_at: Date | string
}

export interface RecurrencePattern {
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  interval: number
  days_of_week?: number[] // 0-6, Sunday = 0
  day_of_month?: number
  week_of_month?: number
  month_of_year?: number
  end_date?: Date | string
  occurrence_count?: number
}

export interface ReminderSettings {
  email_reminders: boolean
  sms_reminders: boolean
  reminder_times: number[] // Minutes before event
  custom_message?: string
}

export interface CalendarPermission {
  id: string
  calendar_id: string
  calendar?: Calendar
  granted_to_church_id?: string
  granted_to_user_id?: string
  granted_to_role_id?: string
  granted_to?: string // Display name
  permission_type: "view" | "create" | "edit" | "delete" | "admin"
  granted_by: string
  expires_at?: Date | string
  is_active: boolean
  created_at: Date | string
  updated_at: Date | string
}

export interface EventAttendee {
  id: string
  event_id: string
  user_id?: string
  attendee_name: string
  attendee_email?: string
  attendee_phone?: string
  church_id?: string
  church_name?: string
  attendance_status: "invited" | "maybe" | "attending" | "not_attending" | "attended" | "no_show"
  role_at_event?: string
  special_requirements?: string
  registered_at: Date | string
  response_at?: Date | string
  checked_in_at?: Date | string
  notes?: string
  created_at: Date | string
  updated_at: Date | string
}

export interface PersonalCalendarSync {
  id: string
  user_id: string
  calendar_provider: "google" | "outlook" | "apple" | "yahoo" | "other"
  provider_calendar_id: string
  calendar_name?: string
  sync_direction: "import_only" | "export_only" | "bidirectional"
  sync_frequency: "real_time" | "hourly" | "daily" | "manual"
  last_sync_at?: Date | string
  sync_status: "active" | "error" | "paused" | "disconnected"
  sync_settings?: {
    include_past_events?: boolean
    sync_reminders?: boolean
    sync_attendees?: boolean
    conflict_resolution?: "local_wins" | "remote_wins" | "manual"
    [key: string]: unknown
  }
  error_message?: string
  is_primary: boolean
  created_at: Date | string
  updated_at: Date | string
}

export interface PersonalAvailability {
  id: string
  user_id: string
  date: Date | string
  start_time: string
  end_time: string
  availability_type: "busy" | "free" | "tentative" | "out_of_office"
  title?: string
  source: "manual" | "google" | "outlook" | "apple" | "church_event"
  source_event_id?: string
  is_private: boolean
  notes?: string
  created_at: Date | string
  updated_at: Date | string
}

export interface CalendarSharingSession {
  id: string
  calendar_id: string
  shared_with_church_id?: string
  shared_with_user_id?: string
  session_name?: string
  shared_by: string
  share_type: "temporary" | "permanent" | "event_specific"
  start_date?: Date | string
  end_date?: Date | string
  permissions?: {
    can_view?: boolean
    can_edit?: boolean
    can_delete?: boolean
    can_create?: boolean
    can_share?: boolean
    [key: string]: unknown
  }
  access_count: number
  last_accessed_at?: Date | string
  is_active: boolean
  created_at: Date | string
  updated_at: Date | string
}

export interface EventConflict {
  id: string
  event_id: string
  conflicting_event_id?: string
  user_id?: string
  conflict_type: "time_overlap" | "resource_conflict" | "person_conflict" | "location_conflict"
  conflict_severity: "minor" | "major" | "critical"
  description?: string
  resolution_status: "unresolved" | "acknowledged" | "resolved" | "ignored"
  resolved_by?: string
  resolved_at?: Date | string
  resolution_notes?: string
  created_at: Date | string
  updated_at: Date | string
}

// Calendar API Payload Types
export interface CreateCalendarPayload {
  name: string
  description?: string
  calendar_type_id: string
  owner_church_id?: string
  owner_ministry_id?: string
  color_code?: string
  settings?: {
    notifications?: boolean
    auto_sync?: boolean
    default_duration?: number
    reminder_minutes?: number[]
    visibility?: "public" | "private" | "church_only"
    [key: string]: unknown
  }
}

export interface UpdateCalendarPayload extends Partial<CreateCalendarPayload> {
  id: string
  is_active?: boolean
}

export interface CreateEventPayload {
  calendar_id: string
  title: string
  description?: string
  event_date: Date | string
  start_time?: string
  end_time?: string
  location?: string
  address?: string
  event_category?: CalendarEvent["event_category"]
  visibility?: CalendarEvent["visibility"]
  max_attendees?: number
  registration_required?: boolean
  registration_deadline?: Date | string
  cost?: number
  contact_person?: string
  contact_phone?: string
  contact_email?: string
  zoom_link?: string
  materials_url?: string
  recurrence_pattern?: RecurrencePattern
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {
  id: string
  status?: CalendarEvent["status"]
}

export interface EventRSVPPayload {
  attendance_status: EventAttendee["attendance_status"]
  special_requirements?: string
  attendee_name?: string
  attendee_email?: string
  attendee_phone?: string
}

export interface CalendarPermissionPayload {
  calendar_id: string
  granted_to_church_id?: string
  granted_to_user_id?: string
  granted_to_role_id?: string
  permission_type: CalendarPermission["permission_type"]
  expires_at?: Date | string
}

// Calendar Filter Types
export interface CalendarFilters {
  church_id?: string
  calendar_type?: CalendarType["level"]
  include_shared?: boolean
  is_active?: boolean
}

export interface EventFilters {
  calendar_id?: string
  church_id?: string
  start_date?: Date | string
  end_date?: Date | string
  event_category?: CalendarEvent["event_category"]
  visibility?: CalendarEvent["visibility"]
  network_only?: boolean
  status?: CalendarEvent["status"]
  search?: string
  limit?: number
  offset?: number
}

// Calendar Response Types
export interface CalendarsResponse {
  success: boolean
  calendars: Calendar[]
}

export interface CalendarResponse {
  success: boolean
  calendar: Calendar
}

export interface EventsResponse {
  success: boolean
  events: CalendarEvent[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface EventResponse {
  success: boolean
  event: CalendarEvent
  attendees?: EventAttendee[]
  conflicts?: EventConflict[]
}

export interface CalendarPermissionsResponse {
  success: boolean
  permissions: CalendarPermission[]
}

export interface AvailabilityResponse {
  success: boolean
  availability: PersonalAvailability[]
  conflicts?: EventConflict[]
}

// Calendar View Types
export interface CalendarView {
  type: "month" | "week" | "day" | "agenda"
  start_date: Date
  end_date: Date
  selected_calendars: string[]
  show_conflicts: boolean
  show_availability: boolean
}

export interface CalendarDisplayEvent extends CalendarEvent {
  calendar_color: string
  calendar_name: string
  is_conflict: boolean
  attendee_status?: EventAttendee["attendance_status"]
  can_edit: boolean
  can_delete: boolean
}

// Calendar Integration Types
export interface ExternalCalendarProvider {
  name: string
  type: PersonalCalendarSync["calendar_provider"]
  auth_url: string
  scopes: string[]
  client_id: string
  supports_sync: boolean
  supports_webhooks: boolean
}

export interface CalendarSyncResult {
  success: boolean
  events_imported: number
  events_exported: number
  conflicts_detected: number
  errors: string[]
  last_sync: Date
}

// Calendar Statistics Types
export interface CalendarStats {
  total_calendars: number
  total_events: number
  upcoming_events: number
  network_events: number
  church_events: number
  personal_events: number
  total_attendees: number
  sync_status: {
    active: number
    errors: number
    paused: number
  }
}

// Export calendar-related constants
export const CALENDAR_LEVELS = [
  { value: "network", label: "Network", description: "Fellowship-wide calendar" },
  { value: "church", label: "Church", description: "Individual church calendar" },
  { value: "ministry", label: "Ministry", description: "Ministry-specific calendar" },
  { value: "personal", label: "Personal", description: "Personal ministry calendar" },
] as const

export const EVENT_CATEGORIES = [
  { value: "service", label: "Service", color: "bg-blue-500" },
  { value: "meeting", label: "Meeting", color: "bg-green-500" },
  { value: "convention", label: "Convention", color: "bg-purple-500" },
  { value: "outreach", label: "Outreach", color: "bg-orange-500" },
  { value: "fellowship", label: "Fellowship", color: "bg-pink-500" },
  { value: "training", label: "Training", color: "bg-indigo-500" },
  { value: "conference", label: "Conference", color: "bg-red-500" },
  { value: "special", label: "Special Event", color: "bg-yellow-500" },
] as const

export const ATTENDANCE_STATUSES = [
  { value: "invited", label: "Invited", color: "bg-gray-100 text-gray-800" },
  { value: "maybe", label: "Maybe", color: "bg-yellow-100 text-yellow-800" },
  { value: "attending", label: "Attending", color: "bg-green-100 text-green-800" },
  { value: "not_attending", label: "Not Attending", color: "bg-red-100 text-red-800" },
  { value: "attended", label: "Attended", color: "bg-blue-100 text-blue-800" },
  { value: "no_show", label: "No Show", color: "bg-gray-100 text-gray-800" },
] as const

export const PERMISSION_TYPES = [
  { value: "view", label: "View Only", description: "Can view calendar and events" },
  { value: "create", label: "Create", description: "Can create new events" },
  { value: "edit", label: "Edit", description: "Can edit existing events" },
  { value: "delete", label: "Delete", description: "Can delete events" },
  { value: "admin", label: "Admin", description: "Full calendar management" },
] as const

// Export utility types
export type CalendarLevel = CalendarType["level"]
export type EventCategory = CalendarEvent["event_category"]
export type AttendanceStatus = EventAttendee["attendance_status"]
export type PermissionType = CalendarPermission["permission_type"]
export type CalendarProvider = PersonalCalendarSync["calendar_provider"]

// Approval workflow types for event approval system
export interface EventApproval {
  id: string
  event_id: string
  approver_email: string
  approver_name: string
  approval_level: "first" | "final"
  status: "pending" | "approved" | "rejected"
  comments?: string
  approved_at?: Date | string
  created_at: Date | string
  updated_at: Date | string
}

export interface ApprovalWorkflow {
  first_approver: {
    name: "First Lady Kiana King"
    email: "ck@holycityofgod.org"
  }
  final_approver: {
    name: "Bishop Anthony King"
    email: "pastor@holycityofgod.org"
  }
  main_church: {
    name: "Holy City of God Christian Fellowship Inc."
    address: "16606 James Couzens Fwy, Detroit, MI 48221"
  }
}

export interface ApprovalNotification {
  id: string
  event_id: string
  recipient_email: string
  recipient_name: string
  notification_type: "approval_request" | "approval_granted" | "approval_rejected" | "final_approval"
  sent_at?: Date | string
  read_at?: Date | string
  created_at: Date | string
}

export const APPROVAL_WORKFLOW = {
  FIRST_APPROVER: {
    name: "First Lady Kiana King",
    email: "ck@holycityofgod.org",
    level: "first" as const,
  },
  FINAL_APPROVER: {
    name: "Bishop Anthony King",
    email: "pastor@holycityofgod.org",
    level: "final" as const,
  },
  MAIN_CHURCH: {
    name: "Holy City of God Christian Fellowship Inc.",
    address: "16606 James Couzens Fwy, Detroit, MI 48221",
  },
} as const

export const APPROVAL_STATUSES = [
  { value: "pending", label: "Pending Approval", color: "bg-yellow-100 text-yellow-800" },
  { value: "first_approved", label: "First Approved", color: "bg-blue-100 text-blue-800" },
  { value: "final_approved", label: "Final Approved", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
] as const

export type ApprovalLevel = EventApproval["approval_level"]
export type ApprovalStatus = EventApproval["status"]
export type EventApprovalStatus = CalendarEvent["approval_status"]

// Church interface
export interface Church {
  id: string
  name: string
  code: string
  city?: string
  state?: string
  address?: string
}

// Media Management Types
export interface MediaFile {
  id: string
  name: string
  path: string
  url: string
  type: "image" | "video" | "audio" | "document"
  mimeType: string
  size: number
  createdAt: Date
  updatedAt: Date
  uploadedBy?: string
  tags?: string[]
  description?: string
}

export interface MediaDirectory {
  name: string
  path: string
  files: MediaFile[]
  subdirectories: MediaDirectory[]
}

export interface UploadResponse {
  success: boolean
  file?: MediaFile
  message?: string
  error?: string
}

export interface MediaListResponse {
  success: boolean
  files: MediaFile[]
  directories: string[]
  message?: string
  error?: string
}

export interface FileUploadProgress {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

export const MEDIA_TYPES = {
  IMAGE: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
  VIDEO: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
  AUDIO: ["mp3", "wav", "ogg", "aac", "m4a"],
  DOCUMENT: ["pdf", "doc", "docx", "txt", "rtf", "odt"],
} as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = [
  ...MEDIA_TYPES.IMAGE,
  ...MEDIA_TYPES.VIDEO,
  ...MEDIA_TYPES.AUDIO,
  ...MEDIA_TYPES.DOCUMENT,
]