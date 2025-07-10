'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Eye, FileText, Settings, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import Link from 'next/link'

interface BlogCategory {
  id: string
  name: string
  color: string
}

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  category: string | null
  status: 'draft' | 'published' | 'archived'
  meta_title: string | null
  meta_description: string | null
  featured_image: string | null
  created_at: string
  updated_at: string
  published_at: string | null
}

export default function EditBlog() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    meta_title: '',
    meta_description: '',
    featured_image: ''
  })
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [originalSlug, setOriginalSlug] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const blogId = params.id as string

  useEffect(() => {
    loadBlog()
    loadCategories()
  }, [blogId])

  const loadBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          category: data.category || '',
          status: data.status,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          featured_image: data.featured_image || ''
        })
        setOriginalSlug(data.slug)
        
        // 既存の画像URLがある場合はプレビューに設定
        if (data.featured_image) {
          setImagePreview(data.featured_image)
        }
      }
    } catch (error: any) {
      setError('記事の読み込みに失敗しました: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

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
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData(prev => ({ ...prev, featured_image: '' }))
    setSuccess('')
    setError('')
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
    if (!formData.slug.trim()) {
      setError('スラッグは必須です')
      return false
    }
    if (!formData.content.trim()) {
      setError('本文は必須です')
      return false
    }
    return true
  }

  const handleSave = async (status?: 'draft' | 'published' | 'archived') => {
    if (!validateForm()) return

    setIsSaving(true)
    setError('')

    try {
      const updateData = {
        ...formData,
        status: status || formData.status,
        published_at: (status === 'published' && formData.status !== 'published') 
          ? new Date().toISOString() 
          : undefined
      }

      // undefinedを除去
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData]
        }
      })

      const { error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', blogId)

      if (error) throw error

      setSuccess(`記事が${status === 'published' ? '公開' : status === 'archived' ? 'アーカイブ' : '保存'}されました`)
      
      if (status) {
        setFormData(prev => ({ ...prev, status }))
      }

    } catch (error: any) {
      setError(error.message || '保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId)

      if (error) throw error

      router.push('/admin/blogs')
    } catch (error: any) {
      setError('削除に失敗しました: ' + error.message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
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
              <h1 className="text-xl font-semibold text-gray-900">記事編集</h1>
            </div>
            <div className="flex space-x-2">
              {formData.status === 'published' && (
                <Button variant="outline" asChild>
                  <Link href={`/blog/${originalSlug}`} target="_blank">
                    <Eye className="w-4 h-4 mr-2" />
                    プレビュー
                  </Link>
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => handleSave()}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
              {formData.status === 'draft' && (
                <Button 
                  onClick={() => handleSave('published')}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  公開
                </Button>
              )}
              {formData.status === 'published' && (
                <Button 
                  variant="outline"
                  onClick={() => handleSave('archived')}
                  disabled={isSaving}
                >
                  アーカイブ
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    削除
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>記事を削除しますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      この操作は取り消せません。記事「{formData.title}」を完全に削除します。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      削除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                  記事情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">タイトル *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="記事のタイトルを入力"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">スラッグ *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="url-friendly-slug"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /blogs/{formData.slug || 'your-slug'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">要約</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="記事の簡潔な要約（SEO用）"
                    rows={3}
                  />
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
                  <p className="text-xs text-gray-500 mt-1">
                    Markdown形式で記述できます
                  </p>
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
                  <Label htmlFor="status">ステータス</Label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">下書き</SelectItem>
                      <SelectItem value="published">公開中</SelectItem>
                      <SelectItem value="archived">アーカイブ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                <CardTitle className="text-sm">SEO設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">メタタイトル</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="SEO用タイトル（未入力時は記事タイトルを使用）"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(formData.meta_title || formData.title).length}/60文字
                  </p>
                </div>

                <div>
                  <Label htmlFor="meta_description">メタディスクリプション</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="検索結果に表示される説明文"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.meta_description.length}/160文字
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