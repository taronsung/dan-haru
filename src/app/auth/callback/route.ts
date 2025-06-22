// src/app/auth/callback/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const redirectUrl = new URL(next, origin) // next 변수를 여기서 사용합니다.
      return NextResponse.redirect(redirectUrl)
    }
  }

  const errorUrl = new URL('/login?error=Could not authenticate user', origin)
  return NextResponse.redirect(errorUrl)
}