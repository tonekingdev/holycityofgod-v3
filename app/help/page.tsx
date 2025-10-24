import type { Metadata } from "next"
import { BookOpen, Edit, Upload, CheckCircle, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Help & Instructions - Holy City of God",
  description:
    "Learn how to use the Holy City of God website features including content editing, message uploads, event management, and more.",
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-card to-secondary/5 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Help & Instructions</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Learn how to use all the features of the Holy City of God website
          </p>
        </div>
      </section>

      {/* Quick Start Guides */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Start Guides</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* For Editors */}
            <Card>
              <CardHeader>
                <Edit className="h-8 w-8 text-primary mb-2" />
                <CardTitle>For Content Editors</CardTitle>
                <CardDescription>Learn how to edit page content</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Log in with your editor account</li>
                  <li>Navigate to any page you want to edit</li>
                  <li>Click the &quot;Edit Page&quot; button at the top</li>
                  <li>Make your changes in the content editor</li>
                  <li>Click &quot;Save Changes&quot; when done</li>
                </ol>
              </CardContent>
            </Card>

            {/* For Preachers */}
            <Card>
              <CardHeader>
                <Upload className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>For Preaching Leaders</CardTitle>
                <CardDescription>Upload and share messages</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Go to the Word Management page</li>
                  <li>Click &quot;Upload New Message&quot;</li>
                  <li>Fill in message details (title, date, scripture)</li>
                  <li>Upload audio/video file</li>
                  <li>Add sermon notes or transcript</li>
                  <li>Click &quot;Publish&quot; to make it available</li>
                </ol>
              </CardContent>
            </Card>

            {/* For Event Creators */}
            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Creating Events</CardTitle>
                <CardDescription>Schedule meetings and events</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to the Events page</li>
                  <li>Click &quot;Create New Event&quot;</li>
                  <li>Enter event details and date/time</li>
                  <li>Submit for approval</li>
                  <li>First Lady reviews first</li>
                  <li>Bishop Anthony gives final approval</li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Detailed Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {/* Editing Content */}
                <AccordionItem value="editing">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <Edit className="h-5 w-5 text-primary" />
                      Editing Page Content
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Who Can Edit?</h4>
                      <p>
                        Only users with content management permissions can edit pages. If you don&apos;t see the &quot;Edit Page&quot;
                        button, contact an administrator.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">How to Edit:</h4>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Log in to your account</li>
                        <li>Navigate to the page you want to edit (Home, About, Give, etc.)</li>
                        <li>Look for the &quot;Edit Page&quot; button in the top-right corner</li>
                        <li>Click it to open the content editor</li>
                        <li>Make your changes using the visual editor</li>
                        <li>Preview your changes before saving</li>
                        <li>Click &quot;Save Changes&quot; to publish</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Editing the Hero Background:</h4>
                      <p>On the homepage, you can change the hero section background image or video:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li>Upload a background image (recommended: 1920x600px)</li>
                        <li>Or add a video URL for a looping background video</li>
                        <li>Adjust the overlay opacity (0-100) to ensure text is readable</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Uploading Messages */}
                <AccordionItem value="messages">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-secondary" />
                      Uploading Messages
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Supported Formats:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Audio: MP3, WAV</li>
                        <li>Video: MP4, MOV</li>
                        <li>Documents: PDF (for sermon notes)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Upload Process:</h4>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Go to Admin → Word Management</li>
                        <li>Click &quot;Upload New Message&quot;</li>
                        <li>
                          Fill in required fields:
                          <ul className="list-disc list-inside ml-6 mt-1">
                            <li>Message title</li>
                            <li>Date preached</li>
                            <li>Scripture reference</li>
                            <li>Speaker name</li>
                          </ul>
                        </li>
                        <li>Upload your audio/video file</li>
                        <li>Optionally add sermon notes or transcript</li>
                        <li>Add tags for easy searching</li>
                        <li>Click &quot;Publish&quot; to make it available</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Sharing During Services:</h4>
                      <p>Once uploaded, you can share messages during services by:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li>Using the share link provided after upload</li>
                        <li>Displaying the message page on screen</li>
                        <li>Embedding the audio/video player in presentations</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Event Approval */}
                <AccordionItem value="events">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Event Approval Process
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Two-Stage Approval:</h4>
                      <p>All events, meetings, and appointments go through a two-stage approval process:</p>
                      <ol className="list-decimal list-inside space-y-2 ml-4 mt-2">
                        <li>
                          <strong>First Approval:</strong> First Lady reviews and approves
                        </li>
                        <li>
                          <strong>Final Approval:</strong> Bishop Anthony King gives final approval
                        </li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Creating an Event:</h4>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Navigate to the Events or Calendar page</li>
                        <li>Click &quot;Create New Event&quot;</li>
                        <li>Fill in all event details</li>
                        <li>Submit the event</li>
                        <li>You&apos;ll receive an email confirmation</li>
                        <li>Wait for approval notifications</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Scheduling with Bishop Anthony:</h4>
                      <p>To schedule a meeting with Bishop Anthony:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li>Create an event with category &quot;Meeting&quot;</li>
                        <li>Include purpose and agenda in description</li>
                        <li>Suggest 2-3 preferred time slots</li>
                        <li>Wait for approval from First Lady, then Bishop</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Approval Status:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>
                          <strong>Pending:</strong> Awaiting First Lady&apos;s review
                        </li>
                        <li>
                          <strong>First Approved:</strong> Awaiting Bishop&apos;s final approval
                        </li>
                        <li>
                          <strong>Final Approved:</strong> Event is confirmed and published
                        </li>
                        <li>
                          <strong>Rejected:</strong> Event was not approved (reason provided)
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Using the Bible */}
                <AccordionItem value="bible">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-secondary" />
                      Using the Bible Reader
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Navigation:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Click on any book name to start reading</li>
                        <li>Use the dropdown menus to select book and chapter</li>
                        <li>Click verse numbers to jump to specific verses</li>
                        <li>Use Previous/Next buttons to navigate chapters</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Features:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>King James Version (KJV) text</li>
                        <li>Clean, readable layout</li>
                        <li>Verse-by-verse navigation</li>
                        <li>Search functionality (coming soon)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Direct Links:</h4>
                      <p>You can link directly to any chapter or verse:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li>Chapter: /bible/John/3</li>
                        <li>Verse: /bible/John/3/16</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you need additional assistance or have questions not covered here, please contact:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Technical Support:</strong> support@holycityofgod.org
                </p>
                <p>
                  <strong>Content Questions:</strong> ck@holycityofgod.org
                </p>
                <p>
                  <strong>General Inquiries:</strong> (313) 397-8240
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}