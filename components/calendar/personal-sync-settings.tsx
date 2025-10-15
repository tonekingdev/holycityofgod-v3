"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Settings, Send as Sync, AlertCircle, CheckCircle, Clock, ExternalLink } from "lucide-react"
import type { PersonalCalendarSync } from "@/types"

interface PersonalSyncSettingsProps {
  userId: string
}

export function PersonalSyncSettings({ userId }: PersonalSyncSettingsProps) {
  const [syncSettings, setSyncSettings] = useState<PersonalCalendarSync[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAppleModalOpen, setIsAppleModalOpen] = useState(false)
  const [appleCredentials, setAppleCredentials] = useState({
    email: "",
    password: "",
    calendarName: "",
  })
  const [appleLoading, setAppleLoading] = useState(false)
  const [appleError, setAppleError] = useState("")

  useEffect(() => {
    fetchSyncSettings()
  }, [userId])

  const fetchSyncSettings = async () => {
    try {
      const response = await fetch("/api/calendars/sync")
      const data = await response.json()
      if (data.success) {
        setSyncSettings(data.sync_settings)
      }
    } catch (error) {
      console.error("Failed to fetch sync settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectCalendar = async (provider: string) => {
    try {
      if (provider === "apple") {
        setIsAppleModalOpen(true)
        setIsAddModalOpen(false)
        return
      }

      window.location.href = `/api/calendar-sync/oauth/${provider}?redirect_uri=${encodeURIComponent(window.location.href)}`
    } catch (error) {
      console.error("Failed to initiate OAuth:", error)
    }
  }

  const handleConnectAppleCalendar = async () => {
    if (!appleCredentials.email || !appleCredentials.password) {
      setAppleError("Please provide both iCloud email and app-specific password")
      return
    }

    setAppleLoading(true)
    setAppleError("")

    try {
      const response = await fetch("/api/auth/calendar/apple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: appleCredentials.email,
          password: appleCredentials.password,
          calendarName: appleCredentials.calendarName,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAppleModalOpen(false)
        setAppleCredentials({ email: "", password: "", calendarName: "" })
        await fetchSyncSettings()
      } else {
        setAppleError(data.error || "Failed to connect Apple Calendar")
      }
    } catch (error) {
      console.error("Apple Calendar connection error:", error)
      setAppleError("Network error. Please try again.")
    } finally {
      setAppleLoading(false)
    }
  }

  const handleUpdateSyncSettings = async (syncId: string, updates: Partial<PersonalCalendarSync>) => {
    try {
      const response = await fetch(`/api/calendars/sync/${syncId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchSyncSettings()
      }
    } catch (error) {
      console.error("Failed to update sync settings:", error)
    }
  }

  const handleDisconnectCalendar = async (syncId: string) => {
    try {
      const response = await fetch(`/api/calendars/sync/${syncId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchSyncSettings()
      }
    } catch (error) {
      console.error("Failed to disconnect calendar:", error)
    }
  }

  const handleManualSync = async (syncId: string) => {
    try {
      await fetch(`/api/calendars/sync/${syncId}/sync`, {
        method: "POST",
      })
      await fetchSyncSettings()
    } catch (error) {
      console.error("Failed to trigger sync:", error)
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "📅"
      case "outlook":
        return "📧"
      case "apple":
        return "🍎"
      case "yahoo":
        return "📮"
      default:
        return "📆"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-100 text-emerald-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        )
      case "disconnected":
        return <Badge variant="outline">Disconnected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading calendar sync settings...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sync className="h-5 w-5 text-emerald-600" />
              Personal Calendar Sync
            </CardTitle>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Connect Calendar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect External Calendar</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Connect your personal calendar to sync your availability with the church calendar system.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { provider: "google", name: "Google Calendar", icon: "📅" },
                      { provider: "outlook", name: "Outlook Calendar", icon: "📧" },
                      { provider: "apple", name: "Apple Calendar", icon: "🍎" },
                      { provider: "yahoo", name: "Yahoo Calendar", icon: "📮" },
                    ].map((calendar) => (
                      <Button
                        key={calendar.provider}
                        variant="outline"
                        className="h-20 flex-col gap-2 bg-transparent"
                        onClick={() => handleConnectCalendar(calendar.provider)}
                      >
                        <span className="text-2xl">{calendar.icon}</span>
                        <span className="text-sm">{calendar.name}</span>
                      </Button>
                    ))}
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your personal events will remain private. Only your availability (busy/free) will be shared with
                      the church calendar.
                    </AlertDescription>
                  </Alert>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sync your personal calendars to show your availability to church leadership for scheduling meetings and
            events.
          </p>
        </CardContent>
      </Card>

      <Dialog open={isAppleModalOpen} onOpenChange={setIsAppleModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">🍎</span>
              Connect Apple Calendar
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Apple Calendar requires an app-specific password.
                <a
                  href="https://appleid.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Generate one here →
                </a>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div>
                <Label htmlFor="apple-email">iCloud Email</Label>
                <Input
                  id="apple-email"
                  type="email"
                  placeholder="your-email@icloud.com"
                  value={appleCredentials.email}
                  onChange={(e) => setAppleCredentials((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="apple-password">App-Specific Password</Label>
                <Input
                  id="apple-password"
                  type="password"
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  value={appleCredentials.password}
                  onChange={(e) => setAppleCredentials((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="apple-calendar-name">Calendar Name (Optional)</Label>
                <Input
                  id="apple-calendar-name"
                  placeholder="My Calendar"
                  value={appleCredentials.calendarName}
                  onChange={(e) => setAppleCredentials((prev) => ({ ...prev, calendarName: e.target.value }))}
                />
              </div>
            </div>

            {appleError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{appleError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setIsAppleModalOpen(false)}
                disabled={appleLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleConnectAppleCalendar}
                disabled={appleLoading}
              >
                {appleLoading ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connected Calendars */}
      {syncSettings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Calendars Connected</h3>
            <p className="text-muted-foreground mb-4">
              Connect your personal calendars to automatically sync your availability.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
              Connect Your First Calendar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {syncSettings.map((sync) => (
            <Card key={sync.id} className="border-l-4 border-l-emerald-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getProviderIcon(sync.calendar_provider)}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium capitalize">{sync.calendar_provider} Calendar</h3>
                        {sync.is_primary && <Badge variant="secondary">Primary</Badge>}
                        {getStatusBadge(sync.sync_status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {sync.calendar_name || `${sync.calendar_provider} Calendar`}
                      </p>
                      {sync.last_sync_at && (
                        <p className="text-xs text-muted-foreground">
                          Last synced: {new Date(sync.last_sync_at).toLocaleString()}
                        </p>
                      )}
                      {sync.error_message && <p className="text-xs text-red-600 mt-1">{sync.error_message}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManualSync(sync.id)}
                      disabled={sync.sync_status === "disconnected"}
                    >
                      <Sync className="h-3 w-3 mr-1" />
                      Sync Now
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Calendar Sync Settings</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Sync Direction</Label>
                            <Select
                              value={sync.sync_direction}
                              onValueChange={(value) =>
                                handleUpdateSyncSettings(sync.id, {
                                  sync_direction: value as "import_only" | "export_only" | "bidirectional",
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="import_only">Import Only (Personal → Church)</SelectItem>
                                <SelectItem value="export_only">Export Only (Church → Personal)</SelectItem>
                                <SelectItem value="bidirectional">Two-Way Sync</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Sync Frequency</Label>
                            <Select
                              value={sync.sync_frequency}
                              onValueChange={(value) =>
                                handleUpdateSyncSettings(sync.id, {
                                  sync_frequency: value as "real_time" | "hourly" | "daily" | "manual",
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="real_time">Real-time</SelectItem>
                                <SelectItem value="hourly">Every Hour</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="manual">Manual Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="primary">Set as Primary Calendar</Label>
                            <Switch
                              id="primary"
                              checked={sync.is_primary}
                              onCheckedChange={(checked) => handleUpdateSyncSettings(sync.id, { is_primary: checked })}
                            />
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => window.open(`https://${sync.calendar_provider}.com/calendar`, "_blank")}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Open Calendar
                            </Button>
                            <Button variant="destructive" onClick={() => handleDisconnectCalendar(sync.id)}>
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Privacy Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy Notice:</strong> Only your availability (busy/free times) is shared with church leadership.
          Personal event details remain private and are never accessed or stored by the church calendar system.
        </AlertDescription>
      </Alert>
    </div>
  )
}