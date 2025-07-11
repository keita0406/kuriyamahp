-- 管理者設定スクリプト
-- admin_profilesテーブルの作成と管理者アカウントの設定

-- admin_profilesテーブルが存在しない場合は作成
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'editor',
  name VARCHAR(100),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- RLSポリシーを有効化
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- 管理者のみがアクセスできるポリシーを作成
CREATE POLICY "管理者のみアクセス可能" ON admin_profiles
FOR ALL 
TO authenticated
USING (auth.uid() = id);

-- blog_categoriesテーブルが存在しない場合は作成
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- カテゴリテーブルのRLS有効化
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能、認証ユーザーのみ編集可能
CREATE POLICY "カテゴリ読み取り" ON blog_categories
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "カテゴリ編集" ON blog_categories
FOR ALL 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM admin_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'editor')
));

-- カテゴリの初期データ
INSERT INTO blog_categories (name, color) VALUES 
('縫製ニュース', '#10B981'),
('サスティナブル', '#3B82F6')
ON CONFLICT (name) DO NOTHING;

-- 管理者アカウント作成の手順をコメントで記載
/*
以下のステップで管理者アカウントを作成してください：

1. Supabase Auth画面で新しいユーザーを作成
   - Email: admin@kuriyama-sewing.com
   - Password: 任意の安全なパスワード

2. 作成されたユーザーのUUIDを確認

3. 以下のSQLを実行してadmin_profilesに追加：
   INSERT INTO admin_profiles (id, role, name, email) VALUES 
   ('USER_UUID_HERE', 'admin', '管理者', 'admin@kuriyama-sewing.com');

4. または、既存ユーザーを管理者にする場合：
   INSERT INTO admin_profiles (id, role, name, email) VALUES 
   ('既存のユーザーUUID', 'admin', 'ユーザー名', 'user@example.com');
*/

-- 結果確認
SELECT 'テーブル作成完了' as status;
SELECT * FROM blog_categories ORDER BY name;
SELECT 'admin_profilesテーブルの確認:' as note;
SELECT * FROM admin_profiles; 