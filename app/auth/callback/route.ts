import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // Get the provider token from the session
      const providerToken = data.session.provider_token
      const user = data.user
      
      if (user) {
        // Get GitHub user info from metadata
        const username = user.user_metadata?.user_name || 
          user.user_metadata?.preferred_username || 
          user.email?.split('@')[0] || 'user'
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name
        const avatarUrl = user.user_metadata?.avatar_url

        // Upsert profile with GitHub token (handles both insert and update)
        const { error: upsertError } = await supabase
          .from("profiles")
          .upsert({ 
            id: user.id,
            username,
            full_name: fullName,
            avatar_url: avatarUrl,
            github_access_token: providerToken || null,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (upsertError) {
          console.error("[v0] Failed to upsert profile:", upsertError)
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error("[v0] Auth callback error:", error)
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
