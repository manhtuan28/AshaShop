import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';

interface ProductCardProps {
  product: Product;
  discountPercentage?: number;
  isNew?: boolean;
}

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  discountPercentage = 25,
  isNew = false 
}) => {
  const { addItem } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const formatCurrency = formatPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : discountPercentage;

  return (
    <div className="group flex flex-col font-poppins relative">
      
      {/* Image & Action Container */}
      <div className="relative bg-exclusive-bg rounded aspect-square overflow-hidden flex items-center justify-center p-4">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="bg-exclusive-red text-white text-xs font-semibold px-3 py-1 rounded">
              -{discountPercent}%
            </span>
          )}
          {isNew && (
            <span className="bg-exclusive-green text-black text-xs font-bold px-3 py-1 rounded">
              NEW
            </span>
          )}
        </div>

        {/* Top Right Action Icons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            title="Add to Wishlist"
            className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow transition-colors ${
              isWishlisted ? 'text-exclusive-red fill-exclusive-red' : 'text-black hover:bg-exclusive-red hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          
          <Link
            to={`/product/${product.slug || product._id}`}
            title="Quick View"
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow text-black hover:bg-exclusive-red hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Image */}
        <Link to={`/product/${product.slug || product._id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="max-h-40 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Add To Cart Hover Slide-up Button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-0 left-0 right-0 bg-black text-white py-2.5 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            addedAnimation 
              ? 'bg-exclusive-green text-black translate-y-0' 
              : 'opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{addedAnimation ? 'Added to Cart ✓' : 'Add To Cart'}</span>
        </button>
      </div>

      {/* Product Details Info */}
      <div className="pt-4 flex flex-col flex-1">
        <Link 
          to={`/product/${product.slug || product._id}`}
          className="font-medium text-base text-black hover:text-exclusive-red transition-colors line-clamp-1 mb-1"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Price Section */}
        <div className="flex items-center gap-3 mb-2 font-medium">
          <span className="text-exclusive-red font-semibold text-base">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-sm">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Ratings & Reviews */}
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex items-center text-exclusive-gold">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            ({product.numReviews || 88})
          </span>
        </div>
      </div>

    </div>
  );
};
