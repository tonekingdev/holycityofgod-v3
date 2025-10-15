"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import BackToTop from "@/components/backToTop"
import { useAuth } from "@/context/auth-context"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user } = useAuth()

  const shouldShowNavigation =
    !pathname?.startsWith("/admin") ||
    !user ||
    !(
      user.role.permissions.includes("all") ||
      user.role.permissions.includes("network_admin") ||
      user.role.permissions.includes("church_admin") ||
      user.role.permissions.includes("content_manage") ||
      user.role.permissions.includes("user_manage")
    )

  return (
    <>
      {shouldShowNavigation && <Navigation />}
      <main className="min-h-screen">{children}</main>
      <BackToTop />
      <Footer />
      <Toaster />
    </>
  )
}