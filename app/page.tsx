'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Star, Check, Plus, Minus, Menu, X, Camera, Zap, Cloud, Link, Phone, Mail, MapPin } from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonials = [
    { name: "アパレルA社", company: "東京都", comment: "小ロットなのに高品質で助かってます！AIレポートのおかげで品質管理が格段に向上しました。", rating: 5 },
    { name: "D2CブランドB社", company: "大阪府", comment: "AI検品レポートがとても分かりやすい。データ化されているので改善点がすぐに分かります。", rating: 5 },
    { name: "商社C社", company: "名古屋市", comment: "納期遵守率99%は本当にすごい。お客様への約束を守れるパートナーです。", rating: 5 }
  ];

  const faqs = [
    { q: "最低ロットはありますか？", a: "1着から対応可能です。小ロットでも大量生産と同等の品質をお約束します。" },
    { q: "個人でも依頼できますか？", a: "もちろん可能です。個人のお客様からも多数ご依頼いただいております。お気軽にご相談ください。" },
    { q: "リードタイムは？", a: "内容にもよりますが最短3日で出荷できます。お急ぎの場合は事前にご相談ください。" },
    { q: "AIシステムの精度は？", a: "99.8%の精度で不良品を検出可能です。人の目では見落としがちな微細な不具合も発見できます。" },
    { q: "海外発送は可能ですか？", a: "はい、世界各国への発送に対応しています。国際配送の手配もお任せください。" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ number, label, delay = 0 }: { number: string; label: string; delay?: number }) => (
    <div 
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-3xl font-bold mb-2">{number}</p>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  );

  const FeatureCard = ({ icon: Icon, title, text, delay = 0 }: { icon: any; title: string; text: string; delay?: number }) => (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{text}</p>
    </div>
  );

  const ServiceCard = ({ title, points, price, isPopular = false }: { title: string; points: string[]; price: string; isPopular?: boolean }) => (
    <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isPopular ? 'bg-gradient-to-br from-primary to-primary-dark text-white relative' : 'bg-white'}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
          人気No.1
        </div>
      )}
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className={`text-2xl font-bold mb-4 ${isPopular ? 'text-white' : 'text-primary'}`}>{price}</p>
      <ul className="space-y-2 text-sm mb-6">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${isPopular ? 'bg-white text-primary hover:bg-gray-100' : 'bg-primary text-white hover:bg-primary-dark'}`}>
        詳細を見る
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full"></div>
              <span className="font-bold text-xl">栗山ソーイング</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="hover:text-primary transition-colors">サービス</a>
              <a href="#technology" className="hover:text-primary transition-colors">AI技術</a>
              <a href="#testimonials" className="hover:text-primary transition-colors">お客様の声</a>
              <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
              <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors">
                お問い合わせ
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a href="#services" className="block hover:text-primary transition-colors">サービス</a>
              <a href="#technology" className="block hover:text-primary transition-colors">AI技術</a>
              <a href="#testimonials" className="block hover:text-primary transition-colors">お客様の声</a>
              <a href="#faq" className="block hover:text-primary transition-colors">FAQ</a>
              <button className="w-full bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors">
                お問い合わせ
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-purple-900 text-white py-32 pt-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            AI搭載の<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              次世代縫製サービス
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
            少量〜大量ロットまで、縫製をワンストップで高速化。<br />
            AIと人の匠の技で、品質と効率を両立します。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button className="px-8 py-4 rounded-full bg-white text-primary font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              無料で相談する
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 rounded-full border-2 border-white/40 hover:bg-white/10 transition-all duration-300">
              サービス資料DL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StatCard number="1着〜" label="小ロット対応" delay={100} />
            <StatCard number="99.8%" label="AI検品精度" delay={200} />
            <StatCard number="500社+" label="取引実績" delay={300} />
          </div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section id="technology" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI自動良否システム</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              最先端のAI技術により、人の目では見落としがちな微細な不具合も確実に検出します
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Camera} 
              title="高精度カメラ" 
              text="縫製箇所を0.01mm単位で解析し、微細な不具合も見逃しません" 
              delay={100}
            />
            <FeatureCard 
              icon={Zap} 
              title="即時フィードバック" 
              text="リアルタイムにNG品を判定し、生産効率を最大化します" 
              delay={200}
            />
            <FeatureCard 
              icon={Cloud} 
              title="クラウド連携" 
              text="全てのデータをクラウドで管理し、いつでもアクセス可能です" 
              delay={300}
            />
            <FeatureCard 
              icon={Link} 
              title="トレーサビリティ" 
              text="製品の履歴を完全に追跡し、品質保証を徹底します" 
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* 365日体制 */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">365日稼働・短納期</h2>
              <p className="text-xl text-gray-600 mb-8">
                お客様のビジネスを止めない、24時間365日体制での生産体制を構築しています
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">24時間三交代制ライン</h3>
                    <p className="text-gray-600">夜間・休日も生産を継続し、短納期を実現</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">最短3日スピード出荷</h3>
                    <p className="text-gray-600">緊急案件にも迅速に対応いたします</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">国内外120名の匠が対応</h3>
                    <p className="text-gray-600">豊富な経験を持つ職人が品質を保証</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-sm text-gray-600">納期遵守率</div>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent">24H</div>
                  <div className="text-sm text-gray-600">稼働時間</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">3日</div>
                  <div className="text-sm text-gray-600">最短納期</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">120名</div>
                  <div className="text-sm text-gray-600">技術者数</div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  お客様のご要望に応じた柔軟な生産体制で、どんな案件にも対応いたします
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">サービス一覧</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              お客様のニーズに合わせた多様なサービスをご提供いたします
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              title="サンプル・試作"
              price="¥5,000〜"
              points={[
                "仕様相談から対応",
                "最短3日納品",
                "AIレポート付き",
                "修正回数無制限",
                "3D試着シミュレーション"
              ]}
            />
            <ServiceCard
              title="量産ライン"
              price="¥2,000〜"
              points={[
                "1着〜10万着まで対応",
                "自動裁断システム",
                "ISO9001取得工場",
                "リアルタイム進捗管理",
                "品質保証書付き"
              ]}
              isPopular={true}
            />
            <ServiceCard
              title="リペア・リメイク"
              price="¥3,000〜"
              points={[
                "ブランド古着対応",
                "スピード修理",
                "CO2削減に貢献",
                "アップサイクル提案",
                "Before/After写真付き"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">お客様の声</h2>
            <p className="text-xl text-gray-600">
              多くのお客様からご満足いただいております
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg leading-relaxed mb-6">
                "{testimonials[activeTestimonial].comment}"
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{testimonials[activeTestimonial].name}</p>
                  <p className="text-sm text-gray-600">{testimonials[activeTestimonial].company}</p>
                </div>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === activeTestimonial ? 'bg-primary' : 'bg-gray-300'
                      }`}
                      onClick={() => setActiveTestimonial(i)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {testimonials.map((testimonial, i) => (
                <button
                  key={i}
                  className={`p-4 rounded-lg text-left transition-all ${
                    i === activeTestimonial ? 'bg-primary text-white' : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTestimonial(i)}
                >
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs opacity-80">{testimonial.company}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">よくある質問</h2>
            <p className="text-xl text-gray-600">
              お客様からよくいただく質問をまとめました
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <h3 className="font-semibold text-lg">{faq.q}</h3>
                  {openFaq === i ? (
                    <Minus className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-primary-dark to-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">まずは無料相談から</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              お客様のご要望をお聞かせください。専門スタッフが最適なプランをご提案いたします
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">お電話でのご相談</h3>
                <p className="text-sm opacity-90">0120-XXX-XXX</p>
                <p className="text-xs opacity-80">平日 9:00-18:00</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">メールでのご相談</h3>
                <p className="text-sm opacity-90">info@kuriyama-sewing.jp</p>
                <p className="text-xs opacity-80">24時間受付</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">工場見学も可能</h3>
                <p className="text-sm opacity-90">東京・大阪・名古屋</p>
                <p className="text-xs opacity-80">事前予約制</p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <button className="bg-white text-primary px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
                お問い合わせフォームへ
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-sm opacity-80">
                ご相談・お見積もりは無料です。お気軽にお問い合わせください
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full"></div>
                <span className="font-bold text-xl text-white">栗山ソーイング</span>
              </div>
              <p className="text-sm leading-relaxed">
                AI技術と職人の技術を融合した、次世代の縫製サービスを提供しています。
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">サービス</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">サンプル・試作</a></li>
                <li><a href="#" className="hover:text-white transition-colors">量産ライン</a></li>
                <li><a href="#" className="hover:text-white transition-colors">リペア・リメイク</a></li>
                <li><a href="#" className="hover:text-white transition-colors">OEM/ODM</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">会社情報</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">会社概要</a></li>
                <li><a href="#" className="hover:text-white transition-colors">採用情報</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ニュース</a></li>
                <li><a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">お問い合わせ</h4>
              <ul className="space-y-2 text-sm">
                <li>TEL: 0120-XXX-XXX</li>
                <li>Email: info@kuriyama-sewing.jp</li>
                <li>〒100-0001 東京都千代田区千代田1-1-1</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 Kuriyama Sewing Co., Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}