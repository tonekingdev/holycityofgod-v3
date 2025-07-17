import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
    IconDefinition,
    faArrowRight,
    faCalendar, 
    faHeart,
    faPray,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";


interface FeatureItem {
    icon: IconDefinition;
    title: string;
    description: string;
    link: string;
    linkText: string;
}

export default function FeaturedContent() {
    const features: FeatureItem[] = [
        {
            icon: faCalendar,
            title: "Upcoming Services",
            description: "Join us for worship and fellowship",
            link: "/services",
            linkText: "View Service Times"

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
        }
    ]

    return (
        <section className="py-12">
            <div className="sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to Our Church Family
                    </h2>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="text-center p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-100 card"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                                <FontAwesomeIcon icon={feature.icon} className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-secondary mb-4">
                                {feature.description}
                            </p>
                            <Link
                                href={feature.link}
                                className="inline-flex items-center gap-2 text-primary hover:text-primary-800 font-medium"
                            >
                                {feature.linkText}
                                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}