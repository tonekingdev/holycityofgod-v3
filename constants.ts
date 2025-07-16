import { faCross, faHandsHelping, faPray, faHome, faHeart } from "@fortawesome/free-solid-svg-icons"
import { type AuthUser } from "./types"

export type PastorInfo = {
  image: string;
  name: string;
  title: string;
  bio: string[];
  ministryFocus: {
    title: string;
    description: string;
  }[];
}

export type ServiceTime = {
  id: string;
  name: string;
  day: string;
  time: string;
  location: string;
  description: string;
}

export type OnlineServiceInfo = {
  title: string;
  description: string;
  phone: string;
  meetingId: string;
  accessCode: string;
  link: string;
}


// Church Information
export const CHURCH_INFO = {
  name: "Holy City of God Christian Fellowship Inc.",
  shortName: "Holy City of God",
  tagline: "A place of worship, fellowship, and spiritual growth",
  subtitle: "Sharing the love of Jesus",
  pastor: {
    name: "Bishop Anthony King",
    title: "Senior Pastor",
    bio: "Bishop Anthony King has been serving the Detroit community for over 20 years, bringing hope and spiritual guidance to countless families.",
    image: "/images/pastor-king.jpg",
  },
  contact: {
    phone: "(313)397-8240",
    email: "info@holycityofgod.org",
    address: {
      street: "16606 James Couzens Fwy",
      city: "Detroit",
      state: "Michigan",
      zip: "48221",
      full: "16606 James Couzens Fwy, Detroit, MI 48221",
    },
  },
  founded: 1998,
  logo: "/img/2_holy.jpg",
  missionTitle: "Holy City of God Mission",
  mission: "To spread the love of Christ through worship, fellowship, and service to our community.",
  vision: "Building a stronger community through faith, hope, and love.",
  values: [
    { 
      title: "Faith in Jesus Christ", 
      description: "We believe in the power of faith to transform lives and communities.",
      icon: faCross 
    },
    { 
      title: "Community Service", 
      description: "Serving our neighbors with love and compassion as Christ taught us.",
      icon: faHandsHelping 
    },
    { 
      title: "Spiritual Growth", 
      description: "Nurturing personal and collective spiritual development through study and prayer.",
      icon: faPray 
    },
    { 
      title: "Family Values", 
      description: "Strengthening families through biblical principles and mutual support.",
      icon: faHome 
    },
    { 
      title: "Compassionate Care", 
      description: "Extending God's love through practical care and emotional support.",
      icon: faHeart 
    },
  ] as const,
} as const

// Pastor Information
export const PASTOR_INFO: PastorInfo = {
  image: "/img/King_T_1-min.jpg",
  name: "Bishop Anthony King, Sr.",
  title: "Senior Pastor", // Added this missing property
  bio: [
    "Bishop Anthony King, Sr. has been serving as Senior Pastor of Holy City of God since its founding in 1998.",
    "With over 25 years of ministry experience, Bishop King brings a wealth of spiritual wisdom and practical guidance to our congregation.",
    "His leadership has guided our church through seasons of growth and transformation, always emphasizing the core values of faith, family, and community service."
  ],
  ministryFocus: [
    {
      title: "Biblical Teaching",
      description: "Delivering sound, practical biblical instruction for daily living"
    },
    {
      title: "Community Outreach",
      description: "Extending God's love through service to our local community"
    },
    {
      title: "Family Ministry",
      description: "Strengthening families through biblical principles and support"
    }
  ]
} as const

// Verse of the Day
export const BIBLE_VERSE = {
  verse: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
  reference: "Jeremiah 29:11",
  date: "July 11, 2025",
} as const;

// Service Times
export const SERVICE_TIMES: readonly ServiceTime[] = [
  {
    id: "sunday-school",
    name: "Sunday School",
    day: "Every Sunday",
    time: "10:00 AM",
    location: "Main Sanctuary",
    description: "Bible study classes for all ages"
  },
  {
    id: "sunday-worship",
    name: "Sunday Worship Service",
    day: "Every Sunday",
    time: "11:00 AM",
    location: "Main Sanctuary",
    description: "Our main weekly worship service with preaching and music"
  },
  {
    id: "bible-study",
    name: "Wednesday Bible Study",
    day: "Every Wednesday",
    time: "7:00 PM",
    location: "Fellowship Hall",
    description: "Midweek Bible study and prayer meeting"
  }
] as const;

// Add the missing ONLINE_SERVICE_INFO constant
export const ONLINE_SERVICE_INFO: OnlineServiceInfo = {
  title: "Join Us Online",
  description: "Can't join us in person? Connect with us virtually for our services.",
  phone: "(313) 555-1234",
  meetingId: "123 456 7890",
  accessCode: "HOLY2023",
  link: "https://zoom.us/j/1234567890"
} as const;

// Office Hours
export const OFFICE_HOURS = [
  { day: "Monday", hours: "9:00 AM - 5:00 PM" },
  { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
  { day: "Wednesday", hours: "9:00 AM - 7:00 PM" },
  { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
  { day: "Friday", hours: "9:00 AM - 7:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
  { day: "Sunday", hours: "Closed (Worship Services Only)" },
] as const

// Prayer Request Categories
export const PRAYER_CATEGORIES = [
  { value: "healing", label: "Healing & Health" },
  { value: "guidance", label: "Guidance & Direction" },
  { value: "thanksgiving", label: "Thanksgiving & Praise" },
  { value: "family", label: "Family & Relationships" },
  { value: "financial", label: "Financial Needs" },
  { value: "other", label: "Other" },
] as const

// Message Types for Alerts/Notifications
export const MESSAGE_TYPES = [
  { value: "general", label: "General Inquiry" },
  { value: "prayer", label: "Prayer Request" },
  { value: "event", label: "Event Information" },
  { value: "giving", label: "Giving/Donations" },
  { value: "feedback", label: "Feedback/Suggestions" },
] as const

// Ministry Information
export const MINISTRIES = [
  {
    id: "youth",
    name: "Youth Ministry",
    description: "Empowering young people to grow in faith and leadership",
    leader: "Minister Sarah Johnson",
    meetingTime: "Saturdays at 2:00 PM",
    targetAudience: "Ages 13-25",
    activities: ["Bible Study", "Community Service", "Youth Events", "Mentorship"],
  },
  {
    id: "womens",
    name: "Women's Ministry",
    description: "Supporting women in their spiritual journey and life challenges",
    leader: "Sister Mary Williams",
    meetingTime: "Second Saturday of each month at 10:00 AM",
    targetAudience: "All women",
    activities: ["Bible Study", "Prayer Circles", "Community Outreach", "Fellowship"],
  },
  {
    id: "mens",
    name: "Men's Ministry",
    description: "Building strong Christian men and fathers",
    leader: "Deacon Robert Davis",
    meetingTime: "First Saturday of each month at 8:00 AM",
    targetAudience: "All men",
    activities: ["Bible Study", "Brotherhood", "Community Service", "Mentorship"],
  },
  {
    id: "seniors",
    name: "Senior Saints Ministry",
    description: "Fellowship and support for our senior members",
    leader: "Elder Grace Thompson",
    meetingTime: "Thursdays at 11:00 AM",
    targetAudience: "Ages 65+",
    activities: ["Bible Study", "Social Activities", "Health & Wellness", "Prayer Support"],
  },
  {
    id: "music",
    name: "Music Ministry",
    description: "Leading worship through music and praise",
    leader: "Minister of Music David Brown",
    meetingTime: "Wednesdays at 6:00 PM (Choir Practice)",
    targetAudience: "All ages",
    activities: ["Choir", "Instrumental Music", "Worship Leading", "Special Events"],
  },
  {
    id: "outreach",
    name: "Community Outreach",
    description: "Serving our community with love and compassion",
    leader: "Deacon Lisa Anderson",
    meetingTime: "Third Saturday of each month at 9:00 AM",
    targetAudience: "All members",
    activities: ["Food Pantry", "Homeless Ministry", "Prison Ministry", "Community Events"],
  },
] as const

// Navigation Links
export const MAIN_NAV = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Pastor", href: "/pastor" },
  { name: "Services", href: "/services" },
  { name: "Ministries", href: "/ministries" },
  { name: "Events", href: "/events" },
  { name: "Sermons", href: "/sermons" },
  { name: "News", href: "/news" },
  { name: "Give", href: "/give" },
  { name: "Contact", href: "/contact" },
] as const

// Social Media Links
export const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://facebook.com/holycityofgod",
    icon: "faFacebookF", // FontAwesome's Facebook icon
  },
  {
    name: "Twitter",
    href: "https://twitter.com/holycityofgod",
    icon: "faTwitter", // FontAwesome's Twitter/X icon
  },
  {
    name: "Instagram",
    href: "https://instagram.com/holycityofgod",
    icon: "faInstagram", // FontAwesome's Instagram icon
  },
  {
    name: "YouTube",
    href: "https://youtube.com/holycityofgod",
    icon: "faYoutube", // FontAwesome's YouTube icon
  },
] as const

// Demo Credentials (for development)
export const DEMO_CREDENTIALS: { users: readonly AuthUser [] } = {
  users: [
    {
      id: "1",
      email: "admin@holycityofgod.org",
      name: "Administrator",
      role: "admin",
      isActive: true,
      createdAt: new Date("2023-01-01"),
      lastLogin: new Date(),
      password: "admin123" // Note: This is just for demo purposes
    },
    {
      id: "2",
      email: "member@holycityofgod.org",
      name: "Church Member",
      role: "member",
      isActive: true,
      createdAt: new Date("2023-01-01"),
      lastLogin: new Date(),
      password: "member123" // Note: This is just for demo purposes
    }
  ] as const
}

// Event Categories
export const EVENT_CATEGORIES = [
  { value: "worship", label: "Worship Service", color: "bg-primary-100 text-primary-800" },
  { value: "study", label: "Bible Study", color: "bg-success-100 text-success-800" },
  { value: "fellowship", label: "Fellowship", color: "bg-church-sage bg-opacity-10 text-green-800" },
  { value: "outreach", label: "Community Outreach", color: "bg-accent-100 text-accent-800" },
  { value: "youth", label: "Youth Event", color: "bg-church-purple bg-opacity-10 text-purple-800" },
  { value: "ministry", label: "Ministry Meeting", color: "bg-info-100 text-info-800" },
] as const

// Content Categories
export const CONTENT_CATEGORIES = [
  { value: "announcements", label: "Announcements", color: "bg-warning-100 text-warning-800" },
  { value: "events", label: "Events", color: "bg-primary-100 text-primary-800" },
  { value: "sermons", label: "Sermons", color: "bg-success-100 text-success-800" },
  { value: "news", label: "News", color: "bg-info-100 text-info-800" },
  { value: "testimonies", label: "Testimonies", color: "bg-church-gold bg-opacity-10 text-yellow-800" },
] as const

// Status Options
export const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "bg-success-100 text-success-800" },
  { value: "inactive", label: "Inactive", color: "bg-secondary-100 text-secondary-800" },
  { value: "pending", label: "Pending", color: "bg-warning-100 text-warning-800" },
  { value: "archived", label: "Archived", color: "bg-secondary-100 text-secondary-600" },
] as const

// Priority Levels
export const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "bg-secondary-100 text-secondary-600" },
  { value: "normal", label: "Normal", color: "bg-info-100 text-info-800" },
  { value: "high", label: "High", color: "bg-warning-100 text-warning-800" },
  { value: "urgent", label: "Urgent", color: "bg-primary-100 text-primary-800" },
] as const

// Default Content
export const DEFAULT_CONTENT = {
  hero: {
    title: "Welcome to Holy City of God",
    subtitle: "A place of worship, fellowship, and spiritual growth in Detroit, Michigan",
    ctaText: "Join Us This Sunday",
    ctaLink: "/services",
  },
  about: {
    title: "About Our Church",
    content:
      "Holy City of God Christian Fellowship Inc. has been serving the Detroit community since 1995. Under the leadership of Bishop Anthony King, we are committed to spreading the love of Christ through worship, fellowship, and service.",
  },
} as const

// Feature Flags
export const FEATURES = {
  ONLINE_GIVING: true,
  EVENT_REGISTRATION: true,
  MEMBER_PORTAL: true,
  PRAYER_REQUESTS: true,
  SERMON_ARCHIVE: true,
  LIVE_STREAMING: false,
  MOBILE_APP: false,
  MULTI_LANGUAGE: false,
} as const

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const

// Email Templates
export const EMAIL_TEMPLATES = {
  WELCOME: "welcome",
  PASSWORD_RESET: "password-reset",
  EVENT_CONFIRMATION: "event-confirmation",
  PRAYER_REQUEST_CONFIRMATION: "prayer-request-confirmation",
  NEWSLETTER: "newsletter",
} as const

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  MAX_FILES_PER_UPLOAD: 5,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
} as const