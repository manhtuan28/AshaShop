import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles,
  Shirt,
  ShoppingBag,
  Scissors,
  Tag,
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  Headset, 
  ShieldCheck, 
  ChevronRight,
  ArrowUp,
  Crown,
  ChevronLeft
} from 'lucide-react';
import { productsApi } from '../services/api';
import { Category, Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSiteConfigStore } from '../store/useSiteConfigStore';
import { translateDynamic } from '../i18n/translator';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, t } = useLanguageStore();
  const { getLocalizedConfig } = useSiteConfigStore();
  const config = getLocalizedConfig(currentLanguage);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Slider Refs for Prev / Next Controls
  const flashSaleSliderRef = useRef<HTMLDivElement>(null);
  const browseCatSliderRef = useRef<HTMLDivElement>(null);
  const exploreSliderRef = useRef<HTMLDivElement>(null);

  // Slider Active Dots
  const [flashSaleDot, setFlashSaleDot] = useState(0);
  const [browseCatDot, setBrowseCatDot] = useState(0);
  const [exploreDot, setExploreDot] = useState(0);

  // Hero Multi-Slide State
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroSlides = [
    {
      tag: config.heroTag || 'Summer Haute Couture 2026',
      title: config.heroTitle || 'Bộ Sưu Tập Thời Trang\nMùa Hè Giảm 10%',
      subtitle: config.heroSubtitle || 'Xu Hướng Phong Cách Tối Giản & Thanh Lịch',
      image: config.heroImageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      link: config.heroButtonLink || '/shop',
      buttonText: config.heroButtonText || 'Khám Phá BST Mới',
    },
    {
      tag: 'New Tailored Suits 2026',
      title: 'Vest & Blazer Nam\nMay Đo Chuẩn Mực',
      subtitle: 'Tôn Vinh Đẳng Cấp & Phong Cách Quý Ông',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=ao-khoac-blazer',
      buttonText: 'Xem Bộ Sưu Tập',
    },
    {
      tag: 'Women Elegance 2026',
      title: 'Váy Đầm Dạ Hội\nLụa Satin Quyến Rũ',
      subtitle: 'Thiết Kế Tinh Tế & Nổi Bật Mọi Ánh Nhìn',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=thoi-trang-nu',
      buttonText: 'Mua Ngay',
    },
  ];

  // Auto Advance Hero Carousel
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(heroTimer);
  }, [heroSlides.length]);

  // Flash sales countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          productsApi.getCategories(),
          productsApi.getAll({ limit: 100 })
        ]);
        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data.items || []);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products for each section based on Admin CMS Configuration
  const customFlashSale = (
    config.flashSaleMode === 'CUSTOM' && config.flashSaleProductIds && config.flashSaleProductIds.length > 0
      ? (config.flashSaleProductIds
          .map((id) => products.find((p) => p._id === id))
          .filter(Boolean) as Product[])
      : products
  );
  const flashSaleProducts = customFlashSale.length > 0 ? customFlashSale : products;

  const customBestSelling = (
    config.bestSellingMode === 'CUSTOM' && config.bestSellingProductIds && config.bestSellingProductIds.length > 0
      ? (config.bestSellingProductIds
          .map((id) => products.find((p) => p._id === id))
          .filter(Boolean) as Product[])
      : products.slice(2, 6)
  );
  const bestSellingProducts = customBestSelling.length > 0 ? customBestSelling : products.slice(0, 4);

  const customExplore = (
    config.exploreMode === 'CUSTOM' && config.exploreProductIds && config.exploreProductIds.length > 0
      ? (config.exploreProductIds
          .map((id) => products.find((p) => p._id === id))
          .filter(Boolean) as Product[])
      : products
  );
  const exploreProducts = customExplore.length > 0 ? customExplore : products;

  // Organize dynamic categories & subcategories from API
  const rootCategories = categories.filter(c => !c.parentId);
  const getSubcategories = (parentId: string) => categories.filter(c => c.parentId === parentId);

  const categoryIcons = [
    { key: 'cat.dresses', icon: Crown, slug: 'thoi-trang-nu' },
    { key: 'cat.menClothing', icon: Shirt, slug: 'thoi-trang-nam' },
    { key: 'cat.womenClothing', icon: Scissors, slug: 'thoi-trang-nu' },
    { key: 'cat.pants', icon: Tag, slug: 'quan-jeans' },
    { key: 'cat.jackets', icon: Sparkles, slug: 'ao-khoac-blazer' },
    { key: 'cat.accessories', icon: ShoppingBag, slug: 'tui-xach-phu-kien' },
    { key: 'home.cat.shoes', icon: Crown, slug: 'giay-dep-thoi-trang' },
  ];

  // Slider control functions
  const slideTo = (ref: React.RefObject<HTMLDivElement | null>, dotIdx: number, stepWidth: number, setDot: (i: number) => void) => {
    if (ref.current) {
      ref.current.scrollTo({ left: dotIdx * stepWidth, behavior: 'smooth' });
      setDot(dotIdx);
    }
  };

  const slideLeft = (ref: React.RefObject<HTMLDivElement | null>, currentDot: number, setDot: (i: number) => void, stepWidth: number, totalDots: number) => {
    const nextDot = currentDot === 0 ? totalDots - 1 : currentDot - 1;
    slideTo(ref, nextDot, stepWidth, setDot);
  };

  const slideRight = (ref: React.RefObject<HTMLDivElement | null>, currentDot: number, setDot: (i: number) => void, stepWidth: number, totalDots: number) => {
    const nextDot = (currentDot + 1) % totalDots;
    slideTo(ref, nextDot, stepWidth, setDot);
  };

  const currentHero = heroSlides[activeHeroIndex];

  return (
    <div className="space-y-20 pb-16 font-poppins">
      
      {/* 1. HERO SECTION: Category Sidebar with Flyout Subcategories + Hero Lookbook Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar: Dynamic Categories with Subcategory Flyout Accordion */}
          <div className="hidden lg:block border-r border-gray-100 pr-6 space-y-1">
            <div className="pb-3 mb-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('nav.categories')}</span>
              <span className="text-[10px] bg-red-50 text-exclusive-red font-bold px-2 py-0.5 rounded-full">BST 2026</span>
            </div>

            {rootCategories.length === 0 ? (
              <div className="text-xs text-gray-400 py-4">Đang tải danh mục...</div>
            ) : (
              rootCategories.map((parent) => {
                const subcats = getSubcategories(parent._id);
                const hasSubs = subcats.length > 0;

                return (
                  <div key={parent._id} className="relative group/category">
                    <div
                      onClick={() => navigate(`/shop?category=${parent.slug}`)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-semibold text-gray-700 hover:text-exclusive-red hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <span className="truncate">{translateDynamic(parent.name, currentLanguage)}</span>
                      {hasSubs ? (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover/category:text-exclusive-red transition-transform group-hover/category:translate-x-1" />
                      ) : null}
                    </div>

                    {/* Subcategories Flyout Popover */}
                    {hasSubs && (
                      <div className="absolute left-full top-0 ml-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 py-3 px-3 hidden group-hover/category:block z-50 animate-fade-in divide-y divide-slate-50">
                        <div className="pb-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {translateDynamic(parent.name, currentLanguage)}
                          </span>
                        </div>
                        <div className="space-y-1 pt-1.5">
                          {subcats.map((sub) => (
                            <Link
                              key={sub._id}
                              to={`/shop?category=${sub.slug}`}
                              className="block px-2.5 py-1.5 text-xs text-slate-600 hover:text-exclusive-red hover:bg-red-50/60 rounded-lg transition-colors font-medium"
                            >
                              {translateDynamic(sub.name, currentLanguage)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <div className="pt-4 border-t border-gray-100">
              <Link
                to="/shop"
                className="flex items-center justify-between py-2.5 px-3 text-xs font-bold text-exclusive-red hover:bg-red-50 rounded-xl transition"
              >
                <span>{t('home.hero.browseAll') || 'Xem Tất Cả Danh Mục'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Banner: Interactive Multi-Lookbook Slider */}
          <div className="lg:col-span-3">
            <div className="relative bg-gradient-to-r from-black via-neutral-900 to-black text-white rounded-3xl overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[440px] flex items-center">
              
              {/* Background ambient glow */}
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 w-full p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Text Content */}
                <div className="space-y-4 max-w-md text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-exclusive-red text-xs font-bold tracking-wider uppercase border border-white/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentHero.tag}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight whitespace-pre-line text-white">
                    {currentHero.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-gray-300">
                    {currentHero.subtitle}
                  </p>

                  <div className="pt-2">
                    <Link
                      to={currentHero.link}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
                    >
                      <span>{currentHero.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Hero Image with stylish framing */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-exclusive-red/30 to-transparent rounded-2xl transform rotate-3"></div>
                  <img
                    src={currentHero.image}
                    alt={currentHero.title}
                    className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-10 border border-white/10"
                  />
                </div>
              </div>

              {/* Prev / Next Hero Slider Buttons */}
              <button
                onClick={() => setActiveHeroIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition cursor-pointer"
                title="Slide trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition cursor-pointer"
                title="Slide kế tiếp"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Carousel Indicator Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {heroSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveHeroIndex(dotIdx)}
                    className={`rounded-full transition-all cursor-pointer ${
                      activeHeroIndex === dotIdx
                        ? 'w-6 h-2.5 bg-exclusive-red'
                        : 'w-2.5 h-2.5 bg-neutral-600 hover:bg-neutral-400'
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FLASH SALES SECTION (WITH MODERN DOTS & ARROW SLIDER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with Countdown Timer */}
        <div className="space-y-4">
          <div className="section-badge">
            <span>{config.flashSaleBadge || t('home.flashSales.badge')}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex flex-wrap items-end gap-8 sm:gap-14">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-wide">{config.flashSaleTitle || t('home.flashSales.title')}</h2>
              
              {/* Countdown Timer */}
              <div className="flex items-center gap-4 text-center font-poppins">
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">{t('home.flashSales.days')}</span>
                  <p className="text-2xl sm:text-3xl font-bold">{String(timeLeft.days).padStart(2, '0')}</p>
                </div>
                <span className="text-2xl font-bold text-exclusive-red mt-2">:</span>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">{t('home.flashSales.hours')}</span>
                  <p className="text-2xl sm:text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</p>
                </div>
                <span className="text-2xl font-bold text-exclusive-red mt-2">:</span>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">{t('home.flashSales.minutes')}</span>
                  <p className="text-2xl sm:text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</p>
                </div>
                <span className="text-2xl font-bold text-exclusive-red mt-2">:</span>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">{t('home.flashSales.seconds')}</span>
                  <p className="text-2xl sm:text-3xl font-bold text-exclusive-red">{String(timeLeft.seconds).padStart(2, '0')}</p>
                </div>
              </div>
            </div>

            {/* Slider Prev / Next Controls */}
            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={() => slideLeft(flashSaleSliderRef, flashSaleDot, setFlashSaleDot, 560, 4)} 
                className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                title="Trượt sang trái"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => slideRight(flashSaleSliderRef, flashSaleDot, setFlashSaleDot, 560, 4)} 
                className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                title="Trượt sang phải"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Horizontal Slider without scrollbar */}
        <div 
          ref={flashSaleSliderRef}
          className="flex items-stretch gap-6 overflow-x-hidden scroll-smooth pb-2"
        >
          {flashSaleProducts.map((product) => (
            <div key={product._id} className="min-w-[270px] max-w-[280px] flex-shrink-0">
              <ProductCard product={product} discountPercentage={config.flashSaleDiscount || 35} />
            </div>
          ))}
        </div>

        {/* Professional Interactive Dots Indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => slideTo(flashSaleSliderRef, idx, 560, setFlashSaleDot)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                flashSaleDot === idx
                  ? 'w-6 h-2.5 bg-exclusive-red'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Trang ${idx + 1}`}
            />
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-12 py-4 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium rounded transition-colors shadow-sm"
          >
            {t('home.flashSales.viewAll')}
          </Link>
        </div>

        <hr className="border-gray-200 my-10" />
      </section>

      {/* 3. BROWSE BY CATEGORY SECTION (WITH PROFESSIONAL DOTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <div className="section-badge">
            <span>{t('home.browseCat.badge')}</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-wide">{t('home.browseCat.title')}</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => slideLeft(browseCatSliderRef, browseCatDot, setBrowseCatDot, 360, 3)} 
                className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                title="Trượt sang trái"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => slideRight(browseCatSliderRef, browseCatDot, setBrowseCatDot, 360, 3)} 
                className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                title="Trượt sang phải"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Cards Horizontal Slider */}
        <div 
          ref={browseCatSliderRef}
          className="flex items-center gap-6 overflow-x-hidden scroll-smooth pb-2"
        >
          {categoryIcons.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(`/shop?category=${cat.slug}`)}
                className="min-w-[170px] group border border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-exclusive-red hover:border-exclusive-red transition-all duration-300 aspect-square shadow-sm flex-shrink-0"
              >
                <Icon className="w-10 h-10 text-black group-hover:text-white transition-colors" />
                <span className="font-medium text-sm text-black text-center group-hover:text-white transition-colors whitespace-nowrap">
                  {t(cat.key)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Category Dots Indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => slideTo(browseCatSliderRef, idx, 360, setBrowseCatDot)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                browseCatDot === idx
                  ? 'w-6 h-2.5 bg-exclusive-red'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Trang ${idx + 1}`}
            />
          ))}
        </div>

        <hr className="border-gray-200 my-10" />
      </section>

      {/* 4. BEST SELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <div className="section-badge">
            <span>{config.bestSellingBadge || t('home.bestSelling.badge')}</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-wide">{config.bestSellingTitle || t('home.bestSelling.title')}</h2>
            <Link
              to="/shop"
              className="px-8 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-medium rounded transition-colors shadow-sm"
            >
              {t('home.bestSelling.viewAll')}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellingProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. PROMOTIONAL FASHION EXPERIENCE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white rounded-2xl p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
          
          {/* Left Content */}
          <div className="space-y-6 max-w-lg z-10">
            <span className="text-exclusive-red font-semibold text-sm tracking-widest uppercase">{config.promoBadge || t('home.musicBanner.badge')}</span>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight tracking-wide whitespace-pre-line">
              {config.promoTitle || t('home.musicBanner.title')}
            </h2>

            {/* Circular Countdown Timers */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white text-black flex flex-col items-center justify-center shadow">
                <span className="text-base font-bold leading-none">{timeLeft.hours}</span>
                <span className="text-[10px] text-gray-600 font-medium">{t('home.flashSales.hours')}</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-white text-black flex flex-col items-center justify-center shadow">
                <span className="text-base font-bold leading-none">{timeLeft.days}</span>
                <span className="text-[10px] text-gray-600 font-medium">{t('home.flashSales.days')}</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-white text-black flex flex-col items-center justify-center shadow">
                <span className="text-base font-bold leading-none">{timeLeft.minutes}</span>
                <span className="text-[10px] text-gray-600 font-medium">{t('home.flashSales.minutes')}</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-white text-black flex flex-col items-center justify-center shadow">
                <span className="text-base font-bold leading-none">{timeLeft.seconds}</span>
                <span className="text-[10px] text-gray-600 font-medium">{t('home.flashSales.seconds')}</span>
              </div>
            </div>

            <div>
              <Link
                to={config.promoButtonLink || '/shop?category=ao-khoac-blazer'}
                className="inline-flex items-center justify-center px-10 py-4 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                {config.promoButtonText || t('home.musicBanner.buyNow')}
              </Link>
            </div>
          </div>

          {/* Right Fashion Model Image */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-72 h-72 bg-red-600/20 rounded-full blur-3xl -z-0"></div>
            <img
              src={config.promoImageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'}
              alt="Fashion Style Lookbook"
              className="max-h-80 rounded-xl object-cover relative z-10 shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

        </div>
      </section>

      {/* 6. EXPLORE OUR PRODUCTS (WITH PROFESSIONAL DOTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <div className="section-badge">
            <span>{config.exploreBadge || t('home.explore.badge')}</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-wide">{config.exploreTitle || t('home.explore.title')}</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => slideLeft(exploreSliderRef, exploreDot, setExploreDot, 560, 4)} 
                className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                title="Trượt sang trái"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => slideRight(exploreSliderRef, exploreDot, setExploreDot, 560, 4)} 
                className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                title="Trượt sang phải"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Horizontal Slider without scrollbar */}
        <div 
          ref={exploreSliderRef}
          className="flex items-stretch gap-6 overflow-x-hidden scroll-smooth pb-2"
        >
          {exploreProducts.map((product, i) => (
            <div key={product._id} className="min-w-[270px] max-w-[280px] flex-shrink-0">
              <ProductCard 
                product={product} 
                isNew={i % 3 === 0} 
              />
            </div>
          ))}
        </div>

        {/* Explore Dots Indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => slideTo(exploreSliderRef, idx, 560, setExploreDot)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                exploreDot === idx
                  ? 'w-6 h-2.5 bg-exclusive-red'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Trang ${idx + 1}`}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-12 py-4 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium rounded transition-colors shadow-sm"
          >
            {t('home.flashSales.viewAll')}
          </Link>
        </div>
      </section>

      {/* 7. NEW ARRIVAL (BENTO GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <div className="section-badge">
            <span>{t('home.newArrival.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-wide">{t('home.newArrival.title')}</h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[600px]">
          
          {/* Card 1: Bento 1 */}
          <Link
            to={config.bento1.link || '/shop?category=ao-khoac-blazer'}
            className="bg-black text-white rounded-2xl relative overflow-hidden flex items-end p-8 group cursor-pointer block shadow-sm hover:shadow-xl transition-all"
          >
            <img
              src={config.bento1.imageUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'}
              alt={config.bento1.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 space-y-3 max-w-xs">
              <h3 className="text-2xl font-bold">{config.bento1.title || t('home.bento.ps5.title')}</h3>
              <p className="text-sm text-neutral-300">
                {config.bento1.desc || t('home.bento.ps5.desc')}
              </p>
              <span className="inline-block font-semibold underline underline-offset-4 text-white group-hover:text-exclusive-red transition-colors">
                {t('home.bento.shopNow')}
              </span>
            </div>
          </Link>

          {/* Right 3 Cards Grid */}
          <div className="grid grid-rows-2 gap-8">
            
            {/* Card 2: Bento 2 */}
            <Link
              to={config.bento2.link || '/shop?category=thoi-trang-nu'}
              className="bg-neutral-900 text-white rounded-2xl relative overflow-hidden flex items-end p-6 group cursor-pointer block shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={config.bento2.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'}
                alt={config.bento2.title}
                className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10 space-y-2 max-w-xs">
                <h3 className="text-xl font-bold">{config.bento2.title || t('home.bento.women.title')}</h3>
                <p className="text-xs text-neutral-300">
                  {config.bento2.desc || t('home.bento.women.desc')}
                </p>
                <span className="inline-block text-sm font-semibold underline underline-offset-4 text-white group-hover:text-exclusive-red transition-colors">
                  {t('home.bento.shopNow')}
                </span>
              </div>
            </Link>

            {/* Bottom 2 Split Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Card 3: Bento 3 */}
              <Link
                to={config.bento3.link || '/shop?category=ao-khoac-blazer'}
                className="bg-neutral-950 text-white rounded-2xl relative overflow-hidden flex items-end p-6 group cursor-pointer block shadow-sm hover:shadow-xl transition-all"
              >
                <img
                  src={config.bento3.imageUrl || 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=600&q=80'}
                  alt={config.bento3.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="relative z-10 space-y-1">
                  <h4 className="text-lg font-bold">{config.bento3.title || t('home.bento.speakers.title')}</h4>
                  <p className="text-xs text-neutral-300">{config.bento3.desc || t('home.bento.speakers.desc')}</p>
                  <span className="inline-block text-xs font-semibold underline underline-offset-2 text-white group-hover:text-exclusive-red transition-colors">
                    {t('home.bento.shopNow')}
                  </span>
                </div>
              </Link>

              {/* Card 4: Bento 4 */}
              <Link
                to={config.bento4.link || '/shop?category=tui-xach-phu-kien'}
                className="bg-neutral-950 text-white rounded-2xl relative overflow-hidden flex items-end p-6 group cursor-pointer block shadow-sm hover:shadow-xl transition-all"
              >
                <img
                  src={config.bento4.imageUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'}
                  alt={config.bento4.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="relative z-10 space-y-1">
                  <h4 className="text-lg font-bold">{config.bento4.title || t('home.bento.perfume.title')}</h4>
                  <p className="text-xs text-neutral-300">{config.bento4.desc || t('home.bento.perfume.desc')}</p>
                  <span className="inline-block text-xs font-semibold underline underline-offset-2 text-white group-hover:text-exclusive-red transition-colors">
                    {t('home.bento.shopNow')}
                  </span>
                </div>
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* 8. SERVICE GUARANTEE BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-neutral-300 p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
                <Truck className="w-8 h-8" />
              </div>
            </div>
            <h4 className="font-bold text-lg">{config.badgeDeliveryTitle || t('home.badge.delivery.title')}</h4>
            <p className="text-xs text-gray-500">{config.badgeDeliveryDesc || t('home.badge.delivery.desc')}</p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-neutral-300 p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
                <Headset className="w-8 h-8" />
              </div>
            </div>
            <h4 className="font-bold text-lg">{config.badgeServiceTitle || t('home.badge.service.title')}</h4>
            <p className="text-xs text-gray-500">{config.badgeServiceDesc || t('home.badge.service.desc')}</p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-neutral-300 p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>
            <h4 className="font-bold text-lg">{config.badgeReturnTitle || t('home.badge.moneyBack.title')}</h4>
            <p className="text-xs text-gray-500">{config.badgeReturnDesc || t('home.badge.moneyBack.desc')}</p>
          </div>

        </div>
      </section>

      {/* Back to Top Floating Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-30 w-12 h-12 rounded-full bg-exclusive-bg hover:bg-exclusive-red hover:text-white text-black shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-200 cursor-pointer"
        title="Cuộn lên đầu trang"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

    </div>
  );
};
