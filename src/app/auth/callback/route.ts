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
      // 올바른 URL 생성 방식으로 수정
      const redirectUrl = new URL(next, origin)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // 인증 실패 시 에러와 함께 로그인 페이지로 리디렉션
  const errorUrl = new URL('/login?error=Could not authenticate user', origin)
  return NextResponse.redirect(errorUrl)
}