import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  /*
  // 一時的に認証をバイパス（開発用）
  // ドラッグ&ドロップ機能のテスト用
  console.log('⚠️ 認証バイパス中 - 開発用設定')
  return response
  */

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // ログインページは認証なしでアクセス可能
  if (req.nextUrl.pathname === '/admin/login') {
    return response
  }

  // セッション更新
  const { data: { session } } = await supabase.auth.getSession()

  // 管理画面パスの保護（ログインページを除く）
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // 未ログインの場合はログインページにリダイレクト
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // 管理者権限の確認
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      // 権限がない場合は403ページにリダイレクト
      return NextResponse.redirect(new URL('/admin/unauthorized', req.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*']
} 