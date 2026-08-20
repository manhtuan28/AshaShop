import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Truck, 
  RotateCcw, 
  Minus, 
  Plus, 
  Check,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { productsApi, reviewsApi } from '../services/api';
import { Product, Review } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useAuthStore } from '../store/useAuthStore';
import { ProductCard } from '../components/common/ProductCard';
import { translateProduct } from '../i18n/translator';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { currentLanguage, t } = useLanguageStore();

  const [rawProduct, setRawProduct] = useState<Product | null>(null);
  const product = rawProduct ? translateProduct(rawProduct, currentLanguage) : null;
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
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
        let res: any = null;
        try {
          res = await productsApi.getBySlug(slug);
        } catch {
          // Fallback to getById if slug route fails
          res = await productsApi.getById(slug);
        }

        if (res?.data?.success && res.data.data) {
          const prodData = res.data.data;
          setRawProduct(prodData);
          setSelectedImage(prodData.images?.[0] || '');

          // Fetch reviews for this product
          fetchReviews(prodData._id);

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

  const fetchReviews = async (productId: string) => {
    try {
      setLoadingReviews(true);
      const res = await reviewsApi.getByProduct(productId);
      if (res.data.success) {
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error('Lỗi tải đánh giá sản phẩm:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Dynamic Colors, Sizes & Material extraction
  const rawColors = product?.attributes?.MauSac || product?.attributes?.color || product?.attributes?.colors || '';
  const availableColors: string[] = typeof rawColors === 'string'
    ? rawColors.split(',').map((c) => c.trim()).filter(Boolean)
    : Array.isArray(rawColors) ? rawColors : [];

  const rawSizes = product?.attributes?.Size || product?.attributes?.size || product?.attributes?.sizes || '';
  const availableSizes: string[] = typeof rawSizes === 'string'
    ? rawSizes.split(',').map((s) => s.trim()).filter(Boolean)
    : Array.isArray(rawSizes) ? rawSizes : [];

  const material = product?.attributes?.ChatLieu || product?.attributes?.material || '';

  useEffect(() => {
    if (rawProduct) {
      const rawC = rawProduct.attributes?.MauSac || rawProduct.attributes?.color || '';
      const cArr = typeof rawC === 'string' ? rawC.split(',').map(s => s.trim()).filter(Boolean) : [];
      if (cArr.length > 0) setSelectedColor(cArr[0]);

      const rawS = rawProduct.attributes?.Size || rawProduct.attributes?.size || '';
      const sArr = typeof rawS === 'string' ? rawS.split(',').map(s => s.trim()).filter(Boolean) : [];
      if (sArr.length > 0) setSelectedSize(sArr[0]);
    }
  }, [rawProduct]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleAddToCart = () => {
    if (!product || (product.stock ?? 0) <= 0) return;
    addItem(product, quantity, { color: selectedColor, size: selectedSize });
    setBuySuccess(true);
    setTimeout(() => setBuySuccess(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || (product.stock ?? 0) <= 0) return;
    addItem(product, quantity, { color: selectedColor, size: selectedSize });
    navigate('/checkout');
  };

  const isOutOfStock = (product?.stock ?? 0) <= 0;

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
            <span className="text-gray-500 font-medium">({reviews.length || product.numReviews || 0} {t('detail.reviews')})</span>
            <span className="text-gray-300">|</span>
            <div>
              {product.stock > 10 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Còn hàng ({product.stock} sản phẩm)
                </span>
              ) : product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  Chỉ còn {product.stock} sản phẩm!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Tạm hết hàng
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-exclusive-red tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="px-2 py-0.5 bg-red-100 text-exclusive-red text-xs font-bold rounded-md">
                Tiết kiệm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Material */}
          {material && (
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
              <span className="font-bold text-gray-800">Chất liệu:</span>
              <span>{material}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed pb-4 border-b border-gray-100">
            {product.description || 'Sản phẩm thời trang cao cấp chính hãng từ AshaShop.'}
          </p>

          {/* Colours Selector */}
          {availableColors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  {t('detail.colours')}: <span className="text-exclusive-red font-semibold">{selectedColor}</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {availableColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-all ${
                      selectedColor === c
                        ? 'bg-black text-white border-black shadow-sm ring-2 ring-black/10'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {selectedColor === c && '✓ '}
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {availableSizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  {t('detail.size')}: <span className="text-exclusive-red font-semibold">{selectedSize}</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[40px] px-3 py-2 rounded-xl font-bold text-xs border transition-all text-center ${
                      selectedSize === s 
                        ? 'bg-exclusive-red text-white border-exclusive-red shadow-sm' 
                        : 'bg-gray-50 border-gray-200 text-gray-800 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Counter + Buy Now Button + Wishlist Heart */}
          <div className="flex items-center gap-4 pt-2">
            
            {/* Quantity Controller */}
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
              <button
                type="button"
                disabled={isOutOfStock || quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white disabled:opacity-30 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-sm">{quantity}</span>
              <button
                type="button"
                disabled={isOutOfStock || quantity >= (product.stock ?? 10)}
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white disabled:opacity-30 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="flex-1 py-3 px-6 bg-exclusive-red hover:bg-exclusive-red-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-exclusive-red/20"
            >
              {isOutOfStock ? 'Hết hàng' : t('detail.buyNow')}
            </button>

            {/* Wishlist Heart */}
            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-11 h-11 border border-gray-300 rounded-xl flex items-center justify-center transition-colors ${
                isWishlisted ? 'bg-exclusive-red text-white border-exclusive-red' : 'hover:border-black text-black bg-white'
              }`}
              title="Thêm vào danh sách yêu thích"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Add to Cart secondary button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`w-full py-3.5 border-2 border-black font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : buySuccess
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'hover:bg-black hover:text-white'
            }`}
          >
            {buySuccess ? <Check className="w-4 h-4" /> : null}
            <span>{isOutOfStock ? 'Sản phẩm tạm hết hàng' : buySuccess ? t('card.added') : t('detail.addToCart')}</span>
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

      {/* Customer Reviews & Ratings Section */}
      <section className="space-y-8 pt-8 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="section-badge mb-2">
              <span>ĐÁNH GIÁ TỪ KHÁCH HÀNG</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Nhận Xét & Trải Nghiệm Thực Tế ({reviews.length})
            </h3>
          </div>

          <Link
            to="/my-reviews"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm self-start sm:self-auto"
          >
            <Star className="w-4 h-4 fill-current text-amber-400" />
            <span>Đánh giá của tôi</span>
          </Link>
        </div>

        {/* Rating Score Summary Box */}
        <div className="bg-gray-50/80 rounded-2xl p-6 sm:p-8 border border-gray-200/80 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Average Score */}
          <div className="md:col-span-4 text-center md:border-r border-gray-200 md:pr-6 space-y-2">
            <span className="text-5xl font-black text-gray-900 tracking-tight">
              {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
            </span>
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(product.rating || 5) ? 'fill-current' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Dựa trên {reviews.length || product.numReviews || 0} lượt đánh giá thực tế
            </p>
          </div>

          {/* Star Distribution Breakdown */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((starCount) => {
              const matchingReviews = reviews.filter((r) => r.rating === starCount);
              const percent = reviews.length > 0 ? (matchingReviews.length / reviews.length) * 100 : (starCount === 5 ? 85 : starCount === 4 ? 15 : 0);
              return (
                <div key={starCount} className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="w-12 font-medium flex items-center gap-1">
                    {starCount} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-gray-400 font-medium">{Math.round(percent)}%</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Reviews List */}
        {loadingReviews ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 space-y-3">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="font-bold text-gray-800 text-base">Chưa có đánh giá nào cho sản phẩm này</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Hãy là người đầu tiên trải nghiệm và chia sẻ cảm nhận về thiết kế này!
            </p>
            <Link
              to="/my-reviews"
              className="inline-block px-5 py-2 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Viết đánh giá ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3 hover:border-gray-200 transition-colors"
              >
                {/* User Info & Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {typeof rev.user === 'object' && rev.user?.avatar ? (
                      <img
                        src={rev.user.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">
                        {typeof rev.user === 'object' ? rev.user?.name?.charAt(0) || 'U' : 'U'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">
                          {typeof rev.user === 'object' ? rev.user?.name : 'Khách hàng AshaShop'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Đã mua hàng
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-current' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        {rev.selectedAttributes && Object.keys(rev.selectedAttributes).length > 0 && (
                          <span className="text-xs text-gray-400">
                            • Phân loại: {Object.values(rev.selectedAttributes).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-gray-700 leading-relaxed pl-13">
                  {rev.comment}
                </p>

                {/* Review Photos */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-13 pt-1">
                    {rev.images.map((imgUrl, imgIdx) => (
                      <a
                        key={imgIdx}
                        href={imgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={imgUrl}
                          alt="Feedback"
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </section>

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
