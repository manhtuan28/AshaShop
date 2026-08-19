import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  Monitor, 
  Watch, 
  Camera, 
  Headphones, 
  Gamepad2, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  Headset, 
  ShieldCheck, 
  ChevronRight,
  ArrowUp,
  Flame,
  Apple
} from 'lucide-react';
import { productsApi } from '../services/api';
import { Category, Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
          productsApi.getAll({ limit: 12 })
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

  const defaultCategoryList = [
    "Woman's Fashion",
    "Men's Fashion",
    "Electronics",
    "Home & Lifestyle",
    "Medicine",
    "Sports & Outdoor",
    "Baby's & Toys",
    "Groceries & Pets",
    "Health & Beauty"
  ];

  const categoryIcons = [
    { name: 'Phones', icon: Smartphone, slug: 'dien-thoai-tablet' },
    { name: 'Computers', icon: Monitor, slug: 'laptop-may-tinh' },
    { name: 'SmartWatch', icon: Watch, slug: 'thoi-trang-phu-kien' },
    { name: 'Camera', icon: Camera, slug: 'dien-thoai-tablet' },
    { name: 'HeadPhones', icon: Headphones, slug: 'am-thanh-phu-kien-so' },
    { name: 'Gaming', icon: Gamepad2, slug: 'laptop-may-tinh' },
  ];

  const flashSaleProducts = products.slice(0, 4);
  const bestSellingProducts = products.slice(2, 6);
  const exploreProducts = products.slice(0, 8);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-20 pb-16 font-poppins">
      
      {/* 1. HERO SECTION: Category Sidebar + Right Banner Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Category Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 border-r border-gray-200 pr-6 pt-6 space-y-3.5">
            {defaultCategoryList.map((cat, idx) => (
              <div 
                key={idx}
                onClick={() => navigate('/shop')}
                className="flex items-center justify-between text-sm font-medium text-black hover:text-exclusive-red hover:translate-x-1 cursor-pointer transition-all py-1"
              >
                <span>{cat}</span>
                {idx < 2 && <ChevronRight className="w-4 h-4 text-gray-400" />}
              </div>
            ))}
          </aside>

          {/* Right Hero Carousel Banner */}
          <div className="lg:col-span-9 pt-6">
            <div className="bg-black text-white rounded overflow-hidden relative min-h-[340px] md:min-h-[380px] flex flex-col md:flex-row items-center justify-between p-8 md:p-14">
              
              {/* Left Content */}
              <div className="space-y-4 max-w-md z-10">
                <div className="flex items-center gap-3">
                  <Apple className="w-8 h-8 fill-current" />
                  <span className="text-sm font-medium text-neutral-300">iPhone 15 Pro Series</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-wide leading-tight">
                  Up to 10% <br /> off Voucher
                </h1>
                <div className="pt-2">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 font-medium border-b-2 border-white pb-1 hover:text-exclusive-red hover:border-exclusive-red transition-all"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Hero Image */}
              <div className="mt-6 md:mt-0 relative flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80"
                  alt="iPhone 15 Pro"
                  className="max-h-72 object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Carousel Indicator Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-exclusive-red border-2 border-white cursor-pointer"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 cursor-pointer"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 cursor-pointer"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 cursor-pointer"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 cursor-pointer"></span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FLASH SALES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with Countdown Timer */}
        <div className="space-y-4">
          <div className="section-badge">
            <span>Today's</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex flex-wrap items-end gap-8 sm:gap-14">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-wide">Flash Sales</h2>
              
              {/* Countdown Timer */}
              <div className="flex items-center gap-4 text-center font-poppins">
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">Days</span>
                  <p className="text-2xl sm:text-3xl font-bold">{String(timeLeft.days).padStart(2, '0')}</p>
                </div>
                <span className="text-2xl font-bold text-exclusive-red mt-2">:</span>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">Hours</span>
                  <p className="text-2xl sm:text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</p>
                </div>
                <span className="text-2xl font-bold text-exclusive-red mt-2">:</span>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">Minutes</span>
                  <p className="text-2xl sm:text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</p>
                </div>
                <span className="text-2xl font-bold text-exclusive-red mt-2">:</span>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase">Seconds</span>
                  <p className="text-2xl sm:text-3xl font-bold text-exclusive-red">{String(timeLeft.seconds).padStart(2, '0')}</p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => navigate('/shop')} className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/shop')} className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product._id} product={product} discountPercentage={35} />
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center pt-6">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-12 py-4 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium rounded transition-colors"
          >
            View All Products
          </Link>
        </div>

        <hr className="border-gray-200 my-10" />
      </section>

      {/* 3. BROWSE BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <div className="section-badge">
            <span>Categories</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-wide">Browse By Category</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/shop')} className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/shop')} className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categoryIcons.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(`/shop?category=${cat.slug}`)}
                className="group border border-gray-300 rounded p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-exclusive-red hover:border-exclusive-red transition-all duration-300 aspect-square shadow-sm"
              >
                <Icon className="w-10 h-10 text-black group-hover:text-white transition-colors" />
                <span className="font-medium text-sm text-black group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

        <hr className="border-gray-200 my-10" />
      </section>

      {/* 4. BEST SELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <div className="section-badge">
            <span>This Month</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-wide">Best Selling Products</h2>
            <Link
              to="/shop"
              className="px-8 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-sm font-medium rounded transition-colors"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellingProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. PROMOTIONAL MUSIC EXPERIENCE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white rounded p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
          
          {/* Left Content */}
          <div className="space-y-6 max-w-lg z-10">
            <span className="text-exclusive-green font-semibold text-sm">Categories</span>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight tracking-wide">
              Enhance Your <br /> Music Experience
            </h2>

            {/* Circular Countdown Timers */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white text-black flex flex-col items-center justify-center shadow">
                <span className="text-base font-bold leading-none">{timeLeft.hours}</span>
                <span className="text-[10px] text-gray-600 font-medium">Hours</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-white text-black flex flex-col items-center justify-center shadow">
                <span className="text-base font-bold leading-none">{timeLeft.days}</span>
                <span className="text-[10px] text-gray-600 font-medium">Days</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-white text-black flex flex-col items-center justify-center shadow">
                <span className="text-base font-bold leading-none">{timeLeft.minutes}</span>
                <span className="text-[10px] text-gray-600 font-medium">Minutes</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-white text-black flex flex-col items-center justify-center shadow">
                <span className="text-base font-bold leading-none">{timeLeft.seconds}</span>
                <span className="text-[10px] text-gray-600 font-medium">Seconds</span>
              </div>
            </div>

            <div>
              <Link
                to="/shop?category=am-thanh-phu-kien-so"
                className="inline-flex items-center justify-center px-10 py-4 bg-exclusive-green hover:bg-green-400 text-black font-semibold rounded transition-colors"
              >
                Buy Now!
              </Link>
            </div>
          </div>

          {/* Right Speaker Image with Green Glow */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-72 h-72 bg-exclusive-green/20 rounded-full blur-3xl -z-0"></div>
            <img
              src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=80"
              alt="JBL Boombox Speaker"
              className="max-h-72 object-contain relative z-10 hover:scale-105 transition-transform duration-500"
            />
          </div>

        </div>
      </section>

      {/* 6. EXPLORE OUR PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <div className="section-badge">
            <span>Our Products</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-wide">Explore Our Products</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/shop')} className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/shop')} className="w-10 h-10 rounded-full bg-exclusive-bg hover:bg-gray-200 flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {exploreProducts.map((product, i) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              isNew={i % 3 === 0} 
            />
          ))}
        </div>

        <div className="text-center pt-6">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-12 py-4 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium rounded transition-colors"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* 7. NEW ARRIVAL (BENTO GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <div className="section-badge">
            <span>Featured</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-wide">New Arrival</h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[600px]">
          
          {/* Card 1: PlayStation 5 (Left Full Height) */}
          <div className="bg-black text-white rounded relative overflow-hidden flex items-end p-8 group">
            <img
              src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"
              alt="PlayStation 5"
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 space-y-3 max-w-xs">
              <h3 className="text-2xl font-bold">PlayStation 5</h3>
              <p className="text-sm text-neutral-300">
                Black and White version of the PS5 coming out on sale.
              </p>
              <Link
                to="/shop"
                className="inline-block font-semibold underline underline-offset-4 hover:text-exclusive-red transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right 3 Cards Grid */}
          <div className="grid grid-rows-2 gap-8">
            
            {/* Card 2: Women's Collections (Top Right) */}
            <div className="bg-neutral-900 text-white rounded relative overflow-hidden flex items-end p-6 group">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                alt="Women's Collections"
                className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10 space-y-2 max-w-xs">
                <h3 className="text-xl font-bold">Women's Collections</h3>
                <p className="text-xs text-neutral-300">
                  Featured woman collections that give you another vibe.
                </p>
                <Link
                  to="/shop"
                  className="inline-block text-sm font-semibold underline underline-offset-4 hover:text-exclusive-red transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Bottom 2 Split Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Card 3: Speakers */}
              <div className="bg-neutral-950 text-white rounded relative overflow-hidden flex items-end p-6 group">
                <img
                  src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80"
                  alt="Speakers"
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="relative z-10 space-y-1">
                  <h4 className="text-lg font-bold">Speakers</h4>
                  <p className="text-xs text-neutral-300">Amazon wireless speakers</p>
                  <Link
                    to="/shop"
                    className="inline-block text-xs font-semibold underline underline-offset-2 hover:text-exclusive-red transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>

              {/* Card 4: Perfume */}
              <div className="bg-neutral-950 text-white rounded relative overflow-hidden flex items-end p-6 group">
                <img
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
                  alt="Perfume"
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="relative z-10 space-y-1">
                  <h4 className="text-lg font-bold">Perfume</h4>
                  <p className="text-xs text-neutral-300">GUCCI INTENSE OUD EDP</p>
                  <Link
                    to="/shop"
                    className="inline-block text-xs font-semibold underline underline-offset-2 hover:text-exclusive-red transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>

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
            <h4 className="font-bold text-lg">FREE AND FAST DELIVERY</h4>
            <p className="text-xs text-gray-500">Free delivery for all orders over $140</p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-neutral-300 p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
                <Headset className="w-8 h-8" />
              </div>
            </div>
            <h4 className="font-bold text-lg">24/7 CUSTOMER SERVICE</h4>
            <p className="text-xs text-gray-500">Friendly 24/7 customer support</p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-neutral-300 p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>
            <h4 className="font-bold text-lg">MONEY BACK GUARANTEE</h4>
            <p className="text-xs text-gray-500">We return money within 30 days</p>
          </div>

        </div>
      </section>

      {/* Back to Top Floating Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-30 w-12 h-12 rounded-full bg-exclusive-bg hover:bg-exclusive-red hover:text-white text-black shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-200"
        title="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

    </div>
  );
};
