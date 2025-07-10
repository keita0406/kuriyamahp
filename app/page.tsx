'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase'
import { 
  ChevronRight, X, Menu, ArrowRight, Minus, Plus, 
  Star, Calendar, Phone, Mail, MapPin, Clock,
  CheckCircle, Users, Award, TrendingUp, Zap,
  Globe, Download, Send
} from 'lucide-react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // ブログデータの状態管理
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  // Supabaseからブログデータを取得
  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          published_at,
          status,
          category
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('ブログ取得エラー:', error.message);
        setBlogs([]);
      } else {
        setBlogs(data || []);
      }
    } catch (error) {
      console.error('ブログ取得エラー:', error);
      setBlogs([]);
    } finally {
      setBlogsLoading(false);
    }
  };

  // ドロップダウンメニュー用のタイマー
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // ヒーローセクションの背景画像
  const heroImages = [
    '/hero-factory.jpg',  // 栗山縫製工場外観（既存）
    'https://images.unsplash.com/photo-1518443855757-6d82c17ee46d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1589965716736-8e58b5c8a4a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  ];
  
  // メニューの開閉制御関数
  const handleMenuEnter = (menuName: string) => {
    // 既存のタイマーがあればクリア
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setHoveredMenu(menuName);
  };

  const handleMenuLeave = () => {
    // 500ms後にメニューを閉じる
    menuTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 500);
  };

  const handleDropdownEnter = () => {
    // ドロップダウン内にマウスが入った場合、タイマーをクリア
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
  };

  const handleDropdownLeave = () => {
    // ドロップダウンから離れた時も遅延して閉じる
    menuTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 300);
  };
  
  // メニュー構造
  const menuItems = {
    '会社案内': [
      { name: '企業理念', link: '/company#philosophy' },
      { name: '代表挨拶', link: '/company#greeting' },
      { name: '会社概要', link: '/company#overview' },
      { name: '沿革', link: '/company#history' }
    ],
    '事業内容': [
      { name: '縫製サービス', link: '/services#sewing-services' },
      { name: '緊急縫製', link: '/emergency-sewing' },
      { name: 'MFC company', link: 'https://and-mfc.com/andmfc/' },
      { name: 'Clothes Art', link: 'https://clothesart.official.ec/?fbclid=PAAaa0ptu1Nh6TKm7ANCu4P_0VwsPRyRjEjmDViLVnCGe3ZJlIi1mF_SbIH1g_aem_th_AfUhgyl_sXc9wUfMizef0arGEsZxTbeFYa_O9sssR9Fn3i2HQS5ve2_jA2-0aaePsrQ' }
    ],
    '緊急縫製': [
      { name: '緊急縫製', link: '/emergency-sewing#emergency-sewing' },
      { name: '緊急修理', link: '/emergency-sewing#emergency-repair' },
      { name: '緊急見積もり', link: '/emergency-sewing#emergency-quote' }
    ],
    '地球黒字化経営': [
      { name: '弊社の取り組み', link: '#our-initiatives' },
      { name: '協賛企業', link: '#sponsor-companies' }
    ]
  };

  // チャット機能
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'こんにちは！栗山縫製です。お見積もりのご相談承ります。' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [workType, setWorkType] = useState('');
  const [deliveryPeriod, setDeliveryPeriod] = useState('');

  // データの定義
  const testimonials = [
    { name: "アパレルA社", company: "東京都", comment: "小ロットなのに高品質で助かってます！", rating: 5 },
    { name: "D2CブランドB社", company: "大阪府", comment: "AI検品レポートがとても分かりやすい。", rating: 5 },
    { name: "商社C社", company: "名古屋市", comment: "納期遵守率99%は本当にすごい。", rating: 5 }
  ];

  const faqs = [
    { q: "最低ロットはありますか？", a: "1着から対応可能です。" },
    { q: "個人でも依頼できますか？", a: "もちろん可能です。" },
    { q: "リードタイムは？", a: "最短3日で出荷できます。" },
    { q: "AIシステムの精度は？", a: "99.8%の精度で不良品を検出可能です。" },
    { q: "海外発送は可能ですか？", a: "はい、世界各国への発送に対応しています。" }
  ];



  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ヒーローセクションの自動スライド機能
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000); // 6秒ごとにスライド
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // ブログデータの取得（初回 + 30秒ごとにポーリング）
  useEffect(() => {
    fetchBlogs(); // 初回取得

    // 30秒ごとにデータを更新
    const interval = setInterval(() => {
      fetchBlogs();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Instagram埋め込みスクリプトの読み込み
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // クリーンアップ
      const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // タイマーのクリーンアップ
  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (currentMessage.trim()) {
      setChatMessages(prev => [...prev, { type: 'user', text: currentMessage }]);
      const messageToSend = currentMessage;
      setCurrentMessage('');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageToSend }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setChatMessages(prev => [...prev, { type: 'bot', text: data.message }]);
        } else {
          setChatMessages(prev => [...prev, { type: 'bot', text: '申し訳ございません。システムエラーが発生しました。' }]);
        }
      } catch (error) {
        setChatMessages(prev => [...prev, { type: 'bot', text: 'ネットワークエラーが発生しました。' }]);
      }
    }
  };

  const handleGenerateEstimate = async () => {
    if (!productCategory || !workType || !deliveryPeriod) {
      alert('すべての項目を選択してください。');
      return;
    }

    const estimateMessage = `製品カテゴリ：${productCategory}、作業内容：${workType}、希望納期：${deliveryPeriod}での見積もりをお願いします。`;
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: estimateMessage }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setChatMessages(prev => [...prev, 
          { type: 'user', text: estimateMessage },
          { type: 'bot', text: data.message }
        ]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { type: 'bot', text: '見積もり生成中にエラーが発生しました。' }]);
    }
  };

  // スライド制御関数
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white z-50 shadow-lg">
        <div className="bg-white">
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
            
            {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-1">
                {Object.entries(menuItems).map(([mainItem, subItems]) => (
                  <div
                    key={mainItem}
                    className="relative"
                    onMouseEnter={() => handleMenuEnter(mainItem)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-serif font-bold text-sm border-2 border-transparent hover:border-purple-500 rounded-lg transition-all duration-200">
                      {mainItem}
                    </button>
                    
                    {hoveredMenu === mainItem && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10"
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {subItems.map((item) => (
                          <a
                            key={item.name}
                            href={item.link}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-serif font-bold"
                            onClick={() => setHoveredMenu(null)}
                          >
                            {item.name}
                          </a>
                        ))}
                  </div>
                )}
              </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <button className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-lg font-serif font-bold text-sm hover:from-orange-500 hover:to-red-600 transition-all duration-200 shadow-md">
                お問い合わせ
              </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Colorful Bottom Bar */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500"></div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-white border-t shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {Object.entries(menuItems).map(([menuName, subItems]) => (
                <div key={menuName} className="border-b border-gray-100 last:border-b-0">
                <button 
                    onClick={() => {
                      if (expandedMobileMenu === menuName) {
                        setExpandedMobileMenu(null);
                      } else {
                        setExpandedMobileMenu(menuName);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg font-serif font-bold transition-all duration-300 flex items-center justify-between ${
                      expandedMobileMenu === menuName 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                    }`}
                  >
                    {menuName}
                    <ChevronRight className={`w-4 h-4 transform transition-transform duration-300 ${
                      expandedMobileMenu === menuName ? 'rotate-90' : ''
                    }`} />
                </button>
                  
                  {expandedMobileMenu === menuName && (
                    <div className="mt-2 ml-4 space-y-1 pb-2">
                      {subItems.map((item, index) => (
                        <a
                          key={index}
                          href={item.link}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setExpandedMobileMenu(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-serif font-bold"
                        >
                          <div className="flex items-center">
                            <ChevronRight className="w-3 h-3 mr-2 text-blue-500" />
                            {item.name}
                          </div>
                        </a>
                      ))}
                  </div>
                )}
              </div>
              ))}
              
              <div className="pt-4">
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md font-serif font-bold">
                  お問い合わせ
                </button>
                  </div>
              </div>
                  </div>
                )}
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative py-12 pt-20 overflow-hidden">
          {/* Background Image Slider */}
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat bg-slate-600 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url('${image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundAttachment: 'fixed'
                }}
              ></div>
            ))}
          </div>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Additional Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40"></div>
          
          {/* Slide Navigation */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6 text-white rotate-180" />
            </button>
          </div>
          
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight relative text-white">
              {/* シンプルな明朝体デザイン */}
              <div className="relative inline-block mb-6">
                <span 
                  className="relative inline-block"
                  style={{ 
                    fontFamily: '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    textShadow: `
                      2px 0px 0px #000000,
                      4px 0px 0px #000000,
                      0px 2px 0px #000000,
                      2px 2px 0px #000000,
                      0px 4px 0px #000000,
                      0px 6px 15px rgba(0, 0, 0, 0.8)
                    `
                  }}
                >
                  <span 
                    className="relative inline-block transform scale-125 mx-1"
                    style={{ 
                      color: '#FFA500',
                      textShadow: `
                        2px 0px 0px #000000,
                        4px 0px 0px #000000,
                        0px 2px 0px #000000,
                        2px 2px 0px #000000,
                        0px 4px 0px #000000,
                        0px 6px 15px rgba(0, 0, 0, 0.8)
                      `
                    }}
                  >
                    緊
                  </span>
                  急時に
                </span>
              </div>

              <br />
              
              <div className="relative inline-block">
                <span 
                  className="relative inline-block"
                  style={{ 
                    fontFamily: '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    textShadow: `
                      2px 0px 0px #000000,
                      4px 0px 0px #000000,
                      0px 2px 0px #000000,
                      2px 2px 0px #000000,
                      0px 4px 0px #000000,
                      0px 6px 15px rgba(0, 0, 0, 0.8)
                    `
                  }}
                >
                  <span 
                    className="relative inline-block transform scale-125 mx-1"
                    style={{ 
                      color: '#FFA500',
                      textShadow: `
                        2px 0px 0px #000000,
                        4px 0px 0px #000000,
                        0px 2px 0px #000000,
                        2px 2px 0px #000000,
                        0px 4px 0px #000000,
                        0px 6px 15px rgba(0, 0, 0, 0.8)
                      `
                    }}
                  >
                    即
                  </span>
                  対応
                </span>
                  </div>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed font-serif text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)' }}>
              オールジャンルの縫製や修理をお客様のご要望に応じて<br />
              緊急時には寄り添って対応いたします
            </p>
            
            <div className="flex flex-col items-center gap-8 mb-16">
                <button 
                className="group relative px-12 py-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-4 text-center min-w-[380px] overflow-hidden"
                onClick={() => setIsChatOpen(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="flex flex-col items-start">
                    <span 
                      className="text-4xl md:text-5xl font-black tracking-wider leading-none transform group-hover:scale-110 transition-all duration-300 group-hover:text-shadow-lg animate-pulse"
                      style={{ 
                        fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif'
                      }}
                    >
                      \ 最短1分 /
                    </span>
                    <span 
                      className="text-xl md:text-2xl font-bold mt-2 transform group-hover:scale-105 transition-all duration-300 group-hover:translate-x-1"
                      style={{ 
                        fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif'
                      }}
                    >
                      簡単お見積もり相談
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
            </button>
              <p 
                className="text-white/90 text-lg md:text-xl animate-bounce"
                style={{ 
                  fontFamily: '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                ↑ クリックでチャットボット相談開始
              </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:from-purple-400 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                <p className="text-3xl font-bold mb-2 text-white">1着〜</p>
                <p className="text-sm opacity-90 text-white">小ロット対応</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:from-purple-400 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                <p className="text-3xl font-bold mb-2 text-white">98%</p>
                <p className="text-sm opacity-90 text-white">お客様満足度</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:from-purple-400 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                <p className="text-3xl font-bold mb-2 text-white">500社+</p>
                <p className="text-sm opacity-90 text-white">取引実績</p>
              </div>
          </div>
        </div>
      </section>

      {/* Two Card Features Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1: 日本トップクラスの縫製技術 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 text-center border-b border-gray-100 pb-3">日本トップクラスの縫製技術</h2>
                
                {/* 動画とコンテンツのレイアウト */}
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  {/* 左側: 動画エリア */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    {/* 動画プレースホルダー */}
                    <div className="relative w-full h-48 bg-gray-900 rounded-md overflow-hidden group">
                      {/* 動画エリア（一時的にプレースホルダー画像を表示） */}
                      <div 
                        className="w-full h-full bg-cover bg-center relative rounded-lg overflow-hidden"
                        style={{
                          backgroundImage: 'url("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")'
                        }}
                      >
                        {/* ビデオプレースホルダーオーバーレイ */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">🎥</div>
                            <p className="text-lg font-semibold mb-2">日本トップクラスの縫製技術</p>
                            <p className="text-sm opacity-90">ビデオは近日公開予定</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 再生ボタンオーバーレイ（オプション） */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 右側: テキストコンテンツ */}
                  <div className="text-center md:text-left">
                    <p className="text-lg font-semibold text-gray-800 mb-2">高級ブランドの生産実績多数！</p>
                    <p className="text-gray-600 leading-relaxed text-sm mb-4">
                      縫製業者をお探しの方は栗山縫製にお任せください。
                    </p>
                    <button className="bg-gray-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-800">
                      詳しくはこちら
                    </button>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Card 2: オリジナルメンズ国産ブランド */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 text-center border-b border-gray-100 pb-3">
                  オリジナルメンズ国産ブランド
                  <div className="text-sm font-normal text-gray-500 mt-2">
                    @clothes_art_official
                  </div>
                </h2>
                
                {/* Instagram投稿埋め込み */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Instagram投稿1 */}
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <blockquote 
                        className="instagram-media" 
                        data-instgrm-permalink="https://www.instagram.com/p/C0example1/?utm_source=ig_embed&amp;utm_campaign=loading" 
                        data-instgrm-version="14"
                        style={{ 
                          background: '#FFF',
                          border: '0',
                          borderRadius: '3px',
                          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                          margin: '1px',
                          maxWidth: '100%',
                          minWidth: '150px',
                          padding: '0',
                          width: '99.375%'
                        }}
                      >
                        <div style={{ padding: '12px' }}>
                          <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg p-3 text-white text-center">
                            <div className="text-3xl mb-1">📸</div>
                            <div className="text-sm font-semibold">Clothes Art</div>
                            <div className="text-xs opacity-90">最新の投稿</div>
                          </div>
                        </div>
                      </blockquote>
                    </div>
                    
                    {/* Instagram投稿2 */}
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <blockquote 
                        className="instagram-media" 
                        data-instgrm-permalink="https://www.instagram.com/p/C0example2/?utm_source=ig_embed&amp;utm_campaign=loading" 
                        data-instgrm-version="14"
                        style={{ 
                          background: '#FFF',
                          border: '0',
                          borderRadius: '3px',
                          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                          margin: '1px',
                          maxWidth: '100%',
                          minWidth: '150px',
                          padding: '0',
                          width: '99.375%'
                        }}
                      >
                        <div style={{ padding: '12px' }}>
                          <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg p-3 text-white text-center">
                            <div className="text-3xl mb-1">👔</div>
                            <div className="text-sm font-semibold">メンズファッション</div>
                            <div className="text-xs opacity-90">高品質縫製</div>
                          </div>
                        </div>
                      </blockquote>
                    </div>
                  </div>
                  
                  {/* Instagram風のフィード表示 */}
                  <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                        CA
                      </div>
                      <div>
                        <div className="font-semibold text-xs">clothes_art_official</div>
                        <div className="text-xs text-gray-500">栗山縫製オリジナルブランド</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 mb-1">
                      🧵 職人の技術が生んだ、こだわりのメンズウェア
                    </div>
                    <div className="text-xs text-gray-500">
                      #ClothesArt #栗山縫製 #メンズファッション #国産ブランド #縫製技術
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    高級ブランド服の生産で培った技術を活かし栗山縫製オリジナルの<br />
                    メンズブランドを立ち上げました。詳細はInstagramにて！
                  </p>
                </div>
                <div className="text-center">
                  <a 
                    href="https://www.instagram.com/clothes_art_official/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-md font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagramで見る
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 栗山クオリティ */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* ヘッダー */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <div className="bg-gradient-to-r from-slate-800 via-gray-900 to-black text-white px-16 py-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-600">
                <h2 
                  className="text-5xl md:text-6xl font-light tracking-wider text-white"
                  style={{ 
                    fontFamily: '"Dancing Script", "Brush Script MT", cursive',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    letterSpacing: '0.1em'
                  }}
                >
                  Made in KURIYAMA
                </h2>
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-4 rounded-full"></div>
                <div className="text-sm mt-3 font-light tracking-widest opacity-90">
                  PREMIUM QUALITY CRAFTSMANSHIP
                </div>
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="max-w-6xl mx-auto">
            {/* 企業理念・方針 */}
            <div className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border-2 border-gradient-to-r from-gold-200 to-blue-200 overflow-hidden">
              {/* 高級感のある装飾 */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
              
              {/* 左右の装飾線 */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 via-orange-400 to-red-400"></div>
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400"></div>
              
              <div className="relative z-10 space-y-8 text-gray-800 leading-relaxed text-center">
                <p 
                  className="text-xl md:text-2xl font-medium"
                  style={{ 
                    fontFamily: '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif',
                    lineHeight: '1.8'
                  }}
                >
                  弊社はお客様の理念、志を尊重し作業に取り組む縫製工場です。
                </p>
                
                <div 
                  className="text-lg md:text-xl font-normal"
                  style={{ 
                    fontFamily: '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif',
                    lineHeight: '1.9'
                  }}
                >
                  <p className="mb-2">お客様のご要望にお応えすることが品質であると考え、独自の縫製教育システムを持ち、</p>
                  <p className="mb-2">人材の育成・オリジナル治具の開発により、お客様のニーズに合わせた縫製が出来る様、</p>
                  <p>取り組んでおります。</p>
                </div>
                
                <div 
                  className="text-lg md:text-xl font-normal"
                  style={{ 
                    fontFamily: '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif',
                    lineHeight: '1.9'
                  }}
                >
                  <p className="mb-2">また弊社は、社員一人一人の天命や志を尊敬しあい切磋琢磨する関係を創る社風が、</p>
                  <p>お客様に求められている縫製への日々挑戦へと繋がっていると考えております。</p>
                </div>
                
                <div 
                  className="text-lg md:text-xl font-normal"
                  style={{ 
                    fontFamily: '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif',
                    lineHeight: '1.9'
                  }}
                >
                  <p className="mb-2">当社ならではの独自性や強みを活かし、お客様の要望に幅広く対応できる</p>
                  <p>縫製工場を目指しております。</p>
                </div>
              </div>
              
              {/* 四隅の装飾 */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-yellow-400 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-orange-400 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-purple-400 rounded-br-lg"></div>
              
              {/* 代表署名 */}
              <div className="absolute bottom-6 right-12 text-right">
                <div 
                  className="text-sm text-gray-600 italic opacity-80"
                  style={{ 
                    fontFamily: '"Dancing Script", "Brush Script MT", cursive',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}
                >
                  <div className="mb-1">代表取締役</div>
                  <div 
                    className="font-medium text-gray-700"
                    style={{ 
                      fontSize: '16px',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    栗山泰充
                  </div>
                </div>
              </div>
            </div>

            {/* 顧客の課題リスト */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl shadow-xl p-8 md:p-12 mb-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                    こんなお悩みありませんか？
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <span className="text-lg font-medium text-gray-800">もっと高品質の製品が欲しい</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <span className="text-lg font-medium text-gray-800">他でうまく縫えなかった</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <span className="text-lg font-medium text-gray-800">生地が難しい</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <span className="text-lg font-medium text-gray-800">納期が間に合わない</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <span className="text-lg font-medium text-gray-800">コストを抑えたい</span>
                    </div>
                  </div>
                </div>
                
                {/* 右側の装飾 */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                      <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🧵</div>
                          <div className="text-lg font-bold text-gray-800">高品質縫製</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

                         {/* 呼びかけ */}
             <div className="text-center">
               <div className="bg-gradient-to-r from-slate-800 via-gray-900 to-black text-white rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-105 transition-all duration-300 border border-gray-600">
                 <h3 className="text-2xl md:text-3xl font-bold mb-6">
                   こんなお客様はどうぞ
                 </h3>
                 <div className="mb-6">
                   <span 
                     className="text-4xl md:text-6xl font-light"
                     style={{ 
                       fontFamily: '"Dancing Script", "Brush Script MT", cursive',
                       textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                       background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF6347)',
                       WebkitBackgroundClip: 'text',
                       WebkitTextFillColor: 'transparent',
                       backgroundClip: 'text'
                     }}
                   >
                     Made in KURIYAMA
                   </span>
                 </div>
                 <p className="text-xl md:text-2xl mb-2">
                   を体感してみてください
                 </p>
                 <p className="text-sm opacity-80 mb-8 tracking-widest">
                   EXPERIENCE THE PREMIUM CRAFTSMANSHIP
                 </p>
                 <div className="mt-8">
                   <button
                     onClick={() => setIsChatOpen(true)}
                     className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 hover:from-yellow-400 hover:to-orange-400"
                   >
                     <span>今すぐお見積もり</span>
                     <ChevronRight className="w-5 h-5" />
                   </button>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Our Strengths Section */}
      <section id="strengths" className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">私たちの強み</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              創業65年の信頼と技術力で、お客様のニーズにお応えします
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-gray-800">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">オールアイテム対応</h3>
              <p className="text-sm text-gray-600">
                布帛、カットソー、ジャージ、ニットなど幅広い素材に対応。小ロット〜中量まで柔軟対応
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-gray-800">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">高い技術力</h3>
              <p className="text-sm text-gray-600">
                88種以上のオリジナル治具と500種類超のアタッチメントを保有、熟練職人による細やかな縫製品質
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-gray-800">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">24時間緊急対応</h3>
              <p className="text-sm text-gray-600">
                緊急時には24時間対応可能。繁忙期や年末年始などの急なニーズにも対応
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-gray-800">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">高い生産能力</h3>
              <p className="text-sm text-gray-600">
                月間13,000枚の生産力。地域の縫製技術者各滑を整備し、週末時の5倍稼働で納期可能
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-gray-800">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">サステナブル経営</h3>
              <p className="text-sm text-gray-600">
                布残布を再利用した廃棄率20%削減を実現。将来的には50%削減を目標とする地球環境字化経営
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-gray-800">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">グローバル体制</h3>
              <p className="text-sm text-gray-600">
                本社（大阪）、東京オフィス、兵庫工場、中国自社工場でサンプル～量産（最大10万枚以上）対応
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-gray-800 max-w-md mx-auto">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2">幅広い製品ジャンル</h3>
            <p className="text-sm text-gray-600">
              レディス・メンズ・キッズ衣料から医療用品、アウトドア用品、バッグ、ペット服まで多岐対応
            </p>
          </div>
        </div>
      </section>
      
      {/* Medical Achievement Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">医療用ガウン200万着生産実績</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              経済産業省からの表彰を受けた確かな技術力と実績で、お客様のご要望にお応えします
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
              <Mail className="w-5 h-5" />
              お問い合わせ
            </button>
            <button className="bg-gray-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
              <Download className="w-5 h-5" />
              資料ダウンロード
            </button>
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
                  {[...Array(5)].map((_, i) => (
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
              お客様からよくいただく質問
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

      {/* Latest News Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              最新ニュース
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              栗山縫製の最新情報をお届けします
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogsLoading ? (
              // ローディング表示
              [...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-16 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : blogs.length > 0 ? (
              // ブログ記事表示
              blogs.map((blog) => (
                <article 
                  key={blog.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={blog.featured_image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span 
                        className="px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ 
                          backgroundColor: blog.category === '技術情報' ? '#10B981' : 
                                         blog.category === '企業ニュース' ? '#F59E0B' : 
                                         blog.category === '業界動向' ? '#8B5CF6' : 
                                         blog.category === '製品紹介' ? '#EF4444' : '#3B82F6' 
                        }}
                      >
                        {blog.category || 'ニュース'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blog.published_at)}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <a
                        href={`/blogs/${blog.slug}`}
                        className="inline-flex items-center text-primary font-medium text-sm hover:text-primary-dark transition-colors group/link"
                      >
                        続きを読む
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              // データがない場合の表示
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-600 text-lg font-medium mb-2">記事を準備中です</p>
                  <p className="text-gray-500 text-sm">まもなく最新情報をお届けします</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <a
              href="/blogs"
              className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-primary-dark transform hover:scale-105 transition-all duration-300"
            >
              すべてのニュースを見る
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-primary-dark to-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">まずは無料相談から</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              お客様のご要望をお聞かせください
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
                ご相談・お見積もりは無料です
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full"></div>
                <span className="font-bold text-xl text-white">栗山縫製</span>
              </div>
              <p className="text-sm leading-relaxed">
                AI技術と職人の技術を融合した次世代の縫製サービス
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
                <li>TEL: 06-6722-5621</li>
                <li>FAX: 06-6722-5617</li>
                <li>Email: kuriyama@mekkii-fashion.com</li>
                <li>〒577-0807 大阪府東大阪市近江堂3-14-9</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 栗山縫製株式会社 All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[80vh] flex overflow-hidden">
            {/* Left Side - Chat */}
            <div className="w-1/2 flex flex-col">
              <div className="p-4 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-tl-2xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-bold">AI相談チャット</h3>
                    <p className="text-sm opacity-90">栗山縫製 GPT-4o-mini</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-line">{message.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="ご相談内容を入力してください..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Auto Estimate */}
            <div className="w-1/2 flex flex-col border-l">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="font-bold">自動見積もり</h3>
                    <p className="text-sm opacity-90">簡単3ステップ</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-blue-600">製品カテゴリ</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    <option value="コート">コート（65,000円～）</option>
                    <option value="ジャケット">ジャケット（50,000円～）</option>
                    <option value="ブラウス">ブラウス（25,000円～）</option>
                    <option value="ワンピース">ワンピース（35,000円～）</option>
                    <option value="Tシャツ">Tシャツ（10,000円～）</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-blue-600">作業内容</label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    <option value="新規縫製">新規縫製</option>
                    <option value="修理・リペア">修理・リペア</option>
                    <option value="リメイク・改造">リメイク・改造</option>
                    <option value="サイズ調整">サイズ調整</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-blue-600">希望納期</label>
                  <select
                    value={deliveryPeriod}
                    onChange={(e) => setDeliveryPeriod(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    <option value="緊急（24時間以内）">緊急（24時間以内）</option>
                    <option value="特急（3日以内）">特急（3日以内）</option>
                    <option value="標準（1週間以内）">標準（1週間以内）</option>
                    <option value="通常（2週間以内）">通常（2週間以内）</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-t">
                <button
                  onClick={handleGenerateEstimate}
                  disabled={!productCategory || !workType || !deliveryPeriod}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                >
                  AI見積を開始
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}