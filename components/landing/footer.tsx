"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Twitter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="GitPulse Logo" width={32} height={32} className="rounded-md" />
            <span className="text-xl font-bold">GitPulse</span>
          </div>
          
          <nav className="flex gap-6 flex-wrap justify-center">
            {/* Docs Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm text-muted-foreground hover:text-foreground">Documentation</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>GitPulse Documentation</DialogTitle>
                  <DialogDescription className="space-y-4 pt-4 text-left">
                    <p>Welcome to the GitPulse Documentation.</p>
                    <p><strong>1. Connecting Repositories:</strong> Go to your dashboard and click "Sync GitHub" to pull your latest repositories.</p>
                    <p><strong>2. Running Analysis:</strong> Click "Analyze" on any repository card to trigger the AI-powered code review.</p>
                    <p><strong>3. Reviewing Reports:</strong> View detailed health scores, dead code, and zombie dependencies directly in the report viewer.</p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* Privacy Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                  <DialogDescription className="space-y-4 pt-4 text-left">
                    <p>Your privacy is critically important to us.</p>
                    <p><strong>Data Collection:</strong> We only collect repository metadata and strictly necessary code snippets for analysis purposes.</p>
                    <p><strong>Data Storage:</strong> Source code is NOT stored permanently on our servers. Analysis is done in-memory and immediately discarded.</p>
                    <p><strong>Third Parties:</strong> We do not share your private codebase with any third parties except the secure AI models required for the analysis.</p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* Terms Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Terms of Service</DialogTitle>
                  <DialogDescription className="space-y-4 pt-4 text-left">
                    <p>By using GitPulse, you agree to the following terms:</p>
                    <p><strong>1. Usage:</strong> GitPulse is provided "as is" for code analysis purposes. You must have the legal right to analyze the repositories you connect.</p>
                    <p><strong>2. API Limits:</strong> Free tier users are subject to rate limiting and repository size restrictions to prevent abuse.</p>
                    <p><strong>3. Liability:</strong> GitPulse is not liable for any code deleted or modified based on the suggestions provided by the AI report.</p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </nav>

          <div className="flex gap-4 text-muted-foreground">
            <Link href="https://github.com" target="_blank" className="hover:text-foreground">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-foreground">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GitPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}