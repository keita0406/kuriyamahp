-- Supabaseデータベース更新スクリプト
-- blogsテーブルのcontentフィールドをTEXT型に変更（50,000文字対応）

-- contentフィールドをTEXT型に変更（無制限長対応）
ALTER TABLE blogs ALTER COLUMN content TYPE TEXT;

-- 他のフィールドもVARCHAR制限を緩和（必要に応じて）
ALTER TABLE blogs ALTER COLUMN title TYPE VARCHAR(1000);
ALTER TABLE blogs ALTER COLUMN slug TYPE VARCHAR(500);
ALTER TABLE blogs ALTER COLUMN excerpt TYPE VARCHAR(500);
ALTER TABLE blogs ALTER COLUMN meta_title TYPE VARCHAR(500);
ALTER TABLE blogs ALTER COLUMN meta_description TYPE VARCHAR(500);

-- 変更確認
\d blogs; 