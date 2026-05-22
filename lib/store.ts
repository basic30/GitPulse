import { create } from "zustand"
import type { User, Repository, Analysis, Report, AnalysisProgress } from "./types"

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void

  // Repository state
  repositories: Repository[]
  setRepositories: (repos: Repository[]) => void
  isLoadingRepos: boolean
  setIsLoadingRepos: (loading: boolean) => void

  // Analysis state
  currentAnalysis: Analysis | null
  setCurrentAnalysis: (analysis: Analysis | null) => void
  analysisProgress: AnalysisProgress | null
  setAnalysisProgress: (progress: AnalysisProgress | null) => void

  // Report state
  currentReport: Report | null
  setCurrentReport: (report: Report | null) => void
  analysisHistory: Analysis[]
  setAnalysisHistory: (history: Analysis[]) => void

  // Filters
  repoSearchQuery: string
  setRepoSearchQuery: (query: string) => void
  selectedLanguage: string | null
  setSelectedLanguage: (language: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  // Repositories
  repositories: [],
  setRepositories: (repositories) => set({ repositories }),
  isLoadingRepos: false,
  setIsLoadingRepos: (isLoadingRepos) => set({ isLoadingRepos }),

  // Analysis
  currentAnalysis: null,
  setCurrentAnalysis: (currentAnalysis) => set({ currentAnalysis }),
  analysisProgress: null,
  setAnalysisProgress: (analysisProgress) => set({ analysisProgress }),

  // Report
  currentReport: null,
  setCurrentReport: (currentReport) => set({ currentReport }),
  analysisHistory: [],
  setAnalysisHistory: (analysisHistory) => set({ analysisHistory }),

  // Filters
  repoSearchQuery: "",
  setRepoSearchQuery: (repoSearchQuery) => set({ repoSearchQuery }),
  selectedLanguage: null,
  setSelectedLanguage: (selectedLanguage) => set({ selectedLanguage }),
}))
