import { NextResponse } from "next/server"
import { checkDatabaseHealth } from "@/lib/database"

export async function GET() {
  try {
    const dbHealthy = await checkDatabaseHealth()

    const health = {
      status: dbHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      database: dbHealthy ? "connected" : "disconnected",
      version: "1.0.0",
    }

    return NextResponse.json(health, {
      status: dbHealthy ? 200 : 503,
    })
  } catch (error) {
    console.error("[Anointed Innovations] Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 503 },
    )
  }
}