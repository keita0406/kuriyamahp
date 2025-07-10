'use client';

import { useState } from 'react';
import { Menu, X, MapPin, Phone, Mail, Globe, Users, Building, Target, Award, TrendingUp } from 'lucide-react';

export default function CompanyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">栗</span>
              </div>
              <span className="text-xl font-bold text-gray-800">栗山縫製株式会社</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-gray-600 hover:text-primary transition-colors">トップページ</a>
              <a href="/company" className="text-primary font-medium">会社案内</a>
              <a href="/services" className="text-gray-600 hover:text-primary transition-colors">事業内容</a>
              <button className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all">
                お問い合わせ
              </button>
            </nav>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 h-[80vh]">
            {/* 左側 - 会社紹介 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-center">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  日本トップクラスの<br />
                  縫製技術
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  高級ブランドの生産実績多数！
                </p>
                <p className="text-gray-600 leading-relaxed">
                  縫製業者をお探しの方は<br />
                  栗山縫製にお任せください。
                </p>
                <button className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all">
                  詳しくはこちら
                </button>
              </div>
            </div>

            {/* 右側 - 会社概要 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">会社概要</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">栗山縫製株式会社</h3>
                    <p className="text-sm text-gray-600">SEWING KURIYAMA CO.,LTD.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">代表取締役</h3>
                    <p className="text-gray-600">栗山泰充</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">所在地</h3>
                    <p className="text-gray-600">大阪府東大阪市近江堂3-14-9</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">連絡先</h3>
                    <p className="text-gray-600">TEL: 06-6722-5621</p>
                    <p className="text-gray-600">FAX: 06-6722-5617</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">事業内容</h3>
                    <p className="text-gray-600">縫製業・卸売業・雑貨</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">設立</h3>
                    <p className="text-gray-600">昭和33年（1958年）</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">地球黒字化経営</p>
                  <p className="text-xs text-gray-500">
                    繊維の来和を創り、人の個の花を輝かす<br />
                    商品を創り、その商品を創る人が<br />
                    輝くインフラを創る
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 