"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ExternalLink, Download, FileJson, Share2, AlertTriangle, Trash2, Package, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Report } from "@/lib/types"
import { useEffect } from "react"
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts"

interface HealthScoreHeroProps {
  report: Report
}

export function HealthScoreHero({ report }: HealthScoreHeroProps) {
  // Framer Motion spring animation for score count-up
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 30 })
  const displayScore = useTransform(springValue, (val) => Math.round(val))

  useEffect(() => {
    motionValue.set(report.healthScore)
  }, [report.healthScore, motionValue])

  const scoreColor =
    report.healthScore >= 70
      ? "#10B981"
      : report.healthScore >= 40
      ? "#F59E0B"
      : "#EF4444"

  const scoreLabel =
    report.healthScore >= 70
      ? "Healthy"
      : report.healthScore >= 40
      ? "Needs Attention"
      : "Critical"

  const chartData = [{ value: report.healthScore, fill: scoreColor }]

  const stats = [
    {
      label: "Total Issues",
      value: report.totalIssues,
      icon: AlertTriangle,
      color: "text-accent-amber",
    },
    {
      label: "Lines Removable",
      value: report.linesRemovable.toLocaleString(),
      icon: Trash2,
      color: "text-accent-red",
    },
    {
      label: "Zombie Dependencies",
      value: report.zombieDependencies,
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Files Affected",
      value: report.fileCount,
      icon: FileText,
      color: "text-muted-foreground",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-6 lg:p-8"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Score Gauge - 200x200px as per spec */}
          <div className="flex flex-col items-center">
            <div className="relative h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={14}
                  data={chartData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: "hsl(var(--secondary))" }}
                    dataKey="value"
                    cornerRadius={10}
                    fill={scoreColor}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="text-5xl font-bold tabular-nums"
                  style={{ color: scoreColor }}
                >
                  {displayScore}
                </motion.span>
                <span className="text-sm text-muted-foreground">out of 100</span>
              </div>
            </div>
            <h2 className="mt-4 text-xl font-semibold">Code Health Score</h2>
            <span
              className="mt-1 rounded-full px-3 py-1 text-sm font-medium"
              style={{
                backgroundColor: `${scoreColor}20`,
                color: scoreColor,
              }}
            >
              {scoreLabel}
            </span>
          </div>

          {/* Sub-scores - bars with animated width */}
          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Score Breakdown
            </h3>
            {report.subScores.map((subScore, index) => (
              <motion.div
                key={subScore.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{subScore.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-medium tabular-nums">{subScore.score}</span>
                    <span className="text-xs text-muted-foreground">
                      /100
                    </span>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      ({subScore.weight}%)
                    </span>
                  </div>
                </div>
                {/* Custom progress bar with animated width */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subScore.score}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        subScore.score >= 70
                          ? "#10B981"
                          : subScore.score >= 40
                          ? "#F59E0B"
                          : "#EF4444",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4"
            >
              <div className="rounded-lg bg-secondary p-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Meta & Actions */}
        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {report.language.map((lang) => (
              <span key={lang} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                {lang}
              </span>
            ))}
            <span className="hidden sm:inline">•</span>
            <span>Analyzed {report.createdAt.toLocaleDateString()}</span>
            <span className="hidden sm:inline">•</span>
            <Link
              href={report.githubUrl}
              target="_blank"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              View on GitHub <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* Export buttons as per spec */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileJson className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share Report
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
