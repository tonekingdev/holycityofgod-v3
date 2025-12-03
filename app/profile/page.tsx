"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import {
  User,
  Settings,
  Church,
  LogOut,
  Camera,
  Save,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Shield,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Edit,
} from "lucide-react"
import { PersonalSyncSettings } from "@/components/calendar/personal-sync-settings"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  bio?: string
  profileImage?: string
  phone?: string
  address?: string
  role: {
    name: string
    permissions: string[]
  }
  position?: {
    name: string
    is_leadership: boolean
    is_clergy: boolean
  }
  church: {
    name: string
    code: string
    church_type: string
  }
  accessibleChurches?: Array<{
    id: string
    name: string
    code: string
  }>
  lastLogin?: Date
  createdAt?: Date
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDepartureModalOpen, setIsDepartureModalOpen] = useState(false)
  const [departureReason, setDepartureReason] = useState("")
  const [departureType, setDepartureType] = useState<"fellowship" | "church">("fellowship")

  useEffect(() => {
    if (user) {
      // Transform auth user to profile format
      setProfile({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: "",
        profileImage: "",
        role: user.role,
        position: user.position,
        church: {
          name: "Holy City of God Christian Fellowship",
          code: "HCGCF",
          church_type: "Main Campus",
        },
        lastLogin: new Date(),
        createdAt: new Date(),
      })
      setLoading(false)
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!profile) return

    setSaving(true)
    try {
      // API call to update profile would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDepartureSubmit = async () => {
    if (!departureReason.trim()) return

    try {
      // API call to submit departure request would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setIsDepartureModalOpen(false)
      setDepartureReason("")
      // Show success message
    } catch (error) {
      console.error("Failed to submit departure request:", error)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Profile Not Found</h3>
            <p className="text-muted-foreground mb-4">Unable to load your profile information.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground tracking-tight">My Profile</h1>
              <p className="text-lg text-muted-foreground">Manage your personal information and settings</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-6"
                size="lg"
              >
                <Edit className="h-4 w-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              <Button
                variant="ghost"
                onClick={logout}
                className="flex items-center gap-2 text-muted-foreground hover:text-destructive px-6"
                size="lg"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="profile" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 text-sm font-medium">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="church" className="flex items-center gap-2 text-sm font-medium">
              <Church className="h-4 w-4" />
              Church Info
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Profile Picture */}
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                      <AvatarImage src={profile.profileImage || "/img/defaultProfile.png"} />
                      <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                        {getInitials(profile.firstName, profile.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 shadow-lg"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-muted-foreground text-lg">{profile.email}</p>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                        {profile.role.name}
                      </Badge>
                      {profile.position && (
                        <Badge variant="outline" className="px-3 py-1 text-sm">
                          {profile.position.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone || ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="(313) 397-8240"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-foreground">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={profile.address || ""}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Street Address, City, State, ZIP"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-foreground">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ""}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us a little about yourself..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSaveProfile} disabled={saving} size="lg" className="px-8">
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} size="lg" className="px-8">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Last Login</p>
                      <p className="text-sm text-muted-foreground">{profile.lastLogin?.toLocaleString() || "Never"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.createdAt?.toLocaleDateString() || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Settings */}
                <div>
                  <Label className="text-base font-medium">Theme Preference</Label>
                  <p className="text-sm text-muted-foreground mb-3">Choose your preferred color scheme</p>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Notification Settings */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Notifications</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Event Reminders</p>
                        <p className="text-xs text-muted-foreground">Get notified about upcoming events</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Prayer Request Updates</p>
                        <p className="text-xs text-muted-foreground">
                          Updates on prayer requests you&apos;ve submitted
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Privacy Settings */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Privacy</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Profile to Members</p>
                        <p className="text-xs text-muted-foreground">Allow other members to see your profile</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Share Contact Information</p>
                        <p className="text-xs text-muted-foreground">Allow leadership to see your contact details</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Active Sessions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Church Info Tab */}
          <TabsContent value="church" className="space-y-8">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Church className="h-5 w-5 text-primary" />
                  </div>
                  Church Affiliation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Primary Church */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-foreground">Primary Church</Label>
                  <div className="p-6 border-2 border-primary/20 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/20 rounded-xl">
                        <Church className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-foreground">{profile.church.name}</h3>
                        <p className="text-muted-foreground">Code: {profile.church.code}</p>
                        <p className="text-muted-foreground">Type: {profile.church.church_type}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role and Position */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-foreground">Role & Position</Label>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                      {profile.role.name}
                    </Badge>
                    {profile.position && (
                      <Badge variant="outline" className="px-4 py-2 text-sm">
                        {profile.position.name}
                      </Badge>
                    )}
                    {profile.position?.is_leadership && (
                      <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">Leadership</Badge>
                    )}
                    {profile.position?.is_clergy && (
                      <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">Clergy</Badge>
                    )}
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-foreground">Permissions</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.role.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="px-3 py-1 text-xs">
                        {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-foreground">Church Contact</Label>
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-foreground">16606 James Couzens Fwy, Detroit, MI 48221</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span className="text-foreground">(313) 397-8240</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span className="text-foreground">info@holycityofgod.org</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Departure Options */}
            <Card className="shadow-lg border-destructive/30 bg-destructive/5 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl text-destructive">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <LogOut className="h-5 w-5 text-destructive" />
                  </div>
                  Departure Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-destructive/30 bg-destructive/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-foreground">
                    If you need to leave the fellowship or transfer to another church, please submit a formal request
                    below.
                  </AlertDescription>
                </Alert>

                <Dialog open={isDepartureModalOpen} onOpenChange={setIsDepartureModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Submit Departure Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-primary-50 border shadow-2xl">
                    <DialogHeader>
                      <DialogTitle>Departure Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Type of Departure</Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="fellowship"
                              name="departure"
                              value="fellowship"
                              checked={departureType === "fellowship"}
                              onChange={(e) => setDepartureType(e.target.value as "fellowship" | "church")}
                            />
                            <Label htmlFor="fellowship">Leaving the Fellowship</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="church"
                              name="departure"
                              value="church"
                              checked={departureType === "church"}
                              onChange={(e) => setDepartureType(e.target.value as "fellowship" | "church")}
                            />
                            <Label htmlFor="church">Transferring to Another Church in Fellowship</Label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="reason">Reason for Departure</Label>
                        <Textarea
                          id="reason"
                          value={departureReason}
                          onChange={(e) => setDepartureReason(e.target.value)}
                          placeholder="Please explain your reason for leaving..."
                          rows={4}
                          className="mt-2"
                        />
                      </div>

                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          This request will be reviewed by church leadership. You will receive a response within 7
                          business days.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDepartureModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDepartureSubmit} disabled={!departureReason.trim()}>
                        Submit Request
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <PersonalSyncSettings userId={profile.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}