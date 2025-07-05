import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI搭載の次世代縫製サービス | 栗山ソーイング',
  description: '1着〜大量ロットまで365日対応。AIと人の匠で縫製をアップデート。小ロット対応、99.8%のAI検品精度、500社以上の取引実績。',
  keywords: '縫製, AI, 小ロット, 検品, アパレル, OEM, ODM',
  openGraph: {
    title: 'AI搭載の次世代縫製サービス | 栗山ソーイング',
    description: '1着〜大量ロットまで365日対応。AIと人の匠で縫製をアップデート。',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}