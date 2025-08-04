// Base URLs
export const BASE_URLS = {
  API: process.env.NEXT_PUBLIC_API_URL || "/api",
  SITE: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  CDN: process.env.NEXT_PUBLIC_CDN_URL || "/img",
} as const

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  REGISTER: "/api/auth/register",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  VERIFY_EMAIL: "/api/auth/verify-email",
  REFRESH_TOKEN: "/api/auth/refresh",
  PROFILE: "/api/auth/profile",
} as const

// Content Management Endpoints
export const CONTENT_ENDPOINTS = {
  // Pages
  PAGES: "/api/content/pages",
  PAGE_BY_SLUG: (slug: string) => `/api/content/pages/${slug}`,

  // Announcements
  ANNOUNCEMENTS: "/api/content/announcements",
  ACTIVE_ANNOUNCEMENTS: "/api/content/announcements/active",
  ANNOUNCEMENT_BY_ID: (id: string) => `/api/content/announcements/${id}`,

  // Events
  EVENTS: "/api/content/events",
  UPCOMING_EVENTS: "/api/content/events/upcoming",
  EVENT_BY_ID: (id: string) => `/api/content/events/${id}`,

  // Word
  Word: "/api/content/word",
  RECENT_WORD: "/api/content/word/recent",
  WORD_BY_ID: (id: string) => `/api/content/word/${id}`,
  WORD_BY_SERIES: (series: string) => `/api/content/word/series/${series}`,

  // News
  NEWS: "/api/content/news",
  RECENT_NEWS: "/api/content/news/recent",
  NEWS_BY_ID: (id: string) => `/api/content/news/${id}`,

  // Media
  MEDIA: "/api/content/media",
  UPLOAD_MEDIA: "/api/content/media/upload",
  MEDIA_BY_ID: (id: string) => `/api/content/media/${id}`,
} as const

// User Management Endpoints
export const USER_ENDPOINTS = {
  USERS: "/api/users",
  USER_BY_ID: (id: string) => `/api/users/${id}`,
  USER_PROFILE: "/api/users/profile",
  UPDATE_PROFILE: "/api/users/profile/update",
  CHANGE_PASSWORD: "/api/users/change-password",
  USER_PREFERENCES: "/api/users/preferences",
} as const

// Prayer Request Endpoints
export const PRAYER_ENDPOINTS = {
  PRAYERS: "/api/prayers",
  SUBMIT_PRAYER: "/api/prayers/submit",
  PRAYER_BY_ID: (id: string) => `/api/prayers/${id}`,
  MY_PRAYERS: "/api/prayers/my-requests",
} as const

// Contact & Communication Endpoints
export const CONTACT_ENDPOINTS = {
  CONTACT_FORM: "/api/contact/submit",
  NEWSLETTER_SIGNUP: "/api/contact/newsletter",
  UNSUBSCRIBE: "/api/contact/unsubscribe",
  SEND_EMAIL: "/api/contact/send-email",
} as const

// Admin Endpoints
export const ADMIN_ENDPOINTS = {
  DASHBOARD: "/api/admin/dashboard",
  STATS: "/api/admin/stats",
  USERS: "/api/admin/users",
  CONTENT: "/api/admin/content",
  SETTINGS: "/api/admin/settings",
  BACKUP: "/api/admin/backup",
  LOGS: "/api/admin/logs",
} as const

// CMS Endpoints
export const CMS_ENDPOINTS = {
  DASHBOARD: "/api/cms/dashboard",
  CONTENT_TYPES: "/api/cms/content-types",
  PAGES: "/api/cms/pages",
  MEDIA_LIBRARY: "/api/cms/media",
  SETTINGS: "/api/cms/settings",
  TEMPLATES: "/api/cms/templates",
} as const

// External URLs
export const EXTERNAL_URLS = {
  // Social Media
  FACEBOOK: "https://facebook.com/holycityofgod",
  TWITTER: "https://twitter.com/holycityofgod",
  INSTAGRAM: "https://instagram.com/holycityofgod",
  YOUTUBE: "https://youtube.com/holycityofgod",

  // Maps & Directions
  GOOGLE_MAPS: "https://maps.google.com/?q=1234+Faith+Avenue,+Detroit,+MI+48201",
  APPLE_MAPS: "https://maps.apple.com/?q=1234+Faith+Avenue,+Detroit,+MI+48201",

  // Online Giving
  GIVING_PLATFORM: "https://giving.holycityofgod.org",
  PAYPAL: "https://paypal.me/holycityofgod",

  // Live Streaming
  YOUTUBE_LIVE: "https://youtube.com/holycityofgod/live",
  FACEBOOK_LIVE: "https://facebook.com/holycityofgod/live",

  // Resources
  BIBLE_GATEWAY: "https://biblegateway.com",
  YOUVERSION: "https://bible.com",

  // Emergency Contacts
  CRISIS_HOTLINE: "tel:988",
  LOCAL_EMERGENCY: "tel:911",
} as const

// File Upload Endpoints
export const UPLOAD_ENDPOINTS = {
  IMAGES: "/api/upload/images",
  DOCUMENTS: "/api/upload/documents",
  AUDIO: "/api/upload/audio",
  VIDEO: "/api/upload/video",
  PROFILE_PICTURE: "/api/upload/profile-picture",
} as const

// Search Endpoints
export const SEARCH_ENDPOINTS = {
  GLOBAL: "/api/search",
  CONTENT: "/api/search/content",
  SERMONS: "/api/search/sermons",
  EVENTS: "/api/search/events",
  PEOPLE: "/api/search/people",
} as const

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  NOTIFICATIONS: "/api/notifications",
  MARK_READ: "/api/notifications/mark-read",
  MARK_ALL_READ: "/api/notifications/mark-all-read",
  PREFERENCES: "/api/notifications/preferences",
  SUBSCRIBE: "/api/notifications/subscribe",
  UNSUBSCRIBE: "/api/notifications/unsubscribe",
} as const

// Analytics Endpoints
export const ANALYTICS_ENDPOINTS = {
  PAGE_VIEWS: "/api/analytics/page-views",
  USER_ENGAGEMENT: "/api/analytics/engagement",
  CONTENT_PERFORMANCE: "/api/analytics/content",
  SERMON_STATS: "/api/analytics/sermons",
  EVENT_ATTENDANCE: "/api/analytics/events",
} as const

// Integration Endpoints
export const INTEGRATION_ENDPOINTS = {
  // Email Service
  MAILCHIMP: "/api/integrations/mailchimp",
  SENDGRID: "/api/integrations/sendgrid",

  // Calendar
  GOOGLE_CALENDAR: "/api/integrations/google-calendar",
  OUTLOOK: "/api/integrations/outlook",

  // Payment Processing
  STRIPE: "/api/integrations/stripe",
  PAYPAL: "/api/integrations/paypal",

  // Social Media
  FACEBOOK_API: "/api/integrations/facebook",
  TWITTER_API: "/api/integrations/twitter",

  // Church Management
  PLANNING_CENTER: "/api/integrations/planning-center",
  CHURCH_TOOLS: "/api/integrations/church-tools",
} as const

// Webhook Endpoints
export const WEBHOOK_ENDPOINTS = {
  STRIPE: "/api/webhooks/stripe",
  PAYPAL: "/api/webhooks/paypal",
  MAILCHIMP: "/api/webhooks/mailchimp",
  FACEBOOK: "/api/webhooks/facebook",
  YOUTUBE: "/api/webhooks/youtube",
} as const

// Health Check Endpoints
export const HEALTH_ENDPOINTS = {
  STATUS: "/api/health",
  DATABASE: "/api/health/database",
  EXTERNAL_SERVICES: "/api/health/external",
  PERFORMANCE: "/api/health/performance",
} as const

// Development Endpoints (only available in development)
export const DEV_ENDPOINTS = {
  SEED_DATA: "/api/dev/seed",
  RESET_DATABASE: "/api/dev/reset",
  TEST_EMAIL: "/api/dev/test-email",
  GENERATE_CONTENT: "/api/dev/generate-content",
} as const

// API Versioning
export const API_VERSIONS = {
  V1: "/api/v1",
  V2: "/api/v2",
  CURRENT: "/api/v1",
} as const

// Rate Limiting Endpoints
export const RATE_LIMIT_ENDPOINTS = {
  AUTH: 5, // 5 requests per minute
  CONTACT: 3, // 3 requests per minute
  PRAYER: 2, // 2 requests per minute
  UPLOAD: 10, // 10 requests per minute
  SEARCH: 20, // 20 requests per minute
  DEFAULT: 100, // 100 requests per minute
} as const