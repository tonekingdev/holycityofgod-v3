"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface FadeInViewProps {
  children: React.ReactNode
  delay?: number
}

export function FadeInView({ children, delay = 0.3 }: FadeInViewProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay, duration: 0.8, ease: "easeIn" }}
    >
      {children}
    </motion.div>
  )
}
