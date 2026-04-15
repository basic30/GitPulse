"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
  Code2,
  Package,
  Sparkles,
  Gauge,
  Shield,
  Languages,
} from "lucide-react"

const features = [
  {
    title: "Dead Code Detection",
    description:
      "Finds unused functions, variables, and classes across ALL files using cross-file call graph analysis.",
    icon: Code2,
    tag: "Static Analysis",
  },
  {
    title: "Zombie Dependencies",
    description:
      "Detects packages in package.json or requirements.txt that are never actually imported anywhere.",
    icon: Package,
    tag: "Dependencies",
  },
  {
    title: "AI Reasoning Layer",
    description:
      "Claude AI reads your code in context, flags conditionally-dead logic and feature flag orphans.",
    icon: Sparkles,
    tag: "AI-Powered",
  },
  {
    title: "Code Health Score",
    description:
      "Composite 0-100 score with 5 sub-categories, trackable over time to measure improvement.",
    icon: Gauge,
    tag: "Metrics",
  },
  {
    title: "Safe Deletion Plan",
    description:
      "AI-ordered step-by-step deletion sequence that won't break your codebase.",
    icon: Shield,
    tag: "Guidance",
  },
  {
    title: "Multi-Language Support",
    description:
      "JavaScript, TypeScript, Python in MVP. Rust and Go coming in v1.1.",
    icon: Languages,
    tag: "Languages",
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="dot-grid relative px-4 py-24" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything rule-based tools{" "}
            <span className="gradient-text">miss</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Traditional linters catch syntax errors. GitPulse catches the code
            that silently wastes your time.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group relative h-full rounded-xl border border-border bg-card/80 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                {/* Tag */}
                <div className="absolute -top-2.5 right-4 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {feature.tag}
                </div>

                {/* Icon */}
                <div className="mb-4 inline-flex rounded-lg bg-secondary p-3">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
