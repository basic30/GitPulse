"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Shield, Copy, GitPullRequest, Check, ChevronDown, GripHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import type { DeletionStep } from "@/lib/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface DeletionPlanProps {
  steps: DeletionStep[]
  reportId?: string
}

const phaseStyles = {
  1: {
    badge: "bg-accent-green/20 text-accent-green border-accent-green/30",
    card: "border-accent-green/20 bg-accent-green/5",
    label: "Safe Deletes",
  },
  2: {
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    card: "border-blue-500/20 bg-blue-500/5",
    label: "Bundled Removals",
  },
  3: {
    badge: "bg-accent-amber/20 text-accent-amber border-accent-amber/30",
    card: "border-accent-amber/20 bg-accent-amber/5",
    label: "Dependency Cleanup",
  },
  4: {
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    card: "border-orange-500/20 bg-orange-500/5",
    label: "Needs Verification",
  },
} as const

export function DeletionPlan({ steps, reportId = "default" }: DeletionPlanProps) {
  // Persist completed steps to localStorage
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1, 2, 3, 4]))
  const [copied, setCopied] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`gitpulse-deletion-plan-${reportId}`)
    if (stored) {
      try {
        setCompletedSteps(new Set(JSON.parse(stored)))
      } catch {
        // Ignore parse errors
      }
    }
  }, [reportId])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(
      `gitpulse-deletion-plan-${reportId}`,
      JSON.stringify([...completedSteps])
    )
  }, [completedSteps, reportId])

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(stepId)) {
        next.delete(stepId)
      } else {
        next.add(stepId)
      }
      return next
    })
  }

  const togglePhase = (phase: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev)
      if (next.has(phase)) {
        next.delete(phase)
      } else {
        next.add(phase)
      }
      return next
    })
  }

  const completedCount = completedSteps.size
  const totalSteps = steps.length
  const progressPercent = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0

  // Group steps by phase
  const phases = [1, 2, 3, 4] as const
  const stepsByPhase = phases.reduce((acc, phase) => {
    acc[phase] = steps.filter((s) => s.phase === phase)
    return acc
  }, {} as Record<number, DeletionStep[]>)

  const handleCopyMarkdown = () => {
    const markdown = phases
      .map((phase) => {
        const phaseSteps = stepsByPhase[phase]
        if (phaseSteps.length === 0) return null
        
        const header = `## Phase ${phase}: ${phaseStyles[phase].label} (${phaseSteps.length} steps)\n\n`
        const items = phaseSteps
          .map((step, i) => {
            const checkbox = completedSteps.has(step.id) ? "[x]" : "[ ]"
            return `${checkbox} **Step ${i + 1}: ${step.issueTitle}**\n   - ${step.rationale}`
          })
          .join("\n\n")
        
        return header + items
      })
      .filter(Boolean)
      .join("\n\n---\n\n")
    
    navigator.clipboard.writeText(`# Safe Deletion Plan\n\n${markdown}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const PlanContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 p-2">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Safe Deletion Plan</h3>
            <p className="text-sm text-muted-foreground">
              {totalSteps} steps
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b border-border p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            {completedCount} of {totalSteps} done
          </span>
          <span className="text-muted-foreground tabular-nums">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Steps by Phase - Collapsible */}
      <div className="max-h-[400px] overflow-y-auto lg:max-h-none">
        {phases.map((phase) => {
          const phaseSteps = stepsByPhase[phase]
          if (phaseSteps.length === 0) return null
          const style = phaseStyles[phase]
          const isExpanded = expandedPhases.has(phase)
          const phaseCompleted = phaseSteps.filter(s => completedSteps.has(s.id)).length

          return (
            <Collapsible
              key={phase}
              open={isExpanded}
              onOpenChange={() => togglePhase(phase)}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between border-b border-border p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${style.badge}`}>
                    Phase {phase}
                  </span>
                  <span className="text-sm font-medium">
                    {style.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({phaseSteps.length} steps)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {phaseCompleted}/{phaseSteps.length}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="space-y-2 p-4 pt-2">
                  {phaseSteps.map((step, index) => {
                    const isCompleted = completedSteps.has(step.id)

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
                          style.card
                        } ${isCompleted ? "opacity-60" : ""}`}
                      >
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => toggleStep(step.id)}
                          className="mt-0.5"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground tabular-nums">
                              #{index + 1}
                            </span>
                            <p
                              className={`text-sm font-medium ${
                                isCompleted ? "line-through" : ""
                              }`}
                            >
                              {step.issueTitle}
                            </p>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {step.rationale}
                          </p>
                        </div>
                        {isCompleted && (
                          <Check className="h-4 w-4 shrink-0 text-accent-green" />
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border p-4">
        <Button variant="outline" size="sm" onClick={handleCopyMarkdown} className="flex-1">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-accent-green" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Plan as Markdown
            </>
          )}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex-1">
                <Button variant="outline" size="sm" disabled className="w-full">
                  <GitPullRequest className="mr-2 h-4 w-4" />
                  Generate Cleanup PR
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming in v2.0</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden rounded-xl border border-border bg-card lg:block"
      >
        <PlanContent />
      </motion.div>

      {/* Mobile Bottom Sheet Trigger */}
      <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
        <Button
          onClick={() => setIsMobileOpen(true)}
          className="w-full shadow-lg"
          size="lg"
        >
          <Shield className="mr-2 h-5 w-5" />
          View Deletion Plan ({completedCount}/{totalSteps})
        </Button>
      </div>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl border-t border-border bg-card lg:hidden"
            >
              {/* Drag Handle */}
              <div className="flex items-center justify-center py-3">
                <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
                className="absolute right-2 top-2"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="overflow-y-auto pb-safe">
                <PlanContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
