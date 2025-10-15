import { type NextRequest, NextResponse } from "next/server"

// Mock sections data
const mockSections = [
  {
    id: "1",
    name: "Church Contact Information",
    key: "church_contact",
    type: "contact",
    category: "Global",
    content: {
      address: "28333 Marcia Ave, Warren, MI 48093",
      phone: "(313) 397-8240",
      email: "info@holycityofgod.org",
      website: "https://holycityofgod.org",
    },
    isActive: true,
    lastModified: "2024-01-15",
    modifiedBy: "Tone King",
    usedOn: ["About Page", "Contact Page", "Footer"],
  },
  {
    id: "2",
    name: "Service Schedule",
    key: "service_schedule",
    type: "schedule",
    category: "Services",
    content: {
      services: [
        { name: "Sunday Worship", day: "Sunday", time: "10:00 AM" },
        { name: "Wednesday Bible Study", day: "Wednesday", time: "7:00 PM" },
        { name: "Friday Prayer Conference", day: "Friday", time: "6:00 AM" },
      ],
    },
    isActive: true,
    lastModified: "2024-01-14",
    modifiedBy: "Bishop King",
    usedOn: ["Homepage", "Services Page", "About Page"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const active = searchParams.get("active")
    const search = searchParams.get("search")

    let filteredSections = [...mockSections]

    if (category && category !== "All") {
      filteredSections = filteredSections.filter((section) => section.category === category)
    }

    if (type) {
      filteredSections = filteredSections.filter((section) => section.type === type)
    }

    if (active !== null) {
      filteredSections = filteredSections.filter((section) => section.isActive === (active === "true"))
    }

    if (search) {
      filteredSections = filteredSections.filter(
        (section) =>
          section.name.toLowerCase().includes(search.toLowerCase()) ||
          section.key.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredSections,
      total: filteredSections.length,
    })
  } catch (error) {
    console.error("Failed to fetch sections:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch sections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.key || !body.type) {
      return NextResponse.json({ success: false, error: "Name, key, and type are required" }, { status: 400 })
    }

    // Check if key already exists
    const existingSection = mockSections.find((section) => section.key === body.key)
    if (existingSection) {
      return NextResponse.json({ success: false, error: "Section with this key already exists" }, { status: 409 })
    }

    const newSection = {
      id: Date.now().toString(),
      name: body.name,
      key: body.key,
      type: body.type,
      category: body.category || "Global",
      content: body.content || {},
      isActive: body.isActive !== undefined ? body.isActive : true,
      lastModified: new Date().toISOString().split("T")[0],
      modifiedBy: body.modifiedBy || "Unknown",
      usedOn: body.usedOn || [],
    }

    mockSections.push(newSection)

    return NextResponse.json(
      {
        success: true,
        data: newSection,
        message: "Section created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Failed to create section:", error)
    return NextResponse.json({ success: false, error: "Failed to create section" }, { status: 500 })
  }
}