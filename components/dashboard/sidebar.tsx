"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  History,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { signOut } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface SidebarProps {
  user: {
    username: string
    avatarUrl?: string
    plan: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Auto-collapse on mobile (<768px)
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const isCollapsed = isMobile || collapsed

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <Image
          src="/logo.png"
          alt="GitPulse Logo"
          width={32}
          height={32}
          className="shrink-0 rounded-md"
        />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold"
          >
            GitPulse
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </div>
            </Link>
          )
        })}

        {/* Upgrade CTA */}
        {user.plan === "FREE" && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            {/* Fixed: Moved classes directly onto the Link component */}
            <Link
              href="/dashboard/upgrade"
              className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <Sparkles className="h-5 w-5" />
              <span>Upgrade</span>
            </Link>
          </motion.div>
        )}
        {user.plan === "FREE" && isCollapsed && (
          /* Fixed: Moved classes directly onto the Link component */
          <Link
            href="/dashboard/upgrade"
            className="mt-4 flex items-center justify-center rounded-lg bg-primary/10 p-2.5 text-primary transition-colors hover:bg-primary/20"
          >
            <Sparkles className="h-5 w-5" />
          </Link>
        )}
      </nav>

      {/* Collapse Toggle - hidden on mobile */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border border-border bg-card shadow-sm"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      )}

      {/* User */}
      <div className="border-t border-border p-3">
        <div className={cn(
          "flex items-center gap-3 rounded-lg px-2 py-2",
          isCollapsed && "justify-center px-0"
        )}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-hidden"
            >
              <p className="truncate text-sm font-medium">{user.username}</p>
              <p className="text-xs text-muted-foreground">{user.plan} plan</p>
            </motion.div>
          )}
        </div>

        {/* Logout Button */}
        <form action={signOut}>
          <button
            type="submit"
            className={cn(
              "mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </form>
      </div>
    </motion.aside>
  )
}