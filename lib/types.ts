export type Plan = "FREE" | "PRO" | "TEAM"
export type AnalysisStatus = "QUEUED" | "RUNNING" | "COMPLETE" | "FAILED"

export interface User {
  id: string
  githubId: string
  username: string
  email?: string
  avatarUrl?: string
  plan: Plan
  createdAt: Date
}

export interface Repository {
  id: string
  name: string
  fullName: string
  owner: string
  description?: string
  language?: string
  stars: number
  forks: number
  isPrivate: boolean
  lastCommitAt: Date
  healthScore?: number
  lastAnalyzedAt?: Date
}

export interface Analysis {
  id: string
  userId: string
  repoFullName: string
  repoId: string
  status: AnalysisStatus
  jobId?: string
  reportId?: string
  healthScore?: number
  issueCount?: number
  linesRemovable?: number
  createdAt: Date
  completedAt?: Date
}

export type IssueSeverity = "critical" | "high" | "medium" | "low"
export type IssueRisk = "safe" | "needs-verification" | "risky"
export type IssueCategory =
  | "dead-code"
  | "zombie-deps"
  | "unused-imports"
  | "duplicate-code"
  | "risky"

export interface Issue {
  id: string
  title: string
  filePath: string
  lineStart: number
  lineEnd: number
  category: IssueCategory
  severity: IssueSeverity
  risk: IssueRisk
  aiExplanation: string
  codeSnippet: string
  fixSuggestion?: {
    before: string
    after: string
  }
  relatedIssueIds?: string[]
  resolved?: boolean
  dismissed?: boolean
}

export interface SubScore {
  name: string
  score: number
  weight: number
}

export interface DeletionStep {
  id: string
  phase: 1 | 2 | 3 | 4
  phaseLabel: string
  issueId: string
  issueTitle: string
  rationale: string
  completed: boolean
}

export interface Report {
  id: string
  analysisId: string
  repoFullName: string
  language: string[]
  fileCount: number
  healthScore: number
  subScores: SubScore[]
  issues: Issue[]
  totalIssues: number
  linesRemovable: number
  zombieDependencies: number
  deletionPlan: DeletionStep[]
  createdAt: Date
  githubUrl: string
}

export interface AnalysisProgress {
  stage: number
  stageName: string
  progress: number
  estimatedTimeRemaining?: number
  logs: string[]
}

export const ANALYSIS_STAGES = [
  { id: 1, name: "Cloning Repository" },
  { id: 2, name: "Building Syntax Tree" },
  { id: 3, name: "Tracing Call Graph" },
  { id: 4, name: "Running AI Analysis" },
  { id: 5, name: "Generating Report" },
] as const
