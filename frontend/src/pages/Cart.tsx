import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../components/common/ProductCard';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, updateQuantity, removeItem, clearCart, isLoading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Bạn chưa chọn sản phẩm nào. Hãy khám phá ngay hàng ngàn sản phẩm tuyệt vời của AshaShop!
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
        >
          <span>Mua sắm ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const shippingFee = cart.totalPrice > 500000 ? 0 : 30000;
  const finalTotal = cart.totalPrice + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Giỏ Hàng ({cart.items.length} mặt hàng)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa tất cả</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4">
          {cart.items.map((item, idx) => {
            const product = item.product;
            if (!product) return null;

            const image =
              product.images && product.images.length > 0
                ? product.images[0]
                : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80';

            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 transition"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-white flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <Link
                      to={`/products/${product.slug}`}
                      className="font-bold text-gray-900 text-sm hover:text-emerald-600 line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs font-semibold text-emerald-600">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-bold text-xs text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <span className="font-extrabold text-sm text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeItem(product._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Tóm Tắt Đơn Hàng
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span className="font-bold text-gray-900">{formatPrice(cart.totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển:</span>
              <span className="font-bold text-gray-900">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
                ) : (
                  formatPrice(shippingFee)
                )}
              </span>
            </div>
            {cart.totalPrice < 500000 && (
              <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-lg">
                Mua thêm {formatPrice(500000 - cart.totalPrice)} để được <strong>FREESHIP</strong>!
              </p>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base">
              <span className="font-bold text-gray-900">Tổng cộng:</span>
              <span className="font-black text-emerald-600 text-xl">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
          >
            <span>Tiến Hành Đặt Hàng</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bảo mật thanh toán 100% qua SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
