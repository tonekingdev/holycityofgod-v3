import { CHURCH_INFO } from "./constants"

// Site Configuration
export const SITE_CONFIG = {
    name: CHURCH_INFO.name,
    shortName: CHURCH_INFO.shortName,
    description: CHURCH_INFO.tagline,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ogImage: "",
    locale: "en_US",
    author: "Anointed Innovations",
    keywords: [
        "church",
        "christian",
        "fellowship",
        "detroit",
        "worship",
        "prayer",
        "bishop anthony king",
        "holy city of god",
        "michigan church",
        "christian community",
    ]
} as const

// Feature Flags
export const FEATURES = {
    // Core Features
    USER_AUTHENTICATION: true,
    MEMBER_PORTAL: true,
    CONTENT_MANAGEMENT: true,

    // Communication Features
    PRAYER_REQUESTS: true,
    CONTACT_FORMS: true,
    NEWSLETTER: true,
    ANNOUNCEMENTS: true,

    // Content Features
    WORD_ARCHIVE: true,
    EVENT_CALENDAR: true,
    NEWS_BLOG: true,
    PHOTO_GALLERY: false,

    // Interactive Features
    ONLINE_GIVING: true,
    EVENT_REGISTRATION: true,
    LIVE_STREAMING: false,
    CHAT_SUPPORT: false,

    // Advance Features
    MULTI_LANGUAGE: false,
    DARK_MODE: false,
    PWA: false,
    PUSH_NOTIFICATIONS: false,

    // Admin Features
    ANALYTICS: true,
    USER_MANAGEMENT: true,
    CONTENT_SCHEDULING: true,
    BACKUP_SYSTEM: false,

    // Integration Features
    SOCIAL_MEDIA_INTEGRATION: true,
    EMAIL_MARKETING: false,
    CALENDAR_SYNC: false,
    PAYMENT_PROCESSING: true,
} as const

// CMS Configuration
export const CMS_CONFIG = {
    // Content Types
    contentTypes: ["page", "announcement", "event", "word", "news", "ministry", "testimony"],

    // Editor Settings
    editor: {
        toolbar: ["heading", "bold", "italic", "link", "bulletList", "orderedList", "blockquote", "image", "table"],
        maxLength: 10000,
        allowHtml: false,
    },

    // Media Settings
    media: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
        imageQuality: 80,
        generateThumbnails: true,
    },

    // Publishing Settings
    publishing: {
        requireApproval: false,
        allowScheduling: true,
        autoSave: true,
        versionControl: true,
    },
} as const

// Authentication Configuration
export const AUTH_CONFIG = {
  // Session Settings
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    strategy: "jwt",
  },

  // Password Requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },

  // Registration Settings
  registration: {
    enabled: true,
    requireEmailVerification: true,
    defaultRole: "member",
    allowSocialLogin: false,
  },

  // Security Settings
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    requireTwoFactor: false,
    sessionTimeout: 60 * 60 * 1000, // 1 hour
  },
} as const

// Email Configuration
export const EMAIL_CONFIG = {
  // SMTP Settings (to be configured with environment variables)
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },

  // Default Settings
  defaults: {
    from: `${CHURCH_INFO.name} <${CHURCH_INFO.contact.email}>`,
    replyTo: CHURCH_INFO.contact.email,
  },
} as const

// Database Configuration
export const DATABASE_CONFIG = {
  // Connection Settings
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "holy_city_db",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    ssl: process.env.DB_SSL === "true",
  },

  // Pool Settings
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },

  // Migration Settings
  migrations: {
    directory: "./migrations",
    tableName: "knex_migrations",
  },
} as const

// API Configuration
export const API_CONFIG = {
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  },

  // CORS Settings
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? [SITE_CONFIG.url] : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },

  // Request Settings
  request: {
    timeout: 30000, // 30 seconds
    maxBodySize: 10 * 1024 * 1024, // 10MB
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
} as const

// SEO Configuration
export const SEO_CONFIG = {
  // Default Meta Tags
  defaultMeta: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords.join(", "),
    author: SITE_CONFIG.author,
    robots: "index, follow",
    viewport: "width=device-width, initial-scale=1",
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.description}`,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@holycityofgod",
    creator: "@tonekingdev",
  },

  // Structured Data
  structuredData: {
    organization: {
      "@type": "Church",
      name: CHURCH_INFO.name,
      url: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}/img/church-logo.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: CHURCH_INFO.contact.address.street,
        addressLocality: CHURCH_INFO.contact.address.city,
        addressRegion: CHURCH_INFO.contact.address.state,
        postalCode: CHURCH_INFO.contact.address.zip,
        addressCountry: "US",
      },
      telephone: CHURCH_INFO.contact.phone,
      email: CHURCH_INFO.contact.email,
    },
  },
} as const

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  // Image Optimization
  images: {
    domains: ["localhost", "holycityofgod.org"],
    formats: ["image/webp", "image/avif"],
    quality: 80,
    sizes: [640, 768, 1024, 1280, 1920],
  },

  // Caching
  cache: {
    staticFiles: 31536000, // 1 year
    apiResponses: 300, // 5 minutes
    pages: 3600, // 1 hour
  },

  // Bundle Analysis
  bundle: {
    analyzer: process.env.ANALYZE === "true",
    gzip: true,
    brotli: true,
  },
} as const

// Monitoring Configuration
export const MONITORING_CONFIG = {
  // Error Tracking
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  },

  // Analytics
  analytics: {
    googleAnalytics: process.env.GOOGLE_ANALYTICS_ID,
    facebookPixel: process.env.FACEBOOK_PIXEL_ID,
  },

  // Health Checks
  health: {
    interval: 60000, // 1 minute
    timeout: 5000, // 5 seconds
    retries: 3,
  },
} as const

// Development Configuration
export const DEV_CONFIG = {
  // Debug Settings
  debug: {
    api: process.env.NODE_ENV === "development",
    database: process.env.NODE_ENV === "development",
    email: process.env.NODE_ENV === "development",
  },

  // Mock Data
  mockData: {
    enabled: process.env.USE_MOCK_DATA === "true",
    seedDatabase: process.env.SEED_DATABASE === "true",
  },

  // Hot Reload
  hotReload: {
    enabled: process.env.NODE_ENV === "development",
    port: 3001,
  },
} as const

// Export all configurations
export const CONFIG = {
  SITE: SITE_CONFIG,
  FEATURES,
  CMS: CMS_CONFIG,
  AUTH: AUTH_CONFIG,
  EMAIL: EMAIL_CONFIG,
  DATABASE: DATABASE_CONFIG,
  API: API_CONFIG,
  SEO: SEO_CONFIG,
  PERFORMANCE: PERFORMANCE_CONFIG,
  MONITORING: MONITORING_CONFIG,
  DEV: DEV_CONFIG,
} as const
