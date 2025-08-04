"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function SlideInView({ children }: { children: React.ReactNode }) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 10 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeIn" }}
        >
            {children}
        </motion.div>
    )
}