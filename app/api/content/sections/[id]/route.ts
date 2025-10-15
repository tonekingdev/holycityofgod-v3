import { type NextRequest, NextResponse } from "next/server"

// Mock sections data - same as above
const mockSections = [
  {
    id: "1",
    name: "Church Contact Information",
    key: "church_contact",
    type: "contact",
    category: "Global",
    content: {
      address: "28333 Marcia Ave, Warren, MI 48093",
      phone: "(313) 555-0123",
      email: "info@holycityofgod.org",
      website: "https://holycityofgod.org",
    },
    isActive: true,
    lastModified: "2024-01-15",
    modifiedBy: "Tone King",
    usedOn: ["About Page", "Contact Page", "Footer"],
  },
]

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const section = mockSections.find((s) => s.id === params.id)

    if (!section) {
      return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: section,
    })
  } catch (error) {
    console.error("Failed to fetch section:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch section" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const body = await request.json()
    const sectionIndex = mockSections.findIndex((s) => s.id === params.id)

    if (sectionIndex === -1) {
      return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 })
    }

    // Update the section
    mockSections[sectionIndex] = {
      ...mockSections[sectionIndex],
      ...body,
      lastModified: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({
      success: true,
      data: mockSections[sectionIndex],
      message: "Section updated successfully",
    })
  } catch (error) {
    console.error("Failed to update section:", error)
    return NextResponse.json({ success: false, error: "Failed to update section" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const sectionIndex = mockSections.findIndex((s) => s.id === params.id)

    if (sectionIndex === -1) {
      return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 })
    }

    const deletedSection = mockSections.splice(sectionIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedSection,
      message: "Section deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete section:", error)
    return NextResponse.json({ success: false, error: "Failed to delete section" }, { status: 500 })
  }
}