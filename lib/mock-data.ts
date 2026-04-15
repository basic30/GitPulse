import type { User, Repository, Analysis, Report, Issue, DeletionStep } from "./types"

export const mockUser: User = {
  id: "user_1",
  githubId: "12345",
  username: "johndoe",
  email: "john@example.com",
  avatarUrl: "https://avatars.githubusercontent.com/u/1234567",
  plan: "PRO",
  createdAt: new Date("2024-01-15"),
}

export const mockRepositories: Repository[] = [
  {
    id: "repo_1",
    name: "frontend-app",
    fullName: "johndoe/frontend-app",
    owner: "johndoe",
    description: "A modern React application with TypeScript",
    language: "TypeScript",
    stars: 142,
    forks: 23,
    isPrivate: false,
    lastCommitAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    healthScore: 78,
    lastAnalyzedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "repo_2",
    name: "api-server",
    fullName: "johndoe/api-server",
    owner: "johndoe",
    description: "Node.js REST API with Express",
    language: "JavaScript",
    stars: 89,
    forks: 12,
    isPrivate: true,
    lastCommitAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    healthScore: 65,
    lastAnalyzedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "repo_3",
    name: "ml-pipeline",
    fullName: "johndoe/ml-pipeline",
    owner: "johndoe",
    description: "Machine learning data pipeline in Python",
    language: "Python",
    stars: 234,
    forks: 45,
    isPrivate: false,
    lastCommitAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "repo_4",
    name: "cli-tools",
    fullName: "johndoe/cli-tools",
    owner: "johndoe",
    description: "Command-line utilities written in Rust",
    language: "Rust",
    stars: 67,
    forks: 8,
    isPrivate: false,
    lastCommitAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    healthScore: 92,
    lastAnalyzedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "repo_5",
    name: "mobile-app",
    fullName: "johndoe/mobile-app",
    owner: "johndoe",
    description: "React Native mobile application",
    language: "TypeScript",
    stars: 45,
    forks: 5,
    isPrivate: true,
    lastCommitAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "repo_6",
    name: "design-system",
    fullName: "johndoe/design-system",
    owner: "johndoe",
    description: "Shared UI component library",
    language: "TypeScript",
    stars: 312,
    forks: 67,
    isPrivate: false,
    lastCommitAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    healthScore: 45,
    lastAnalyzedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
]

export const mockIssues: Issue[] = [
  {
    id: "issue_1",
    title: "Dead function: parseOldXMLFormat",
    filePath: "src/utils/xml.js",
    lineStart: 45,
    lineEnd: 78,
    category: "dead-code",
    severity: "high",
    risk: "safe",
    aiExplanation:
      "This function was used in the legacy XML import feature that was removed in v2.0. No call sites exist anywhere in the codebase, and the function is not exported or used as a callback.",
    codeSnippet: `function parseOldXMLFormat(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");
  // ... 30 more lines of legacy parsing logic
  return transformedData;
}`,
    fixSuggestion: {
      before: `// In src/utils/xml.js
function parseOldXMLFormat(xmlString) {
  // ... function body
}

export { parseNewFormat, parseOldXMLFormat };`,
      after: `// In src/utils/xml.js
// Removed: parseOldXMLFormat (dead code)

export { parseNewFormat };`,
    },
  },
  {
    id: "issue_2",
    title: "Zombie dependency: moment",
    filePath: "package.json",
    lineStart: 15,
    lineEnd: 15,
    category: "zombie-deps",
    severity: "medium",
    risk: "safe",
    aiExplanation:
      "The 'moment' package is declared in dependencies but never imported anywhere in the codebase. It appears it was replaced with 'date-fns' in a previous refactor but never removed from package.json.",
    codeSnippet: `"dependencies": {
  "moment": "^2.29.4",  // <-- Never imported
  "date-fns": "^2.30.0",
  // ...
}`,
    fixSuggestion: {
      before: `"moment": "^2.29.4",`,
      after: `// Removed: moment (zombie dependency)`,
    },
  },
  {
    id: "issue_3",
    title: "Unused export: formatCurrency (3 call sites removed)",
    filePath: "src/utils/formatters.ts",
    lineStart: 89,
    lineEnd: 102,
    category: "dead-code",
    severity: "medium",
    risk: "needs-verification",
    aiExplanation:
      "This function was previously used in the checkout flow but all call sites were removed when Stripe Elements were integrated. However, there's a dynamic import in src/admin/reports.tsx that might use this function via string interpolation. Manual verification recommended.",
    codeSnippet: `export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}`,
    relatedIssueIds: ["issue_5"],
  },
  {
    id: "issue_4",
    title: "Zombie dependency: lodash",
    filePath: "package.json",
    lineStart: 18,
    lineEnd: 18,
    category: "zombie-deps",
    severity: "high",
    risk: "safe",
    aiExplanation:
      "The 'lodash' package (2.4MB) is in dependencies but only lodash/debounce was ever used, and that import was replaced with a custom hook. Removing this will significantly reduce bundle size.",
    codeSnippet: `"lodash": "^4.17.21",  // 2.4MB - never imported`,
  },
  {
    id: "issue_5",
    title: "Unused import: React (auto-import)",
    filePath: "src/components/Button.tsx",
    lineStart: 1,
    lineEnd: 1,
    category: "unused-imports",
    severity: "low",
    risk: "safe",
    aiExplanation:
      "With React 17+ JSX transform, explicit React imports are no longer required. This import can be safely removed.",
    codeSnippet: `import React from 'react';  // Unnecessary with JSX transform`,
    fixSuggestion: {
      before: `import React from 'react';`,
      after: `// React import removed (JSX transform handles this)`,
    },
  },
  {
    id: "issue_6",
    title: "Dead class: LegacyAuthProvider",
    filePath: "src/auth/providers/legacy.ts",
    lineStart: 1,
    lineEnd: 156,
    category: "dead-code",
    severity: "critical",
    risk: "safe",
    aiExplanation:
      "This entire file contains a legacy authentication provider that was replaced by NextAuth. The class is never instantiated or referenced anywhere in the codebase. The entire file can be deleted.",
    codeSnippet: `export class LegacyAuthProvider {
  // 156 lines of dead code
  // This was the old auth system before NextAuth migration
}`,
  },
  {
    id: "issue_7",
    title: "Duplicate utility: deepClone",
    filePath: "src/utils/helpers.ts",
    lineStart: 234,
    lineEnd: 245,
    category: "duplicate-code",
    severity: "low",
    risk: "needs-verification",
    aiExplanation:
      "This deepClone implementation duplicates functionality already provided by structuredClone (native) and by the existing cloneDeep function in src/utils/objects.ts. Consider consolidating to a single implementation.",
    codeSnippet: `function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}`,
    relatedIssueIds: ["issue_8"],
  },
  {
    id: "issue_8",
    title: "Risky deletion: featureFlagCheck",
    filePath: "src/utils/features.ts",
    lineStart: 12,
    lineEnd: 28,
    category: "risky",
    severity: "high",
    risk: "risky",
    aiExplanation:
      "This function appears unused in static analysis, but it's called dynamically via eval() in the feature flag configuration loader. Deleting this could break production feature flag functionality. Manual review strongly recommended.",
    codeSnippet: `export function featureFlagCheck(flagName: string): boolean {
  // Called dynamically - DO NOT DELETE without verification
  return config.flags[flagName] ?? false;
}`,
  },
]

export const mockDeletionPlan: DeletionStep[] = [
  {
    id: "step_1",
    phase: 1,
    phaseLabel: "Safe Deletes",
    issueId: "issue_6",
    issueTitle: "Dead class: LegacyAuthProvider",
    rationale: "Entire file is dead code with no dependencies. Safe to delete immediately.",
    completed: false,
  },
  {
    id: "step_2",
    phase: 1,
    phaseLabel: "Safe Deletes",
    issueId: "issue_1",
    issueTitle: "Dead function: parseOldXMLFormat",
    rationale: "No call sites, not exported. Remove function and update exports.",
    completed: false,
  },
  {
    id: "step_3",
    phase: 1,
    phaseLabel: "Safe Deletes",
    issueId: "issue_5",
    issueTitle: "Unused import: React",
    rationale: "JSX transform handles React. Safe to remove across all files.",
    completed: false,
  },
  {
    id: "step_4",
    phase: 2,
    phaseLabel: "Bundled Removals",
    issueId: "issue_3",
    issueTitle: "formatCurrency + related imports",
    rationale: "Remove function and all related imports together to maintain consistency.",
    completed: false,
  },
  {
    id: "step_5",
    phase: 3,
    phaseLabel: "Dependency Cleanup",
    issueId: "issue_2",
    issueTitle: "Remove moment from package.json",
    rationale: "After code cleanup, remove zombie dependencies from manifest.",
    completed: false,
  },
  {
    id: "step_6",
    phase: 3,
    phaseLabel: "Dependency Cleanup",
    issueId: "issue_4",
    issueTitle: "Remove lodash from package.json",
    rationale: "Will reduce bundle size by ~2.4MB after removal.",
    completed: false,
  },
  {
    id: "step_7",
    phase: 4,
    phaseLabel: "Needs Verification",
    issueId: "issue_8",
    issueTitle: "featureFlagCheck (risky)",
    rationale: "Requires manual verification of dynamic usage before removal.",
    completed: false,
  },
  {
    id: "step_8",
    phase: 4,
    phaseLabel: "Needs Verification",
    issueId: "issue_7",
    issueTitle: "Consolidate deepClone implementations",
    rationale: "Review which implementation to keep before consolidating.",
    completed: false,
  },
]

export const mockReport: Report = {
  id: "report_1",
  analysisId: "analysis_1",
  repoFullName: "johndoe/frontend-app",
  language: ["TypeScript", "JavaScript"],
  fileCount: 234,
  healthScore: 72,
  subScores: [
    { name: "Dead Code Density", score: 68, weight: 30 },
    { name: "Dependency Cleanliness", score: 55, weight: 25 },
    { name: "Import Hygiene", score: 82, weight: 20 },
    { name: "Code Complexity Debt", score: 78, weight: 15 },
    { name: "AI Risk Assessment", score: 85, weight: 10 },
  ],
  issues: mockIssues,
  totalIssues: mockIssues.length,
  linesRemovable: 423,
  zombieDependencies: 2,
  deletionPlan: mockDeletionPlan,
  createdAt: new Date(),
  githubUrl: "https://github.com/johndoe/frontend-app",
}

export const mockAnalysisHistory: Analysis[] = [
  {
    id: "analysis_1",
    userId: "user_1",
    repoFullName: "johndoe/frontend-app",
    repoId: "repo_1",
    status: "COMPLETE",
    reportId: "report_1",
    healthScore: 72,
    issueCount: 8,
    linesRemovable: 423,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 67000),
  },
  {
    id: "analysis_2",
    userId: "user_1",
    repoFullName: "johndoe/api-server",
    repoId: "repo_2",
    status: "COMPLETE",
    reportId: "report_2",
    healthScore: 65,
    issueCount: 12,
    linesRemovable: 567,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 82000),
  },
]
