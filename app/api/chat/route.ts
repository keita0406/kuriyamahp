import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// APIルートを動的レンダリングに強制
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('API called - parsing JSON...');
    const { message } = await request.json();
    console.log('Received message:', message);

    if (!message) {
      return NextResponse.json(
        { error: 'メッセージが空です。' },
        { status: 400 }
      );
    }

    // 自動見積もり機能かどうかを判定
    const isAutoEstimate = message.includes('製品カテゴリ：') && message.includes('作業内容：') && message.includes('希望納期：');

    console.log('Calling OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: isAutoEstimate ? 
            `あなたは栗山縫製株式会社の見積もりアシスタントです。

【料金表】
■修理（緊急対応）
・8:00～17:00：2,500円×作業時間
・17:00～21:00：3,500円×作業時間
・21:00以降：4,000円×作業時間

■サンプル（緊急対応料金・税別）
・コート：65,000円～
・ジャケット：50,000円～
・ブラウス：25,000円～
・ボトム：25,000円～
・ワンピース：35,000円～
・カットソー：15,000円～
・Tシャツ：10,000円～

■量産
・サンプル・仕様書からお見積もりいたします

以下の形式で見積もりを提示してください：

◼︎ お見積もり結果

▶︎ 製品：[製品名]
▶︎ 作業内容：[作業内容]
▶︎ 希望納期：[納期]

▶︎ 【概算料金】
[該当する料金を料金表から提示]

▶︎ 【注意事項】
・上記は緊急対応時の料金です
・金額は税別表示です
・詳細仕様により変動する場合があります
・正式見積もりは担当者よりご連絡いたします

担当者が詳細な打ち合わせをさせていただきます！` 
            : 
            `あなたは栗山縫製株式会社の見積もりアシスタントです。

以下の形式で必ず回答してください：

◼︎ こんにちは！ご連絡ありがとうございます。

▶︎ [お客様のご要望を1行で確認]

[お客様に必要な情報を聞くための質問を▶︎で箇条書き（各項目1行）]
▶︎ どんな服ですか？（例：Tシャツ、ドレス、ジャケット）
▶︎ サイズは？（例：S、M、L）
▶︎ 生地の希望は？（例：コットン、ウール）
▶︎ デザインのイメージは？（例：色、柄）
▶︎ いつまでに必要ですか？

詳細を教えていただければ、担当者がご連絡いたします！

【重要ポイント】
- 各行は必ず改行で区切る
- ◼︎は挨拶用、▶︎は質問用マーカー
- 短く簡潔な文章
- 親しみやすい口調
- 1着から対応可能
- 最短3日で完成可能
- AI検品で高品質保証`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log('OpenAI API response received');
    const response = completion.choices[0].message.content;

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // OpenAI APIの具体的なエラーを取得
    let errorMessage = 'AI応答の生成中にエラーが発生しました。';
    
    if (error instanceof Error) {
      errorMessage += ' 詳細: ' + error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 