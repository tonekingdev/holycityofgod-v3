import { NextResponse } from "next/server"
import { POST_CATEGORIES } from "@/types"

export async function GET() {
  try {
    return NextResponse.json({ categories: POST_CATEGORIES })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}