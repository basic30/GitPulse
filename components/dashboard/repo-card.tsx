"use client"

import { motion } from "framer-motion"
import { Star, GitFork, Lock, Globe, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import type { Repository } from "@/lib/types"

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
}

interface RepoCardProps {
  repo: Repository
  index: number
}

export function RepoCard({ repo, index }: RepoCardProps) {
  const scoreColor =
    repo.healthScore !== undefined
      ? repo.healthScore >= 70
        ? "stroke-accent-green text-accent-green"
        : repo.healthScore >= 40
        ? "stroke-accent-amber text-accent-amber"
        : "stroke-accent-red text-accent-red"
      : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Repo Name */}
          <div className="mb-2 flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold">{repo.name}</h3>
            {repo.isPrivate ? (
              <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
          </div>

          {/* Description */}
          {repo.description && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {repo.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {/* Language */}
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-3 w-3 rounded-full ${
                    languageColors[repo.language] || "bg-gray-500"
                  }`}
                />
                <span>{repo.language}</span>
              </div>
            )}

            {/* Stars */}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{repo.stars}</span>
            </div>

            {/* Forks */}
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              <span>{repo.forks}</span>
            </div>

            {/* Last Commit */}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(repo.lastCommitAt, { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {/* Health Score Badge */}
        {repo.healthScore !== undefined && (
          <div className="relative shrink-0">
            <svg className="h-14 w-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-secondary"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${(repo.healthScore / 100) * 150.8} 150.8`}
                className={scoreColor}
              />
            </svg>
            <span
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold ${scoreColor}`}
            >
              {repo.healthScore}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        {repo.lastAnalyzedAt ? (
          <p className="text-xs text-muted-foreground">
            Last analyzed {formatDistanceToNow(repo.lastAnalyzedAt, { addSuffix: true })}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Never analyzed</p>
        )}

        <div className="flex items-center gap-2">
          {repo.healthScore !== undefined && repo.lastAnalyzedAt && (
            <Button asChild size="sm" variant="default">
              <Link href={`/report/${repo.id}`}>
                View Report
              </Link>
            </Button>
          )}
          <Button asChild size="sm" variant={repo.healthScore !== undefined ? "outline" : "default"}>
            <Link href={`/analyze/${repo.id}`}>
              {repo.healthScore !== undefined ? "Re-analyze" : "Analyze"}
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
