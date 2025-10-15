"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, LogOut, Settings, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function AdminHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="gradient-bg border-b border-purple-200 px-6 py-4 shadow-royal">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Holy City of God CMS</h1>
          <p className="text-sm text-purple-100">Content Management System</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-white font-medium">Welcome, {user?.firstName}</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/20 transition-colors">
                <Avatar className="h-8 w-8 border-2 border-white/30">
                  <AvatarFallback className="bg-white text-primary-700 font-semibold">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-purple-200" align="end" forceMount>
              <DropdownMenuItem asChild className="hover:bg-primary-100 focus:bg-primary-100">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-primary-700">Home</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-purple-100 focus:bg-primary-100">
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-primary-700">Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-purple-100 focus:bg-purple-100">
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-primary-700">Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-purple-200" />
              <DropdownMenuItem onClick={logout} className="hover:bg-red-50 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4 text-red-600" />
                <span className="text-red-700">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}