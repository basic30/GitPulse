"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { 
  FileText, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  GitBranch,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"

interface AnalysisReport {
  id: string
  health_score: number
  total_issues: number
  status: string
  created_at: string
  repository: {
    id: string
    name: string
    full_name: string
    language: string
  }
}

export default function HistoryPage() {
  const router = useRouter()
  const [reports, setReports] = useState<AnalysisReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from("analysis_reports")
          .select(`
            id,
            health_score,
            total_issues,
            status,
            created_at,
            repository:repositories(id, name, full_name, language)
          `)
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) throw error
        
        if (data) {
          setReports(data as unknown as AnalysisReport[])
        }
      } catch (error) {
        console.error("Failed to load history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500"
    if (score >= 40) return "text-amber-500"
    return "text-red-500"
  }

  const getScoreTrend = (score: number) => {
    if (score >= 70) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (score >= 40) return <Minus className="h-4 w-4 text-amber-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
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
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent sm:text-4xl">Analysis History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and review your past codebase health audits
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="relative z-10 space-y-6 pl-10 border-l border-border/40 ml-4 py-2">
          <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/30 to-transparent pointer-events-none" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative space-y-2">
              <div className="absolute -left-[49px] top-4 h-4 w-4 rounded-full bg-border/40 border border-background animate-pulse" />
              <Skeleton className="h-24 w-full rounded-xl bg-card/25" />
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10"
        >
          <Card className="border-border/60 bg-card/40 backdrop-blur-md shadow-lg shadow-black/5 p-8">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
                <Clock className="h-8 w-8 animate-pulse text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-bold tracking-tight">No analysis history</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  You haven't run any codebase safety syncs yet. Start auditing your projects now!
                </p>
              </div>
              <Button asChild className="mt-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md active:scale-95 transition-all">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Go to Dashboard &rarr;
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="relative z-10 ml-4 pl-8 py-2 space-y-8">
          {/* Timeline continuous vertical connector gradient overlay */}
          <div className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-indigo-500/50 to-transparent pointer-events-none" />
          
          {reports.map((report, index) => {
            const scoreColor = report.health_score >= 70 
              ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5" 
              : report.health_score >= 40 
              ? "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-amber-500/5" 
              : "text-red-500 bg-red-500/10 border-red-500/20 shadow-red-500/5";

            const scoreGlow = report.health_score >= 70 
              ? "hover:border-emerald-500/30 hover:shadow-emerald-500/10" 
              : report.health_score >= 40 
              ? "hover:border-amber-500/30 hover:shadow-amber-500/10" 
              : "hover:border-red-500/30 hover:shadow-red-500/10";

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="relative group animate-in fade-in slide-in-from-left-5"
              >
                {/* Timeline connector node dot */}
                <div className="absolute -left-[41px] top-6 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full border-4 border-background bg-indigo-500 shadow-md transition-all group-hover:scale-125 group-hover:bg-primary z-10" />
                  <div className="absolute h-6 w-6 rounded-full bg-indigo-500/20 animate-ping group-hover:bg-primary/20 pointer-events-none" />
                </div>

                <Card className={`overflow-hidden border-border/60 bg-card/40 backdrop-blur-md shadow-lg shadow-black/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 ${scoreGlow}`}>
                  <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                        <FileText className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {report.repository?.full_name || "Unknown Repository"}
                          </h3>
                          {report.repository?.language && (
                            <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-400 border-none font-semibold text-[10px] tracking-wide uppercase px-2 py-0.5">
                              {report.repository.language}
                            </Badge>
                          )}
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Clock className="h-3 w-3 shrink-0" />
                          {format(new Date(report.created_at), "PPp")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-border/40 pt-4 sm:pt-0">
                      {/* Health Score Pill */}
                      <div className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border ${scoreColor} shadow-inner`}>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {getScoreTrend(report.health_score)}
                            <span className="text-xl font-black tracking-tight leading-none">
                              {report.health_score}
                            </span>
                          </div>
                          <p className="text-[9px] font-bold uppercase tracking-wider opacity-85 mt-0.5 text-right leading-none">
                            Health Grade
                          </p>
                        </div>
                      </div>

                      {/* Issues Count */}
                      <div className="hidden md:block text-left shrink-0">
                        <p className="text-sm font-bold text-foreground">
                          {report.total_issues}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                          issues flagged
                        </p>
                      </div>

                      {/* View Report button */}
                      <Button asChild variant="outline" size="sm" className="shrink-0 border-border/80 bg-background/50 hover:bg-background/80 hover:border-primary/30 transition-all font-semibold active:scale-95">
                        <Link href={`/report/${report.id}`} className="flex items-center gap-2">
                          <span>Report</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  )
}