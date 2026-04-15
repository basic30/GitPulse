import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  default_branch: string
  private: boolean
  pushed_at: string
}

export async function POST() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's profile with GitHub token
    const { data: profile } = await supabase
      .from("profiles")
      .select("github_access_token")
      .eq("id", user.id)
      .single()

    // Use provider token from user metadata or profile
    const githubToken = profile?.github_access_token || 
      user.user_metadata?.provider_token

    if (!githubToken) {
      return NextResponse.json(
        { error: "GitHub token not found. Please re-authenticate." },
        { status: 401 }
      )
    }

    // Fetch repositories from GitHub
    const repos: GitHubRepo[] = []
    let page = 1
    const perPage = 100

    while (true) {
      const response = await fetch(
        `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&sort=pushed&direction=desc`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      )

      if (!response.ok) {
        const error = await response.text()
        console.error("GitHub API error:", error)
        return NextResponse.json(
          { error: "Failed to fetch repositories from GitHub" },
          { status: response.status }
        )
      }

      const pageRepos: GitHubRepo[] = await response.json()
      repos.push(...pageRepos)

      if (pageRepos.length < perPage) break
      page++
      
      // Limit to 500 repos
      if (repos.length >= 500) break
    }

    // Upsert repositories to database
    const reposToUpsert = repos.map((repo) => ({
      user_id: user.id,
      github_id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      default_branch: repo.default_branch,
      is_private: repo.private,
      last_commit_at: repo.pushed_at,
      updated_at: new Date().toISOString(),
    }))

    // Batch upsert
    for (let i = 0; i < reposToUpsert.length; i += 50) {
      const batch = reposToUpsert.slice(i, i + 50)
      const { error } = await supabase
        .from("repositories")
        .upsert(batch, { 
          onConflict: "user_id,github_id",
          ignoreDuplicates: false 
        })

      if (error) {
        console.error("Database upsert error:", error)
        return NextResponse.json(
          { error: "Failed to save repositories" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: repos.length,
      message: `Synced ${repos.length} repositories`
    })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
