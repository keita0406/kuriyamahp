import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// サービスロールキーを使用したSupabaseクライアント
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 400 }
      )
    }

    // ファイル名生成
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `blog-images/${fileName}`

    // Supabase Storageにアップロード
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .upload(filePath, file)

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json(
        { error: `アップロードエラー: ${error.message}` },
        { status: 500 }
      )
    }

    // パブリックURLを取得
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath
    })

  } catch (error: any) {
    console.error('API upload error:', error)
    return NextResponse.json(
      { error: `サーバーエラー: ${error.message}` },
      { status: 500 }
    )
  }
} 