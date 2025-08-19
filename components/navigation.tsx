"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Heart, BookOpen, Calendar, Home, User, LogOut, Info, ChevronDown, Users, Target, CalendarHeart } from 'lucide-react'

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bible", label: "Bible", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
  {href: "/services", label: "Services", icon: CalendarHeart},
  { href: "/posts", label: "Posts", icon: Calendar },
  { href: "/give", label: "Give", icon: Heart },
]

const aboutLinks = [
  {
    title: "Mission Statement",
    href: "/about/mission",
    description: "Our calling to spread God's love and build His kingdom",
    icon: Target
  },
  {
    title: "Core Values", 
    href: "/about/core-values",
    description: "The fundamental principles that guide our community",
    icon: Users
  },
  {
    title: "Our Pastor",
    href: "/about/pastor",
    description: "Meet Bishop Anthony King, Sr. and learn about his ministry",
    icon: User
  },
  {
    title: "Statement of Faith",
    href: "/about/statement-of-faith",
    description: "Our biblical beliefs and doctrinal foundations",
    icon: BookOpen
  }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const [desktopAboutOpen, setDesktopAboutOpen] = useState(false)
  const { user, logout } = useAuth()

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-about-dropdown]')) {
        setDesktopAboutOpen(false)
      }
    }

    if (desktopAboutOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [desktopAboutOpen])

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-full p-2 shadow-md overflow-hidden">
              <Image
                src="/img/church-logo.png"
                alt="Holy City of God Christian Fellowship"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <span className="font-bold text-xl">Holy City of God</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.href} className="relative">
                {item.label === "About" ? (
                  <div className="flex items-center" data-about-dropdown>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-1 text-gray-600 hover:text-purple-700 transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                    <button
                      className="ml-2 text-gray-600 hover:text-purple-700 transition-colors"
                      onClick={() => setDesktopAboutOpen(!desktopAboutOpen)}
                      aria-label="Toggle About submenu"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${desktopAboutOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {desktopAboutOpen && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                        {aboutLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                            onClick={() => setDesktopAboutOpen(false)}
                          >
                            <div className="flex items-center space-x-3">
                              <link.icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{link.title}</div>
                                <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-600 hover:text-purple-700 transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-purple-700 text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/give">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>My Donations</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-gray-600 hover:text-purple-700 hover:bg-gray-100">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-purple-700 hover:bg-purple-800 text-white hover:text-secondary-500">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center mb-6">
                <Image
                  src="/img/church-logo.png"
                  alt="Holy City of God Christian Fellowship"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <span className="font-bold">Holy City of God</span>
              </div>

              <div className="flex flex-col space-y-4">
                {user && (
                  <div className="flex items-center space-x-4 mb-4 p-4 bg-purple-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-purple-700 text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                )}

                {/* Mobile Navigation Items */}
                {navItems.map((item) => (
                  <div key={item.href}>
                    {item.label === "About" ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <Link
                            href={item.href}
                            className="flex items-center space-x-3 text-lg hover:text-purple-700 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                          <button
                            className="p-2 hover:text-purple-700 transition-colors"
                            onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                            aria-label="Toggle About submenu"
                          >
                            <ChevronDown className={`h-5 w-5 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        {mobileAboutOpen && (
                          <div className="ml-8 mt-2 space-y-2">
                            {aboutLinks.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="block text-sm text-gray-600 hover:text-purple-600 transition-colors py-2"
                                onClick={() => {
                                  setIsOpen(false)
                                  setMobileAboutOpen(false)
                                }}
                              >
                                {link.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3 text-lg hover:text-purple-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 text-lg hover:text-purple-700 transition-colors mb-4"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full text-purple-50 hover:text-gold-300 bg-purple-700 hover:bg-purple-800">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
