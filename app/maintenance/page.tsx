import Image from "next/image"
import { Clock, Wrench, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function MaintenancePage() {
  // Get maintenance end time from environment variable
  const maintenanceEndTime = process.env.NEXT_PUBLIC_MAINTENANCE_END_TIME || ""
  const maintenanceReason = process.env.NEXT_PUBLIC_MAINTENANCE_REASON || "scheduled maintenance"

  // Calculate time remaining if end time is provided
  const getTimeRemaining = () => {
    if (!maintenanceEndTime) return null

    const end = new Date(maintenanceEndTime)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return null

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return { hours, minutes }
  }

  const timeRemaining = getTimeRemaining()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-purple-200">
        <CardContent className="p-8 md:p-12">
          {/* Church Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative h-24 w-24 overflow-hidden rounded-full shadow-lg border-4 border-purple-700">
              <Image
                src="/img/church-logo.png"
                alt="Holy City of God Christian Fellowship"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          </div>

          {/* Church Name */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">Holy City of God</h1>
          <p className="text-center text-gray-600 mb-8">Christian Fellowship</p>

          {/* Maintenance Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 p-6 rounded-full">
              <Wrench className="h-12 w-12 text-primary-700" />
            </div>
          </div>

          {/* Main Message */}
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">We&apos;ll Be Right Back</h2>
          <p className="text-center text-gray-600 mb-8 text-lg">
            Our website is currently undergoing {maintenanceReason}. We apologize for any inconvenience.
          </p>

          {/* Time Remaining */}
          {timeRemaining && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Clock className="h-5 w-5 text-primary-700" />
                <h3 className="font-semibold text-gray-900">Estimated Time Remaining</h3>
              </div>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-700">{timeRemaining.hours}</div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
                <div className="text-4xl font-bold text-primary-700">:</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-700">{timeRemaining.minutes}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Mail className="h-5 w-5 text-primary-700" />
              <h3 className="font-semibold text-gray-900">Need Immediate Assistance?</h3>
            </div>
            <p className="text-gray-600 mb-2">Contact us at:</p>
            <a href="mailto:info@holycityofgod.org" className="text-primary-700 hover:text-primary-800 font-medium">
              info@holycityofgod.org
            </a>
          </div>

          {/* Footer Message */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Thank you for your patience and understanding. We&apos;re working hard to serve you better.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}