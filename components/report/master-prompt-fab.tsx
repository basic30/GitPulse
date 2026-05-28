"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Copy, Check, X, Code, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Issue {
  id: string
  title: string
  filePath: string
  lineStart: number
  lineEnd: number
  category: string
  severity: "critical" | "high" | "medium" | "low"
  risk: string
  aiExplanation: string
  codeSnippet?: string
  fixSuggestion?: {
    before: string
    after: string
  }
}

interface MasterPromptFabProps {
  issues: Issue[]
  repoFullName: string
}

export function MasterPromptFab({ issues, repoFullName }: MasterPromptFabProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate the prompt text
  const generatePromptText = () => {
    const issuesList = issues.map((issue, index) => {
      let codeContext = ""
      if (issue.codeSnippet) {
        codeContext = `\nCode Snippet:\n\`\`\`\n${issue.codeSnippet}\n\`\`\``
      }
      
      let fixContext = ""
      if (issue.fixSuggestion?.after) {
        fixContext = `\nSuggested Fix:\n\`\`\`\n${issue.fixSuggestion.after}\n\`\`\``
      }

      return `[ISSUE #${index + 1}] Category: ${issue.category.toUpperCase()} | Severity: ${issue.severity.toUpperCase()} | Risk Level: ${issue.risk.toUpperCase()}
File: \`${issue.filePath}\` (Lines ${issue.lineStart}-${issue.lineEnd})
Title: "${issue.title}"
Explanation: ${issue.aiExplanation}${codeContext}${fixContext}
----------------------------------------`
    }).join("\n\n")

    return `You are an expert AI software refactoring assistant. 
I have analyzed my repository "${repoFullName}" using GitPulse, which has detected code health issues including dead code, zombie dependencies, unused imports, duplicate code, and risky patterns.

Please act as an autonomous refactoring engine and write the exact code edits required to clean up these flagged issues based on the following audit report:

=================== GITPULSE REPORT ===================
Repository: ${repoFullName}
Total Issues Flagged: ${issues.length}

${issuesList}
========================================================

INSTRUCTIONS:
1. Carefully review each issue in the report.
2. For DEAD CODE, unused imports, or zombie dependencies, safely remove the unused elements. Verify that no remaining routes or files depend on them.
3. For DUPLICATE code, extract the shared logic into a single reusable utility function or component to maximize DRY principles.
4. For RISKY PATTERNS, write a safer, more robust implementation matching the suggested fix.
5. Provide a summary of the edits made, listing the exact lines of code successfully deleted or refactored.
`
  }

  const promptText = generatePromptText()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy prompt:", err)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-primary to-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/30 border border-indigo-400/20 hover:shadow-indigo-500/50 hover:border-indigo-400/40 transition-all group"
        >
          <div className="relative">
            <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
            <span className="absolute inset-0 rounded-full bg-white/20 blur-sm animate-ping pointer-events-none" />
          </div>
          <span>AI Master Prompt</span>
        </motion.button>
      </div>

      {/* Slide-Over Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
            />

            {/* Modal Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-55 w-full max-w-2xl border-l border-border bg-card p-6 shadow-2xl flex flex-col h-screen"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 text-indigo-500 border border-indigo-500/20">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">AI Master Cleanup Prompt</h2>
                    <p className="text-xs text-muted-foreground">
                      Refactor your entire audited codebase in one click
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full h-8 w-8 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Guide Card */}
              <div className="my-5 p-4 rounded-xl border border-indigo-500/15 bg-indigo-500/5 backdrop-blur-sm space-y-2">
                <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wider">
                  <Terminal className="h-4 w-4" />
                  <span>How to use this prompt:</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We compiled all <strong>{issues.length} issues</strong> and refactoring recommendations from this report into a highly optimized instruction set. Copy it and paste it into your favorite coding AI (like <strong>Cursor Composer</strong>, <strong>Claude 3.5 Sonnet</strong>, or <strong>GitHub Copilot</strong>) to automatically prune and clean up your workspace.
                </p>
              </div>

              {/* Prompt Text Container */}
              <div className="flex-1 min-h-0 relative rounded-xl border border-border/80 bg-background/50 backdrop-blur-sm p-4 overflow-hidden group">
                <div className="absolute right-4 top-4 z-10">
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md active:scale-95 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-white" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="h-full overflow-y-auto font-mono text-[11px] leading-relaxed text-muted-foreground p-2 pr-6 select-all scrollbar-thin whitespace-pre-wrap select-text">
                  {promptText}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Code className="h-4 w-4 text-indigo-500" />
                  Formulated for maximum AI prompt alignment
                </span>
                <span>Press Esc to close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
