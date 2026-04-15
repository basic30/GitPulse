"use client"

import { Github, Twitter, FileText, Shield } from "lucide-react"
import Link from "next/link"

const footerLinks = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "Docs", href: "/docs", icon: FileText },
  { label: "Privacy", href: "/privacy", icon: Shield },
  { label: "Terms", href: "/terms", icon: FileText },
]

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">G</span>
              </div>
              <span className="text-xl font-bold">GitPulse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Find dead code. Kill zombie dependencies. Ship cleaner software.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GitPulse. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with <span className="text-accent-red">♥</span> for developers
          </p>
        </div>
      </div>
    </footer>
  )
}
