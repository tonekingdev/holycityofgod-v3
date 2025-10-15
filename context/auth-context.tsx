"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  role: {
    id: string
    name: string
    permissions: string[]
  }
  position?: {
    id: string
    name: string
    is_leadership: boolean
    is_clergy: boolean
    can_upload_word: boolean
  }
  church_id: string
  isActive: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for authentication on page load
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")

      if (response.ok) {
        const data = await response.json()
        const transformedUser = {
          id: data.user.id.toString(),
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          name: `${data.user.first_name} ${data.user.last_name}`,
          email: data.user.email,
          role: data.user.role,
          position: data.user.position,
          church_id: data.user.church.id.toString(),
          isActive: true,
        }
        setUser(transformedUser)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const transformedUser = {
          id: data.user.id.toString(),
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          name: `${data.user.first_name} ${data.user.last_name}`,
          email: data.user.email,
          role: data.user.role,
          position: data.user.position,
          church_id: data.user.church.id.toString(),
          isActive: true,
        }
        setUser(transformedUser)
      } else {
        throw new Error(data.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call to create a user
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration - in a real app, send to backend
      if (name && email && password.length >= 6) {
        const newUser = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          firstName: name.split(" ")[0],
          lastName: name.split(" ")[1] || "",
          name,
          email,
          role: {
            id: "member",
            name: "member",
            permissions: ["content_view", "profile_edit"],
          },
          church_id: "1",
          isActive: true,
        }

        setUser(newUser)
        localStorage.setItem("church_app_user", JSON.stringify(newUser))
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Registration error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }

    setUser(null)
    localStorage.removeItem("church_app_user")

    // Redirect to login page if on admin route
    if (window.location.pathname.startsWith("/admin")) {
      window.location.href = "/auth/login"
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}