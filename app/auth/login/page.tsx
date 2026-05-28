"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Github, ArrowLeft, Loader2, Sparkles, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signInWithGitHub } from "@/lib/auth/actions"

interface SubmitButtonProps {
  mode: "signin" | "register"
}

function SubmitButton({ mode }: SubmitButtonProps) {
  const { pending } = useFormStatus()
  
  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="w-full gap-2.5 bg-white text-black hover:bg-zinc-100 hover:text-black font-semibold font-mono-code text-sm rounded-md transition-all border border-zinc-200 shadow-sm active:scale-95 flex items-center justify-center relative overflow-hidden"
    >
      {pending ? (
        <>
          <Loader2 className="h-4.5 w-4.5 animate-spin text-black shrink-0" />
          <span>{mode === "signin" ? "Securing connection..." : "Initializing profile..."}</span>
        </>
      ) : (
        <>
          <Github className="h-4.5 w-4.5 text-black shrink-0" />
          <span>{mode === "signin" ? "Sign In with GitHub" : "Register with GitHub"}</span>
        </>
      )}
    </Button>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "register">("signin")

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#09090b] text-white px-4 overflow-hidden">
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

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-2"
      >
        {/* Back button */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-mono-code text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to terminal</span>
        </Link>

        {/* Premium Zinc Card */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/65 backdrop-blur-md p-8 shadow-2xl space-y-6 flex flex-col">
          {/* Logo & Platform Name */}
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/logo.png"
              alt="GitPulse Logo"
              width={30}
              height={30}
              className="rounded-md shrink-0"
            />
            <span className="text-xl font-bold tracking-tight">GitPulse</span>
          </div>

          {/* Interactive Mode Selector Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-900 border border-zinc-800/80 font-mono-code text-[10px] uppercase font-bold tracking-wider select-none shrink-0">
            <button 
              onClick={() => setMode("signin")}
              className={`py-1.5 px-3 rounded text-center transition-all ${
                mode === "signin" 
                  ? "bg-zinc-800 text-white shadow-sm font-extrabold" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode("register")}
              className={`py-1.5 px-3 rounded text-center transition-all ${
                mode === "register" 
                  ? "bg-zinc-800 text-white shadow-sm font-extrabold" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Register
            </button>
          </div>

          {/* Headline details with AnimatePresence for smooth slide transitions */}
          <div className="text-center h-[52px] flex flex-col justify-center select-none overflow-hidden relative">
            <AnimatePresence mode="wait">
              {mode === "signin" ? (
                <motion.div
                  key="signin-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-1"
                >
                  <h1 className="font-serif-display text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
                    <UserCheck className="h-5 w-5 text-indigo-400 shrink-0" />
                    Welcome back
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium leading-none">
                    Authenticate via secure OAuth to inspect your files
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="register-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-1"
                >
                  <h1 className="font-serif-display text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
                    <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
                    Create account
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium leading-none">
                    OAuth sets up your workspace instantly. Free to try.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* GitHub Form Action */}
          <form action={signInWithGitHub} className="pt-2">
            <SubmitButton mode={mode} />
          </form>

          {/* Security details statement */}
          <p className="text-[10px] text-center text-zinc-500 font-mono-code leading-relaxed max-w-[280px] mx-auto select-none">
            🛡️ GitPulse requests read-only scopes. We never cache or persistent-store your source files on our servers.
          </p>

          {/* Toggle switcher link */}
          <div className="text-center pt-2 text-[10px] font-mono-code text-zinc-400 hover:text-zinc-200 cursor-pointer select-none transition-colors">
            {mode === "signin" ? (
              <span onClick={() => setMode("register")}>
                New to GitPulse? <strong className="text-indigo-400 underline font-semibold">Register account now &rarr;</strong>
              </span>
            ) : (
              <span onClick={() => setMode("signin")}>
                Already registered? <strong className="text-indigo-400 underline font-semibold">Sign in here &rarr;</strong>
              </span>
            )}
          </div>
        </div>

        {/* Footer legal agreements */}
        <p className="mt-6 text-center text-[10px] font-mono-code text-zinc-500 space-x-1 select-none">
          <span>By syncing, you agree to our</span>
          <Link href="/terms" className="text-zinc-400 underline hover:text-zinc-200 transition-colors">
            Terms of Service
          </Link>
          <span>and</span>
          <Link href="/privacy" className="text-zinc-400 underline hover:text-zinc-200 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
