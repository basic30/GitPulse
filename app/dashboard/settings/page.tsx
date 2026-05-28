"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  User, 
  Github, 
  Bell, 
  Shield, 
  RefreshCw,
  Check,
  AlertCircle,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { signOut } from "@/lib/auth/actions"

interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  plan: string
  github_access_token: string | null
  created_at: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    weeklyReport: false,
    newFeatures: true,
  })

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        
        if (data) {
          setProfile(data)
        }
      }
      setIsLoading(false)
    }

    fetchProfile()
  }, [])

  const handleReconnectGitHub = async () => {
    // Sign out and redirect to login to get fresh token
    await signOut()
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    )
    if (!confirmed) return

    setIsSaving(true)
    let accountDeleted = false

    try {
      // 1. Delete the user via our secure API
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete account')
      }

      accountDeleted = true 
      
    } catch (error: any) {
      console.error("Error deleting account:", error)
      alert(error.message || "There was an error deleting your account.")
      setIsSaving(false)
    }

    // 2. Handle the redirect safely
    if (accountDeleted) {
      try {
        // Attempt to clear session cookies
        await signOut()
      } catch (e) {
        // Ignore any errors here. Supabase throws an error because 
        // the user was JUST deleted, so their session is technically invalid.
      } finally {
        // Force a hard redirect to the home page to clear all React state
        window.location.href = '/'
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen space-y-8 p-6 lg:p-8 max-w-4xl mx-auto overflow-hidden">
      {/* Premium background decorations */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="relative z-10 flex items-center gap-4">
        {/* Back Button */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.push("/dashboard")}
          className="h-10 w-10 shrink-0 border-border/80 bg-background/50 backdrop-blur-sm transition-all hover:scale-105 hover:bg-background/85 hover:border-primary/30 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent sm:text-4xl">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize and manage your GitPulse account & preferences
          </p>
        </div>
      </div>

      <div className="relative z-10 grid gap-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden border-border/60 bg-card/40 backdrop-blur-md shadow-lg shadow-black/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
            {/* Banner Background */}
            <div className="h-24 w-full bg-gradient-to-r from-primary/20 via-indigo-500/15 to-purple-500/10 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
            </div>
            
            <CardContent className="relative space-y-6 pt-0">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 px-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="rounded-full p-1 bg-background/90 backdrop-blur-md border border-border/50 shadow-md inline-block shrink-0"
                >
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-indigo-600 text-white font-bold">
                      {profile?.username?.slice(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                
                <div className="mb-1 space-y-1">
                  <h3 className="text-xl font-bold tracking-tight">{profile?.full_name || profile?.username}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">@{profile?.username}</span>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 py-0.5 text-[10px] font-semibold tracking-wide">
                      GITHUB INTEGRATION ACTIVE
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/40" />

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</Label>
                  <Input 
                    value={profile?.username || ""} 
                    disabled 
                    className="bg-background/40 border-border/60 text-muted-foreground/80 font-mono disabled:opacity-100 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Plan</Label>
                  <div className="flex items-center gap-3 h-10 px-3 rounded-lg border border-border/60 bg-background/40">
                    {profile?.plan === "PRO" ? (
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-none shadow-md px-2.5 py-0.5 font-bold tracking-wide">
                        🏆 PRO PLAN
                      </Badge>
                    ) : (
                      <>
                        <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-400 border-none font-semibold">
                          FREE PLAN
                        </Badge>
                        <Button variant="link" size="sm" className="h-auto p-0 text-primary hover:text-primary/80 font-semibold transition-colors ml-auto" asChild>
                          <Link href="/dashboard/upgrade" className="flex items-center gap-1">
                            Upgrade to Pro &rarr;
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* GitHub Connection */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card className="border-border/60 bg-card/40 backdrop-blur-md shadow-lg shadow-black/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold tracking-tight">
                <div className="p-1.5 rounded-md bg-zinc-500/10 text-foreground">
                  <Github className="h-5 w-5" />
                </div>
                GitHub Connection
              </CardTitle>
              <CardDescription>
                Manage your authenticated GitHub connection and security tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/40 bg-background/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  {profile?.github_access_token ? (
                    <>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500 shadow-inner">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">Active Connection</p>
                        <p className="text-xs text-muted-foreground">
                          Repository read access is fully authorized
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 shadow-inner">
                        <AlertCircle className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">Token Missing or Expired</p>
                        <p className="text-xs text-muted-foreground">
                          Please reconnect to synchronize repositories
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleReconnectGitHub}
                  className="w-full sm:w-auto shrink-0 border-border/80 bg-background/50 hover:bg-background/80 hover:border-primary/30 transition-all font-semibold active:scale-95"
                >
                  <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-180" />
                  Reconnect Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="border-border/60 bg-card/40 backdrop-blur-md shadow-lg shadow-black/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold tracking-tight">
                <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500">
                  <Bell className="h-5 w-5" />
                </div>
                Notifications
              </CardTitle>
              <CardDescription>
                Configure when and how you receive alerts and analytics reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-background/20 transition-all duration-200">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-semibold">Email Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Get instantly notified about completed code audits & grades
                  </p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <Separator className="bg-border/40" />
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-background/20 transition-all duration-200">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-semibold">Weekly Report Summary</p>
                  <p className="text-xs text-muted-foreground">
                    Receive a clean digest of your repositories' health every Monday
                  </p>
                </div>
                <Switch 
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, weeklyReport: checked }))
                  }
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <Separator className="bg-border/40" />
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-background/20 transition-all duration-200">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-semibold">GitPulse Product Updates</p>
                  <p className="text-xs text-muted-foreground">
                    Be the first to hear about new specialized AI agents and features
                  </p>
                </div>
                <Switch 
                  checked={notifications.newFeatures}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, newFeatures: checked }))
                  }
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="border-red-500/25 bg-red-950/5 backdrop-blur-md shadow-lg shadow-black/5 hover:border-red-500/45 hover:shadow-xl hover:shadow-red-950/5 transition-all duration-300 group">
            <CardHeader className="relative overflow-hidden">
              {/* Subtle background red glow */}
              <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-red-500/5 blur-xl group-hover:bg-red-500/10 transition-all duration-500" />
              <CardTitle className="flex items-center gap-2 font-bold tracking-tight text-red-500">
                <div className="p-1.5 rounded-md bg-red-500/10 text-red-500 group-hover:scale-105 transition-transform">
                  <Shield className="h-5 w-5" />
                </div>
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-500/75 font-medium">
                Critical, permanent, and destructive actions. Proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-500/15 bg-red-500/5 backdrop-blur-sm">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-red-500">Delete My Account</p>
                  <p className="text-xs text-red-500/80">
                    Permanently delete your profile, analysis records, cached repositories, and integration tokens. This cannot be undone.
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="default"
                  onClick={handleDeleteAccount}
                  disabled={isSaving}
                  className="w-full sm:w-auto shrink-0 bg-red-600 hover:bg-red-700 hover:shadow-md hover:shadow-red-600/25 active:scale-95 transition-all font-semibold"
                >
                  {isSaving ? "Deleting Account..." : "Delete Account"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}