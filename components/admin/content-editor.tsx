"use client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Upload } from "lucide-react"

interface ContentData {
  [key: string]: string | number | boolean | ContentData | ArrayItem[] | unknown
}

interface ArrayItem {
  [key: string]: string
}

interface ContentEditorProps {
  content: ContentData
  onChange: (content: ContentData) => void
  pageType: string
}

export function ContentEditor({ content, onChange, pageType }: ContentEditorProps) {
  const initializeDefaultContent = () => {
    if (!content || Object.keys(content).length === 0) {
      const defaultContent: ContentData = {}

      switch (pageType) {
        case "home":
          defaultContent.hero = {
            title: "Holy City of God",
            subtitle: "Christian Fellowship Inc.",
            description:
              "Welcome to our church family where faith, hope, and love come together in worship and fellowship.",
            backgroundImage: "/church-sanctuary.png",
            ctaText: "Join Our Services",
            ctaLink: "/services",
            secondaryCtaText: "Give Online",
            secondaryCtaLink: "/give",
          }
          defaultContent.verseOfTheDay = {
            enabled: true,
            title: "Daily Scripture",
            subtitle: "God's Word for Today",
          }
          defaultContent.featuredContent = {
            enabled: true,
            title: "Featured Content",
            subtitle: "Discover what's happening in our church community",
            items: [
              {
                title: "Sunday Service",
                description: "Join us for worship and fellowship",
                image: "/placeholder.svg?height=200&width=300",
                link: "/services",
              },
            ],
          }
          defaultContent.latestPosts = {
            enabled: true,
            title: "Latest Updates",
            subtitle: "Stay connected with our church community",
            showCount: 3,
          }
          defaultContent.ctaSection = {
            enabled: true,
            title: "Join Our Community",
            subtitle: "Experience God's love and fellowship",
            description: "We invite you to be part of our church family and grow in faith together.",
            primaryButton: {
              text: "Visit Us",
              link: "/services",
            },
            secondaryButton: {
              text: "Contact Us",
              link: "/contact",
            },
            backgroundImage: "/placeholder.svg?height=400&width=800",
          }
          break
        case "give":
          defaultContent.hero = {
            title: "Give",
            subtitle: "Supporting God's Work",
            content: "Your generous giving helps us continue our mission and ministry in the community.",
          }
          break
        case "prayer":
          defaultContent.hero = {
            title: "Prayer Requests",
            subtitle: "We're Here to Pray With You",
            content: "Submit your prayer requests and let our church family lift you up in prayer.",
          }
          break
      }

      onChange(defaultContent)
      return defaultContent
    }
    return content
  }

  const workingContent = initializeDefaultContent()

  const updateField = (path: string[], value: string | ContentData | ArrayItem[]) => {
    const newContent = { ...workingContent }
    let current: ContentData = newContent

    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {}
      }
      current = current[path[i]] as ContentData
    }

    current[path[path.length - 1]] = value
    onChange(newContent)
  }

  const getFieldValue = (path: string[]): string => {
    let current: unknown = workingContent
    for (const key of path) {
      if (!current || typeof current !== "object") return ""
      current = (current as ContentData)[key]
    }
    return typeof current === "string" ? current : ""
  }

  const getArrayValue = (path: string[]): ArrayItem[] => {
    let current: unknown = workingContent
    for (const key of path) {
      if (!current || typeof current !== "object") return []
      current = (current as ContentData)[key]
    }
    return Array.isArray(current) ? (current as ArrayItem[]) : []
  }

  const renderField = (label: string, path: string[], type: "text" | "textarea" | "image" = "text") => {
    const value = getFieldValue(path)

    return (
      <div className="space-y-2">
        <Label htmlFor={path.join(".")} className="text-sm font-medium">
          {label}
        </Label>
        {type === "textarea" ? (
          <Textarea
            id={path.join(".")}
            value={value}
            onChange={(e) => updateField(path, e.target.value)}
            rows={4}
            className="resize-none"
          />
        ) : type === "image" ? (
          <div className="space-y-2">
            <Input
              id={path.join(".")}
              value={value}
              onChange={(e) => updateField(path, e.target.value)}
              placeholder="Image URL or path"
            />
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        ) : (
          <Input id={path.join(".")} value={value} onChange={(e) => updateField(path, e.target.value)} />
        )}
      </div>
    )
  }

  const renderArrayField = (label: string, path: string[], itemTemplate: ArrayItem) => {
    const array = getArrayValue(path)

    const addItem = () => {
      const newArray = [...array, { ...itemTemplate }]
      updateField(path, newArray)
    }

    const removeItem = (index: number) => {
      const newArray = array.filter((_: ArrayItem, i: number) => i !== index)
      updateField(path, newArray)
    }

    const updateItem = (index: number, field: string, value: string) => {
      const newArray = [...array]
      newArray[index] = { ...newArray[index], [field]: value }
      updateField(path, newArray)
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <Button onClick={addItem} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        {array.map((item: ArrayItem, index: number) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Item {index + 1}</span>
              <Button
                onClick={() => removeItem(index)}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(itemTemplate).map((field) => (
                <div key={field} className="space-y-2">
                  <Label className="text-xs font-medium capitalize">{field.replace(/([A-Z])/g, " $1").trim()}</Label>
                  <Input
                    value={item[field] || ""}
                    onChange={(e) => updateItem(index, field, e.target.value)}
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // Render different editor layouts based on page type
  const renderPageEditor = () => {
    switch (pageType) {
      case "home":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Title", ["hero", "title"])}
                {renderField("Subtitle", ["hero", "subtitle"])}
                {renderField("Description", ["hero", "description"], "textarea")}
                {renderField("Background Image", ["hero", "backgroundImage"], "image")}
                {renderField("Primary CTA Text", ["hero", "ctaText"])}
                {renderField("Primary CTA Link", ["hero", "ctaLink"])}
                {renderField("Secondary CTA Text", ["hero", "secondaryCtaText"])}
                {renderField("Secondary CTA Link", ["hero", "secondaryCtaLink"])}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verse of the Day</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verseEnabled"
                    checked={getFieldValue(["verseOfTheDay", "enabled"]) === "true"}
                    onChange={(e) => updateField(["verseOfTheDay", "enabled"], e.target.checked.toString())}
                  />
                  <Label htmlFor="verseEnabled">Enable Verse of the Day</Label>
                </div>
                {renderField("Title", ["verseOfTheDay", "title"])}
                {renderField("Subtitle", ["verseOfTheDay", "subtitle"])}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featuredEnabled"
                    checked={getFieldValue(["featuredContent", "enabled"]) === "true"}
                    onChange={(e) => updateField(["featuredContent", "enabled"], e.target.checked.toString())}
                  />
                  <Label htmlFor="featuredEnabled">Enable Featured Content</Label>
                </div>
                {renderField("Title", ["featuredContent", "title"])}
                {renderField("Subtitle", ["featuredContent", "subtitle"])}
                {renderArrayField("Featured Items", ["featuredContent", "items"], {
                  title: "",
                  description: "",
                  image: "",
                  link: "",
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latest Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="postsEnabled"
                    checked={getFieldValue(["latestPosts", "enabled"]) === "true"}
                    onChange={(e) => updateField(["latestPosts", "enabled"], e.target.checked.toString())}
                  />
                  <Label htmlFor="postsEnabled">Enable Latest Posts</Label>
                </div>
                {renderField("Title", ["latestPosts", "title"])}
                {renderField("Subtitle", ["latestPosts", "subtitle"])}
                {renderField("Number of Posts to Show", ["latestPosts", "showCount"])}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call to Action Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ctaEnabled"
                    checked={getFieldValue(["ctaSection", "enabled"]) === "true"}
                    onChange={(e) => updateField(["ctaSection", "enabled"], e.target.checked.toString())}
                  />
                  <Label htmlFor="ctaEnabled">Enable CTA Section</Label>
                </div>
                {renderField("Title", ["ctaSection", "title"])}
                {renderField("Subtitle", ["ctaSection", "subtitle"])}
                {renderField("Description", ["ctaSection", "description"], "textarea")}
                {renderField("Background Image", ["ctaSection", "backgroundImage"], "image")}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Primary Button</Label>
                    {renderField("Button Text", ["ctaSection", "primaryButton", "text"])}
                    {renderField("Button Link", ["ctaSection", "primaryButton", "link"])}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Secondary Button</Label>
                    {renderField("Button Text", ["ctaSection", "secondaryButton", "text"])}
                    {renderField("Button Link", ["ctaSection", "secondaryButton", "link"])}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "about":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Title", ["hero", "title"])}
                {renderField("Subtitle", ["hero", "subtitle"])}
                {renderField("Content", ["hero", "content"], "textarea")}
                {renderField("Image", ["hero", "image"], "image")}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Story Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Title", ["story", "title"])}
                {renderField("Content", ["story", "content"], "textarea")}
              </CardContent>
            </Card>
          </div>
        )

      case "coreValues":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Title", ["hero", "title"])}
                {renderField("Subtitle", ["hero", "subtitle"])}
                {renderField("Content", ["hero", "content"], "textarea")}
                {renderField("Image", ["hero", "image"], "image")}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Core Values</CardTitle>
              </CardHeader>
              <CardContent>
                {renderArrayField("Values", ["values"], {
                  title: "",
                  description: "",
                  icon: "",
                })}
              </CardContent>
            </Card>
          </div>
        )

      case "statementOfFaith":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Title", ["hero", "title"])}
                {renderField("Subtitle", ["hero", "subtitle"])}
                {renderField("Content", ["hero", "content"], "textarea")}
                {renderField("Image", ["hero", "image"], "image")}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Beliefs</CardTitle>
              </CardHeader>
              <CardContent>
                {renderArrayField("Beliefs", ["beliefs"], {
                  title: "",
                  content: "",
                })}
              </CardContent>
            </Card>
          </div>
        )

      case "give":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Title", ["hero", "title"])}
                {renderField("Subtitle", ["hero", "subtitle"])}
                {renderField("Content", ["hero", "content"], "textarea")}
              </CardContent>
            </Card>
          </div>
        )

      case "prayer":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Title", ["hero", "title"])}
                {renderField("Subtitle", ["hero", "subtitle"])}
                {renderField("Content", ["hero", "content"], "textarea")}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderField("Title", ["hero", "title"])}
                {renderField("Subtitle", ["hero", "subtitle"])}
                {renderField("Content", ["hero", "content"], "textarea")}
                {renderField("Image", ["hero", "image"], "image")}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Raw Content Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={JSON.stringify(workingContent, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed: ContentData = JSON.parse(e.target.value) as ContentData
                      onChange(parsed)
                    } catch {
                      // Invalid JSON, don't update
                    }
                  }}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Enter valid JSON content..."
                />
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return <div className="space-y-6">{renderPageEditor()}</div>
}