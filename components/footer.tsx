import { CHURCH_INFO, SOCIAL_LINKS } from "@/constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookF, faTwitter, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons"
import Image from "next/image"


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
                            <div className="relative h-10 w-10 overflow-hidden bg-white rounded-full">
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
                </div>
            </div>
        </footer>
    )
}