"use client"

import { motion } from "framer-motion"
import { GitBranch, Gauge, AlertTriangle } from "lucide-react"

interface StatsBarProps {
  totalAnalyzed: number
  averageScore: number
  totalIssues: number
}

export function StatsBar({ totalAnalyzed, averageScore, totalIssues }: StatsBarProps) {
  const stats = [
    {
      label: "Repos Analyzed",
      value: totalAnalyzed,
      icon: GitBranch,
      color: "text-primary",
    },
    {
      label: "Avg Health Score",
      value: averageScore,
      icon: Gauge,
      color:
        averageScore >= 70
          ? "text-accent-green"
          : averageScore >= 40
          ? "text-accent-amber"
          : "text-accent-red",
    },
    {
      label: "Issues Found",
      value: totalIssues,
      icon: AlertTriangle,
      color: "text-accent-amber",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-secondary p-2.5">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
