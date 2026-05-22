import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const supabase = await createClient()
    const { reportId } = await params
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get report
    const { data: report, error: reportError } = await supabase
      .from("analysis_reports")
      .select(`
        *,
        repository:repositories(*)
      `)
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single()

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Get issues
    const { data: issues, error: issuesError } = await supabase
      .from("issues")
      .select("*")
      .eq("report_id", reportId)
      .order("severity", { ascending: true })

    if (issuesError) {
      console.error("Failed to fetch issues:", issuesError)
    }

    return NextResponse.json({
      report,
      issues: issues || [],
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
