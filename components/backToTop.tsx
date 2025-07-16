"use client"

import { ArrowBigUp } from "lucide-react";
import { useEffect, useState } from "react";


export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 250) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)

        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <>
            {isVisible && (
                <button 
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 bg-purple-500 hover:bg-primary-800 text-secondary-50 hover:text-secondary-400 p-2 rounded-full shadow-lg transition-all duration-300 hover-lift z-50"
                >
                    <ArrowBigUp />
                </button>
            )}
        </>
    )
}