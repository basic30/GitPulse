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
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Delete the profile data
        await supabase.from("profiles").delete().eq("id", user.id)
        
        // Note: To completely delete the user from Supabase Auth, 
        // you typically need to call this from an Admin API route/Edge function.
        // For now, this wipes their data and logs them out.
        await signOut()
      }
    } catch (error) {
      console.error("Error deleting account:", error)
      alert("There was an error deleting your account.")
    } finally {
      setIsSaving(false)
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {/* Added Back Button */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.push("/dashboard")}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Your account information from GitHub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {profile?.username?.slice(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{profile?.full_name || profile?.username}</h3>
                  <p className="text-muted-foreground">@{profile?.username}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={profile?.username || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={profile?.plan === "PRO" ? "default" : "secondary"}>
                      {profile?.plan || "FREE"}
                    </Badge>
                    {/* Fixed Upgrade Button Link */}
                    {profile?.plan === "FREE" && (
                      <Button variant="link" size="sm" className="h-auto p-0" asChild>
                        <Link href="/dashboard/upgrade">Upgrade to Pro</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* GitHub Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Connection
              </CardTitle>
              <CardDescription>
                Manage your GitHub integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {profile?.github_access_token ? (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Connected</p>
                        <p className="text-sm text-muted-foreground">
                          Repository access enabled
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">Token Missing</p>
                        <p className="text-sm text-muted-foreground">
                          Please reconnect to sync repositories
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleReconnectGitHub}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive analysis results via email
                  </p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Get a summary of your repositories health
                  </p>
                </div>
                <Switch 
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, weeklyReport: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Features</p>
                  <p className="text-sm text-muted-foreground">
                    Be notified about new GitPulse features
                  </p>
                </div>
                <Switch 
                  checked={notifications.newFeatures}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, newFeatures: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                {/* Fixed Delete Account Button */}
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={isSaving}
                >
                  {isSaving ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}