import { DropInView } from "@/components/DropInView"
import { FadeInView } from "@/components/FadeInView"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CHURCH_INFO } from "@/constants"
import { ArrowRight, BookOpen, Calendar, Heart, Home, Users } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"


export const metadata: Metadata = {
    title: "About Us | Holy City of God Christian Fellowship",
    description: "Learn about our church, our mission, values, and statement of faith.",
}

export default function AboutPage() {
    const aboutSections =[
        {
            title: "Mission Statement",
            description: "Using the Ministry of Reconciliation to help others obtain Spiritual Maturity.",
            icon: Heart,
            href: "/about/mission",
            color: "bg-red-100 text-red-700 border-red-200"
        },
        {
            title: "Core Values",
            description: "The principles and beliefs that guide our church and community.",
            icon: Users,
            href: "/about/core-values",
            color: "bg-blue-100 text-blue-700 border-blue-200",
        },
        {
            title: "Services",
            description: "Join us for worship, prayer, and fellowship throughout the week.",
            icon: Calendar,
            href: "/services",
            color: "bg-green-100 text-green-700 border-green-200",
        },
        {
            title: "Statement of Faith",
            description: "What we believe as followers of Christ and members of this church.",
            icon: BookOpen,
            href: "/about/statement-of-faith",
            color: "bg-purple-100 text-purple-700 border-purple-200",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            {/* Hero Section */}
            <section className="relative py-16 bg-gradient-to-r from-purple-800 to-purple-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <DropInView>
                            <div className="flex justify-center mb-8">
                                <div className="relative h-32 w-32 bg-white rounded-full p-4 overflow-hidden shadow-2xl">
                                    <Image 
                                        src="/img/church-logo.png"
                                        alt="Holy City of God Christian Fellowship"
                                        width={96}
                                        height={96}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </DropInView>

                        <DropInView delay={0.9}>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                About Our Church
                            </h1>
                        </DropInView>

                        <FadeInView delay={0.98}>
                            <p className="text-xl md:tex-2xl mb-8 opacity-90 leading-relaxed">
                                Holy City of God Christian Fellowship Inc.
                            </p>
                        </FadeInView>

                        <FadeInView delay={1.4}>
                            <p className="text-lg opacity-80 max-w-3xl mx-auto leading-relaxed">
                                {CHURCH_INFO.subtitle}
                            </p>
                        </FadeInView>
                    </div>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="py-12">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <DropInView>
                            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
                                Welcome to Our Family
                            </h2>
                        </DropInView>

                        <FadeInView delay={0.5}>
                            <Card className="border-purple-200 shadow-lg bg-gradient-to-br from-white to-purple-50">
                                <CardContent className="p-8">
                                    <div className="prose prose-lg max-w-none text-gray-700 leading relaxed">
                                        <p className="mb-6">
                                            Holy City of God Christian Fellowship is a part of the Body of Christ that is centered on Christ Himself, and His mission of reconciliation. We understand that the true reconciliation to God is the process of having an intimate and loving relationship with our Creator.
                                        </p>
                                        <p className="mb-6">
                                            During this process a nurturing relationship is formed, and we find our hope, peace, love, fulfillment, and joy in Him. We believe this is our foundational relationship that hings the success of all other relationships.
                                        </p>
                                        <p className="mb-6">
                                            We agree with Peter when he said, &quot;Silver and Gold have I none; but such as I have give I thee: in the name of Jesus Christ of Nazareth,&quot; having Jesus is better than having silver or gold. Maintaining this relationship revolutionizes our entire lives.
                                        </p>
                                        <p className="mb-6">
                                            Holy City is dedicated to the personal success of every member. We are committed to reach beyond carnal limitations and inherit the promise of eternal lif; therefore, all of our efforts are focused and directed towards this purpose.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeInView>
                    </div>
                </div>
            </section>

            {/* About Sections Grid */}
            <section className="py-16 bg-gradient-to-b from-white to-purple-50">
                <div className="container">
                    <DropInView>
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
                            Learn More About Us
                        </h2>
                    </DropInView>

                    <FadeInView delay={0.6}>
                        <p className="text-xl text-gray-700 text-center mb-12 max-w-2xl mx-auto">
                            Explore the different aspects of our church community.
                        </p>
                    </FadeInView>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w 4xl mx-auto">
                        {aboutSections.map((section, index) =>(
                            <FadeInView key={section.href} delay={0.5 + (index * 0.1)}>
                                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-purple-100 hover:border-purple-200 bg-white">
                                    <CardContent className="p-8">
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-3 rounded-lg ${section.color} group-hover:scale-110 transition-transform duration-300`}>
                                                <section.icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                                                    {section.title}
                                                </h3>
                                                <p className="text-gray-600 mb-4 leading-relaxed">
                                                    {section.description}
                                                </p>
                                                <Link href={section.href} className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium group-hover:gap-2 transition-all duration-300"
                                                >
                                                    Learn More
                                                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </FadeInView>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pastor Section */}
            <section className="py-8">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <DropInView>
                            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                                Meet Our Pastor
                            </h2>
                        </DropInView>

                        <FadeInView delay={0.3}>
                            <Card className="border-purple-200 shadow-lg">
                                <CardContent className="p-8">
                                    <div className="grid md:grid-cols-3 gap-8 items-center">
                                        <div className="text-center">
                                            <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-purple-300 shadow-lg">
                                                <Image 
                                                    src="/img/King_T_1-min.jpg?height=200&width=200&text=Pastor+Photo"
                                                    alt="Pastor"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <Badge className="bg-purple-100 text-purple-800 hover:text-purple-50 border-purple-200">
                                                Presiding Bishop
                                            </Badge>
                                        </div>
                                        <div className="md:col-span-2">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                                Bishop Anthony King, Sr.
                                            </h3>
                                            <p className="text-gray-700 mb-4 leading-relaxed">
                                                Bishop Anthony K. King, Sr. is the founding pastor of Holy City of God Christian Fellowship, Inc., in Detroit, Michigan. Bishop King also serves as First Assistant Presiding Bishop of Maranatha Faith Fellowship International, Inc, in McDonough, Georgia.
                                            </p>
                                            <p className="text-gray-700 mb-4 leading-relaxed">
                                                Bishop King&apos;s leadership inspiration and divine mandate is found in Hebrews 6:1, received in a vision in 1998. “Let us go on to perfection (maturity)” has become his mandate and mantra. Bishop King&apos;s greatest joy is to see God&apos;s people mature in Him. He truly enjoys recognizing and developing potential in those whom he leads. His ministry has shaped and encouraged the lives of thousands of people in his over 25-year ministry tenure. Therefore, Spiritual Formation is the foundation of his leadership.
                                            </p>
                                            <Link 
                                                href="/about/pastor"
                                                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium group-hover:gap-2 transition-all duration-300"
                                            >
                                                Read More
                                                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeInView>
                    </div>
                </div>
            </section>

            {/* Back Home Section */}
            <section className="py-2">
                <div className="container">
                    <DropInView delay={0.3}>
                        <div className="max-w-4xl mx-auto text-center">
                            <Link href="/" className="btn-primary hover-lift font-bold inline-flex items-center">
                                <Home className="mr-2 h-6 w-6" />
                                Back to Home
                            </Link>
                        </div>
                    </DropInView>
                </div>
            </section>
        </div>
    )
}