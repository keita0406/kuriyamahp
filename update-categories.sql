-- カテゴリテーブル更新スクリプト
-- 「縫製ニュース」と「サスティナブル」の2つのカテゴリに変更

-- 既存のカテゴリをすべて削除
DELETE FROM blog_categories;

-- 新しいカテゴリを追加
INSERT INTO blog_categories (id, name, color, created_at, updated_at) VALUES 
(
  gen_random_uuid(),
  '縫製ニュース',
  '#10B981',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'サスティナブル',
  '#3B82F6',
  NOW(),
  NOW()
);

-- 結果を確認
SELECT * FROM blog_categories ORDER BY name; 