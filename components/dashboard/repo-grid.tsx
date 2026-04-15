"use client"

import { motion } from "framer-motion"
import { Search, RefreshCw, Filter, FolderOpen, Github, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RepoCard } from "./repo-card"
import { RepoCardSkeleton } from "./repo-card-skeleton"
import type { Repository } from "@/lib/types"
import { useState, useEffect, useRef, useCallback } from "react"

interface RepoGridProps {
  repositories: Repository[]
  isLoading: boolean
  onRefresh: () => void
}

const REPOS_PER_PAGE = 20

export function RepoGrid({ repositories, isLoading, onRefresh }: RepoGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [isSyncing, setIsSyncing] = useState(false)
  const [visibleCount, setVisibleCount] = useState(REPOS_PER_PAGE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Get unique languages
  const languages = Array.from(
    new Set(repositories.map((r) => r.language).filter(Boolean))
  ) as string[]

  // Filter and sort repositories
  const filteredRepos = repositories
    .filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLanguage =
        selectedLanguage === "all" || repo.language === selectedLanguage
      return matchesSearch && matchesLanguage
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return b.lastCommitAt.getTime() - a.lastCommitAt.getTime()
        case "stars":
          return b.stars - a.stars
        case "name":
          return a.name.localeCompare(b.name)
        case "score":
          return (b.healthScore ?? -1) - (a.healthScore ?? -1)
        default:
          return 0
      }
    })

  // Paginated repos for infinite scroll
  const visibleRepos = filteredRepos.slice(0, visibleCount)
  const hasMore = visibleCount < filteredRepos.length

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(REPOS_PER_PAGE)
  }, [searchQuery, selectedLanguage, sortBy])

  // Infinite scroll with Intersection Observer
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    // Simulate network delay for smooth UX
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + REPOS_PER_PAGE, filteredRepos.length))
      setIsLoadingMore(false)
    }, 300)
  }, [isLoadingMore, hasMore, filteredRepos.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, loadMore])

  const handleSync = async () => {
    setIsSyncing(true)
    await onRefresh()
    setTimeout(() => setIsSyncing(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Your Repositories</h1>
          <p className="mt-1 text-muted-foreground">
            Select any repository to run an AI-powered dead code analysis
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleSync}
          disabled={isSyncing}
          className="shrink-0"
        >
          {isSyncing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          Sync from GitHub
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Language Filter */}
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent Activity</SelectItem>
            <SelectItem value="stars">Most Stars</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="score">Health Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <RepoCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredRepos.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleRepos.map((repo, index) => (
              <RepoCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>
          
          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Loading more repositories...</span>
                </div>
              )}
            </div>
          )}
          
          {/* End of list indicator */}
          {!hasMore && visibleRepos.length > REPOS_PER_PAGE && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Showing all {filteredRepos.length} repositories
            </p>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16"
        >
          <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No repositories found</h3>
          <p className="text-center text-sm text-muted-foreground">
            {searchQuery || selectedLanguage !== "all"
              ? "Try adjusting your filters"
              : "Make sure you've connected your GitHub account"}
          </p>
        </motion.div>
      )}
    </div>
  )
}
