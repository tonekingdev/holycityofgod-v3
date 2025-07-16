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
