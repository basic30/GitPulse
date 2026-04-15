"use client"

import { motion } from "framer-motion"
import { Github, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <div className="z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Beta Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green"></span>
            </span>
            <span className="text-muted-foreground">Now in Beta</span>
            <span className="text-foreground">Free to try</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Your codebase is hiding{" "}
          <span className="gradient-text">dead weight</span>.{" "}
          <br className="hidden sm:block" />
          We find it.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl"
        >
          GitPulse connects to your GitHub and uses AI to find dead code, unused functions,
          and zombie dependencies — then tells you exactly how to fix it.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="h-14 gap-3 bg-foreground px-8 text-lg font-semibold text-background hover:scale-105 hover:bg-foreground/90 transition-transform"
          >
            <Link href="/auth/login">
              <Github className="h-5 w-5" />
              Continue with GitHub
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-14 px-8 text-lg font-semibold"
          >
            <Link href="#demo">See a live demo</Link>
          </Button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span className="font-semibold text-foreground">500+</span> developers
          </span>
          <span className="hidden sm:inline">·</span>
          <span>Supports JS, TS, Python, Rust</span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-2">
            <span className="font-semibold text-accent-green">93%</span> accuracy
          </span>
        </motion.div>
      </div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1, duration: 0.5 },
          y: { delay: 1, duration: 1.5, repeat: Infinity },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-8 w-8 text-muted-foreground" />
      </motion.div>
    </section>
  )
}
