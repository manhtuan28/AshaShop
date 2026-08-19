import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { ProductCard } from '../components/common/ProductCard';
import { productsApi } from '../services/api';
import { Product } from '../types';
import toast from 'react-hot-toast';

export const Wishlist: React.FC = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        const res = await productsApi.getAll({ limit: 4 });
        setRecommended(res.data.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;
    items.forEach((item) => {
      addItem(item, 1);
    });
    toast.success(`Đã chuyển tất cả ${items.length} sản phẩm vào giỏ hàng!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <span className="text-black font-medium">Danh Sách Yêu Thích</span>
      </nav>

      {/* Header with Wishlist Count & Move All Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black flex items-center gap-2">
            <Heart className="w-7 h-7 text-exclusive-red fill-exclusive-red" />
            <span>Danh Sách Yêu Thích ({items.length})</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Các sản phẩm thời trang bạn đã lưu lại để mua sắm sau</p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearWishlist}
              className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa tất cả</span>
            </button>
            <button
              onClick={handleMoveAllToCart}
              className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Chuyển tất cả vào giỏ</span>
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-exclusive-red mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Danh sách yêu thích của bạn đang trống</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Hãy khám phá các mẫu thời trang mới nhất và bấm vào biểu tượng trái tim để lưu lại những trang phục bạn yêu thích!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-bold rounded transition-colors"
          >
            <span>Khám Phá Mua Sắm Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Recommended Section (Just For You) */}
      <div className="space-y-6 pt-10 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-8 bg-exclusive-red rounded-sm"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-black flex items-center gap-2">
              <span>Gợi Ý Dành Riêng Cho Bạn</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h2>
          </div>
          <Link
            to="/shop"
            className="px-6 py-2 border border-black hover:bg-black hover:text-white text-xs font-bold rounded transition-all"
          >
            Xem Tất Cả
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommended.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
