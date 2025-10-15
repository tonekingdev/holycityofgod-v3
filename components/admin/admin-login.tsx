"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(email, password)
      router.push("/admin")
    } catch {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-primary-50 border-purple-200 shadow-royal">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative h-16 w-16 gradient-bg rounded-full p-2 shadow-royal">
            <Image
              src="/img/church-logo.png"
              alt="Holy City of God"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold gradient-text">Admin Login</CardTitle>
        <CardDescription className="text-primary">Sign in to access the content management system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-purple-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-purple-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <Button type="submit" className="w-full btn-primary hover-lift" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>

          <Button variant="ghost" className="w-full btn-outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              <span>Back Home</span>
            </Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}