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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {/* Added Back Button */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.push("/dashboard")}
          className="h-10 w-10 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Analysis History</h1>
          <p className="mt-1 text-muted-foreground">
            View all your past repository analyses
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No analysis history</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Run your first analysis to see it here
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="transition-colors hover:bg-card/80">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold line-clamp-1">
                          {report.repository?.full_name || "Unknown Repository"}
                        </h3>
                        {report.repository?.language && (
                          <Badge variant="secondary" className="text-xs">
                            {report.repository.language}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(report.created_at), "PPp")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center justify-end gap-2">
                        {getScoreTrend(report.health_score)}
                        <span className={`text-2xl font-bold ${getScoreColor(report.health_score)}`}>
                          {report.health_score}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {report.total_issues} issues found
                      </p>
                    </div>

                    <Button asChild variant="outline" size="sm">
                      <Link href={`/report/${report.id}`}>
                        <span className="hidden sm:inline-block mr-2">View Report</span>
                        <span className="sm:hidden">View</span>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}