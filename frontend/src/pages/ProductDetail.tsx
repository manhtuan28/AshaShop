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
  ShieldCheck 
} from 'lucide-react';
import { productsApi } from '../services/api';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
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
          setProduct(prodData);
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
    if (product) {
      addItem(product, quantity, { color: selectedColor, size: selectedSize });
      setBuySuccess(true);
      setTimeout(() => setBuySuccess(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity, { color: selectedColor, size: selectedSize });
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
        <div className="h-96 bg-gray-200 rounded max-w-4xl mx-auto"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link to="/shop" className="inline-block px-6 py-2 bg-exclusive-red text-white rounded">
          Return to Shop
        </Link>
      </div>
    );
  }

  const sampleImages = product.images && product.images.length > 0 
    ? product.images 
    : [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80'
      ];

  const colors = ['#A0BCE0', '#E07575', '#000000'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">Account</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-black transition-colors">
          {typeof product.category === 'object' ? product.category.name : 'Products'}
        </Link>
        <span>/</span>
        <span className="text-black font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Detail Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery (4 Vertical Thumbnails + 1 Large Main Image) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          
          {/* Vertical Thumbnails */}
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
            <span className="text-gray-500 font-medium">({product.numReviews || 150} Reviews)</span>
            <span className="text-gray-300">|</span>
            <span className="text-exclusive-green font-semibold">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
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
            {product.description || 'PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.'}
          </p>

          {/* Colours Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-black">Colours:</span>
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
            <span className="text-sm font-medium text-black">Size:</span>
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
              Buy Now
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
            <span>{buySuccess ? 'Added to Cart Successfully!' : 'Add to Cart'}</span>
          </button>

          {/* Delivery & Return Accordion Box */}
          <div className="border border-gray-300 rounded divide-y divide-gray-300 mt-6">
            
            {/* Free Delivery */}
            <div className="p-4 flex items-start gap-4">
              <Truck className="w-7 h-7 text-black flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Free Delivery</h4>
                <p className="text-xs text-gray-500 underline cursor-pointer">
                  Enter your postal code for Delivery Availability
                </p>
              </div>
            </div>

            {/* Return Delivery */}
            <div className="p-4 flex items-start gap-4">
              <RotateCcw className="w-7 h-7 text-black flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Return Delivery</h4>
                <p className="text-xs text-gray-500">
                  Free 30 Days Delivery Returns.{' '}
                  <span className="underline cursor-pointer">Details</span>
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
            <span>Related Item</span>
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
