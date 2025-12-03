"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Church, Users, Eye, Edit, Share2 } from "lucide-react"
import type { Church as ChurchType, Calendar as CalendarType, CalendarPermission } from "@/types"

interface ChurchSharingModalProps {
  isOpen: boolean
  onClose: () => void
  calendar: CalendarType
  currentChurch: ChurchType
}

export function ChurchSharingModal({ isOpen, onClose, calendar, currentChurch }: ChurchSharingModalProps) {
  const [churches, setChurches] = useState<ChurchType[]>([])
  const [permissions, setPermissions] = useState<CalendarPermission[]>([])
  const [selectedChurch, setSelectedChurch] = useState<string>("")
  const [permissionLevel, setPermissionLevel] = useState<"view" | "edit">("view")
  const [loading, setLoading] = useState(false)

  const fetchChurches = useCallback(async () => {
    try {
      const response = await fetch("/api/churches")
      const data = await response.json()
      // Filter out current church
      setChurches(data.filter((church: ChurchType) => church.id !== currentChurch.id))
    } catch (error) {
      console.error("Failed to fetch churches:", error)
    }
  }, [currentChurch.id])

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await fetch(`/api/calendars/${calendar.id}/permissions`)
      const data = await response.json()
      setPermissions(data)
    } catch (error) {
      console.error("Failed to fetch permissions:", error)
    }
  }, [calendar.id])

  useEffect(() => {
    if (isOpen) {
      fetchChurches()
      fetchPermissions()
    }
  }, [isOpen, fetchChurches, fetchPermissions])

  const handleGrantAccess = async () => {
    if (!selectedChurch) return

    setLoading(true)
    try {
      const response = await fetch(`/api/calendars/${calendar.id}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          church_id: selectedChurch,
          permission_level: permissionLevel,
          granted_by: currentChurch.id,
        }),
      })

      if (response.ok) {
        await fetchPermissions()
        setSelectedChurch("")
        setPermissionLevel("view")
      }
    } catch (error) {
      console.error("Failed to grant access:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeAccess = async (permissionId: string) => {
    try {
      await fetch(`/api/calendars/permissions/${permissionId}`, {
        method: "DELETE",
      })
      await fetchPermissions()
    } catch (error) {
      console.error("Failed to revoke access:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-emerald-600" />
            Share Calendar: {calendar.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grant New Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grant Access to Church</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="church-select">Select Church</Label>
                <Select value={selectedChurch} onValueChange={setSelectedChurch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a church..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {churches.map((church) => (
                      <SelectItem key={church.id} value={church.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Church className="h-4 w-4" />
                          {church.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="permission-level">Permission Level</Label>
                <Select value={permissionLevel} onValueChange={(value: "view" | "edit") => setPermissionLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="view">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Only
                      </div>
                    </SelectItem>
                    <SelectItem value="edit">
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        View & Edit
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGrantAccess}
                disabled={!selectedChurch || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Granting Access..." : "Grant Access"}
              </Button>
            </CardContent>
          </Card>

          {/* Current Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Shared Access</CardTitle>
            </CardHeader>
            <CardContent>
              {permissions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No churches have access to this calendar yet.</p>
              ) : (
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Church className="h-4 w-4 text-emerald-600" />
                        <div>
                          <p className="font-medium">{permission.granted_to}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={permission.permission_type === "edit" ? "default" : "secondary"}>
                              {permission.permission_type === "edit" ? (
                                <>
                                  <Edit className="h-3 w-3 mr-1" /> Edit
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3 w-3 mr-1" /> View
                                </>
                              )}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Since {new Date(permission.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeAccess(permission.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Network-wide Calendar Notice */}
        {calendar.calendar_type?.level === "network" && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <Users className="h-4 w-4" />
                <p className="text-sm">
                  This is a network-wide calendar. All churches in the Holy City of God fellowship automatically have
                  access to view and participate in these events.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}