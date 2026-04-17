import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    // 1. Verify the user is actually logged in
    const supabase = await createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Initialize Supabase Admin client
    // Make sure SUPABASE_SERVICE_ROLE_KEY is in your .env.local file!
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 3. Delete the user entirely from Supabase Auth
    // This will automatically cascade and delete their "profiles" row too
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in delete route:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}