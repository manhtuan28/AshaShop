import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Truck, 
  RotateCcw, 
  Minus, 
  Plus, 
  Check 
} from 'lucide-react';
import { productsApi } from '../services/api';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { ProductCard } from '../components/common/ProductCard';
import { translateProduct } from '../i18n/translator';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { currentLanguage, t } = useLanguageStore();

  const [rawProduct, setRawProduct] = useState<Product | null>(null);
  const product = rawProduct ? translateProduct(rawProduct, currentLanguage) : null;
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>('#A0BCE0');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [buySuccess, setBuySuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await productsApi.getBySlug(slug);
        if (res.data.success) {
          const prodData = res.data.data;
          setRawProduct(prodData);
          setSelectedImage(prodData.images?.[0] || '');

          // Fetch related products
          const relatedRes = await productsApi.getAll({ limit: 4 });
          setRelatedProducts(relatedRes.data.data.items.filter(p => p._id !== prodData._id).slice(0, 4));
        }
      } catch (err) {
        console.error('Lỗi tải chi tiết sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, { color: selectedColor, size: selectedSize });
    setBuySuccess(true);
    setTimeout(() => setBuySuccess(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity, { color: selectedColor, size: selectedSize });
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8 font-poppins">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 bg-gray-200 rounded aspect-square"></div>
          <div className="lg:col-span-5 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4 font-poppins">
        <h2 className="text-2xl font-bold">{t('shop.noProducts')}</h2>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-exclusive-red text-white font-medium rounded">
          {t('cart.returnToShop')}
        </Link>
      </div>
    );
  }

  const colors = ['#1E1E1E', '#E07575', '#E5E7EB', '#2563EB'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const sampleImages = product.images && product.images.length > 0 
    ? product.images 
    : [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80',
        'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=700&q=80',
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-16">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-black transition-colors">{t('nav.shop')}</Link>
        <span>/</span>
        <span className="text-black font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: 4 Thumbnails (Vertical) + 1 Large Active Image */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6 items-start">
          
          {/* Vertical Thumbnail List */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
            {sampleImages.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-24 h-24 sm:w-28 sm:h-28 bg-exclusive-bg rounded p-2 flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                  selectedImage === img ? 'border-exclusive-red' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="max-h-full max-w-full object-contain" />
              </button>
            ))}
          </div>

          {/* Main Large Image Container */}
          <div className="flex-1 bg-exclusive-bg rounded p-8 flex items-center justify-center aspect-square md:aspect-auto md:min-h-[500px]">
            <img
              src={selectedImage || sampleImages[0]}
              alt={product.name}
              className="max-h-96 max-w-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

        </div>

        {/* Right Column: Product Information & Purchase Options */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-black">
            {product.name}
          </h1>

          {/* Rating, Reviews & Stock Status */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center text-exclusive-gold">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-gray-500 font-medium">({product.numReviews || 150} {t('detail.reviews')})</span>
            <span className="text-gray-300">|</span>
            <span className="text-exclusive-green font-semibold">
              {product.stock > 0 ? t('detail.inStock') : t('detail.outOfStock')}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-2xl sm:text-3xl font-semibold text-black">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed pb-4 border-b border-gray-200">
            {product.description || 'Exclusive premium quality authentic merchandise.'}
          </p>

          {/* Colours Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-black">{t('detail.colours')}</span>
            <div className="flex items-center gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedColor === c ? 'ring-2 ring-offset-2 ring-black border-white' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-black">{t('detail.size')}</span>
            <div className="flex items-center gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-9 h-9 rounded font-medium text-xs border transition-all ${
                    selectedSize === s 
                      ? 'bg-exclusive-red text-white border-exclusive-red' 
                      : 'border-gray-300 text-black hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Counter + Buy Now Button + Wishlist Heart */}
          <div className="flex items-center gap-4 pt-2">
            
            {/* Quantity Controller */}
            <div className="flex items-center border border-gray-400 rounded overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-exclusive-red hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center bg-exclusive-red text-white hover:bg-exclusive-red-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="flex-1 py-2.5 px-6 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium text-sm sm:text-base rounded transition-colors"
            >
              {t('detail.buyNow')}
            </button>

            {/* Wishlist Heart */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-10 h-10 border border-gray-400 rounded flex items-center justify-center transition-colors ${
                isWishlisted ? 'bg-exclusive-red text-white border-exclusive-red' : 'hover:border-black text-black'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Add to Cart secondary button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 border-2 border-black font-semibold text-sm rounded transition-all flex items-center justify-center gap-2 ${
              buySuccess ? 'bg-exclusive-green text-black border-exclusive-green' : 'hover:bg-black hover:text-white'
            }`}
          >
            {buySuccess ? <Check className="w-4 h-4" /> : null}
            <span>{buySuccess ? t('card.added') : t('detail.addToCart')}</span>
          </button>

          {/* Delivery & Return Accordion Box */}
          <div className="border border-gray-300 rounded divide-y divide-gray-300 mt-6">
            
            {/* Free Delivery */}
            <div className="p-4 flex items-start gap-4">
              <Truck className="w-7 h-7 text-black flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">{t('detail.freeDelivery')}</h4>
                <p className="text-xs text-gray-500 underline cursor-pointer">
                  {t('detail.deliveryDesc')}
                </p>
              </div>
            </div>

            {/* Return Delivery */}
            <div className="p-4 flex items-start gap-4">
              <RotateCcw className="w-7 h-7 text-black flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">{t('detail.returnDelivery')}</h4>
                <p className="text-xs text-gray-500">
                  {t('detail.returnDesc')}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Related Items Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-10">
          <div className="section-badge">
            <span>{t('detail.relatedItem')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
