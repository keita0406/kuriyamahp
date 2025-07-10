'use client';

import { useState } from 'react';
import { Check, Factory, Cog, Shield, Award, Users, Clock, Target } from 'lucide-react';

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);

  const services = [
    {
      id: 'sewing-services',
      title: '縫製サービス',
      icon: <Factory className="w-8 h-8 text-blue-600" />,
      description: 'お客様のニーズに応える高品質な縫製サービス'
    },
    {
      id: 'ai-inspection',
      title: 'AI検品システム',
      icon: <Cog className="w-8 h-8 text-green-600" />,
      description: '最新のAI技術による高精度な検品システム'
    },
    {
      id: '365-operation',
      title: '365日体制',
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      description: '年中無休の生産体制でお客様をサポート'
    },
    {
      id: 'quality-assurance',
      title: '品質保証',
      icon: <Shield className="w-8 h-8 text-red-600" />,
      description: '厳格な品質管理と保証システム'
    }
  ];

  const sewingCapabilities = [
    '婦人、紳士服、布帛、カットソー、ニット服、オールアイテムの縫製、特殊縫製、製品縫製',
    '製品仕立て',
    'リペア（お直し）の縫製',
    '細い縫製糸から太い糸、織物、縫製、プレス、出荷',
    '企画から生産までの一貫体制',
    '1着から大量生産まで対応',
    '反物の裁断の縫製【反物裁断（ウインドゥシミュレーション）など】',
    '発送業務'
  ];

  const equipment = [
    { name: '本縫いミシン', count: '30台' },
    { name: '2本針オーバーロック', count: '4台' },
    { name: 'オーバーロック', count: '2台' },
    { name: 'スローミシン', count: '3台' },
    { name: 'すくい本縫針送りミシン', count: '6台' },
    { name: '千鳥ミシン', count: '2台' },
    { name: 'ギザギザミシン', count: '1台' },
    { name: 'サイドカッター', count: '1台' },
    { name: '割り伏縫いミシン', count: '1台' },
    { name: '中留ステッチミシン', count: '1台' },
    { name: 'サージング', count: '1台' },
    { name: '下糸の台', count: '6台' },
    { name: 'バータ', count: '2台' },
    { name: '被覆糸', count: '1台' },
    { name: 'ねじり糸', count: '1台' },
    { name: 'カンヌキ', count: '1台' },
    { name: 'ボタン付け機', count: '2台' },
    { name: '穴縫い機', count: '1台' },
    { name: '裁断機', count: '1台' },
    { name: 'ロータリー裁断機10分', count: '1台' },
    { name: '縫製プレス機', count: '1台' },
    { name: 'ロータリー仕上げ機分', count: '1台' },
    { name: 'セブレス式仕上機', count: '1台' },
    { name: 'ハンドアイロン', count: '2台' },
    { name: 'オートマーカー自動描画', count: '1台' },
    { name: 'モバイルソフト自動描画', count: '1台' }
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
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              事業内容
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              SERVICE CONTENTS
            </p>
            <p className="text-lg md:text-xl mb-8 opacity-80 max-w-4xl mx-auto">
              お客様のニーズに応える高品質な縫製サービスをご提供いたします
            </p>
          </div>
        </div>
      </section>

      {/* Service Tabs */}
      <section className="py-4 bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {service.icon}
                <span>{service.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* 縫製サービス */}
          {activeTab === 0 && (
            <div className="space-y-12">
              {/* お客様のニーズに応える縫製工場 */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="border-l-4 border-red-500 pl-6 mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    お客様のニーズに応える縫製工場の項目
                  </h2>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6 mb-8">
                  <div className="grid gap-3 text-gray-700">
                    {sewingCapabilities.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-red-500 font-bold">{index + 1}.</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-gray-600 leading-relaxed mb-8">
                  <p className="mb-4">
                    当社ではアンタークライフ縫製ネットワークを取り入れております。弊社を拠点とした周辺地域の縫製技術者を融合し、
                    高品質な製品づくりを実現しております。これにより、遠隔地のお客様も人員を確保することができ、
                    急、緊急時や変更時にも迅速に対応した生産が可能となっております。
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <Factory className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">縫製工場内の様子</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <Users className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">熟練技術者による作業</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <Award className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">高品質な製品</p>
                  </div>
                </div>
              </div>

              {/* 設備紹介 */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="border-l-4 border-blue-500 pl-6 mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    設備紹介
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white bg-red-500 px-4 py-2 rounded-t-lg">
                      本社工場
                    </h3>
                    <div className="bg-gray-50 rounded-b-lg p-4">
                      <div className="space-y-2">
                        {equipment.slice(0, Math.ceil(equipment.length / 2)).map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-1 border-b border-gray-200">
                            <span className="text-gray-700">{item.name}</span>
                            <span className="font-semibold text-gray-900">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white bg-blue-500 px-4 py-2 rounded-t-lg">
                      (有)ファインカラー縫製工場
                    </h3>
                    <div className="bg-gray-50 rounded-b-lg p-4">
                      <div className="space-y-2">
                        {equipment.slice(Math.ceil(equipment.length / 2)).map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-1 border-b border-gray-200">
                            <span className="text-gray-700">{item.name}</span>
                            <span className="font-semibold text-gray-900">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <div className="bg-gray-100 rounded-lg p-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Cog className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">YAMAMOTO洗濯機</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI検品システム */}
          {activeTab === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="border-l-4 border-green-500 pl-6 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  AI検品システム
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">高精度AI検品</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>99.8%の検品精度</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>リアルタイム検品</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>自動レポート生成</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>品質データ蓄積</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="text-center">
                    <Cog className="w-24 h-24 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">AIによる自動検品システム</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 365日体制 */}
          {activeTab === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="border-l-4 border-purple-500 pl-6 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  365日体制
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">24時間365日対応</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-purple-500" />
                      <span>年中無休の生産体制</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-purple-500" />
                      <span>三交代制による24時間稼働</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-purple-500" />
                      <span>緊急対応可能</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-purple-500" />
                      <span>短納期対応</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="text-center">
                    <Clock className="w-24 h-24 text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-600">365日24時間対応体制</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 品質保証 */}
          {activeTab === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="border-l-4 border-red-500 pl-6 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  品質保証
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">厳格な品質管理</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-red-500" />
                      <span>ISO9001認証取得</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-red-500" />
                      <span>全工程品質チェック</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-red-500" />
                      <span>品質保証書発行</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-red-500" />
                      <span>アフターサポート</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="text-center">
                    <Shield className="w-24 h-24 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">品質保証システム</p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            お客様のニーズに応える高品質な縫製サービスをご提供いたします
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="/" className="text-gray-400 hover:text-white">トップページ</a>
            <a href="/company" className="text-gray-400 hover:text-white">会社案内</a>
            <a href="/emergency-sewing" className="text-gray-400 hover:text-white">緊急縫製</a>
            <a href="#" className="text-gray-400 hover:text-white">地球黒字化経営</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 