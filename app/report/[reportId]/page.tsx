"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import useSWR from "swr"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Download, FileJson, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HealthScoreHero } from "@/components/report/health-score-hero"
import { IssueList } from "@/components/report/issue-list"
import { DeletionPlan } from "@/components/report/deletion-plan"
import { MasterPromptFab } from "@/components/report/master-prompt-fab"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface Repository {
  id: string
  name: string
  full_name: string
  language: string | null
}

interface Report {
  id: string
  repository_id: string
  health_score: number
  dead_code_score: number | null
  dependency_score: number | null
  complexity_score: number | null
  duplication_score: number | null
  documentation_score: number | null
  total_issues: number
  lines_removable: number
  zombie_dependencies: number
  files_affected: number
  status: string
  ai_summary: string | null
  deletion_plan: {
    phases: Array<{
      name: string
      badge: string
      steps: Array<{ title: string; rationale: string }>
    }>
  } | null
  created_at: string
  completed_at: string | null
  repository: Repository
}

interface Issue {
  id: string
  category: string
  severity: string
  risk_level: string
  title: string
  description: string | null
  file_path: string
  start_line: number | null
  end_line: number | null
  code_snippet: string | null
  suggested_fix: string | null
  ai_explanation: string | null
}

// Custom fetcher that handles BOTH Report IDs and Repository IDs
const fetchReportData = async (id: string) => {
  const supabase = createClient()

  // 1. Try to fetch by Report ID (History page behavior)
  let { data: report, error: reportError } = await supabase
    .from("analysis_reports")
    .select('*, repository:repositories(id, name, full_name, language)')
    .eq("id", id)
    .single()

  // 2. If it fails, assume the ID is a Repository ID (Dashboard page behavior)
  if (reportError || !report) {
    const { data: latestReport, error: latestError } = await supabase
      .from("analysis_reports")
      .select('*, repository:repositories(id, name, full_name, language)')
      .eq("repository_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (latestError || !latestReport) {
      throw new Error("Report not found")
    }
    report = latestReport
  }

  // 3. Fetch the associated issues
  const { data: issues, error: issuesError } = await supabase
    .from("issues")
    .select("*")
    .eq("report_id", report.id)

  if (issuesError) {
    console.error("Failed to fetch issues:", issuesError)
  }

  return { report, issues: issues || [] }
}

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const reportId = params.reportId as string

  const { data, error, isLoading } = useSWR<{ report: Report; issues: Issue[] }>(
    reportId,
    fetchReportData
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="mb-4 text-muted-foreground">Report not found or hasn't been analyzed yet.</p>
        <Button onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    )
  }

  const { report, issues } = data

  // Transform to component-compatible format
  // Calculate dead code percentage: score is 0-100 where 100 = no dead code.
  // So dead code percentage = 100 - score. E.g., score 75 → 25% dead code.
  const deadCodePct = Math.round(100 - (report.dead_code_score ?? 100))
  const dependencyPct = Math.round(100 - (report.dependency_score ?? 100))
  const complexityPct = Math.round(100 - (report.complexity_score ?? 100))
  const duplicationPct = Math.round(100 - (report.duplication_score ?? 100))
  const documentationPct = Math.round(100 - (report.documentation_score ?? 100))

  const reportData = {
    id: report.id,
    analysisId: report.id,
    repoFullName: report.repository.full_name,
    language: report.repository.language ? [report.repository.language] : ["Unknown"],
    fileCount: report.files_affected || 0,
    healthScore: report.health_score,
    subScores: [
      { name: "Dead Code", percentage: deadCodePct, score: report.dead_code_score ?? 0, weight: 25, description: "of code is dead / unused" },
      { name: "Zombie Dependencies", percentage: dependencyPct, score: report.dependency_score ?? 0, weight: 25, description: "of dependencies are unused" },
      { name: "Code Complexity", percentage: complexityPct, score: report.complexity_score ?? 0, weight: 20, description: "of code has high complexity" },
      { name: "Duplication", percentage: duplicationPct, score: report.duplication_score ?? 0, weight: 15, description: "of code is duplicated" },
      { name: "Documentation Gaps", percentage: documentationPct, score: report.documentation_score ?? 0, weight: 15, description: "of code lacks documentation" },
    ],
    issues: [],
    totalIssues: report.total_issues,
    linesRemovable: report.lines_removable,
    zombieDependencies: report.zombie_dependencies,
    deletionPlan: [],
    createdAt: new Date(report.created_at),
    githubUrl: `https://github.com/${report.repository.full_name}`,
  }

  const categoryMap: Record<string, string> = {
    "dead_code": "dead-code",
    "zombie_dependency": "zombie-deps",
    "unused_import": "unused-imports",
    "duplicate": "duplicate-code",
    "risky_pattern": "risky",
  }

  const riskMap: Record<string, string> = {
    "safe": "safe",
    "verify": "needs-verification",
    "risky": "risky",
  }

  const issuesData = issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    filePath: issue.file_path,
    lineStart: issue.start_line ?? 1,
    lineEnd: issue.end_line ?? issue.start_line ?? 1,
    category: categoryMap[issue.category] || "dead-code",
    severity: issue.severity as "critical" | "high" | "medium" | "low",
    risk: riskMap[issue.risk_level] || "safe",
    aiExplanation: issue.ai_explanation || issue.description || "No explanation available",
    codeSnippet: issue.code_snippet || "",
    fixSuggestion: issue.suggested_fix ? {
      before: issue.code_snippet || "",
      after: issue.suggested_fix,
    } : undefined,
  }))

  const phaseNumberMap: Record<string, 1 | 2 | 3 | 4> = {
    "safe": 1,
    "bundled": 2,
    "dependency": 3,
    "verify": 4,
  }

  const phaseLabelMap: Record<string, string> = {
    "safe": "Safe Deletes",
    "bundled": "Bundled Removals",
    "dependency": "Dependency Cleanup",
    "verify": "Needs Verification",
  }

  let stepCounter = 0
  const deletionSteps = report.deletion_plan?.phases?.flatMap((phase) =>
    phase.steps.map((step) => {
      stepCounter++
      return {
        id: `step-${stepCounter}`,
        phase: phaseNumberMap[phase.badge] || 4,
        phaseLabel: phaseLabelMap[phase.badge] || phase.name,
        issueId: `issue-${stepCounter}`,
        issueTitle: step.title,
        rationale: step.rationale,
        completed: false,
      }
    })
  ) || []

  // --- EXPORT AND SHARE HANDLERS ---
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2))
    const downloadNode = document.createElement('a')
    downloadNode.setAttribute("href", dataStr)
    downloadNode.setAttribute("download", `gitpulse-report-${reportData.repoFullName.replace('/', '-')}.json`)
    document.body.appendChild(downloadNode)
    downloadNode.click()
    downloadNode.remove()
  }

  const handleExportPDF = () => {
    // Triggers the browser's native print dialog to save as PDF
    window.print()
  }

  const handleShare = async () => {
    const shareUrl = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GitPulse Analysis Report',
          text: `Check out this code analysis report for ${reportData.repoFullName}`,
          url: shareUrl,
        })
      } catch (err) {
        console.log('Share canceled', err)
      }
    } else {
      // Fallback for desktop browsers that don't support navigator.share
      await navigator.clipboard.writeText(shareUrl)
      alert("Report URL copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
            <div className="hidden h-6 w-px bg-border sm:block" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">{report.repository.full_name}</h1>
              <p className="text-sm text-muted-foreground">Analysis Report</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="GitPulse Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="hidden font-bold sm:inline">GitPulse</span>
          </div>
        </div>
      </header>

      {/* Main Content - 70/30 split on desktop */}
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          {/* Left Column - Main Content (~70%) */}
          <div className="space-y-6">
            <HealthScoreHero report={reportData} />
            <IssueList issues={issuesData} />
          </div>

          {/* Right Column - Deletion Plan (~30%) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <DeletionPlan steps={deletionSteps} reportId={reportId} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile: Deletion Plan is a floating button + bottom sheet */}
      <div className="lg:hidden">
        <DeletionPlan steps={deletionSteps} reportId={reportId} />
      </div>

      {/* Floating Action Button for AI Master Prompt */}
      <MasterPromptFab issues={issuesData} repoFullName={reportData.repoFullName} />

      {/* Footer */}
      <footer className="mt-16 border-t border-border py-8 pb-24 lg:pb-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 lg:px-8 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            Report generated by GitPulse · {reportData.createdAt.toLocaleDateString()}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportJSON} className="gap-2">
              <FileJson className="h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="default" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Report
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}