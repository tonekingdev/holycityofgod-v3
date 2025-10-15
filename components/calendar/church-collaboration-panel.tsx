"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Users, Plus, Send, Church, Clock } from "lucide-react"
import type { Church as ChurchType } from "@/types"

interface CollaborationRequest {
  id: number
  title: string
  description: string
  status: string
  initiating_church_id: number
  initiating_church_name: string
  proposed_date: string
  proposed_time: string
}

interface ChurchCollaborationPanelProps {
  currentChurch: ChurchType
}

export function ChurchCollaborationPanel({ currentChurch }: ChurchCollaborationPanelProps) {
  const [churches, setChurches] = useState<ChurchType[]>([])
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newCollaboration, setNewCollaboration] = useState({
    title: "",
    description: "",
    event_type: "collaboration",
    participating_churches: [] as string[],
    proposed_date: "",
    proposed_time: "",
  })

  const fetchChurches = useCallback(async () => {
    try {
      const response = await fetch("/api/churches")
      const data = await response.json()
      setChurches(data.filter((church: ChurchType) => church.id !== currentChurch.id))
    } catch (error) {
      console.error("Failed to fetch churches:", error)
    }
  }, [currentChurch.id])

  const fetchCollaborationRequests = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/collaborations?church_id=${currentChurch.id}`)
      const data = await response.json()
      setCollaborationRequests(data)
    } catch (error) {
      console.error("Failed to fetch collaboration requests:", error)
    }
  }, [currentChurch.id])

  useEffect(() => {
    fetchChurches()
    fetchCollaborationRequests()
  }, [fetchChurches, fetchCollaborationRequests])

  const handleCreateCollaboration = async () => {
    try {
      const response = await fetch("/api/events/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCollaboration,
          initiating_church_id: currentChurch.id,
          status: "pending",
        }),
      })

      if (response.ok) {
        setIsCreateModalOpen(false)
        setNewCollaboration({
          title: "",
          description: "",
          event_type: "collaboration",
          participating_churches: [],
          proposed_date: "",
          proposed_time: "",
        })
        await fetchCollaborationRequests()
      }
    } catch (error) {
      console.error("Failed to create collaboration:", error)
    }
  }

  const handleRespondToCollaboration = async (collaborationId: number, response: "accepted" | "declined") => {
    try {
      await fetch(`/api/events/collaborations/${collaborationId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          church_id: currentChurch.id,
          response,
        }),
      })
      await fetchCollaborationRequests()
    } catch (error) {
      console.error("Failed to respond to collaboration:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create New Collaboration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Church Collaborations
            </CardTitle>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Propose Collaboration
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Propose New Church Collaboration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newCollaboration.title}
                      onChange={(e) => setNewCollaboration((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Joint worship service, community outreach, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCollaboration.description}
                      onChange={(e) => setNewCollaboration((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the collaboration event and its purpose..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Proposed Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newCollaboration.proposed_date}
                        onChange={(e) => setNewCollaboration((prev) => ({ ...prev, proposed_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Proposed Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newCollaboration.proposed_time}
                        onChange={(e) => setNewCollaboration((prev) => ({ ...prev, proposed_time: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Invite Churches</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                      {churches.map((church) => (
                        <label
                          key={church.id}
                          className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={newCollaboration.participating_churches.includes(String(church.id))}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewCollaboration((prev) => ({
                                  ...prev,
                                  participating_churches: [...prev.participating_churches, String(church.id)],
                                }))
                              } else {
                                setNewCollaboration((prev) => ({
                                  ...prev,
                                  participating_churches: prev.participating_churches.filter(
                                    (id) => id !== String(church.id),
                                  ),
                                }))
                              }
                            }}
                          />
                          <span className="text-sm">{church.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateCollaboration}
                    disabled={!newCollaboration.title || newCollaboration.participating_churches.length === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Collaboration Proposal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {collaborationRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No collaboration requests at this time.</p>
          ) : (
            <div className="space-y-4">
              {collaborationRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{request.title}</h4>
                          <Badge
                            variant={
                              request.status === "pending"
                                ? "secondary"
                                : request.status === "accepted"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Church className="h-3 w-3" />
                            From: {request.initiating_church_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(request.proposed_date).toLocaleDateString()} at {request.proposed_time}
                          </div>
                        </div>
                      </div>
                      {request.status === "pending" && request.initiating_church_id !== Number(currentChurch.id) && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleRespondToCollaboration(request.id, "accepted")}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRespondToCollaboration(request.id, "declined")}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}