'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { 
  ArrowLeft,
  Plus, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  status: 'draft' | 'published' | 'archived'
  category: string | null
  created_at: string
  updated_at: string
  published_at: string | null
}

export default function BlogsList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadBlogs()
  }, [])

  useEffect(() => {
    filterBlogs()
  }, [blogs, searchTerm, statusFilter])

  const loadBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      
      setBlogs(data || [])
    } catch (error) {
      console.error('Error loading blogs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterBlogs = () => {
    let filtered = blogs

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // ステータスフィルター
    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status === statusFilter)
    }

    setFilteredBlogs(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) throw error

      setBlogs(blogs.filter(blog => blog.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      published: 'default',
      draft: 'secondary',
      archived: 'outline'
    } as const

    const labels = {
      published: '公開中',
      draft: '下書き',
      archived: 'アーカイブ'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ダッシュボード
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">ブログ記事一覧</h1>
            </div>
            <Link href="/admin/blogs/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                新規作成
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* フィルター */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">検索・フィルター</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="記事タイトルや内容で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="published">公開中</SelectItem>
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="archived">アーカイブ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 記事一覧 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>記事一覧 ({filteredBlogs.length}件)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  {searchTerm || statusFilter !== 'all' ? (
                    <>
                      <Search className="w-12 h-12 mx-auto mb-4" />
                      <p>検索条件に一致する記事が見つかりません</p>
                    </>
                  ) : (
                    <>
                      <Edit className="w-12 h-12 mx-auto mb-4" />
                      <p>まだ記事がありません</p>
                    </>
                  )}
                </div>
                <Link href="/admin/blogs/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    新規記事を作成
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBlogs.map((blog) => (
                  <div key={blog.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusBadge(blog.status)}
                          {blog.category && (
                            <Badge variant="outline">{blog.category}</Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-blue-600 font-mono mb-2">
                          slug: {blog.slug}
                        </p>
                        {blog.excerpt && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {blog.excerpt}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span>作成: {formatDate(blog.created_at)}</span>
                          <span>更新: {formatDate(blog.updated_at)}</span>
                          {blog.published_at && (
                            <span>公開: {formatDate(blog.published_at)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {blog.status === 'published' && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/blogs/${blog.slug}`} target="_blank">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/blogs/${blog.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>記事を削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription>
                                この操作は取り消せません。記事「{blog.title}」を完全に削除します。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(blog.id)}
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 