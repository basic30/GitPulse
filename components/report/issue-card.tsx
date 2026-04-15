"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronDown, 
  Copy, 
  Check, 
  X, 
  Link2, 
  FileCode, 
  Sparkles,
  Package,
  FileX,
  Files,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import type { Issue, IssueCategory } from "@/lib/types"

interface IssueCardProps {
  issue: Issue
  isExpanded: boolean
  onToggle: () => void
}

const severityStyles = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

const riskStyles = {
  safe: "bg-accent-green/10 text-accent-green border-accent-green/20",
  "needs-verification": "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  risky: "bg-accent-red/10 text-accent-red border-accent-red/20",
}

const categoryIcons: Record<IssueCategory, React.ElementType> = {
  "dead-code": FileX,
  "zombie-deps": Package,
  "unused-imports": FileCode,
  "duplicate-code": Files,
  risky: AlertTriangle,
}

const categoryLabels: Record<IssueCategory, string> = {
  "dead-code": "Dead Code",
  "zombie-deps": "Zombie Dep",
  "unused-imports": "Unused Import",
  "duplicate-code": "Duplicate",
  risky: "Risky",
}

const riskLabels = {
  safe: "Safe",
  "needs-verification": "Verify",
  risky: "Risky",
}

export function IssueCard({ issue, isExpanded, onToggle }: IssueCardProps) {
  const [copied, setCopied] = useState(false)
  const [fixCopied, setFixCopied] = useState(false)

  const CategoryIcon = categoryIcons[issue.category]

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Format as GitHub permalink style
    const permalink = `${issue.filePath}:${issue.lineStart}-${issue.lineEnd}`
    navigator.clipboard.writeText(permalink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyFix = () => {
    if (issue.fixSuggestion) {
      navigator.clipboard.writeText(issue.fixSuggestion.after)
      setFixCopied(true)
      setTimeout(() => setFixCopied(false), 2000)
    }
  }

  // Get file extension for syntax highlighting
  const fileExtension = issue.filePath.split('.').pop() || 'js'
  const language = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    json: 'json',
    py: 'python',
    rs: 'rust',
  }[fileExtension] || 'javascript'

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      {/* Collapsed Header - height ~72px as per spec */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-secondary/30"
      >
        {/* Category Icon */}
        <div className="shrink-0 rounded-lg bg-secondary p-2">
          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Title & Path */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium">{issue.title}</h3>
          <button
            onClick={handleCopyPath}
            className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-mono truncate">
              {issue.filePath}:{issue.lineStart}-{issue.lineEnd}
            </span>
            {copied ? (
              <Check className="h-3 w-3 text-accent-green shrink-0" />
            ) : (
              <Copy className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        </div>

        {/* Badges - hidden on mobile, shown on sm+ */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
              severityStyles[issue.severity]
            }`}
          >
            {issue.severity}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
              riskStyles[issue.risk]
            }`}
          >
            {riskLabels[issue.risk]}
          </span>
        </div>

        {/* Expand Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Mobile Badges */}
      <div className="flex flex-wrap gap-2 px-4 pb-3 sm:hidden">
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
            severityStyles[issue.severity]
          }`}
        >
          {issue.severity}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
            riskStyles[issue.risk]
          }`}
        >
          {riskLabels[issue.risk]}
        </span>
      </div>

      {/* Expanded Content with spring animation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="space-y-4 border-t border-border p-4">
              {/* AI Analysis Section */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Analysis
                </h4>
                <p className="rounded-lg bg-secondary/50 p-3 text-sm leading-relaxed text-muted-foreground">
                  {issue.aiExplanation}
                </p>
              </div>

              {/* Dead Code Section - Syntax highlighted */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Dead Code</h4>
                  <span className="text-xs text-muted-foreground font-mono">
                    {language}
                  </span>
                </div>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-[#0d1117] p-4 font-mono text-xs leading-relaxed">
                    <code className="text-[#c9d1d9]">
                      {issue.codeSnippet.split('\n').map((line, i) => (
                        <div key={i} className="flex">
                          <span className="mr-4 select-none text-[#484f58] w-6 text-right">
                            {issue.lineStart + i}
                          </span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Fix Suggestion - Diff view */}
              {issue.fixSuggestion && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Fix Suggestion</h4>
                  <div className="rounded-lg border border-border overflow-hidden">
                    {/* Removed lines */}
                    <div className="bg-red-500/10 border-b border-border">
                      {issue.fixSuggestion.before.split('\n').map((line, i) => (
                        <div key={`before-${i}`} className="flex font-mono text-xs">
                          <span className="w-8 shrink-0 select-none bg-red-500/20 px-2 py-0.5 text-red-400 text-center">
                            -
                          </span>
                          <span className="px-3 py-0.5 text-red-400 whitespace-pre overflow-x-auto">
                            {line}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Added lines */}
                    <div className="bg-green-500/10">
                      {issue.fixSuggestion.after.split('\n').map((line, i) => (
                        <div key={`after-${i}`} className="flex font-mono text-xs">
                          <span className="w-8 shrink-0 select-none bg-green-500/20 px-2 py-0.5 text-green-400 text-center">
                            +
                          </span>
                          <span className="px-3 py-0.5 text-green-400 whitespace-pre overflow-x-auto">
                            {line}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Related Issues */}
              {issue.relatedIssueIds && issue.relatedIssueIds.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Related Issues</h4>
                  <div className="flex flex-wrap gap-2">
                    {issue.relatedIssueIds.map((relatedId) => (
                      <span
                        key={relatedId}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                      >
                        {relatedId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Row */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm">
                  <Check className="mr-2 h-4 w-4" />
                  Mark Resolved
                </Button>
                <Button variant="ghost" size="sm">
                  <X className="mr-2 h-4 w-4" />
                  Dismiss as False Positive
                </Button>
                {issue.fixSuggestion && (
                  <Button variant="ghost" size="sm" onClick={handleCopyFix}>
                    {fixCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-accent-green" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Fix
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
