# 栗山縫製株式会社 ウェブサイト

## 🏭 プロジェクト概要

栗山縫製株式会社の公式ウェブサイトとブログシステム。日本の縫製工場として、緊急修理サービス、サンプル製作、量産対応などのサービスを提供する企業サイトです。

## 🚀 技術スタック

### **フロントエンド**
- **Next.js 13.5.1** - React フレームワーク (App Router)
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **shadcn/ui** - UIコンポーネントライブラリ
- **Lucide React** - アイコンライブラリ

### **バックエンド**
- **Supabase** - PostgreSQL データベース
- **Supabase Storage** - 画像ストレージ
- **Supabase Auth** - 認証システム

### **AI機能**
- **OpenAI GPT-4o-mini** - チャットボット・見積もりアシスタント

## ✨ 実装済み機能

### **🏠 メインサイト**
- ✅ **レスポンシブデザイン** - モバイル・タブレット・デスクトップ対応
- ✅ **ヒーローセクション** - 工場の魅力的な紹介
- ✅ **サービス紹介** - 緊急修理、サンプル、量産サービス
- ✅ **会社概要** - 企業情報・アクセス
- ✅ **お問い合わせフォーム** - Supabase連携

### **📝 ブログシステム**
- ✅ **記事作成・編集** - リッチテキストエディタ
- ✅ **画像アップロード** - ドラッグ&ドロップ対応
- ✅ **記事一覧表示** - カテゴリ・タグ対応
- ✅ **記事詳細ページ** - SEO対応・OGP設定
- ✅ **ソーシャルシェア** - Twitter・Facebook・URLコピー
- ✅ **関連記事表示** - カテゴリベース推薦
- ✅ **パンくずナビゲーション** - UX向上

### **🔧 管理機能**
- ✅ **管理者ダッシュボード** - 記事管理・統計
- ✅ **認証システム** - Supabase Auth
- ✅ **記事ステータス管理** - 下書き・公開・アーカイブ
- ✅ **画像管理** - Supabase Storage連携
- ✅ **SEOメタデータ管理** - title・description・OGP

### **🤖 AI機能**
- ✅ **チャットボット** - OpenAI GPT-4o-mini
- ✅ **自動見積もり** - 料金表ベースの概算
- ✅ **顧客対応アシスタント** - 質問フォーマット化

## ⚙️ セットアップ手順

### **1. リポジトリクローン**
\`\`\`bash
git clone https://github.com/keita0406/kuriyamahp.git
cd kuriyamahp
\`\`\`

### **2. 依存関係インストール**
\`\`\`bash
npm install
\`\`\`

### **3. 環境変数設定**
\`.env.local\` ファイルを作成：

\`\`\`bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 管理者設定
ADMIN_EMAIL=your_admin_email

# サイト設定
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OpenAI API設定
OPENAI_API_KEY=your_openai_api_key
\`\`\`

### **4. データベース設定**
Supabaseで以下のテーブルを作成：

#### **blogs テーブル**
\`\`\`sql
CREATE TABLE blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    category TEXT,
    tags TEXT[],
    meta_title TEXT,
    meta_description TEXT,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- インデックス作成
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_published_at ON blogs(published_at);
CREATE INDEX idx_blogs_slug ON blogs(slug);
\`\`\`

#### **Row Level Security (RLS) 設定**
\`\`\`sql
-- RLS有効化
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- 公開記事は全員閲覧可能
CREATE POLICY "Public blogs are viewable by everyone" ON blogs
    FOR SELECT USING (status = 'published');

-- 認証済みユーザーは全記事閲覧可能
CREATE POLICY "Authenticated users can view all blogs" ON blogs
    FOR SELECT USING (auth.role() = 'authenticated');

-- 認証済みユーザーは記事作成可能
CREATE POLICY "Authenticated users can insert blogs" ON blogs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 認証済みユーザーは記事更新可能
CREATE POLICY "Authenticated users can update blogs" ON blogs
    FOR UPDATE USING (auth.role() = 'authenticated');
\`\`\`

### **5. Storage設定**
Supabaseで\`images\`バケットを作成：

\`\`\`sql
-- imagesバケット作成
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- 公開アクセス許可
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- 認証済みユーザーのアップロード許可
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
\`\`\`

## 🔧 開発・デプロイ

### **開発サーバー起動**
\`\`\`bash
npm run dev
# → http://localhost:3000
\`\`\`

### **ビルド**
\`\`\`bash
npm run build
npm run start
\`\`\`

### **デプロイ (Vercel推奨)**
1. Vercelアカウント作成
2. GitHubリポジトリ連携
3. 環境変数設定
4. 自動デプロイ

## 🔐 セキュリティ設定

### **Personal Access Token設定**
GitHubプッシュ用のPersonal Access Token：

1. GitHub Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Scopes: \`repo\`, \`workflow\`
5. 生成されたトークンを保存

### **API Key管理**
- ❌ **NG**: コード内に直接記述
- ✅ **OK**: 環境変数(\`.env.local\`)に設定
- ✅ **OK**: Vercel等の環境変数設定

### **Supabase RLS**
- Row Level Securityでデータアクセス制御
- 認証状態に応じたポリシー設定

## 📊 データベース構成

### **テーブル設計**
\`\`\`
blogs
├── id (UUID, Primary Key)
├── title (TEXT, NOT NULL)
├── slug (TEXT, UNIQUE, NOT NULL)
├── content (TEXT, NOT NULL)
├── excerpt (TEXT)
├── featured_image (TEXT)
├── status (ENUM: draft/published/archived)
├── category (TEXT)
├── tags (TEXT[])
├── meta_title (TEXT)
├── meta_description (TEXT)
├── author_id (UUID, FK to auth.users)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── published_at (TIMESTAMP)
\`\`\`

## 🎨 UIコンポーネント

### **shadcn/ui コンポーネント**
使用コンポーネント一覧：
- Button, Input, Textarea
- Card, Badge, Alert
- Dialog, Sheet, Popover
- Avatar, Calendar, Progress
- Toast, Skeleton
- Form, Table, Tabs

### **カスタムコンポーネント**
- BlogEditor: リッチテキストエディタ
- ImageUpload: ドラッグ&ドロップアップロード
- ShareButtons: ソーシャルシェア
- ChatBot: AI見積もりアシスタント

## 🤖 AI機能詳細

### **OpenAI設定**
- **モデル**: GPT-4o-mini
- **機能**: 顧客対応・見積もり生成
- **料金表連携**: 自動価格計算
- **日本語対応**: 自然な顧客対応

### **見積もりシステム**
\`\`\`
料金表:
■ 修理（緊急対応）
・8:00～17:00：2,500円×作業時間
・17:00～21:00：3,500円×作業時間
・21:00以降：4,000円×作業時間

■ サンプル（緊急対応料金・税別）
・コート：65,000円～
・ジャケット：50,000円～
・ブラウス：25,000円～
(他、各種製品対応)
\`\`\`

## 📱 レスポンシブデザイン

### **ブレークポイント**
- **モバイル**: 〜768px
- **タブレット**: 768px〜1024px
- **デスクトップ**: 1024px〜

### **主要対応**
- タッチフレンドリーUI
- モバイルナビゲーション
- 画像最適化
- 高速読み込み

## 🔧 トラブルシューティング

### **よくある問題**

#### **1. git push固まる問題**
**原因**: Personal Access Token未設定
**解決**:
\`\`\`bash
git config --global user.name "your_username"
git config --global user.email "your_email"
git push https://TOKEN@github.com/username/repo.git main
\`\`\`

#### **2. API Key検出エラー**
**原因**: コード内にAPI Key記述
**解決**: 環境変数のみに移行

#### **3. Supabase接続エラー**
**原因**: 環境変数設定ミス
**解決**: \`.env.local\`のURL・Key確認

#### **4. 画像アップロード失敗**
**原因**: Storage権限不足
**解決**: Supabase Storage RLS設定確認

### **WebSocket警告対応**
\`\`\`bash
npm install bufferutil utf-8-validate
\`\`\`

## 👥 開発チーム

- **開発者**: keita0406
- **リポジトリ**: https://github.com/keita0406/kuriyamahp
- **作成日**: 2025年

## 📄 ライセンス

このプロジェクトは栗山縫製株式会社の所有物です。

---

## 🎯 今後の拡張予定

- [ ] **多言語対応** (英語・中国語)
- [ ] **在庫管理システム**
- [ ] **顧客管理CRM**
- [ ] **オンライン注文システム**
- [ ] **生産進捗管理**
- [ ] **品質管理システム**

---

**開発・運用に関する質問は [Issues](https://github.com/keita0406/kuriyamahp/issues) でお気軽にどうぞ！**