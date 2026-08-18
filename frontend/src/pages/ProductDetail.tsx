import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { productsApi } from '../services/api';
import { Product } from '../types';
import { formatPrice } from '../components/common/ProductCard';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await productsApi.getBySlug(slug);
        const p = res.data.data;
        setProduct(p);
        if (p.images && p.images.length > 0) {
          setSelectedImage(p.images[0]);
        }
      } catch (error) {
        console.error('Không tìm thấy sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500">Sản phẩm bạn đang tìm kiếm có thể đã ngừng bán hoặc đổi đường dẫn.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product._id, quantity);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product._id, quantity);
    navigate('/cart');
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
        <Link to="/" className="hover:text-emerald-600">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-emerald-600">Cửa hàng</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImage === img ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Featured */}
            <div className="flex items-center gap-2">
              {typeof product.category === 'object' && product.category && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase">
                  {product.category.name}
                </span>
              )}
              {product.isFeatured && (
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg">
                  Sản Phẩm Hot
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1 font-bold text-gray-800">{product.rating.toFixed(1)}</span>
                <span className="ml-1 text-gray-400">({product.numReviews} nhận xét)</span>
              </div>
              <span>|</span>
              <span className={`font-semibold flex items-center gap-1 ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                <CheckCircle2 className="w-4 h-4" />
                {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : 'Tạm hết hàng'}
              </span>
            </div>

            {/* Price */}
            <div className="p-4 bg-gray-50 rounded-2xl flex items-baseline gap-4">
              <span className="text-3xl font-black text-emerald-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-gray-400 line-through font-medium">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-extrabold rounded-md">
                    Tiết kiệm {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Attributes / Specs */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông số nổi bật:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.attributes).map(([key, val]) => (
                    <div key={key} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                      <span className="font-semibold text-gray-500">{key}:</span>
                      <span className="font-bold text-gray-800">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            {/* Quantity Picker */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Số lượng:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-2.5 hover:bg-gray-100 disabled:opacity-30 transition"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-5 font-bold text-sm text-gray-800">{quantity}</span>
                <button
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                  className="p-2.5 hover:bg-gray-100 disabled:opacity-30 transition"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Button group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-2xl border-2 border-emerald-600 text-emerald-600 font-bold text-sm hover:bg-emerald-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>
              <button
                disabled={product.stock <= 0}
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Mua Ngay</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 text-[11px] text-gray-600 text-center">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
                <p className="font-semibold">Bảo hành 12 tháng</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto" />
                <p className="font-semibold">Đổi trả 7 ngày</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <Truck className="w-4 h-4 text-emerald-600 mx-auto" />
                <p className="font-semibold">Freeship từ 500k</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Tab Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
          Mô Tả Chi Tiết Sản Phẩm
        </h3>
        <div className="prose prose-emerald max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
          {product.description}
        </div>
      </div>
    </div>
  );
};
