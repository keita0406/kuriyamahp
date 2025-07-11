import './globals.css';
import type { Metadata } from 'next';
import { Inter, Dancing_Script, Noto_Sans_JP } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
});

export const metadata: Metadata = {
  title: 'AI搭載の次世代縫製サービス | 栗山縫製',
  description: '1着〜大量ロットまで365日対応。AIと人の匠で縫製をアップデート。小ロット対応、99.8%のAI検品精度、500社以上の取引実績。',
  keywords: '縫製, AI, 小ロット, 検品, アパレル, OEM, ODM',
  openGraph: {
    title: 'AI搭載の次世代縫製サービス | 栗山縫製',
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
      <body className={`${inter.className} ${notoSansJP.variable} ${dancingScript.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}