import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

interface ProductCardProps {
  product: Product;
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product._id, 1);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';

  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? product.category.name
      : '';

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image & Badges */}
      <Link to={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50 block">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Featured Badge */}
        {product.isFeatured && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            NỔI BẬT
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {categoryName && (
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
              {categoryName}
            </span>
          )}
          <Link
            to={`/products/${product.slug}`}
            className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 hover:text-emerald-600 transition"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="ml-1 font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
          </div>
          <span>•</span>
          <span>{product.numReviews} đánh giá</span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-emerald-600">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition duration-200 shadow-sm"
            title="Thêm vào giỏ"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
