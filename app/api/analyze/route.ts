import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { puter } from '@heyputer/puter.js'

const IssueSchema = z.object({
  category: z.enum(["dead_code", "zombie_dependency", "unused_import", "duplicate", "risky_pattern"]),
  severity: z.enum(["critical", "high", "medium", "low"]),
  risk_level: z.enum(["safe", "verify", "risky"]),
  title: z.string(),
  description: z.string(),
  file_path: z.string(),
  start_line: z.number().nullable(),
  end_line: z.number().nullable(),
  code_snippet: z.string().nullable(),
  suggested_fix: z.string().nullable(),
  ai_explanation: z.string(),
})

const AnalysisResultSchema = z.object({
  health_score: z.number().min(0).max(100),
  dead_code_score: z.number().min(0).max(100),
  dependency_score: z.number().min(0).max(100),
  complexity_score: z.number().min(0).max(100),
  duplication_score: z.number().min(0).max(100),
  documentation_score: z.number().min(0).max(100),
  ai_summary: z.string(),
  issues: z.array(IssueSchema),
  deletion_plan: z.object({
    phases: z.array(z.object({
      name: z.string(),
      badge: z.enum(["safe", "bundled", "dependency", "verify"]),
      steps: z.array(z.object({
        title: z.string(),
        rationale: z.string(),
      })),
    })),
  }),
})

interface GitHubFile {
  name: string
  path: string
  type: string
  content?: string
  download_url?: string
}

async function fetchRepoContents(
  githubToken: string,
  owner: string,
  repo: string,
  path: string = ""
): Promise<GitHubFile[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  )

  if (!response.ok) return []
  return response.json()
}

async function fetchFileContent(
  githubToken: string,
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  )

  if (!response.ok) return null

  const data = await response.json()
  if (data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8")
  }
  return null
}

const CODE_EXTENSIONS = [
  ".js", ".jsx", ".ts", ".tsx", ".py", ".rs", ".go", ".java",
  ".c", ".cpp", ".h", ".hpp", ".cs", ".rb", ".php", ".swift",
  ".kt", ".scala", ".vue", ".svelte"
]

const CONFIG_FILES = [
  "package.json", "requirements.txt", "Cargo.toml", "go.mod",
  "pom.xml", "build.gradle", "Gemfile", "composer.json"
]

// --- FALLBACK CHECKER (Runs if AI fails) ---
function runStaticAnalysisFallback(codeFiles: { path: string; content: string }[]) {
  const issues: any[] = [];
  let healthScore = 95;

  // 1. Check for Package.json to find Zombie Dependencies
  const packageJsonFile = codeFiles.find(f => f.path.endsWith("package.json"));
  if (packageJsonFile) {
    try {
      const pkg = JSON.parse(packageJsonFile.content);
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      const depNames = Object.keys(allDeps);
      const ignoredDeps = ["typescript", "tailwindcss", "postcss", "eslint", "prettier", "vite", "next", "react", "react-dom"];

      for (const dep of depNames) {
        if (ignoredDeps.some(ignored => dep.includes(ignored))) continue;

        let isUsed = false;
        for (const file of codeFiles) {
          if (file.content.includes(dep)) {
            isUsed = true;
            break;
          }
        }

        if (!isUsed) {
          issues.push({
            category: "zombie_dependency",
            severity: "medium",
            risk_level: "verify",
            title: `Potentially Unused Dependency: ${dep}`,
            description: `The package '${dep}' is listed in package.json but doesn't appear to be imported in the scanned code files.`,
            file_path: packageJsonFile.path,
            start_line: null,
            end_line: null,
            code_snippet: `"${dep}": "${allDeps[dep]}"`,
            suggested_fix: `npm uninstall ${dep}`,
            ai_explanation: "Static analysis detected this dependency is declared but never imported. Verify it isn't used implicitly before removing."
          });
          healthScore -= 5;
        }
      }
    } catch(e) {
      // Ignore parse errors in fallback
    }
  }

  // 2. Scan code files for dead code / risky patterns
  for (const file of codeFiles) {
    if (file.path.endsWith("package.json")) continue;

    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for leftover console.logs
      if (line.includes('console.log(')) {
        issues.push({
          category: "dead_code",
          severity: "low",
          risk_level: "safe",
          title: "Leftover Debug Code (console.log)",
          description: "Found a console.log statement that should be removed before production.",
          file_path: file.path,
          start_line: i + 1,
          end_line: i + 1,
          code_snippet: line.trim(),
          suggested_fix: "Remove this line.",
          ai_explanation: "Static analysis found a console.log, which is typically used for debugging and cluttering production output."
        });
        healthScore -= 1;
      }

      // Check for TODOs
      if (line.includes('TODO:') || line.includes('FIXME:')) {
        issues.push({
          category: "risky_pattern",
          severity: "low",
          risk_level: "verify",
          title: "Unresolved TODO/FIXME",
          description: "Found an unresolved developer note in the code.",
          file_path: file.path,
          start_line: i + 1,
          end_line: i + 1,
          code_snippet: line.trim(),
          suggested_fix: "Address the TODO and remove the comment.",
          ai_explanation: "Developer notes often indicate incomplete or fragile code that needs review."
        });
        healthScore -= 1;
      }
    }
  }

  healthScore = Math.max(0, Math.min(100, healthScore));

  return {
    health_score: healthScore,
    dead_code_score: healthScore,
    dependency_score: healthScore,
    complexity_score: 90,
    duplication_score: 90,
    documentation_score: 80,
    ai_summary: `Generated via Static Analysis Fallback (AI was temporarily unavailable). Found ${issues.length} potential issues in your repository.`,
    issues,
    deletion_plan: {
      phases: [
        {
          name: "Static Cleanup",
          badge: "safe",
          steps: issues.map((i, idx) => ({ title: `Fix issue #${idx+1}`, rationale: i.title }))
        }
      ]
    }
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { repoId } = await request.json()
    
    if (!repoId) {
      return NextResponse.json({ error: "Repository ID required" }, { status: 400 })
    }

    // Get repository details
    const { data: repo, error: repoError } = await supabase
      .from("repositories")
      .select("*")
      .eq("id", repoId)
      .eq("user_id", user.id)
      .single()

    if (repoError || !repo) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 })
    }

    // Get GitHub token
    const { data: profile } = await supabase
      .from("profiles")
      .select("github_access_token")
      .eq("id", user.id)
      .single()

    const githubToken = profile?.github_access_token || user.user_metadata?.provider_token

    if (!githubToken) {
      return NextResponse.json({ error: "GitHub token not found" }, { status: 401 })
    }

    // Create initial report
    const { data: report, error: reportError } = await supabase
      .from("analysis_reports")
      .insert({
        repository_id: repoId,
        user_id: user.id,
        health_score: 0,
        status: "analyzing",
      })
      .select()
      .single()

    if (reportError) {
      console.error("Failed to create report:", reportError)
      return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
    }

    // Fetch repository files
    const [owner, repoName] = repo.full_name.split("/")
    const rootContents = await fetchRepoContents(githubToken, owner, repoName)

    const codeFiles: { path: string; content: string }[] = []
    const filesToCheck: GitHubFile[] = [...rootContents]
    const checkedDirs = new Set<string>()

    const IGNORE_FILES = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "next-env.d.ts", "components.json"]

    while (filesToCheck.length > 0 && codeFiles.length < 15) {
      const file = filesToCheck.shift()!
      
      if (file.type === "dir" && !checkedDirs.has(file.path)) {
        if (["node_modules", ".git", "dist", "build", "__pycache__", "venv", ".next"].includes(file.name)) {
          continue
        }
        checkedDirs.add(file.path)
        const dirContents = await fetchRepoContents(githubToken, owner, repoName, file.path)
        filesToCheck.push(...dirContents)
      } else if (file.type === "file") {
        if (IGNORE_FILES.includes(file.name)) continue;

        const isCodeFile = CODE_EXTENSIONS.some(ext => file.name.endsWith(ext))
        const isConfigFile = CONFIG_FILES.includes(file.name)
        
        if (isCodeFile || isConfigFile) {
          const content = await fetchFileContent(githubToken, owner, repoName, file.path)
          if (content && content.length < 20000) {
            codeFiles.push({ path: file.path, content })
          }
        }
      }
    }

    const codeContext = codeFiles
      .map(f => `--- ${f.path} ---\n${f.content.slice(0, 2500)}`)
      .join("\n\n")

    const systemPrompt = `You are an expert code analyst. You analyze repositories for dead code, unused dependencies, and code quality issues.
You MUST respond with valid JSON matching this exact structure:
{
  "health_score": number (0-100),
  "dead_code_score": number (0-100),
  "dependency_score": number (0-100),
  "complexity_score": number (0-100),
  "duplication_score": number (0-100),
  "documentation_score": number (0-100),
  "ai_summary": "string describing overall code health",
  "issues": [
    {
      "category": "dead_code" | "zombie_dependency" | "unused_import" | "duplicate" | "risky_pattern",
      "severity": "critical" | "high" | "medium" | "low",
      "risk_level": "safe" | "verify" | "risky",
      "title": "Issue title",
      "description": "Detailed description",
      "file_path": "path/to/file.ts",
      "start_line": number or null,
      "end_line": number or null,
      "code_snippet": "relevant code" or null,
      "suggested_fix": "how to fix" or null,
      "ai_explanation": "Why this is an issue"
    }
  ],
  "deletion_plan": {
    "phases": [
      {
        "name": "Phase name",
        "badge": "safe" | "bundled" | "dependency" | "verify",
        "steps": [
          { "title": "Step title", "rationale": "Why this step" }
        ]
      }
    ]
  }
}`

    const userPrompt = `Analyze this repository for dead code, unused dependencies, and code quality issues.
Repository: ${repo.full_name}
Language: ${repo.language || "Unknown"}
FILES:
${codeContext}
Focus on: Unused functions, dependencies in package.json, dead paths, duplicates, risky patterns.
Respond ONLY with valid JSON.`

    let analysis;

    try {
      // Attempt AI Analysis via puter.js
      const chatResponse = await puter.ai.chat(
        systemPrompt + "\n\n" + userPrompt, 
        { model: "gpt-5.4-nano" }
      );

      // Handle the puter response structure
      const responseText = typeof chatResponse === 'string' 
        ? chatResponse 
        : (chatResponse as any)?.message || JSON.stringify(chatResponse);

      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }
      
      const parsed = JSON.parse(jsonMatch[0])
      analysis = AnalysisResultSchema.parse(parsed)

    } catch (aiError) {
      console.warn("AI analysis failed, triggering static fallback:", aiError)
      // TRIGGERS NORMAL CHECKING FALLBACK IF AI FAILS!
      analysis = runStaticAnalysisFallback(codeFiles);
    }

    // Update report with results
    const { error: updateError } = await supabase
      .from("analysis_reports")
      .update({
        health_score: analysis.health_score,
        dead_code_score: analysis.dead_code_score,
        dependency_score: analysis.dependency_score,
        complexity_score: analysis.complexity_score,
        duplication_score: analysis.duplication_score,
        documentation_score: analysis.documentation_score,
        total_issues: analysis.issues.length,
        lines_removable: analysis.issues.reduce((acc: number, i: any) => 
          acc + (i.end_line && i.start_line ? i.end_line - i.start_line + 1 : 0), 0
        ),
        zombie_dependencies: analysis.issues.filter((i: any) => i.category === "zombie_dependency").length,
        files_affected: new Set(analysis.issues.map((i: any) => i.file_path)).size,
        status: "completed",
        ai_summary: analysis.ai_summary,
        deletion_plan: analysis.deletion_plan,
        completed_at: new Date().toISOString(),
      })
      .eq("id", report.id)

    if (updateError) {
      console.error("Failed to update report:", updateError)
    }

    // Insert issues
    if (analysis.issues.length > 0) {
      const issuesToInsert = analysis.issues.map((issue: any) => ({
        report_id: report.id,
        user_id: user.id,
        ...issue,
      }))

      const { error: issuesError } = await supabase
        .from("issues")
        .insert(issuesToInsert)

      if (issuesError) {
        console.error("Failed to insert issues:", issuesError)
      }
    }

    // Update repository health score
    await supabase
      .from("repositories")
      .update({
        health_score: analysis.health_score,
        last_analyzed_at: new Date().toISOString(),
      })
      .eq("id", repoId)

    return NextResponse.json({
      success: true,
      reportId: report.id,
      healthScore: analysis.health_score,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}