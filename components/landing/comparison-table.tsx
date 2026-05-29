"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Check, X, Minus } from "lucide-react"

const tools = [
  {
    name: "GitPulse",
    highlight: true,
    deadCode: true,
    crossFile: true,
    zombieDeps: true,
    aiLayer: true,
    safePlan: true,
  },
  {
    name: "SonarQube",
    highlight: false,
    deadCode: "partial",
    crossFile: false,
    zombieDeps: false,
    aiLayer: false,
    safePlan: false,
  },
  {
    name: "DeepSource",
    highlight: false,
    deadCode: "partial",
    crossFile: "partial",
    zombieDeps: false,
    aiLayer: false,
    safePlan: false,
  },
  {
    name: "Depcheck",
    highlight: false,
    deadCode: false,
    crossFile: false,
    zombieDeps: true,
    aiLayer: false,
    safePlan: false,
  },
  {
    name: "ts-prune",
    highlight: false,
    deadCode: "partial",
    crossFile: false,
    zombieDeps: false,
    aiLayer: false,
    safePlan: false,
  },
]

const columns = [
  { key: "deadCode", label: "Dead Code" },
  { key: "crossFile", label: "Cross-file" },
  { key: "zombieDeps", label: "Zombie Deps" },
  { key: "aiLayer", label: "AI Layer" },
  { key: "safePlan", label: "Safe Plan" },
]

function StatusIcon({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-green/20">
        <Check className="h-4 w-4 text-accent-green" />
      </div>
    )
  }
  if (value === "partial") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-amber/20">
        <Minus className="h-4 w-4 text-accent-amber" />
      </div>
    )
  }
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted/50">
      <X className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}

export function ComparisonTable() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="px-4 py-24" ref={ref}>
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built for what existing tools{" "}
            <span className="gradient-text">can&apos;t do</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden rounded-xl border border-border"
        >
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                    Tool
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tools.map((tool, index) => (
                  <motion.tr
                    key={tool.name}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className={`border-b border-border transition-colors hover:bg-card/80 ${
                      tool.highlight
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "bg-card/30"
                    }`}
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`font-medium text-sm sm:text-base ${
                          tool.highlight ? "text-primary" : ""
                        }`}
                      >
                        {tool.name}
                      </span>
                      {tool.highlight && (
                        <span className="ml-1.5 sm:ml-2 rounded-full bg-primary/20 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary">
                          Best
                        </span>
                      )}
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex justify-center">
                          <StatusIcon
                            value={tool[col.key as keyof typeof tool] as boolean | string}
                          />
                        </div>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
