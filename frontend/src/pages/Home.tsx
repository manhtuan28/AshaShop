import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { productsApi } from '../services/api';
import { Category, Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getFeatured(),
          productsApi.getCategories(),
        ]);
        setFeaturedProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (error) {
        console.error('Lỗi tải dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.25),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4" />
                <span>NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ THẾ HỆ MỚI</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                Mua sắm thông minh, <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  trải nghiệm đẳng cấp
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Khám phá hàng ngàn sản phẩm công nghệ, smartphone, laptop và thời trang chính hãng với ưu đãi giảm giá lên tới 40% hôm nay.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition duration-200 transform hover:-translate-y-0.5"
                >
                  <span>Khám Phá Cửa Hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop?isFeatured=true"
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-2xl border border-slate-700 flex items-center justify-center transition"
                >
                  Sản Phẩm Nổi Bật
                </Link>
              </div>

              {/* Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left">
                <div>
                  <p className="text-2xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-slate-400">Chính hãng bảo hành</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">24/7</p>
                  <p className="text-xs text-slate-400">Hỗ trợ khách hàng</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">&lt; 2h</p>
                  <p className="text-xs text-slate-400">Giao hàng siêu tốc</p>
                </div>
              </div>
            </div>

            {/* Hero Banner Showcase Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl bg-gradient-to-tr from-slate-800 to-slate-700 p-2">
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"
                  alt="AshaShop Hero Banner"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase">Flash Deal Tuần Này</span>
                    <h3 className="text-sm font-bold text-white">iPhone 15 Pro Max Titan</h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl">
                    -15%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Khám Phá Theo Nhóm
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Danh Mục Nổi Bật
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent absolute inset-0 flex flex-col justify-end text-white">
                <h3 className="font-bold text-base sm:text-lg group-hover:text-emerald-400 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-200 line-clamp-1 mt-0.5 font-light">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section (Redis Cached) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md mb-2">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>SẢN PHẨM BÁN CHẠY NHẤT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Gợi Ý Dành Cho Bạn
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>Xem thêm</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-gray-100 h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Promotion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
              ƯU ĐÃI ĐẶC BIỆT
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Đăng ký thành viên nhận voucher 100.000đ
            </h3>
            <p className="text-emerald-100 text-sm">
              Áp dụng cho tất cả khách hàng mới đăng ký tài khoản trên hệ thống AshaShop.
            </p>
          </div>
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-emerald-800 font-extrabold rounded-2xl hover:bg-emerald-50 shadow-lg hover:scale-105 transition flex-shrink-0"
          >
            Đăng Ký Ngay
          </Link>
        </div>
      </section>
    </div>
  );
};
