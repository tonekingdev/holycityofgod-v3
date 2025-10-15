"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"
import type { Announcement } from "@/types"
import { ANNOUNCEMENT_PRIORITIES } from "@/types"

interface AnnouncementCardProps {
  announcement: Announcement
  showActions?: boolean
  onEdit?: (announcement: Announcement) => void
  onDelete?: (announcement: Announcement) => void
}

export function AnnouncementCard({ announcement, showActions = false, onEdit, onDelete }: AnnouncementCardProps) {
  const priorityConfig = ANNOUNCEMENT_PRIORITIES.find((p) => p.value === announcement.priority)
  const isExpiringSoon =
    announcement.expires_at && new Date(announcement.expires_at).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 // 7 days

  return (
    <Card className={`relative ${announcement.is_featured ? "ring-2 ring-primary" : ""}`}>
      {announcement.is_featured && (
        <div className="absolute -top-2 -right-2">
          <Badge variant="default" className="bg-primary">
            Featured
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight mb-2">{announcement.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{announcement.author_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {announcement.published_at
                    ? new Date(announcement.published_at).toLocaleDateString()
                    : "Not published"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={priorityConfig?.color}>
              {priorityConfig?.label}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {announcement.type.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3">{announcement.content}</p>

        {announcement.expires_at && (
          <div
            className={`flex items-center gap-1 text-sm mb-3 ${
              isExpiringSoon ? "text-orange-600" : "text-muted-foreground"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>
              Expires: {new Date(announcement.expires_at).toLocaleDateString()}
              {isExpiringSoon && " (Soon)"}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {announcement.metadata?.event_location && (
              <Badge variant="outline" className="text-xs">
                📍 {announcement.metadata.event_location}
              </Badge>
            )}
          </div>

          {showActions && (
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(announcement)}>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="outline" size="sm" onClick={() => onDelete(announcement)}>
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}