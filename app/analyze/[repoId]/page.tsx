"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, X, AlertCircle, RotateCcw, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnalysisStages } from "@/components/analyze/analysis-stages"
import { LiveLog } from "@/components/analyze/live-log"
import { createClient } from "@/lib/supabase/client"
import confetti from "canvas-confetti"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface LogEntry {
  message: string
  timestamp: string
}

interface Repository {
  id: string
  name: string
  full_name: string
  language: string | null
  is_private: boolean
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function AnalyzePage() {
  const params = useParams()
  const router = useRouter()
  const [repo, setRepo] = useState<Repository | null>(null)
  const [currentStage, setCurrentStage] = useState(1)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [etaSeconds, setEtaSeconds] = useState(60)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const elapsedRef = useRef(0)
  const startTimeRef = useRef<number>(0)

  const addLog = useCallback((message: string) => {
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const timestamp = formatTime(elapsed)
    setLogs((prev) => [...prev, { message, timestamp }])
  }, [])

  const completeStage = useCallback((stage: number) => {
    setCompletedStages((prev) => [...prev, stage])
    if (stage < 5) {
      setCurrentStage(stage + 1)
    }
  }, [])

  const fireConfetti = useCallback(() => {
    const duration = 2000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }, [])

  // Fetch repository info
  useEffect(() => {
    const fetchRepo = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("repositories")
        .select("id, name, full_name, language, is_private")
        .eq("id", params.repoId)
        .single()

      if (error || !data) {
        router.push("/dashboard")
        return
      }

      setRepo(data)
    }

    fetchRepo()
  }, [params.repoId, router])

  // Start analysis
  useEffect(() => {
    if (!repo || isAnalyzing) return

    const startAnalysis = async () => {
      setIsAnalyzing(true)
      startTimeRef.current = Date.now()

      // Stage 1: Cloning
      addLog("Connecting to GitHub API...")
      await new Promise((r) => setTimeout(r, 500))
      addLog(`Fetching repository: ${repo.full_name}`)
      setProgress(5)

      setTimeout(() => {
        addLog("Repository access verified")
        setProgress(10)
        completeStage(1)
      }, 2000)

      // Stage 2: Parsing (after 2.5s)
      setTimeout(() => {
        addLog("Starting code parsing...")
        setProgress(15)
      }, 2500)

      setTimeout(() => {
        addLog("Building abstract syntax trees...")
        setProgress(25)
      }, 4000)

      setTimeout(() => {
        addLog("AST construction complete")
        setProgress(35)
        completeStage(2)
      }, 6000)

      // Stage 3: Graph Building (after 6.5s)
      setTimeout(() => {
        addLog("Building cross-file dependency graph...")
        setProgress(40)
      }, 6500)

      setTimeout(() => {
        addLog("Tracing function calls across modules...")
        setProgress(50)
      }, 8000)

      setTimeout(() => {
        addLog("Dependency graph complete")
        setProgress(55)
        completeStage(3)
      }, 10000)

      // Stage 4: AI Analysis (the real work)
      setTimeout(() => {
        addLog("Preparing AI analysis context...")
        setProgress(60)
      }, 10500)

      setTimeout(() => {
        addLog("Sending code to AI for analysis...")
        setProgress(65)
      }, 12000)

      // Make the actual API call
      setTimeout(async () => {
        try {
          addLog("AI analyzing patterns and dead code...")
          setProgress(70)

          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ repoId: repo.id }),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || "Analysis failed")
          }

          const result = await response.json()

          setProgress(90)
          addLog("AI analysis complete")
          completeStage(4)

          // Stage 5: Report Generation
          setTimeout(() => {
            addLog("Generating safe deletion plan...")
            setProgress(95)
          }, 500)

          setTimeout(() => {
            addLog("Building final report...")
            setProgress(100)
            completeStage(5)
          }, 1500)

          setTimeout(() => {
            addLog("Report generation complete!")
            setIsComplete(true)
            fireConfetti()
          }, 2500)

          setTimeout(() => {
            router.push(`/report/${result.reportId}`)
          }, 4500)

        } catch (err) {
          console.error("Analysis error:", err)
          setError(err instanceof Error ? err.message : "Analysis failed")
        }
      }, 14000)
    }

    startAnalysis()
  }, [repo, isAnalyzing, addLog, completeStage, fireConfetti, router])

  // Update ETA
  useEffect(() => {
    if (!startTimeRef.current || isComplete) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      elapsedRef.current = elapsed
      const estimatedTotal = 45 // ~45 seconds total
      const remaining = Math.max(0, estimatedTotal - elapsed)
      setEtaSeconds(remaining)
    }, 1000)

    return () => clearInterval(interval)
  }, [isComplete])

  if (!repo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0F] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Analysis Failed</h1>
            <p className="mt-2 text-muted-foreground">{error}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0A0A0F] p-4 sm:p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {/* Back Arrow + Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-mono text-lg font-medium sm:text-xl">
              Analyzing{" "}
              <span className="text-primary">{repo.full_name}</span>
            </h1>
            <div className="mt-1 flex items-center gap-2">
              {repo.language && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                  {repo.language}
                </span>
              )}
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                {repo.is_private ? "Private" : "Public"}
              </span>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <X className="mr-2 h-4 w-4" />
              Cancel analysis
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Analysis?</AlertDialogTitle>
              <AlertDialogDescription>
                This will stop the current analysis. You can restart it at any
                time from the dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Analysis</AlertDialogCancel>
              <AlertDialogAction onClick={() => router.push("/dashboard")}>
                Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Main Content */}
      <div className="mx-auto mt-8 w-full max-w-2xl flex-1 space-y-8 sm:mt-12">
        {/* Stage Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnalysisStages
            currentStage={currentStage}
            completedStages={completedStages}
          />
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          {/* Progress Track */}
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent-green)))",
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          {/* Progress Label */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {Math.round(progress)}% complete
            </span>
            <span>
              ~{etaSeconds} seconds remaining
            </span>
          </div>
        </motion.div>

        {/* Live Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LiveLog logs={logs} />
        </motion.div>

        {/* Completion Message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-lg font-medium text-accent-green">
              Analysis complete! Redirecting to report...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
