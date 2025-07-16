import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import BackToTop from "@/components/backToTop"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Holy City of God Christian Fellowship",
  description: "Sharing the love of Jesus",
  authors: [{ name: "Kris K LLC & PC BRAINIACS LLC d.b.a. Tone King Development", url: "https://tonekingdev.com" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
          <BackToTop />
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}