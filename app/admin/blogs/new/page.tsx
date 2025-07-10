'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Eye, FileText, Settings, Upload, X, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface BlogCategory {
  id: string
  name: string
  color: string
}

export default function NewBlog() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    featured_image: '',
    tags: [] as string[]
  })
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    // タイトルからスラッグを自動生成
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  // ファイルアップロード処理（APIエンドポイント経由）
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'アップロードに失敗しました')
    }

    const result = await response.json()
    return result.url
  }

  // ファイル選択処理
  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB制限
      setError('ファイルサイズは5MB以下にしてください')
      return
    }

    setImageFile(file)
    
    // プレビュー画像を生成
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setImagePreview(imageUrl)
      setSuccess('画像が選択されました（プレビュー表示）')
    }
    reader.readAsDataURL(file)

    // 実際のアップロードを実行
    setIsUploading(true)
    try {
      const uploadedImageUrl = await uploadImage(file)
      setFormData(prev => ({ ...prev, featured_image: uploadedImageUrl }))
      setSuccess('画像がアップロードされました')
      setError('') // エラーをクリア
      console.log('✅ 画像アップロード成功:', uploadedImageUrl)
    } catch (error: any) {
      setError('画像のアップロードに失敗しました: ' + error.message)
      console.error('❌ アップロードエラー:', error)
    } finally {
      setIsUploading(false)
    }
  }

  // ドラッグ&ドロップ処理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // ファイル入力処理
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // 画像削除処理
  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData(prev => ({ ...prev, featured_image: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('タイトルは必須です')
      return false
    }
    if (formData.title.length > 500) {
      setError('タイトルは500文字以内で入力してください')
      return false
    }
    if (!formData.slug.trim()) {
      setError('スラッグは必須です')
      return false
    }
    if (formData.slug.length > 500) {
      setError('スラッグは500文字以内で入力してください')
      return false
    }
    // excerpt と meta_description は TEXT フィールドなので制限なし
    if (formData.meta_title && formData.meta_title.length > 500) {
      setError('メタタイトルは500文字以内で入力してください')
      return false
    }
    if (!formData.content.trim()) {
      setError('本文は必須です')
      return false
    }
    if (formData.content.length > 50000) {
      setError('本文は50,000文字以内で入力してください')
      return false
    }
    return true
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ユーザーが認証されていません')

      // 空文字列をnullに変換（データベース制約対応）
      const blogData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || null,
        // featured_image: Supabase URLは保存、base64データURLは保存しない
        featured_image: formData.featured_image && !formData.featured_image.startsWith('data:') ? formData.featured_image.trim() : null,
        category: formData.category.trim() || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        meta_title: formData.meta_title.trim() || null,
        meta_description: formData.meta_description.trim() || null,
        status,
        author_id: user.id,
        published_at: status === 'published' ? new Date().toISOString() : null
      }

      // 詳細な文字数チェック
      const fieldLengths = {
        title: blogData.title.length,
        slug: blogData.slug.length,
        content: blogData.content.length,
        excerpt: blogData.excerpt?.length || 0,
        featured_image: blogData.featured_image?.length || 0,
        category: blogData.category?.length || 0,
        meta_title: blogData.meta_title?.length || 0,
        meta_description: blogData.meta_description?.length || 0
      }
      
      console.log('🔍 各フィールドの文字数:', fieldLengths)
      console.log('🔍 送信するblogData:', blogData)
      console.log('🔍 userID:', user.id)
      
      // 文字数制限チェック（contentは除外、titleは1000文字まで）
      const fieldsOverLimit = Object.entries(fieldLengths)
        .filter(([field, length]) => {
          if (field === 'content') return false
          if (field === 'title') return length > 1000
          return length > 500
        })
        .map(([field, length]) => `${field}: ${length}文字 (制限: ${field === 'title' ? '1000' : '500'}文字)`)
      
      if (fieldsOverLimit.length > 0) {
        console.error('❌ 文字数制限オーバー:', fieldsOverLimit)
        alert(`以下のフィールドが文字数制限を超えています:\n${fieldsOverLimit.join('\n')}`)
        setIsLoading(false)
        return
      }

      // Step 1: データ挿入のみ
      const { data: insertData, error: insertError } = await supabase
        .from('blogs')
        .insert([blogData])

      if (insertError) {
        console.error('❌ Supabase挿入エラー詳細:', insertError)
        console.error('❌ エラーコード:', insertError.code)
        console.error('❌ エラーメッセージ:', insertError.message)
        console.error('❌ エラー詳細:', insertError.details)
        console.error('❌ エラーヒント:', insertError.hint)
        throw insertError
      }

      console.log('✅ データ挿入成功')
      
      // Step 2: 挿入成功後、作成された記事を取得（オプション）
      // const { data, error } = await supabase
      //   .from('blogs')
      //   .select('*')
      //   .eq('slug', blogData.slug)
      //   .single()

      const data = insertData

      setSuccess(`記事が${status === 'published' ? '公開' : '保存'}されました`)
      
      setTimeout(() => {
        router.push('/admin/blogs')
      }, 1500)

    } catch (error: any) {
      setError(error.message || '保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/blogs">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  記事一覧
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">新規記事作成</h1>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => handleSave('draft')}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                下書き保存
              </Button>
              <Button 
                onClick={() => handleSave('published')}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                公開
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  📝 記事の基本情報
                  <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">コンテンツ・URL</span>
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">
                  記事の内容とWebサイト上での表示に関する設定
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">タイトル *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="記事のタイトルを入力"
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">文字数:</span> {formData.title.length}/1000文字
                  </p>
                </div>

                <div>
                  <Label htmlFor="slug">
                    スラッグ * 
                    <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">URL用</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="url-friendly-slug"
                    maxLength={500}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">記事のURL:</span> /blogs/{formData.slug || 'your-slug'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">文字数:</span> {formData.slug.length}/500文字
                  </p>
                  <p className="text-xs text-gray-400">
                    英数字とハイフンのみ使用可。記事の識別に使用されます。
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">
                    要約 
                    <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">ブログカード用</span>
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="ブログカードに表示される短い紹介文"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">文字数:</span> {formData.excerpt.length}文字
                    <span className="ml-2 text-blue-600">(推奨: 100-200文字)</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">表示場所:</span> メインページのブログカード、記事一覧ページ
                  </p>
                  <p className="text-xs text-gray-400">
                    読者が記事の内容を素早く把握できる2-3行の説明文
                  </p>
                </div>

                <div>
                  <Label htmlFor="content">本文 *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="記事の本文をMarkdown形式で入力"
                    rows={15}
                    className="font-mono"
                    required
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      Markdown形式で記述できます
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">文字数:</span> {formData.content.length.toLocaleString()}/50,000文字
                      {formData.content.length > 45000 && (
                        <span className="ml-2 text-amber-600">
                          ⚠️ 上限近いです
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">カテゴリ</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="featured_image">アイキャッチ画像</Label>
                  
                  {/* ドラッグ&ドロップエリア */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver 
                        ? 'border-blue-400 bg-blue-50' 
                        : imagePreview 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <div className="space-y-2">
                        <div className="animate-spin mx-auto w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        <p className="text-sm text-gray-600">アップロード中...</p>
                      </div>
                    ) : imagePreview ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="プレビュー"
                            className="mx-auto max-h-32 rounded-lg shadow-sm"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage()
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-green-600">画像が設定されました</p>
                        <p className="text-xs text-gray-500">別の画像に変更するにはクリックまたはドラッグ&ドロップ</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            画像をドラッグ&ドロップまたはクリックして選択
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF (最大5MB)
                          </p>
                        </div>
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          ファイルを選択
                        </Button>
                      </div>
                    )}
                    
                    {/* 隠れたファイル入力 */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>

                  {/* 手動URL入力オプション */}
                  <div className="mt-3">
                    <details className="group">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 mb-2">
                        📷 または画像URLを直接入力
                      </summary>
                      <div className="mt-2 space-y-2">
                        <Input
                          value={formData.featured_image}
                          onChange={(e) => {
                            handleInputChange('featured_image', e.target.value)
                            if (e.target.value) {
                              setImagePreview(e.target.value)
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                        />
                        <div className="text-xs text-gray-500">
                          <p className="mb-1">📸 フリー画像サイト:</p>
                          <div className="flex flex-wrap gap-2">
                            <a href="https://unsplash.com" target="_blank" className="text-blue-500 hover:underline">Unsplash</a>
                            <a href="https://pixabay.com" target="_blank" className="text-blue-500 hover:underline">Pixabay</a>
                            <a href="https://pexels.com" target="_blank" className="text-blue-500 hover:underline">Pexels</a>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  🔍 SEO設定
                  <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">検索エンジン用</span>
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">
                  Google検索結果に表示される情報を設定
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">
                    メタタイトル
                    <span className="ml-2 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">ブラウザタブ・検索結果</span>
                  </Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="Google検索結果のタイトル（未入力時は記事タイトルを使用）"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">文字数:</span> {formData.meta_title.length}/500文字
                    <span className="ml-2 text-amber-600">
                      (SEO推奨: 60文字以内)
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    ブラウザタブやGoogle検索結果に表示されるタイトル
                  </p>
                </div>

                <div>
                  <Label htmlFor="meta_description">
                    メタディスクリプション
                    <span className="ml-2 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">検索結果の説明文</span>
                  </Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="Google検索結果に表示される記事の説明文"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">文字数:</span> {formData.meta_description.length}文字
                    <span className="ml-2 text-amber-600">
                      (SEO推奨: 160文字以内)
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    検索結果でユーザーがクリックしたくなる魅力的な説明文を記載
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 