"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Terminal } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface LogEntry {
  message: string
  timestamp: string
}

interface LiveLogProps {
  logs: LogEntry[]
}

export function LiveLog({ logs }: LiveLogProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const logContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current && isExpanded) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs, isExpanded])

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0a0a0f]">
      {/* Header Toggle */}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-none border-b border-border px-4 py-3 hover:bg-muted/20"
      >
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium">
            {isExpanded ? "Hide log" : "Show live log"}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {logs.length} entries
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {/* Log Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 192, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              ref={logContainerRef}
              className="h-48 max-h-48 overflow-y-auto bg-[#0a0a0f] p-4 font-mono text-xs"
            >
              {logs.length === 0 ? (
                <p className="text-muted-foreground">Waiting for logs...</p>
              ) : (
                logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-1.5 flex gap-3"
                  >
                    <span className="shrink-0 text-muted-foreground">
                      [{log.timestamp}]
                    </span>
                    <span className="text-green-400">{log.message}</span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
