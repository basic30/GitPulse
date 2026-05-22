"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Sidebar } from "@/components/dashboard/sidebar"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { RepoGrid } from "@/components/dashboard/repo-grid"
import { createClient } from "@/lib/supabase/client"

interface Repository {
  id: string
  github_id: number
  name: string
  full_name: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  default_branch: string
  is_private: boolean
  last_commit_at: string | null
  last_analyzed_at: string | null
  health_score: number | null
}

interface User {
  username: string
  avatarUrl?: string
  plan: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [initialSyncDone, setInitialSyncDone] = useState(false)

  const { data, error, isLoading, mutate } = useSWR<{ repos: Repository[] }>(
    "/api/repos",
    fetcher,
    { revalidateOnFocus: false }
  )

  // Check auth and get user
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single()

      if (profile) {
        setUser({
          username: profile.username,
          avatarUrl: profile.avatar_url,
          plan: profile.plan || "FREE",
        })
      }
    }

    checkAuth()
  }, [router])

  // Initial sync if no repos
  useEffect(() => {
    if (!isLoading && data?.repos?.length === 0 && !initialSyncDone) {
      setInitialSyncDone(true)
      handleSync()
    }
  }, [isLoading, data, initialSyncDone])

  const handleSync = useCallback(async () => {
    setIsSyncing(true)
    try {
      const res = await fetch("/api/github/sync", { method: "POST" })
      if (res.ok) {
        await mutate()
      }
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      setIsSyncing(false)
    }
  }, [mutate])

  // Transform repos to match component interface
  const repositories = (data?.repos || []).map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    language: repo.language,
    stars: repo.stars,
    forks: repo.forks,
    isPrivate: repo.is_private,
    lastCommitAt: repo.last_commit_at ? new Date(repo.last_commit_at) : new Date(),
    lastAnalyzedAt: repo.last_analyzed_at ? new Date(repo.last_analyzed_at) : undefined,
    healthScore: repo.health_score ?? undefined,
  }))

  // Calculate stats
  const analyzedRepos = repositories.filter((r) => r.healthScore !== undefined)
  const totalAnalyzed = analyzedRepos.length
  const averageScore =
    totalAnalyzed > 0
      ? Math.round(
          analyzedRepos.reduce((acc, r) => acc + (r.healthScore ?? 0), 0) /
            totalAnalyzed
        )
      : 0
  const totalIssues = 0 // This would need another API call to get actual count

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={user} />
      
      <main className="pl-[72px] transition-all duration-300 md:pl-[240px]">
        <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
          <StatsBar
            totalAnalyzed={totalAnalyzed}
            averageScore={averageScore}
            totalIssues={totalIssues}
          />
          
          <RepoGrid
            repositories={repositories}
            isLoading={isLoading || isSyncing}
            onRefresh={handleSync}
          />
        </div>
      </main>
    </div>
  )
}
