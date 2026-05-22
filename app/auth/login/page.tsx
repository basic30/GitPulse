"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Github, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signInWithGitHub } from "@/lib/auth/actions"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Back button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <Image
              src="/logo.png"
              alt="GitPulse Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-2xl font-bold">GitPulse</span>
          </div>

          {/* Title */}
          <h1 className="mb-2 text-center text-xl font-semibold">
            Welcome back
          </h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Sign in with GitHub to analyze your repositories
          </p>

          {/* GitHub Login Button */}
          <form action={signInWithGitHub}>
            <Button
              type="submit"
              size="lg"
              className="w-full gap-3 bg-[#24292e] text-white hover:bg-[#24292e]/90"
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </Button>
          </form>

          {/* Info */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            We&apos;ll request read access to your repositories to perform analysis.
            Your code is never stored on our servers.
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
