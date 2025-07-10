import { createClient } from '@/lib/supabase';
import { ArrowLeft, Calendar, Tag, Share2, Facebook, Twitter, Link as LinkIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import BlogDetailClient from './BlogDetailClient';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: 'draft' | 'published' | 'archived';
  category: string | null;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

interface RelatedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  category: string | null;
}

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

// メタデータを動的に生成
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const supabase = createClient();
  
  try {
    const { data: blog } = await supabase
      .from('blogs')
      .select('title, meta_title, meta_description, excerpt, featured_image')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single();

    if (!blog) {
      return {
        title: '記事が見つかりません | 栗山縫製',
        description: '指定された記事は存在しません。'
      };
    }

    return {
      title: blog.meta_title || `${blog.title} | 栗山縫製`,
      description: blog.meta_description || blog.excerpt || '栗山縫製の最新ニュースをお届けします。',
      openGraph: {
        title: blog.meta_title || blog.title,
        description: blog.meta_description || blog.excerpt || '',
        images: blog.featured_image ? [blog.featured_image] : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.meta_title || blog.title,
        description: blog.meta_description || blog.excerpt || '',
        images: blog.featured_image ? [blog.featured_image] : [],
      },
    };
  } catch (error) {
    console.error('メタデータ取得エラー:', error);
    return {
      title: '記事 | 栗山縫製',
      description: '栗山縫製の記事をご覧ください。'
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const supabase = createClient();
  
  // サーバー側で記事データを取得
  const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  // 関連記事を取得
  let relatedBlogs: RelatedBlogPost[] = [];
  if (blog) {
    let query = supabase
      .from('blogs')
      .select('id, title, slug, excerpt, featured_image, published_at, created_at, category')
      .eq('status', 'published')
      .neq('id', blog.id)
      .order('published_at', { ascending: false })
      .limit(3);

    // カテゴリが同じ記事を優先的に取得
    if (blog.category) {
      query = query.eq('category', blog.category);
    }

    const { data } = await query;
    relatedBlogs = data || [];
  }

  // 記事が見つからない場合の404ページ
  if (blogError || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-12">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">記事が見つかりません</h1>
              <p className="text-gray-600 mb-8">指定された記事は存在しないか、削除された可能性があります。</p>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // クライアントコンポーネントにデータを渡す
  return (
    <BlogDetailClient 
      blog={blog} 
      relatedBlogs={relatedBlogs} 
    />
  );
} 