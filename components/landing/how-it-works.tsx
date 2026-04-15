"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Github, Brain, FileBarChart } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Connect GitHub",
    description:
      "Link your GitHub account with one click. We only request read-only access to your repositories.",
    icon: Github,
  },
  {
    number: "02",
    title: "AI Analyzes Your Repo",
    description:
      "Our AI engine scans your codebase, builds a cross-file call graph, and identifies dead code with surgical precision.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Get Your Health Report",
    description:
      "Receive a comprehensive report with a Code Health Score, prioritized issues, and a safe deletion plan.",
    icon: FileBarChart,
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative px-4 py-24" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            From repo to report in under{" "}
            <span className="gradient-text">90 seconds</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="group relative h-full rounded-xl border border-border bg-card/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                {/* Step Number Badge */}
                <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6 mt-2 inline-flex rounded-lg bg-secondary p-3">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
