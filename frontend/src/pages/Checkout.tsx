import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { ordersApi } from '../services/api';
import { formatPrice } from '../components/common/ProductCard';
import { PaymentMethod } from '../types';
import toast from 'react-hot-toast';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cart, fetchCart } = useCartStore();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Hà Nội',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Không có sản phẩm để thanh toán</h2>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  const shippingFee = cart.totalPrice > 500000 ? 0 : 30000;
  const finalTotal = cart.totalPrice + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        shippingAddress: formData,
        paymentMethod,
      };

      const res = await ordersApi.create(orderPayload);
      const createdOrder = res.data.data;
      toast.success('Đặt hàng thành công!');
      navigate(`/order-success/${createdOrder._id}`);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Không thể tạo đơn hàng';
      toast.error(typeof msg === 'string' ? msg : 'Lỗi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 border-b border-gray-200 pb-4">
        Thanh Toán & Đặt Hàng
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Shipping & Payment Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              Thông Tin Giao Hàng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ví dụ: 0987654321"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Địa chỉ cụ thể *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Tỉnh / Thành phố *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Khác">Tỉnh thành khác</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Ghi chú đơn hàng (nếu có)</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Giao giờ hành chính, gọi trước..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Phương Thức Thanh Toán
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-950 font-semibold'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-xs text-gray-500">Nhận hàng và thanh toán tiền mặt cho shipper</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-emerald-600 w-4 h-4"
                />
              </label>

              <label
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-950 font-semibold'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Chuyển khoản Ngân hàng (QR 24/7)</p>
                    <p className="text-xs text-gray-500">Quét mã VietQR chuyển khoản nhanh</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                  className="accent-emerald-600 w-4 h-4"
                />
              </label>

              <label
                onClick={() => setPaymentMethod('VNPAY')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'VNPAY'
                    ? 'border-emerald-600 bg-emerald-50/40 text-emerald-950 font-semibold'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Ví điện tử VNPAY / MoMo</p>
                    <p className="text-xs text-gray-500">Cổng thanh toán trực tuyến an toàn</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'VNPAY'}
                  onChange={() => setPaymentMethod('VNPAY')}
                  className="accent-emerald-600 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Đơn Hàng ({cart.items.length} món)
          </h2>

          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto space-y-3 pr-1">
            {cart.items.map((item, idx) => {
              const product = item.product;
              const img = product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';
              return (
                <div key={idx} className="flex items-center gap-3 pt-3 first:pt-0">
                  <img src={img} alt={product?.name} className="w-14 h-14 rounded-xl object-cover bg-gray-50" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 truncate">{product?.name}</h4>
                    <p className="text-xs text-gray-400">Số lượng: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span className="font-bold text-gray-900">{formatPrice(cart.totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển:</span>
              <span className="font-bold text-gray-900">
                {shippingFee === 0 ? <span className="text-emerald-600 font-bold">MIỄN PHÍ</span> : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base">
              <span className="font-bold text-gray-900">Tổng thanh toán:</span>
              <span className="font-black text-emerald-600 text-xl">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Xác Nhận Đặt Hàng</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cam kết sản phẩm chính hãng 100%</span>
          </div>
        </div>
      </form>
    </div>
  );
};
