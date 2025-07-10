'use client';

import { useState } from 'react';
import { ChevronRight, Clock, Zap, Truck, Calculator, Check, Phone, Mail, Star } from 'lucide-react';

export default function EmergencySewing() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: 'emergency-24h',
      title: '24時間対応サービス',
      icon: <Clock className="w-12 h-12 text-red-500" />,
      description: '緊急時にも迅速に対応できる24時間体制のサービス',
      features: [
        '24時間365日受付対応',
        '深夜・早朝でも生産開始',
        '専用ホットライン完備',
        '緊急度に応じた優先対応',
        'リアルタイム進捗報告'
      ],
      price: '通常料金の150%〜',
      turnaround: '最短6時間〜'
    },
    {
      id: 'emergency-repair',
      title: '緊急修理・リペア',
      icon: <Zap className="w-12 h-12 text-yellow-500" />,
      description: '大切な衣類の緊急修理・リペアサービス',
      features: [
        'ボタン付け・ほつれ修理',
        'ファスナー交換',
        'シミ・汚れ除去',
        'サイズ直し',
        'デザイン修正・改良'
      ],
      price: '¥3,000〜',
      turnaround: '最短2時間〜'
    },
    {
      id: 'same-day',
      title: '当日出荷サービス',
      icon: <Truck className="w-12 h-12 text-blue-500" />,
      description: '当日中の出荷を保証する超特急サービス',
      features: [
        '午前10時までの依頼で当日出荷',
        '全国対応可能',
        '追跡番号即時発行',
        '配送状況リアルタイム確認',
        '受け取り確認システム'
      ],
      price: '通常料金の200%〜',
      turnaround: '当日出荷保証'
    },
    {
      id: 'emergency-quote',
      title: '緊急見積もり',
      icon: <Calculator className="w-12 h-12 text-green-500" />,
      description: '最短1分で見積もりを提供する迅速サービス',
      features: [
        'AIによる自動見積もり',
        'LINEでの簡単相談',
        '写真送付で詳細見積もり',
        '専門スタッフによる電話相談',
        '見積もり後即座に作業開始可能'
      ],
      price: '見積もり無料',
      turnaround: '最短1分'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-lg px-3 py-2 rounded-lg">
                <span className="text-2xl">K</span>
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-gray-600 font-serif font-bold">高品質！緊急時、安心即対応の縫製工場</div>
                <div className="text-base font-serif font-bold text-gray-900">栗山縫製株式会社</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-700 hover:text-orange-600 font-semibold">トップページ</a>
              <button className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-500 hover:to-red-600 transition-all duration-300">
                お問い合わせ
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-red-600 to-orange-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              緊急縫製サービス
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              緊急時にも迅速に対応。24時間体制でお客様をサポートします。
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">最短1分見積もり</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">24時間対応</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">当日出荷可能</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setActiveService(index)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeService === index
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>

          {/* Active Service Details */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  {services[activeService].icon}
                  <h2 className="text-3xl font-bold text-gray-900">
                    {services[activeService].title}
                  </h2>
                </div>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {services[activeService].description}
                </p>
                <div className="space-y-3">
                  {services[activeService].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      {services[activeService].price}
                    </div>
                    <div className="text-sm text-gray-600">料金目安</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {services[activeService].turnaround}
                    </div>
                    <div className="text-sm text-gray-600">対応時間</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    今すぐ相談する
                  </button>
                  <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    詳細を見る
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">緊急時はこちら</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Phone className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">緊急ホットライン</h3>
              <p className="text-2xl font-bold mb-2">0120-XXX-XXX</p>
              <p className="text-sm opacity-90">24時間365日対応</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">緊急メール</h3>
              <p className="text-lg font-bold mb-2">emergency@kuriyama.co.jp</p>
              <p className="text-sm opacity-90">最短5分で返信</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">お客様の声</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                「展示会前日の緊急対応で本当に助かりました。品質も完璧で感謝しています。」
              </p>
              <div className="text-sm text-gray-500">
                アパレル会社 A様
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                「24時間対応は本当にありがたい。夜中でも対応してくれて助かります。」
              </p>
              <div className="text-sm text-gray-500">
                D2Cブランド B様
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                「当日出荷サービスで間に合わせることができました。品質も文句なしです。」
              </p>
              <div className="text-sm text-gray-500">
                商社 C様
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-lg px-3 py-2 rounded-lg">
              <span className="text-2xl">K</span>
            </div>
            <div className="text-xl font-bold">栗山縫製株式会社</div>
          </div>
          <p className="text-gray-400 mb-4">
            緊急時でも安心してお任せください。24時間体制でお客様をサポートします。
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="/" className="text-gray-400 hover:text-white">トップページ</a>
            <a href="/company" className="text-gray-400 hover:text-white">会社案内</a>
            <a href="#" className="text-gray-400 hover:text-white">事業内容</a>
            <a href="#" className="text-gray-400 hover:text-white">地球黒字化経営</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 