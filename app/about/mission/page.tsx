import type { Metadata } from "next"
import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import { ChevronRight, Heart, Users, BookOpen, Church, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Mission and Vision - Holy City of God Christian Fellowship",
  description:
    "Our mission is using the Ministry of Reconciliation to help others obtain Spiritual Maturity. Learn about our vision and goals.",
  keywords: "Mission, Vision, Statement, Holy City of God, Spiritual Maturity, Ministry of Reconciliation",
}

const visionPoints = [
  "Creating an environment of love & acceptance",
  "Providing ministries that uplift and empower",
  "Offering seminars, classes, and training that educate, strengthen, and build",
  "Conducting Worship Services that inspire, encourage, uplift, and motivate",
  "Fellowship, accountability, and moral support",
  "Addressing the needs of the total person (Spirit, body, & soul)",
]

const visionSections = [
  {
    title: "Our Environment",
    content:
      "We live a life of worship through sharing our God-given gifts of love, patience, joy, grace, talents, and encouragement with those around us.",
    icon: Heart,
  },
  {
    title: "Our Ministries",
    content:
      "We minister to the needs of others through specific ministries designed to enlighten, encourage, guide, and assist others at every level in Christ. We accomplish this through our Men's, Women's, Youth, Marriage & Family Enrichment, Singles, and Educational Ministries.(Eph 4:12-13; Heb. 6:1-2)",
    icon: Users,
  },
  {
    title: "Our Educational Services",
    content:
      "We respond to our Divine mandate to educate believers by teaching and living the biblical precepts and the principles of the doctrine of Christ. (Hosea 4:6; Matt 28:19)",
    icon: BookOpen,
  },
  {
    title: "Our Worship Services",
    content:
      "We offer God the perfect sacrifice of praise and worship God in Spirit and truth through song, prayer, humility, and application of the Word of God.",
    icon: Church,
  },
  {
    title: "Our Fellowship",
    content:
      "Fellowship is the result of like-minded persons entering into meaningful interactions: edifying, strengthening, and encouraging each other in their Christian Walk. We use fellowship to empower lives as we build healthy relationships, that are intimate, spiritual, and exciting! (Heb. 10:25)",
    icon: Users,
  },
  {
    title: "Our Personal Goal",
    content:
      "We use our environment, ministries, educational and worship services, and our fellowship to build the Kingdom of God one total person at a time.",
    icon: Heart,
  },
]

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <FadeInView>
          <div className="max-w-4xl mx-auto">
            {/* Mission Statement */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  <span className="text-secondary-500">O</span>ur <span className="text-secondary-500">M</span>ission{" "}
                  <span className="text-secondary-500">S</span>tatement
                </h1>
              </div>

              <DropInView>
                <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
                  <blockquote className="text-xl md:text-2xl font-medium text-gray-700 text-center italic leading-relaxed">
                    &quot;Using the Ministry of Reconciliation to help others obtain Spiritual Maturity&quot;
                  </blockquote>
                </div>
              </DropInView>
            </section>

            {/* Vision */}
            <section className="mb-16">
              <FadeInView>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    <span className="text-secondary-500">O</span>ur <span className="text-secondary-500">V</span>ision
                  </h2>
                </div>
              </FadeInView>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <DropInView>
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      By 2023, Holy City of God Christian Fellowship, Inc. will be assisting 250 families in their
                      Spiritual Growth through:
                    </p>

                    <ul className="space-y-4">
                      {visionPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <ChevronRight className="w-5 h-5 text-secondary-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </DropInView>

                <DropInView delay={0.2}>
                  <div className="flex justify-center">
                    <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src="/img/placeholder.jpg?height=256&width=256&text=Chalice"
                        alt="Chalice representing communion and fellowship"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </DropInView>
              </div>
            </section>

            {/* Vision Expounded */}
            <section>
              <FadeInView>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    <span className="text-secondary-500">O</span>ur <span className="text-secondary-500">V</span>ision{" "}
                    <span className="text-secondary-500">E</span>xpounded
                  </h2>
                </div>
              </FadeInView>

              <div className="grid md:grid-cols-2 gap-6">
                {visionSections.map((section, index) => {
                  const IconComponent = section.icon
                  return (
                    <DropInView key={section.title} delay={index * 0.1}>
                      <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-secondary-500 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-secondary-100 rounded-lg">
                            <IconComponent className="w-6 h-6 text-secondary-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{section.content}</p>
                      </div>
                    </DropInView>
                  )
                })}
              </div>
            </section>
          </div>
        </FadeInView>
        
        <FadeInView>
          <Link href="/about">
              <Button size="lg" variant="outline" className="border-purple-300 mt-4 shadow-lg hover:bg-gold-300 font-semibold hover:text-purple-700 hover-lift">
                <Info className="mr-2 h-5 w-5" />
                Back to About
              </Button>
          </Link>
        </FadeInView>
      </div>
    </div>
  )
}