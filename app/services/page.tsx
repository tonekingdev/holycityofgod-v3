import type { Metadata } from "next"
import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import { Clock, Calendar, Phone, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Services - Holy City of God Christian Fellowship",
  description: "Schedule of services and special meetings at Holy City of God Christian Fellowship.",
  keywords: "Services, Operation, Holy, City, of, God, Schedule, Worship",
}

const regularServices = [
  {
    title: "Pastor's Interactive Bible Study",
    day: "Wednesday",
    time: "7:00 PM",
  },
  {
    title: "Corporate Prayer Conference",
    day: "Friday",
    time: "6:00 AM",
    info: "(712) 775-7031 Participant Code 796680#",
  },
  {
    title: "Institutional Bible Lessons",
    day: "Sunday",
    time: "9:00 AM",
  },
  {
    title: "Worship Services",
    day: "Sunday",
    time: "10:00 AM",
  },
]

const specialServices = [
  "Support Group Meetings",
  "Mentorship Program Meetings",
  "Information Technology Training",
  "Financial Planning Classes",
  "Health Tips",
  "Tutoring",
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <FadeInView>
          <div className="max-w-4xl mx-auto">
            {/* Regular Services */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  <span className="text-secondary-500">S</span>chedule <span className="text-secondary-500">O</span>f{" "}
                  <span className="text-secondary-500">S</span>ervices
                </h1>
                <p className="text-lg text-gray-600">Join us for worship, prayer, and fellowship throughout the week</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {regularServices.map((service, index) => (
                  <DropInView key={service.title} delay={index * 0.1}>
                    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-secondary-500 hover:shadow-xl transition-shadow duration-300">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>

                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-secondary-600" />
                          <span className="font-medium text-gray-700">{service.day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-secondary-600" />
                          <span className="font-medium text-gray-700">{service.time}</span>
                        </div>
                      </div>

                      {service.info && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-secondary-50 rounded-md">
                          <Phone className="w-4 h-4 text-secondary-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{service.info}</span>
                        </div>
                      )}
                    </div>
                  </DropInView>
                ))}
              </div>
            </section>

            {/* Special Services */}
            <section>
              <FadeInView>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    <span className="text-secondary-500">S</span>pecial <span className="text-secondary-500">S</span>
                    ervices & <span className="text-secondary-500">M</span>eetings
                  </h2>
                </div>
              </FadeInView>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {specialServices.map((service, index) => (
                  <DropInView key={service} delay={index * 0.1}>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-secondary-500 hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-lg font-semibold text-gray-900">{service}</h3>
                    </div>
                  </DropInView>
                ))}
              </div>

              <DropInView delay={0.3}>
                <div className="bg-secondary-50 rounded-lg p-8 text-center border border-secondary-200">
                  <div className="flex justify-center mb-4">
                    <Phone className="w-8 h-8 text-secondary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">More Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Call the office for more information and for dates & times of our special services and meetings.
                  </p>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="border-secondary-300 hover:bg-white hover:text-secondary-700 hover:shadow-sm hover-lift">
                      <Home className="h5 w-5 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </DropInView>
            </section>
          </div>
        </FadeInView>

      </div>
    </div>
  )
}