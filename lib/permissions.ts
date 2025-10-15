import type { User } from "./auth"

// Permission constants
export const PERMISSIONS = {
  // System level
  ALL: "all",
  NETWORK_ADMIN: "network_admin",
  CHURCH_ADMIN: "church_admin",

  // Content management
  CONTENT_MANAGE: "content_manage",
  CONTENT_VIEW: "content_view",

  // User management
  USER_MANAGE: "user_manage",
  MEMBER_VIEW: "member_view",

  // Word management (formerly sermon management)
  WORD_UPLOAD: "word_upload",
  WORD_APPROVE: "word_approve",

  // Prayer management
  PRAYER_MANAGE: "prayer_manage",

  // Profile management
  PROFILE_EDIT: "profile_edit",
} as const

// Role-based permission matrix
export const ROLE_PERMISSIONS = {
  super_admin: [PERMISSIONS.ALL],
  network_admin: [
    PERMISSIONS.NETWORK_ADMIN,
    PERMISSIONS.CHURCH_ADMIN,
    PERMISSIONS.CONTENT_MANAGE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.WORD_UPLOAD,
    PERMISSIONS.WORD_APPROVE,
  ],
  first_lady: [
    PERMISSIONS.NETWORK_ADMIN,
    PERMISSIONS.CHURCH_ADMIN,
    PERMISSIONS.CONTENT_MANAGE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.WORD_UPLOAD,
  ],
  bishop: [
    PERMISSIONS.CHURCH_ADMIN,
    PERMISSIONS.CONTENT_MANAGE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.WORD_UPLOAD,
    PERMISSIONS.WORD_APPROVE,
  ],
  pastor: [PERMISSIONS.CHURCH_ADMIN, PERMISSIONS.CONTENT_MANAGE, PERMISSIONS.USER_MANAGE, PERMISSIONS.WORD_UPLOAD],
  minister: [PERMISSIONS.CONTENT_MANAGE, PERMISSIONS.MEMBER_VIEW, PERMISSIONS.WORD_UPLOAD],
  elder: [PERMISSIONS.CONTENT_MANAGE, PERMISSIONS.MEMBER_VIEW],
  deacon: [PERMISSIONS.MEMBER_VIEW, PERMISSIONS.PRAYER_MANAGE],
  leader: [PERMISSIONS.CONTENT_VIEW, PERMISSIONS.MEMBER_VIEW],
  member: [PERMISSIONS.CONTENT_VIEW, PERMISSIONS.PROFILE_EDIT],
} as const

type ContentAction = "create" | "edit" | "delete" | "view" | "approve" | "share" | "upload"
type RoleName = keyof typeof ROLE_PERMISSIONS | "all"

interface ContentPermissions {
  create?: RoleName[]
  edit?: RoleName[]
  delete?: RoleName[]
  view?: RoleName[]
  approve?: RoleName[]
  share?: RoleName[]
  upload?: RoleName[]
}

// Content type permissions - what content types can each role manage
export const CONTENT_TYPE_PERMISSIONS: Record<string, ContentPermissions> = {
  // Pages - only webmasters (super_admin, network_admin) can create new pages
  page: {
    create: ["super_admin", "network_admin"],
    edit: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister", "elder"],
    delete: ["super_admin", "network_admin"],
    view: ["all"],
  },

  // Hero sections - leadership can edit
  hero: {
    create: ["super_admin", "network_admin"],
    edit: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister", "elder"],
    delete: ["super_admin", "network_admin"],
    view: ["all"],
  },

  // Announcements - leadership can create and manage
  announcement: {
    create: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister", "elder"],
    edit: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister", "elder"],
    delete: ["super_admin", "network_admin", "first_lady", "bishop", "pastor"],
    view: ["all"],
  },

  // Events - leadership can create and manage
  event: {
    create: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister", "elder"],
    edit: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister", "elder"],
    delete: ["super_admin", "network_admin", "first_lady", "bishop", "pastor"],
    view: ["all"],
  },

  // Posts - leadership can create and manage
  post: {
    create: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister", "elder"],
    edit: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister", "elder"],
    delete: ["super_admin", "network_admin", "first_lady", "bishop", "pastor"],
    view: ["all"],
  },

  // Word messages - only clergy and those with can_upload_word permission
  word: {
    create: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister"],
    edit: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister"],
    delete: ["super_admin", "network_admin", "bishop", "pastor"],
    approve: ["super_admin", "network_admin", "bishop"],
    share: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister"],
    upload: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister"],
    view: ["all"],
  },

  // Prayers - deacons and above can manage
  prayer: {
    create: ["all"], // Anyone can submit prayers
    edit: ["super_admin", "network_admin", "first_lady", "bishop", "pastor", "minister", "elder", "deacon"],
    delete: ["super_admin", "network_admin", "first_lady", "bishop", "pastor"],
    view: ["all"],
  },
}

// Check if user can perform action on content type
export function canPerformAction(
  user: User,
  contentType: keyof typeof CONTENT_TYPE_PERMISSIONS,
  action: ContentAction,
): boolean {
  if (!user || !user.role) return false

  // Super admin can do everything
  if (user.role.permissions.includes(PERMISSIONS.ALL)) return true

  const permissions = CONTENT_TYPE_PERMISSIONS[contentType]
  if (!permissions) return false

  const allowedRoles = permissions[action]
  if (!allowedRoles) return false

  // Check if 'all' is allowed
  if (allowedRoles.includes("all")) return true

  // Check if user's role is in allowed roles
  return allowedRoles.includes(user.role.name as RoleName)
}

// Check if user is leadership
export function isLeadership(user: User): boolean {
  return user.position?.is_leadership || false
}

// Check if user is clergy
export function isClergy(user: User): boolean {
  return user.position?.is_clergy || false
}

// Get user's effective permissions (combines role and position permissions)
export function getEffectivePermissions(user: User): string[] {
  if (!user || !user.role) return []

  const permissions = [...user.role.permissions]

  // Add position-based permissions
  if (user.position) {
    if (user.position.can_upload_word && !permissions.includes(PERMISSIONS.WORD_UPLOAD)) {
      permissions.push(PERMISSIONS.WORD_UPLOAD)
    }

    if (user.position.is_leadership && !permissions.includes(PERMISSIONS.CONTENT_MANAGE)) {
      permissions.push(PERMISSIONS.CONTENT_MANAGE)
    }
  }

  return permissions
}

interface SecurityEventDetails {
  [key: string]: string | number | boolean | null | undefined
}

// Security audit logging
export function logSecurityEvent(
  user: User | null,
  action: string,
  resource: string,
  success: boolean,
  details?: SecurityEventDetails,
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    user_id: user?.id || null,
    user_email: user?.email || "anonymous",
    action,
    resource,
    success,
    details: details ? JSON.stringify(details) : null,
    ip_address: "server", // Will be populated by middleware
    user_agent: "server", // Will be populated by middleware
  }

  console.log("[Anointed Innovations] Security Event:", logEntry)

  // In production, this should write to audit_logs table
  // For now, we'll just log to console
}

export function canUploadWord(user: User): boolean {
  if (!user || !user.role) return false

  // Super admin can do everything
  if (user.role.permissions.includes(PERMISSIONS.ALL)) return true

  // Check if user has WORD_UPLOAD permission
  if (user.role.permissions.includes(PERMISSIONS.WORD_UPLOAD)) return true

  // Check if user's position allows Word upload
  if (user.position?.can_upload_word) return true

  return false
}

interface WordMessage {
  speaker_id: number
  [key: string]: unknown
}

export function canShareWordLive(user: User, word: WordMessage): boolean {
  if (!user || !user.role) return false

  // Super admin can do everything
  if (user.role.permissions.includes(PERMISSIONS.ALL)) return true

  // User can share their own Word
  if (word.speaker_id === user.id) return true

  // Check if user has content management permissions
  return canPerformAction(user, "word", "share")
}
