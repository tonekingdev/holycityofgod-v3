import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  type IconDefinition,
  faArrowRight,
  faCalendar,
  faHeart,
  faPray,
  faUsers,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { DropInView } from "./DropInView"
import { FadeInView } from "./FadeInView"

interface FeatureItem {
  icon: IconDefinition
  title: string
  description: string
  link: string
  linkText: string
}

export default function FeaturedContent() {
  const features: FeatureItem[] = [
    {
      icon: faCalendar,
      title: "Upcoming Services",
      description: "Join us for worship and fellowship",
      link: "/services",
      linkText: "View Service Times",
    },
    {
      icon: faPray,
      title: "Prayer Requests",
      description: "We're here to pray with you",
      link: "/prayer",
      linkText: "Submit Request",
    },
    {
      icon: faUsers,
      title: "About our Church",
      description: "Learn about our mission and values",
      link: "/about",
      linkText: "Learn More",
    },
    {
      icon: faHeart,
      title: "Donate to our Vision",
      description: "Give tithe and/or offering",
      link: "/give",
      linkText: "Support our Ministry",
    },
  ]

  return (
    <section className="py-12">
      <div className="sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <DropInView>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Church Family</h2>
          </DropInView>
        </div>

        {/* Who We Are Section */}
        <FadeInView>
          <div className="card border border-purple-200 shadow-lg p-6 mb-8 text-center">
            <FadeInView>
              <p className="text-gray-600 mb-4 opacity-80">
                Holy City of God Christian Fellowship is a part of the Body of Christ that is centered on Christ
                Himself, and His mission of reconciliation. We understand that true reconciliation to God is the process
                of having an intimate and loving relationship with our Creator. During this process a nurturing
                relationship is formed, and we find our hope, peace, love, fulfillment, and joy in Him. We believe this
                is our foundational relationship that hinges the success of all other relationships.
              </p>
            </FadeInView>
            <FadeInView>
              <p className="text-gray-600 mb-4 opacity-80">
                We agree with Peter when he said, &quot;Silver and gold have I none; but such as I have give I thee: in the
                name of Jesus Christ of Nazareth,&quot; having Jesus is better than having silver or gold. Maintaining this
                relationship revolutionizes our entire lives. Holy City is dedicated to the personal success of every
                member. We are committed to reach beyond carnal limitations and inherit the promise of eternal life;
                therefore, all of our efforts are focused and directed towards this purpose.
              </p>
            </FadeInView>
          </div>
        </FadeInView>

        {/* Features with Individual Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <FadeInView key={index}>
              <div className="text-center p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 card h-full flex flex-col justify-between group hover:scale-105 hover:border-purple-300">
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-200">
                    <FontAwesomeIcon
                      icon={feature.icon}
                      className="w-8 h-8 text-primary group-hover:text-primary-700 transition-colors duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-secondary mb-4">{feature.description}</p>
                </div>
                <Link
                  href={feature.link}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-800 font-medium group-hover:gap-3 transition-all duration-300"
                >
                  {feature.linkText}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}