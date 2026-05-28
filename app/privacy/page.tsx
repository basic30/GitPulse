"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
            <span>Privacy Policy Statement</span>
          </div>
          <h1 className="font-serif-display text-4xl font-extrabold tracking-tight text-white leading-none">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500 font-mono-code">
            Last updated: May 28, 2026
          </p>
        </div>

        {/* Document Content */}
        <div className="border border-zinc-800 bg-zinc-950/65 backdrop-blur-md rounded-xl p-8 space-y-6 text-sm text-zinc-400 leading-relaxed font-sans select-text">
          <section className="space-y-2">
            <h3 className="text-white font-bold text-base font-serif-display italic">1. Code Confidentiality</h3>
            <p>
              Your source code is yours alone. GitPulse analyzes your files on-the-fly and never copies, transmits, or stores code segments. We only cache metrics, dependencies lists, file metadata, and health grades inside secured, encrypted PostgreSQL cells.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-white font-bold text-base font-serif-display italic">2. Token Security</h3>
            <p>
              Your GitHub OAuth token is stored using Advanced Encryption Standards (AES-256) at rest. Token access is isolated entirely to the automated analysis routes and is never shared, exposed, or transmitted to outside parties.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-white font-bold text-base font-serif-display italic">3. Zero Third-Party Sharing</h3>
            <p>
              We do not sell, trade, or monetize your repository health statistics, profile details, or analytical reports. The platform is built specifically as a private utility for individual developers and organizations.
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
