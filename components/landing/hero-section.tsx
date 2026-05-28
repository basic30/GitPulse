"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, PlayCircle, Terminal, FileText, CheckCircle2, ChevronRight, RefreshCw, Cpu, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FileItem {
  id: string
  name: string
  path: string
  type: "code" | "config"
  issueType: "unused_import" | "dead_code" | "zombie" | "clean"
  codeBefore: string
  codeAfter: string
  linesSaved: number
  description: string
  severity: "critical" | "high" | "low" | "none"
}

const initialFiles: FileItem[] = [
  {
    id: "file-1",
    name: "page.tsx",
    path: "app/page.tsx",
    type: "code",
    issueType: "unused_import",
    codeBefore: `import { unusedHelper, activeFn } from "@/lib/utils"
import { LegacyIcon } from "@/components/icons"

export default function Home() {
  return <div onClick={activeFn}>GitPulse Dashboard</div>
}`,
    codeAfter: `import { activeFn } from "@/lib/utils"

export default function Home() {
  return <div>GitPulse Dashboard</div>
}`,
    linesSaved: 2,
    description: "Import references 'unusedHelper' and 'LegacyIcon' are never referenced in active render scope.",
    severity: "low"
  },
  {
    id: "file-2",
    name: "helpers.ts",
    path: "lib/helpers.ts",
    type: "code",
    issueType: "dead_code",
    codeBefore: `export function cleanUtil(data: any) {
  return data.trim()
}

export function deprecatedCalculator(a: number, b: number) {
  // Obsolete helper method
  console.warn("Legacy calculation run")
  return a * b + 42
}`,
    codeAfter: `export function cleanUtil(data: any) {
  return data.trim()
}`,
    linesSaved: 7,
    description: "Function 'deprecatedCalculator' is declared but has 0 references in the active project dependency graph.",
    severity: "critical"
  },
  {
    id: "file-3",
    name: "package.json",
    path: "package.json",
    type: "config",
    issueType: "zombie",
    codeBefore: `{
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "moment": "^2.30.1",
    "lodash": "^4.17.21"
  }
}`,
    codeAfter: `{
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0"
  }
}`,
    linesSaved: 2,
    description: "Libraries 'moment' and 'lodash' are listed in manifests but never imported in source files.",
    severity: "high"
  },
  {
    id: "file-4",
    name: "utils.ts",
    path: "lib/utils.ts",
    type: "code",
    issueType: "clean",
    codeBefore: `export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}`,
    codeAfter: `export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}`,
    linesSaved: 0,
    description: "File is fully optimized. No redundant or orphaned code structures identified.",
    severity: "none"
  }
]

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center px-4 py-20 bg-transparent text-white overflow-hidden">
      {/* Dynamic Lora and JetBrains Font Injector */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
        .font-serif-display {
          font-family: 'Lora', serif;
        }
        .font-mono-code {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c1e_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

      {/* Subtle blur highlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-1%] right-[-1%] w-[500px] h-[500px] rounded-full bg-zinc-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl w-full grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Premium Editorial Typography */}
        <div className="lg:col-span-5 flex flex-col items-start text-left space-y-6">
          {/* Engineering Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-xs font-semibold font-mono-code tracking-wider text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>BUILD v2.4 (STABLE)</span>
            </div>
          </motion.div>

          {/* Master Display Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-6xl leading-[1.08]"
          >
            Extract the <span className="italic text-indigo-400 font-medium">dead weight</span> from your codebase.
          </motion.h1>

          {/* Precise Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-zinc-400 leading-relaxed font-medium max-w-lg"
          >
            A static archaeologist for software engineering teams. Discovered dead functions, zombie dependencies, and duplicate files are pruned safely and automatically.
          </motion.p>

          {/* Linear-Style Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <Button
              asChild
              size="lg"
              className="h-12 px-6 bg-white hover:bg-zinc-100 text-black font-semibold font-mono-code text-sm rounded-md shadow-sm border border-zinc-200 transition-all active:scale-95"
            >
              <Link href="/auth/login" className="flex items-center gap-2">
                <Github className="h-4.5 w-4.5 text-black" />
                Analyze Project
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-6 border-zinc-800 bg-zinc-950/20 text-zinc-400 font-semibold font-mono-code text-sm rounded-md transition-all hover:bg-zinc-900/60 hover:text-white active:scale-95"
            >
              <Link href="https://youtu.be/lpjvCJ21cmI" target="_blank" rel="noopener noreferrer">
                <PlayCircle className="h-4.5 w-4.5 text-indigo-400" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          {/* Supported Technologies Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-zinc-500 pt-4"
          >
            <span>Supports:</span>
            {["javascript", "typescript", "python", "rust", "go"].map((tech) => (
              <span key={tech} className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/20 uppercase tracking-wider text-[10px] text-zinc-400">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Interactive Repository File Tree Pruner */}
        <div className="lg:col-span-7 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full"
          >
            <InteractivePruner />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function InteractivePruner() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [selectedId, setSelectedId] = useState("file-1")
  const [prunedIds, setPrunedIds] = useState<Set<string>>(new Set())
  const [isPruning, setIsPruning] = useState(false)

  const activeFile = files.find(f => f.id === selectedId) || files[0]
  const isPruned = prunedIds.has(activeFile.id)

  const handlePrune = () => {
    if (activeFile.issueType === "clean" || isPruned || isPruning) return

    setIsPruning(true)
    setTimeout(() => {
      setPrunedIds(prev => {
        const next = new Set(prev)
        next.add(activeFile.id)
        return next
      })
      setIsPruning(false)
    }, 1200)
  }

  const handleReset = () => {
    setPrunedIds(new Set())
  }

  const severityColors: Record<string, string> = {
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
    high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    none: "bg-zinc-500/10 text-zinc-400 border-zinc-800"
  }

  return (
    <div className="relative rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-2xl backdrop-blur-md overflow-hidden text-left font-mono-code text-[11px] h-[380px] flex flex-col">
      {/* IDE Tab Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 select-none">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400 font-semibold uppercase tracking-wider text-[9px]">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Code Pruning Simulator</span>
        </div>
        <div>
          {prunedIds.size > 0 && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-zinc-300 font-bold uppercase transition-colors"
            >
              <RefreshCw className="h-3 w-3" /> Reset Mock
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Mock File Tree Sidebar (35%) */}
        <div className="w-[35%] border-r border-zinc-800 bg-zinc-950/40 p-3 select-none flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Workspace Files</div>
            
            <div className="space-y-1">
              {files.map((file) => {
                const filePruned = prunedIds.has(file.id)
                const isSelected = file.id === selectedId
                
                return (
                  <div
                    key={file.id}
                    onClick={() => { if (!isPruning) setSelectedId(file.id) }}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-zinc-900 text-white font-bold" 
                        : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className={`h-3.5 w-3.5 shrink-0 ${
                        file.issueType === "clean" 
                          ? "text-zinc-500" 
                          : filePruned 
                          ? "text-emerald-500" 
                          : "text-indigo-400"
                      }`} />
                      <span className="truncate text-xs">{file.name}</span>
                    </div>

                    {file.issueType !== "clean" && (
                      <div className="shrink-0 ml-1">
                        {filePruned ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <span className={`w-1.5 h-1.5 rounded-full block ${
                            file.severity === "critical" 
                              ? "bg-red-500 animate-pulse" 
                              : "bg-indigo-400"
                          }`} />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cumulative health stats inside sidebar */}
          <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 text-[10px] space-y-1 text-zinc-500">
            <div className="flex justify-between">
              <span>Cleaned Files:</span>
              <span className="font-bold text-white">{prunedIds.size} / 3</span>
            </div>
            <div className="flex justify-between">
              <span>Lines Cleared:</span>
              <span className="font-bold text-indigo-400">
                {Array.from(prunedIds).reduce((acc, id) => {
                  const f = files.find(file => file.id === id)
                  return acc + (f?.linesSaved || 0)
                }, 0)} lines
              </span>
            </div>
          </div>
        </div>

        {/* Code Viewer Panel (65%) */}
        <div className="flex-grow bg-zinc-950 p-4.5 flex flex-col justify-between overflow-hidden">
          {/* Header metadata */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900 shrink-0">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white">{activeFile.path}</div>
              <div className="text-[10px] text-zinc-500 font-medium truncate max-w-[240px]">
                {activeFile.description}
              </div>
            </div>
            {activeFile.issueType !== "clean" && (
              <span className={`px-2 py-0.5 rounded border text-[9px] uppercase tracking-wider font-semibold shrink-0 ${severityColors[activeFile.severity]}`}>
                {activeFile.severity} issue
              </span>
            )}
          </div>

          {/* Code block area */}
          <div className="flex-grow my-3 relative overflow-auto font-mono text-[10.5px] leading-relaxed p-2.5 border border-zinc-900/60 rounded bg-black/35 select-all scrollbar-thin select-text">
            <AnimatePresence mode="wait">
              {isPruning ? (
                <motion.div
                  key="pruning"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.5 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-2 py-10"
                >
                  <Cpu className="h-5 w-5 animate-spin text-indigo-500" />
                  <span className="text-xs text-zinc-400">Refactoring redundant AST syntax tree...</span>
                </motion.div>
              ) : (
                <motion.div
                  key={isPruned ? "after" : "before"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="h-full select-text whitespace-pre"
                >
                  {isPruned ? (
                    <div className="text-zinc-500 whitespace-pre">
                      {activeFile.codeAfter}
                      <span className="block mt-2 text-[9px] text-emerald-400 font-bold tracking-wide uppercase">
                        ✨ + Cleaned and verified by GitPulse
                      </span>
                    </div>
                  ) : (
                    <div className="text-zinc-300 whitespace-pre">
                      {activeFile.codeBefore}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-900 shrink-0">
            <span className="text-[9px] text-zinc-500 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-zinc-600" />
              TypeScript · 100% Secure Deletes
            </span>

            {activeFile.issueType === "clean" ? (
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                ✓ Fully Optimized
              </span>
            ) : isPruned ? (
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                ✓ Pruned (-{activeFile.linesSaved} lines)
              </span>
            ) : (
              <Button
                onClick={handlePrune}
                disabled={isPruning}
                size="sm"
                className="h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-mono-code text-[10px] rounded shadow-md active:scale-95 transition-all"
              >
                <span>Prune Code Block</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}