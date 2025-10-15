"use client"

import { DropInView } from "@/components/DropInView"
import { FadeInView } from "@/components/FadeInView"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge, CheckCircle, Clock, ExternalLink, Globe, Heart, Home, Mail, MapPin, Shield, Smartphone } from "lucide-react"
import Link from "next/link"


export default function GivePageClient() {
    const givingMethods = [
        {
            id: "givelify",
            title: "Givelify",
            subtitle: "Secure Online Giving",
            description: "Give securely online with credit card, debit card, or bank transfer through our trusted Givelify platform.",
            icon: Globe,
            color: "bg-primary-100 text-primary",
            features: [
                "Secure SSL encryption",
                "Recurring donations available",
                "Instant confirmation",
                "Tax receipt provided",
                "Mobile-friendly",
            ],
            action: {
                text: "Give Online Now",
                href: "https://www.givelify.com/donate/holy-city-of-god-christian-fellowship-detroit-mi-2j7wy5NTU3NDU=/donation/amount",
                external: true,
            },
            badge: "Most Popular",
        },
        {
            id: "cashapp",
            title: "Cash App",
            subtitle: "Quick Mobile Giving",
            description: "Send your donation instantly using Cash App to our church handle.",
            icon: Smartphone,
            color: "bg-secondary-100 text-secondary",
            features: [
                "Instant transfer",
                "Mobile-first experience",
                "No processing delays",
                "Easy to use",
                "Available 24/7",
            ],
            action: {
                text: "Open Cash App",
                href: "https://cash.app/$holycitydetroit",
                external: true,
            },
            handle: "$holycitydetroit",
        },
        {
            id: "mail",
            title: "Mail Donation",
            subtitle: "Traditional Giving",
            description: "Send your check or money order by mail to our church address.",
            icon: Mail,
            color: "bg-gray-100 text-gray-600",
            features: [
                "Traditional method",
                "Check or money order",
                "Detailed records",
                "Personal touch",
                "Tax deductible"
            ],
            address: {
                payable: "Holy City of God",
                street: "28333 Marcia Ave",
                city: "Warren",
                state: "MI",
                zip: "48093",
            },
        },
    ]

    const handleGiveClick = (method: (typeof givingMethods)[0]) => {
        if (method.action?.external && method.action.href) {
        window.open(method.action.href, "_blank", "noopener,noreferrer")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header Section */}
                <FadeInView>
                    <div className="text-center mb-12">
                        <div className="inline-flex justify-center items-center gap-2 mb-4">
                            <Heart className="h-8 w-8 text-primary-500" />
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Give with a <span className="text-primary-500">Generous</span> Heart
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Your generosity enables us to serve our community, support those in need, and spread the love of Christ. Thank you for partnering with us in ministry.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Shield className="h-4 w-4" />
                                <span>Secure & Safe</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                <span>Tax Deductible</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Available 24/7</span>
                            </div>
                        </div>
                    </div>
                </FadeInView>

                {/* Bible Verse */}
                <DropInView delay={1}>
                    <div className="bg-secondary-50 border-1-4 border-secondary-500 p-6 mb-12 rounded-r-lg">
                        <blockquote className="text-lg italic text-gray-700 font-light">
                            &quot;Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over, shall men give into your bosom. For with the same measure that ye mete withal it shall be measured to you again.&quot;
                        </blockquote>
                        <cite className="text-primary italic font-semibold">
                            Luke 6:38
                        </cite>
                    </div>
                </DropInView>

                {/* Giving Methods */}
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {givingMethods.map((method, index) => (
                        <DropInView key={method.id} delay={1 + index * .2}>
                            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary-200 relative overflow-hidden">
                                {method.badge && (
                                    <Badge className="absolute top-4 right-4 bg-secondary-500 text-white">
                                        {method.badge}
                                    </Badge>
                                )}

                                <CardHeader className="text-center pb-4">
                                    <div className={`w-16 h-16 rounded-full ${method.color} flex items-center justify-center mx-auto mb-4`}>
                                        <method.icon className="h-8 w-8" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-gray-900">
                                        {method.title}
                                    </CardTitle>
                                    <CardDescription className="text-lg font-medium text-secondary">
                                        {method.subtitle}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <p className="text-gray-600 text-center">
                                        {method.description}
                                    </p>

                                    {/* Special display for Cash App handle */}
                                    {method.handle && (
                                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                                            <p className="text-sm text-gray-500 mb-1">
                                                Cash App Handle:
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900 font-mono">
                                                {method.handle}
                                            </p>
                                        </div>
                                    )}

                                    {/* Special display for mailing address */}
                                    {method.address && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-start gap-2 mb-3">
                                                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        Make checks payable to:
                                                    </p>
                                                    <p className="text-lg font-bold text-primary">
                                                        {method.address.payable}
                                                    </p>
                                                    <p>
                                                        {method.address.street} <br />
                                                        {method.address.city}, {method.address.state}. {method.address.zip}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Feature List */}
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                                            Features:
                                        </h4>
                                        <ul className="space-y-1">
                                            {method.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle className="h-4 w-4 text-secondary-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action button */}
                                    {method.action && (
                                        <Button
                                            onClick={() => handleGiveClick(method)}
                                            className="w-full bg-primary hover:bg-primary-700 text-white py-3 text-lg font-semibold"
                                            size="lg"
                                        >
                                            {method.action.text}
                                            {method.action.external && <ExternalLink className="ml-2 h-4 w-4" />}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </DropInView>
                    ))}
                </div>

                <Separator className="my-12" />
                
                {/* Call to Action */}
                <FadeInView delay={1.1}>
                    <div className="text-center p-8 bg-gradient-to-r from-primary to-primary-700 rounded-xl text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            Thank You for Your Generosity
                        </h2>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Your support makes a real difference in our community and helps us continue our mission of spreading God&apos;s love and serving others.
                        </p>
                        <div>
                            <Link href="/">
                                <Button size="lg" variant="outline" className="border-white hover:shadow-sm hover:shadow-gold-300 hover:bg-primary-50 hover-lift text-white hover:text-primary font-semibold">
                                    <Home className="mr-2 h-5 w-5" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </FadeInView>
            </div>
        </div>
    )
}