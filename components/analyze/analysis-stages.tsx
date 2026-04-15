"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GitFork, Code2, Network, Sparkles, FileText, Check } from "lucide-react"
import { ANALYSIS_STAGES } from "@/lib/types"
import { AIParticleBurst } from "./ai-particle-burst"

const stageIcons = [GitFork, Code2, Network, Sparkles, FileText]

type StageStatus = "pending" | "active" | "done"

interface AnalysisStagesProps {
  currentStage: number
  completedStages: number[]
}

export function AnalysisStages({ currentStage, completedStages }: AnalysisStagesProps) {
  const getStageStatus = (stageId: number): StageStatus => {
    if (completedStages.includes(stageId)) return "done"
    if (currentStage === stageId) return "active"
    return "pending"
  }

  return (
    <div className="relative">
      {/* Connecting vertical line */}
      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />
      
      {/* Animated progress line overlay */}
      <motion.div
        className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-primary to-accent-green"
        initial={{ height: 0 }}
        animate={{
          height: `${Math.min(100, ((completedStages.length + (currentStage > 0 ? 0.5 : 0)) / 5) * 100)}%`,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ maxHeight: "calc(100% - 4rem)" }}
      />

      <div className="relative space-y-4">
        {ANALYSIS_STAGES.map((stage, index) => {
          const Icon = stageIcons[index]
          const status = getStageStatus(stage.id)
          const isAIStage = stage.id === 4

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              {/* Circle indicator */}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center">
                {/* Pulse ring for active */}
                {status === "active" && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* AI Particle burst for stage 4 */}
                {isAIStage && status === "active" && <AIParticleBurst />}

                {/* Circle background */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                    status === "done"
                      ? "bg-accent-green"
                      : status === "active"
                        ? "bg-primary"
                        : "bg-muted"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {status === "done" ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-5 w-5 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ scale: 0.8 }}
                        animate={{
                          scale: status === "active" ? [1, 1.1, 1] : 1,
                        }}
                        transition={{
                          duration: status === "active" ? 1 : 0.2,
                          repeat: status === "active" ? Infinity : 0,
                        }}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            status === "active"
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p
                    className={`font-medium ${
                      status === "pending"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {stage.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {status === "done" && "Complete"}
                    {status === "active" && "In progress"}
                    {status === "pending" && "Waiting..."}
                  </p>
                </div>

                {/* Status indicator */}
                {status === "active" && (
                  <motion.div
                    className="h-2 w-2 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
