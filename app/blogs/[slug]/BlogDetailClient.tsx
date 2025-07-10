'use client';

import { ArrowLeft, Calendar, Tag, Share2, Facebook, Twitter, Link as LinkIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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

interface BlogDetailClientProps {
  blog: BlogPost;
  relatedBlogs: RelatedBlogPost[];
}

export default function BlogDetailClient({ blog, relatedBlogs }: BlogDetailClientProps) {
  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // シェア機能
  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          alert('URLをコピーしました');
        } catch (err) {
          console.error('コピーエラー:', err);
        }
        break;
    }
  };

  // コンテンツのHTMLを安全に表示するためのヘルパー
  const createMarkup = (content: string) => {
    let htmlContent = content;
    
    // 見出しの変換（H1, H2, H3）
    htmlContent = htmlContent.replace(/^### (.+)$/gm, '<h3 class="blog-h3">$1</h3>');
    htmlContent = htmlContent.replace(/^## (.+)$/gm, '<h2 class="blog-h2">$1</h2>');
    htmlContent = htmlContent.replace(/^# (.+)$/gm, '<h1 class="blog-h1">$1</h1>');
    
    // 太字の変換
    htmlContent = htmlContent.replace(/\*\*(.+?)\*\*/g, '<strong class="blog-bold">$1</strong>');
    
    // 重要なポイント（▶︎マーカー）
    htmlContent = htmlContent.replace(/^▶︎ (.+)$/gm, '<div class="blog-point">▶︎ $1</div>');
    
    // 注意事項や枠囲み（◼︎マーカー）
    htmlContent = htmlContent.replace(/^◼︎ (.+)$/gm, '<div class="blog-box">$1</div>');
    
    // リスト項目（・）
    htmlContent = htmlContent.replace(/^・(.+)$/gm, '<li class="blog-list">$1</li>');
    
    // 改行を<br>タグに変換
    htmlContent = htmlContent.replace(/\n/g, '<br />');
    
    return { __html: htmlContent };
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* パンくずナビゲーション */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">ホーム</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/#news" className="hover:text-blue-600 transition-colors">ニュース</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800 font-medium truncate max-w-xs">{blog.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 戻るボタン */}
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              記事一覧に戻る
            </Link>
          </div>

          {/* メイン記事コンテンツ */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* 記事ヘッダー */}
            <div className="p-6 border-b border-gray-200">
              {/* カテゴリとタグ */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {blog.category && (
                  <span 
                    className="px-3 py-1 rounded-full text-white text-sm font-medium"
                    style={{ 
                      backgroundColor: 
                        blog.category === '技術情報' ? '#10B981' : 
                        blog.category === '企業ニュース' ? '#F59E0B' : 
                        blog.category === '業界動向' ? '#8B5CF6' : 
                        blog.category === '製品紹介' ? '#EF4444' : '#3B82F6' 
                    }}
                  >
                    {blog.category}
                  </span>
                )}
                {blog.tags && blog.tags.map((tag, index) => (
                  <span key={index} className="flex items-center gap-1 text-gray-600 text-sm">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* タイトル */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* 記事情報 */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.published_at || blog.created_at)}</span>
                </div>
                
                {/* シェアボタン */}
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span className="mr-2">シェア:</span>
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Twitterでシェア"
                  >
                    <Twitter className="w-4 h-4 text-blue-400" />
                  </button>
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Facebookでシェア"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </button>
                  <button 
                    onClick={() => handleShare('copy')}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="URLをコピー"
                  >
                    <LinkIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* アイキャッチ画像 */}
            {blog.featured_image && (
              <div className="relative">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            )}

            {/* 記事本文 */}
            <div className="p-6">
              {blog.excerpt && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    {blog.excerpt}
                  </p>
                </div>
              )}

              <div 
                className="blog-content prose prose-lg max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={createMarkup(blog.content)}
              />
            </div>
          </article>

          {/* 関連記事 */}
          {relatedBlogs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">関連記事</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link 
                    key={relatedBlog.id}
                    href={`/blogs/${relatedBlog.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={relatedBlog.featured_image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                      alt={relatedBlog.title}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(relatedBlog.published_at || relatedBlog.created_at)}</span>
                        {relatedBlog.category && (
                          <>
                            <span>•</span>
                            <span>{relatedBlog.category}</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 leading-tight">
                        {relatedBlog.title}
                      </h3>
                      {relatedBlog.excerpt && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {relatedBlog.excerpt.length > 100 
                            ? `${relatedBlog.excerpt.substring(0, 100)}...` 
                            : relatedBlog.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 戻るボタン（下部） */}
          <div className="mt-12 text-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              記事一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 