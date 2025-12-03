"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Shield } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: {
    name: string
    permissions: string[]
  }
  position?: {
    name: string
    is_leadership: boolean
    is_clergy: boolean
  }
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    position: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Mock users data - replace with actual API call
      const mockUsers: User[] = [
        {
          id: "1",
          firstName: "John",
          lastName: "Pastor",
          email: "pastor@holycityofgod.org",
          role: {
            name: "pastor",
            permissions: ["church_admin", "content_manage", "user_manage"],
          },
          position: {
            name: "Presiding Bishop",
            is_leadership: true,
            is_clergy: true,
          },
          isActive: true,
          lastLogin: "2024-01-15T10:30:00Z",
          createdAt: "2023-01-01T00:00:00Z",
        },
        {
          id: "2",
          firstName: "Sarah",
          lastName: "Minister",
          email: "sarah@holycityofgod.org",
          role: {
            name: "minister",
            permissions: ["content_manage", "member_view"],
          },
          position: {
            name: "Associate Minister",
            is_leadership: true,
            is_clergy: true,
          },
          isActive: true,
          lastLogin: "2024-01-14T15:20:00Z",
          createdAt: "2023-03-15T00:00:00Z",
        },
        {
          id: "3",
          firstName: "Michael",
          lastName: "Elder",
          email: "michael@holycityofgod.org",
          role: {
            name: "elder",
            permissions: ["content_manage", "member_view"],
          },
          position: {
            name: "Elder",
            is_leadership: true,
            is_clergy: false,
          },
          isActive: true,
          lastLogin: "2024-01-13T09:45:00Z",
          createdAt: "2023-06-01T00:00:00Z",
        },
        {
          id: "4",
          firstName: "Lisa",
          lastName: "Member",
          email: "lisa@example.com",
          role: {
            name: "member",
            permissions: ["content_view", "profile_edit"],
          },
          isActive: true,
          lastLogin: "2024-01-12T18:30:00Z",
          createdAt: "2023-09-20T00:00:00Z",
        },
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case "pastor":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "minister":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "elder":
        return "bg-green-100 text-green-800 border-green-200"
      case "deacon":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "member":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleAddUser = async () => {
    try {
      // Create new user object
      const userToAdd: User = {
        id: Date.now().toString(), // In real app, this would come from backend
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: {
          name: newUser.role,
          permissions: getRolePermissions(newUser.role),
        },
        position: newUser.position
          ? {
              name: newUser.position,
              is_leadership: ["pastor", "minister", "elder"].includes(newUser.role),
              is_clergy: ["pastor", "minister"].includes(newUser.role),
            }
          : undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
      }

      // Add to users list (in real app, this would be an API call)
      setUsers((prev) => [...prev, userToAdd])

      // Reset form and close modal
      setNewUser({ firstName: "", lastName: "", email: "", role: "", position: "" })
      setIsAddUserOpen(false)

      console.log("[Anointed Innovations] User added successfully:", userToAdd)
    } catch (error) {
      console.error("Failed to add user:", error)
    }
  }

  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case "pastor":
        return ["church_admin", "content_manage", "user_manage", "member_view", "word_upload", "word_approve"]
      case "minister":
        return ["content_manage", "member_view", "word_upload"]
      case "elder":
        return ["content_manage", "member_view"]
      case "deacon":
        return ["member_view", "prayer_manage"]
      case "leader":
        return ["content_view", "member_view"]
      case "member":
        return ["content_view", "profile_edit"]
      default:
        return ["content_view"]
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold gradient-text">Users</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-secondary-50">
              <CardContent className="p-6">
                <div className="h-6 bg-purple-100 rounded mb-2"></div>
                <div className="h-4 bg-purple-100 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">Users</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-secondary-50">
            <DialogHeader>
              <DialogTitle className="gradient-text">Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-primary-50">
                    <SelectItem value="pastor">Pastor</SelectItem>
                    <SelectItem value="minister">Minister</SelectItem>
                    <SelectItem value="elder">Elder</SelectItem>
                    <SelectItem value="deacon">Deacon</SelectItem>
                    <SelectItem value="leader">Leader</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position (Optional)</Label>
                <Input
                  id="position"
                  value={newUser.position}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, position: e.target.value }))}
                  placeholder="e.g., Associate Pastor, Youth Leader"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleAddUser}
                disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role}
              >
                Add User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="bg-primary-50 border-primary-200 hover:shadow-primary transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-purple-800">
                      {user.firstName} {user.lastName}
                    </h3>
                    <Badge className={getRoleColor(user.role.name)}>{user.role.name}</Badge>
                    {user.position?.is_leadership && (
                      <Badge variant="outline" className="text-primary border-primary bg-purple-50">
                        <Shield className="w-3 h-3 mr-1" />
                        Leadership
                      </Badge>
                    )}
                    {user.position?.is_clergy && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
                        Clergy
                      </Badge>
                    )}
                    {!user.isActive && <Badge variant="destructive">Inactive</Badge>}
                  </div>
                  <p className="text-primary mb-2">{user.email}</p>
                  {user.position && <p className="text-sm text-purple-500 mb-2">Position: {user.position.name}</p>}
                  <div className="flex items-center gap-4 text-sm text-purple-500">
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    {user.lastLogin && (
                      <>
                        <span>•</span>
                        <span>Last login {new Date(user.lastLogin).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="hover:bg-purple-50 text-primary">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="bg-secondary-50 border-purple-200">
          <CardContent className="p-12 text-center">
            <p className="text-primary">No users found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}