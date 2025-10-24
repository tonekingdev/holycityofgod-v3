import { CHURCH_INFO, MAIN_NAV, SOCIAL_LINKS } from "@/constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookF, faTwitter, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons"
import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"


// Icon mapping
const IconMap= {
    faFacebookF,
    faTwitter,
    faInstagram,
    faYoutube,
}

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Church Info */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="relative h-10 w-10 overflow-hidden bg-primary-50 rounded-full">
                                <Image 
                                    src="/img/church-logo.png"
                                    alt="Holy City of God Christian Fellowship"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-bold text-xl">Holy City of God</span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            {CHURCH_INFO.subtitle}
                        </p>
                        <div className="flex space-x-4">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-secondary-500"
                                >
                                    <FontAwesomeIcon icon={IconMap[social.icon]} className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {MAIN_NAV.map((nav) => (
                                <li key={nav.name}>
                                    <Link href={nav.href} className="text-gray-400 hover:text-gold-400">
                                        {nav.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/bible" className="text-gray-400 hover:text-gold-300">
                                    Bible Study
                                </Link>
                            </li>
                            <li>
                                <Link href="our-network" className="text-gray-400 hover:text-gold-300">
                                    Our Network
                                </Link>
                            </li>
                            <li>
                                <Link href="/prayer" className="text-gray-400 hover:text-gold-300">
                                    Prayer Requests
                                </Link>
                            </li>
                            <li>
                                <Link href="/give" className="text-gray-400 hover:text-gold-300">
                                    Online Giving
                                </Link>
                            </li>
                            <li>
                                <Link href="/outreach" className="text-gray-400 hover:text-gold-300">
                                    Outreach
                                </Link>
                            </li>
                            <li>
                                <Link href="/help" className="text-gray-400 hover:text-gold-300">
                                    Help
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Contact Us
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400 text-sm">
                                    {CHURCH_INFO.contact.address.full}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400 text-sm">
                                    {CHURCH_INFO.contact.phone}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400 text-sm">
                                    {CHURCH_INFO.contact.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-aut text-center mt-8">
                    <p className="text-xs font-light text-gray-400">
                        &copy; Copyright {new Date().getFullYear()} Holy City of God Christian Fellowship Inc. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}