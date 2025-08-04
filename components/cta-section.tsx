import Link from "next/link";
import { FadeInView } from "./FadeInView";
import { SlideInView } from "./SlideInView";


export function CTASection() {
    return (
        <section className="py-12 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%, rgba(255,255,255,0.1)_0%, transparent_50%)]" />
            </div>

            <div className="container relative z-10">
                <FadeInView>
                    <div className="text-center mb-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Join Our Family
                        </h2>
                        <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                            Experience the love of Jesus in a welcoming community. Whether you&apos;re seeking spiritual growth, fellowship, or a place to serve, you&apos;ll find your home with us.
                        </p>
                    </div>
                </FadeInView>

                <SlideInView>
                    <div className="flex items-center justify-center">
                        <Link
                            href="/auth/register"
                            className="btn-primary hover-scale font-bold"
                        >
                            Join Us
                        </Link>
                    </div>
                </SlideInView>
            </div>
        </section>
    )
}