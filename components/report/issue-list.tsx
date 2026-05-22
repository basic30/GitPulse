"use client"

import { motion } from "framer-motion"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { IssueCard } from "./issue-card"
import { useState, useRef, useCallback } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { Issue, IssueSeverity, IssueRisk } from "@/lib/types"

interface IssueListProps {
  issues: Issue[]
}

const tabs = [
  { value: "all", label: "All" },
  { value: "dead-code", label: "Dead Code" },
  { value: "zombie-deps", label: "Zombie Deps" },
  { value: "unused-imports", label: "Unused Imports" },
  { value: "duplicate-code", label: "Duplicates" },
  { value: "risky", label: "Risky" },
]

const severityFilters: IssueSeverity[] = ["critical", "high", "medium", "low"]
const riskFilters: IssueRisk[] = ["safe", "needs-verification", "risky"]

const severityColors: Record<IssueSeverity, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

const riskColors: Record<IssueRisk, string> = {
  safe: "bg-accent-green/20 text-accent-green border-accent-green/30",
  "needs-verification": "bg-accent-amber/20 text-accent-amber border-accent-amber/30",
  risky: "bg-accent-red/20 text-accent-red border-accent-red/30",
}

export function IssueList({ issues }: IssueListProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeverities, setSelectedSeverities] = useState<IssueSeverity[]>([])
  const [selectedRisks, setSelectedRisks] = useState<IssueRisk[]>([])
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())
  const [allExpanded, setAllExpanded] = useState(false)
  
  const parentRef = useRef<HTMLDivElement>(null)

  const toggleSeverity = (severity: IssueSeverity) => {
    setSelectedSeverities((prev) =>
      prev.includes(severity)
        ? prev.filter((s) => s !== severity)
        : [...prev, severity]
    )
  }

  const toggleRisk = (risk: IssueRisk) => {
    setSelectedRisks((prev) =>
      prev.includes(risk) ? prev.filter((r) => r !== risk) : [...prev, risk]
    )
  }

  const toggleExpanded = (issueId: string) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev)
      if (next.has(issueId)) {
        next.delete(issueId)
      } else {
        next.add(issueId)
      }
      return next
    })
  }

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    // Tab filter
    if (activeTab !== "all" && issue.category !== activeTab) return false

    // Search filter
    if (
      searchQuery &&
      !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !issue.filePath.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Severity filter
    if (
      selectedSeverities.length > 0 &&
      !selectedSeverities.includes(issue.severity)
    ) {
      return false
    }

    // Risk filter
    if (selectedRisks.length > 0 && !selectedRisks.includes(issue.risk)) {
      return false
    }

    return true
  })

  const toggleAllExpanded = () => {
    if (allExpanded) {
      setExpandedIssues(new Set())
    } else {
      setExpandedIssues(new Set(filteredIssues.map((i) => i.id)))
    }
    setAllExpanded(!allExpanded)
  }

  // Get counts per tab
  const getCategoryCount = (category: string) => {
    if (category === "all") return issues.length
    return issues.filter((i) => i.category === category).length
  }

  // Virtual list for performance when issues > 100
  const shouldVirtualize = filteredIssues.length > 100
  
  const virtualizer = useVirtualizer({
    count: filteredIssues.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback((index: number) => {
      // 72px collapsed, ~400px expanded (estimate)
      return expandedIssues.has(filteredIssues[index]?.id) ? 400 : 72
    }, [expandedIssues, filteredIssues]),
    overscan: 5,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-border bg-card"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tabs Header - horizontal scroll on mobile */}
        <div className="border-b border-border overflow-x-auto scrollbar-hide">
          <TabsList className="h-auto w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0">
            {tabs.map((tab) => {
              const count = getCategoryCount(tab.value)
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  {tab.label}
                  <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs tabular-nums">
                    {count}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-border p-4">
          {/* Severity & Risk Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">Severity:</span>
            {severityFilters.map((severity) => (
              <button
                key={severity}
                onClick={() => toggleSeverity(severity)}
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize transition-colors ${
                  selectedSeverities.includes(severity)
                    ? severityColors[severity]
                    : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {severity}
              </button>
            ))}
            
            <span className="mx-2 hidden h-4 w-px bg-border sm:block" />
            
            <span className="text-xs text-muted-foreground shrink-0">Risk:</span>
            {riskFilters.map((risk) => (
              <button
                key={risk}
                onClick={() => toggleRisk(risk)}
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  selectedRisks.includes(risk)
                    ? riskColors[risk]
                    : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {risk === "needs-verification" ? "Verify" : risk.charAt(0).toUpperCase() + risk.slice(1)}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={toggleAllExpanded} className="shrink-0">
              {allExpanded ? (
                <>
                  <ChevronUp className="mr-1 h-4 w-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-4 w-4" />
                  Expand All
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Issue List */}
        <TabsContent value={activeTab} className="mt-0">
          {filteredIssues.length > 0 ? (
            shouldVirtualize ? (
              // Virtualized list for large datasets
              <div ref={parentRef} className="h-[600px] overflow-auto">
                <div
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualRow) => {
                    const issue = filteredIssues[virtualRow.index]
                    return (
                      <div
                        key={virtualRow.key}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                        className="p-2"
                      >
                        <IssueCard
                          issue={issue}
                          isExpanded={expandedIssues.has(issue.id)}
                          onToggle={() => toggleExpanded(issue.id)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              // Regular list for smaller datasets
              <div className="space-y-3 p-4">
                {filteredIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    isExpanded={expandedIssues.has(issue.id)}
                    onToggle={() => toggleExpanded(issue.id)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No issues match your filters</p>
              <Button
                variant="link"
                onClick={() => {
                  setSelectedSeverities([])
                  setSelectedRisks([])
                  setSearchQuery("")
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
