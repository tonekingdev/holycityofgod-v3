"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit3 } from "lucide-react"
import Link from "next/link"

interface EditPageButtonProps {
  pageId: string
  className?: string
}

export function EditPageButton({ pageId, className = "" }: EditPageButtonProps) {
  const [canEdit, setCanEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkPermissions() {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          // Check if user has content_manage permission
          const hasPermission =
            data.user?.role?.permissions?.includes("content_manage") || data.user?.role?.permissions?.includes("all")
          setCanEdit(hasPermission)
        }
      } catch (error) {
        console.error("Failed to check permissions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkPermissions()
  }, [])

  if (isLoading || !canEdit) {
    return null
  }

  return (
    <div className={`fixed top-20 right-6 z-50 ${className}`}>
      <Link href={`/admin/content?edit=${pageId}`}>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Edit Page
        </Button>
      </Link>
    </div>
  )
}