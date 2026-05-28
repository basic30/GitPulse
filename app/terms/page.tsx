"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-white px-6 py-20 flex flex-col items-center justify-start overflow-hidden">
      {/* Google Lora and JetBrains Font Injector */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
        .font-serif-display {
          font-family: 'Lora', serif;
        }
        .font-mono-code {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c1e_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl space-y-8 select-text"
      >
        {/* Back Link */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-xs font-mono-code text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to login gate</span>
        </Link>

        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-indigo-400 font-bold uppercase tracking-widest">
            <Shield className="h-4 w-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="font-serif-display text-4xl font-extrabold tracking-tight text-white leading-none">
            Terms of Service
          </h1>
          <p className="text-xs text-zinc-500 font-mono-code">
            Last updated: May 28, 2026
          </p>
        </div>

        {/* Document Content */}
        <div className="border border-zinc-800 bg-zinc-950/65 backdrop-blur-md rounded-xl p-8 space-y-6 text-sm text-zinc-400 leading-relaxed font-sans select-text">
          <section className="space-y-2">
            <h3 className="text-white font-bold text-base font-serif-display italic">1. Agreement to Terms</h3>
            <p>
              By authenticating your GitHub account with GitPulse, you represent that you agree to be bound by these legal terms. If you do not agree to these terms, you must immediately disconnect your authentication token and cease all usage.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-white font-bold text-base font-serif-display italic">2. Repository Access</h3>
            <p>
              GitPulse operates entirely as a local static analysis inspector. We request read-only scope authorizations from your active GitHub profile. We do not copy, write, alter, or persist your code files outside of local analytical caches required to output health grades.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-white font-bold text-base font-serif-display italic">3. Usage Restrictions</h3>
            <p>
              You agree not to abuse or exploit the platform, API limits, or automated agent pipelines. Any actions designed to disrupt the performance of our multi-agent architecture will result in permanent service revocation.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-white font-bold text-base font-serif-display italic">4. Limitation of Liability</h3>
            <p>
              GitPulse and its associated AI agents make refactoring recommendations only. You assume full responsibility for confirming recommended code removals or pruning patches before merging changes into your production systems.
            </p>
          </section>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-center text-zinc-600 font-mono-code">
          GitPulse Static Archaeology · Clean code, safe deployments.
        </p>
      </motion.div>
    </div>
  )
}
