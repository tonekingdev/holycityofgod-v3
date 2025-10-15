"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { LayoutDashboard, FileText, Users, Mic, Settings, Calendar, Newspaper, ImageIcon, Megaphone } from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    permission: null, // Always visible to admin users
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: FileText,
    permission: "content",
    action: "view" as const,
  },
  {
    name: "Media Library",
    href: "/admin/content/media",
    icon: ImageIcon,
    permission: "content",
    action: "view" as const,
  },
  {
    name: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
    permission: "announcement",
    action: "view" as const,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    permission: "user",
    action: "view" as const,
  },
  {
    name: "Word",
    href: "/admin/word",
    icon: Mic,
    permission: "word",
    action: "view" as const,
  },
  {
    name: "Calendar",
    href: "/admin/calendar",
    icon: Calendar,
    permission: "event",
    action: "view" as const,
  },
  {
    name: "Posts",
    href: "/admin/posts",
    icon: Newspaper,
    permission: "content",
    action: "view" as const,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    permission: null, // Always visible to admin users
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-primary to-purple-800 shadow-xl">
      <div className="px-6 py-4 bg-slate-800">
        <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4 bg-slate-300">
        {navigationItems.map((item) => {
          const hasAccess =
            !item.permission ||
            user.role.permissions.includes("all") ||
            user.role.permissions.includes(`${item.permission}_${item.action}`)

          if (!hasAccess) return null

          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive ? "bg-primary-200 text-primary shadow-lg" : "text-slate hover:bg-primary-50 hover:text-white",
              )}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-600 p-4 bg-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">
            {user.firstName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-slate-400 truncate capitalize">{user.role.name.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
