'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  FileText, 
  Users, 
  Plus, 
  Settings, 
  LogOut,
  Eye,
  Edit,
  Trash2,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  status: 'draft' | 'published' | 'archived'
  created_at: string
  category: string | null
}

interface DashboardStats {
  totalBlogs: number
  publishedBlogs: number
  draftBlogs: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // ユーザー情報取得
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // ブログ記事取得
      const { data: blogsData } = await supabase
        .from('blogs')
        .select('id, title, status, created_at, category')
        .order('created_at', { ascending: false })
        .limit(5)

      if (blogsData) {
        setBlogs(blogsData)
      }

      // 統計データ取得
      const { data: allBlogs } = await supabase
        .from('blogs')
        .select('status')

      if (allBlogs) {
        const stats = {
          totalBlogs: allBlogs.length,
          publishedBlogs: allBlogs.filter(blog => blog.status === 'published').length,
          draftBlogs: allBlogs.filter(blog => blog.status === 'draft').length,
        }
        setStats(stats)
      }
    } catch (error) {
      console.error('Dashboard data loading error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
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
      day: 'numeric'
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
              <h1 className="text-xl font-semibold text-gray-900">管理ダッシュボード</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                こんにちは、{user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">総記事数</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">公開中</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.publishedBlogs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">下書き</CardTitle>
              <Edit className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.draftBlogs}</div>
            </CardContent>
          </Card>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/admin/blogs/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              新規記事作成
            </Button>
          </Link>
          <Link href="/admin/blogs">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              記事一覧
            </Button>
          </Link>
        </div>

        {/* 最近の記事 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              最近の記事
            </CardTitle>
            <CardDescription>
              最新の5件の記事を表示しています
            </CardDescription>
          </CardHeader>
          <CardContent>
            {blogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">まだ記事がありません</p>
                <Link href="/admin/blogs/new">
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    最初の記事を作成
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div key={blog.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{blog.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(blog.status)}
                        {blog.category && (
                          <Badge variant="outline">{blog.category}</Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(blog.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/blogs/${blog.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
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