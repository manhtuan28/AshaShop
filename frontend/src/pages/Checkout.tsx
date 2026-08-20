import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, QrCode, CreditCard, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { ordersApi, paymentsApi } from '../services/api';
import {
  VnPayLogo,
  MomoLogo,
  VietQrLogo,
  CodLogo,
  VisaLogo,
  MastercardLogo,
} from '../components/common/PaymentLogos';
import {
  getVietnamProvinces,
  getVietnamDistricts,
  getVietnamWards,
  INITIAL_PROVINCES,
  ProvinceItem,
  DistrictItem,
  WardItem,
} from '../data/provinces';

type SelectedPaymentMethod = 'VNPAY' | 'MOMO' | 'PAYPAL' | 'BANK_TRANSFER' | 'COD';

export const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name || '',
    companyName: '',
    streetAddress: '',
    apartment: '',
    phone: user?.phone || '',
    email: user?.email || '',
    saveInfo: true,
  });

  const [provinces, setProvinces] = useState<ProvinceItem[]>(INITIAL_PROVINCES);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [wards, setWards] = useState<WardItem[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('01');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedWardId, setSelectedWardId] = useState<string>('');

  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('Hà Nội');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('');
  const [selectedWardName, setSelectedWardName] = useState<string>('');

  const [paymentMethod, setPaymentMethod] = useState<SelectedPaymentMethod>('VNPAY');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    getVietnamProvinces().then((data) => {
      if (data && data.length > 0) {
        setProvinces(data);
        const defaultProv = data.find((p) => p.name.includes('Hà Nội')) || data[0];
        if (defaultProv) {
          setSelectedProvinceId(defaultProv.id);
          setSelectedProvinceName(defaultProv.name);
          getVietnamDistricts(defaultProv.id).then((dists) => {
            setDistricts(dists);
          });
        }
      }
    });
  }, []);

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provId = e.target.value;
    setSelectedProvinceId(provId);
    const found = provinces.find((p) => p.id === provId);
    const provName = found ? found.name : '';
    setSelectedProvinceName(provName);

    setSelectedDistrictId('');
    setSelectedDistrictName('');
    setSelectedWardId('');
    setSelectedWardName('');
    setWards([]);

    if (provId) {
      const dists = await getVietnamDistricts(provId);
      setDistricts(dists);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distId = e.target.value;
    setSelectedDistrictId(distId);
    const found = districts.find((d) => d.id === distId);
    const distName = found ? found.name : '';
    setSelectedDistrictName(distName);

    setSelectedWardId('');
    setSelectedWardName('');

    if (distId) {
      const wList = await getVietnamWards(distId);
      setWards(wList);
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardId = e.target.value;
    setSelectedWardId(wardId);
    const found = wards.find((w) => w.id === wardId);
    setSelectedWardName(found ? found.name : '');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'EXCLUSIVE10' || couponCode.trim().toUpperCase() === 'ASHASHOP') {
      setDiscountAmount(totalPrice * 0.1);
    } else {
      alert('Mã giảm giá không hợp lệ! Thử mã: ASHASHOP (Giảm 10%)');
    }
  };

  const finalTotal = Math.max(0, totalPrice - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.streetAddress || !selectedProvinceName || !formData.phone) {
      setError('Vui lòng điền đầy đủ các trường thông tin giao hàng bắt buộc.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const detailedAddress = [
        formData.streetAddress,
        selectedWardName,
        selectedDistrictName,
        formData.apartment,
      ]
        .filter(Boolean)
        .join(', ');

      const orderPayload = {
        items: items.map((i) => {
          const prodId = typeof i.product === 'object' ? i.product._id : i.product;
          return {
            productId: String(prodId),
            quantity: Number(i.quantity),
            selectedAttributes: i.selectedAttributes || {},
          };
        }),
        shippingAddress: {
          fullName: formData.firstName,
          phone: formData.phone,
          address: detailedAddress,
          city: selectedProvinceName,
        },
        paymentMethod,
        totalPrice: finalTotal,
      };

      const res = await ordersApi.create(orderPayload);
      if (res.data && res.data.success) {
        const createdOrder = res.data.data;
        clearCart();

        // If online payment (VNPAY, MoMo, PayPal), request payment URL and redirect
        if (paymentMethod === 'VNPAY' || paymentMethod === 'MOMO' || paymentMethod === 'PAYPAL') {
          try {
            const payRes = await paymentsApi.createPaymentUrl({
              orderId: createdOrder._id,
            });

            if (payRes.data && payRes.data.data?.paymentUrl) {
              window.location.href = payRes.data.data.paymentUrl;
              return;
            }
          } catch (payErr: any) {
            const errMsg = payErr.response?.data?.message || 'Không thể kết nối cổng thanh toán';
            setError(`Đơn hàng #${createdOrder._id} đã được tạo thành công nhưng chưa thể mở cổng thanh toán (${errMsg}). Vui lòng vào mục "Đơn hàng của tôi" để theo dõi.`);
            return;
          }
        }

        // Default direct success routing for COD & Bank transfer
        navigate(`/order-success/${createdOrder._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/profile" className="hover:text-black transition-colors">{t('nav.manageAccount')}</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-black transition-colors">{t('cart.title')}</Link>
        <span>/</span>
        <span className="text-black font-medium">{t('checkout.title')}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <h1 className="text-3xl font-extrabold text-black tracking-tight">{t('checkout.title')}</h1>
        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Bảo mật thanh toán SSL 256-bit chuẩn quốc tế</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Billing Information */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-100">
            Thông Tin Giao Hàng & Người Nhận
          </h2>

          <div className="space-y-2">
            <label className="text-sm text-gray-700 font-medium">
              {t('checkout.firstName')}<span className="text-exclusive-red">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="w-full bg-exclusive-bg rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700 font-medium">{t('checkout.companyName')} (Không bắt buộc)</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Tên công ty hoặc tổ chức"
              className="w-full bg-exclusive-bg rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          {/* 3-Tier Administrative Divisions: Tỉnh/Thành - Quận/Huyện - Phường/Xã */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Tỉnh / Thành Phố */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700 font-medium">
                {t('checkout.city') || 'Tỉnh / Thành phố'}<span className="text-exclusive-red">*</span>
              </label>
              <select
                required
                value={selectedProvinceId}
                onChange={handleProvinceChange}
                className="w-full bg-exclusive-bg rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition cursor-pointer"
              >
                <option value="" disabled>-- Chọn Tỉnh / Thành phố --</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Quận / Huyện */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700 font-medium">
                Quận / Huyện<span className="text-exclusive-red">*</span>
              </label>
              <select
                required
                disabled={!selectedProvinceId}
                value={selectedDistrictId}
                onChange={handleDistrictChange}
                className="w-full bg-exclusive-bg rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">-- Chọn Quận / Huyện --</option>
                {districts.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 3. Phường / Xã */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700 font-medium">
                Phường / Xã<span className="text-exclusive-red">*</span>
              </label>
              <select
                required
                disabled={!selectedDistrictId}
                value={selectedWardId}
                onChange={handleWardChange}
                className="w-full bg-exclusive-bg rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">-- Chọn Phường / Xã --</option>
                {wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Số nhà, tên đường */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700 font-medium">
                {t('checkout.streetAddress') || 'Số nhà, tên đường'}<span className="text-exclusive-red">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Số 16, Đường Thanh Miếu..."
                value={formData.streetAddress}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                className="w-full bg-exclusive-bg rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700 font-medium">{t('checkout.apartment') || 'Tòa nhà, căn hộ (Không bắt buộc)'}</label>
            <input
              type="text"
              placeholder="Tòa nhà, số phòng, căn hộ (nếu có)"
              value={formData.apartment}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              className="w-full bg-exclusive-bg rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-700 font-medium">
                {t('checkout.phone')}<span className="text-exclusive-red">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="0337832186"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-exclusive-bg rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-700 font-medium">
                {t('checkout.email')}<span className="text-exclusive-red">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="contact@tuancute.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-exclusive-bg rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Save Info Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="saveInfo"
              checked={formData.saveInfo}
              onChange={(e) => setFormData({ ...formData, saveInfo: e.target.checked })}
              className="w-4 h-4 accent-exclusive-red rounded cursor-pointer"
            />
            <label htmlFor="saveInfo" className="text-sm text-gray-700 cursor-pointer select-none">
              {t('checkout.saveInfo')}
            </label>
          </div>
        </div>

        {/* Right Column: Order Summary & Payment Options */}
        <div className="lg:col-span-6 space-y-6 lg:pl-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-exclusive-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-100">
              Đơn Hàng Của Bạn
            </h2>

            {/* Order Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center justify-between gap-4 py-1.5 border-b border-gray-50 last:border-0">
                  <Link
                    to={`/product/${item.product.slug || item.product._id}`}
                    className="flex items-center gap-3 min-w-0 group cursor-pointer"
                    title="Xem chi tiết sản phẩm"
                  >
                    <img
                      src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                      alt={item.product.name}
                      className="w-12 h-12 object-contain bg-exclusive-bg rounded-lg p-1 flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="truncate">
                      <span className="text-xs sm:text-sm font-medium text-black group-hover:text-exclusive-red transition-colors block truncate">
                        {item.product.name}
                      </span>
                      <span className="text-xs text-gray-400">Số lượng: {item.quantity}</span>
                    </div>
                  </Link>
                  <span className="text-xs sm:text-sm font-semibold text-black flex-shrink-0">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Summary */}
            <div className="space-y-3 divide-y divide-gray-100 text-sm">
              <div className="flex items-center justify-between pt-2">
                <span className="text-gray-600">{t('cart.subtotal')}:</span>
                <span className="font-semibold text-black">{formatCurrency(totalPrice)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between pt-2 text-exclusive-red">
                  <span>{t('cart.discount')} (10%):</span>
                  <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-gray-600">{t('cart.shipping')}:</span>
                <span className="font-semibold text-emerald-600">{t('cart.shippingFree')}</span>
              </div>

              <div className="flex items-center justify-between pt-3 text-base">
                <span className="font-bold text-black">{t('cart.total')} thanh toán:</span>
                <span className="font-extrabold text-exclusive-red text-xl">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-bold text-gray-900 block">
                Chọn phương thức thanh toán:
              </label>

              {/* 1. VNPAY */}
              <div
                onClick={() => setPaymentMethod('VNPAY')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  paymentMethod === 'VNPAY'
                    ? 'border-exclusive-red bg-red-50/40 ring-2 ring-exclusive-red/20 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    id="pay_vnpay"
                    checked={paymentMethod === 'VNPAY'}
                    onChange={() => setPaymentMethod('VNPAY')}
                    className="w-4 h-4 accent-exclusive-red cursor-pointer"
                  />
                  <div>
                    <label htmlFor="pay_vnpay" className="text-sm font-bold text-black cursor-pointer block">
                      Cổng VNPAY-QR
                    </label>
                    <span className="text-[11px] text-gray-500 block">Quét mã QR, Thẻ ATM 40+ Ngân hàng, Visa, Master</span>
                  </div>
                </div>
                <div className="bg-white px-2 py-1 rounded border border-gray-100 flex-shrink-0">
                  <VnPayLogo className="h-4 w-auto" />
                </div>
              </div>

              {/* 2. MOMO */}
              <div
                onClick={() => setPaymentMethod('MOMO')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  paymentMethod === 'MOMO'
                    ? 'border-exclusive-red bg-red-50/40 ring-2 ring-exclusive-red/20 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    id="pay_momo"
                    checked={paymentMethod === 'MOMO'}
                    onChange={() => setPaymentMethod('MOMO')}
                    className="w-4 h-4 accent-exclusive-red cursor-pointer"
                  />
                  <div>
                    <label htmlFor="pay_momo" className="text-sm font-bold text-black cursor-pointer block">
                      Ví Điện Tử MoMo
                    </label>
                    <span className="text-[11px] text-gray-500 block">Thanh toán tức thì qua App MoMo trên điện thoại</span>
                  </div>
                </div>
                <div className="bg-white px-2 py-1 rounded border border-gray-100 flex-shrink-0">
                  <MomoLogo className="h-4 w-auto" />
                </div>
              </div>

              {/* 3. PAYPAL */}
              <div
                onClick={() => setPaymentMethod('PAYPAL')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  paymentMethod === 'PAYPAL'
                    ? 'border-exclusive-red bg-red-50/40 ring-2 ring-exclusive-red/20 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    id="pay_paypal"
                    checked={paymentMethod === 'PAYPAL'}
                    onChange={() => setPaymentMethod('PAYPAL')}
                    className="w-4 h-4 accent-exclusive-red cursor-pointer"
                  />
                  <div>
                    <label htmlFor="pay_paypal" className="text-sm font-bold text-black cursor-pointer block">
                      PayPal (Quốc Tế)
                    </label>
                    <span className="text-[11px] text-gray-500 block">Thanh toán an toàn qua tài khoản PayPal quốc tế</span>
                  </div>
                </div>
                <div className="bg-white px-2 py-1 rounded border border-gray-100 flex-shrink-0 font-bold text-blue-700 text-xs">
                  PayPal
                </div>
              </div>

              {/* 4. BANK TRANSFER */}
              <div
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-exclusive-red bg-red-50/40 ring-2 ring-exclusive-red/20 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    id="pay_bank"
                    checked={paymentMethod === 'BANK_TRANSFER'}
                    onChange={() => setPaymentMethod('BANK_TRANSFER')}
                    className="w-4 h-4 accent-exclusive-red cursor-pointer"
                  />
                  <div>
                    <label htmlFor="pay_bank" className="text-sm font-bold text-black cursor-pointer block">
                      Chuyển Khoản Ngân Hàng (VietQR)
                    </label>
                    <span className="text-[11px] text-gray-500 block">Chuyển khoản trực tiếp tới STK MB Bank của Shop</span>
                  </div>
                </div>
                <div className="bg-white px-2 py-1 rounded border border-gray-100 flex-shrink-0">
                  <VietQrLogo className="h-4 w-auto" />
                </div>
              </div>

              {/* 5. COD */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  paymentMethod === 'COD'
                    ? 'border-exclusive-red bg-red-50/40 ring-2 ring-exclusive-red/20 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    id="pay_cod"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 accent-exclusive-red cursor-pointer"
                  />
                  <div>
                    <label htmlFor="pay_cod" className="text-sm font-bold text-black cursor-pointer block">
                      Thanh Toán Khi Nhận Hàng (COD)
                    </label>
                    <span className="text-[11px] text-gray-500 block">Nhận hàng, kiểm tra đồ rồi mới thanh toán tiền mặt</span>
                  </div>
                </div>
                <div className="bg-white px-2 py-1 rounded border border-gray-100 flex-shrink-0">
                  <CodLogo className="h-4 w-auto" />
                </div>
              </div>
            </div>

            {/* Coupon Box */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Mã giảm giá (ví dụ: ASHASHOP)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black flex-1 uppercase font-mono"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-5 py-3 bg-black hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex-shrink-0"
              >
                Áp Dụng
              </button>
            </div>

            {/* Place Order Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-exclusive-red/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>
                  {loading
                    ? 'Đang Xử Lý Giao Dịch...'
                    : paymentMethod === 'COD' || paymentMethod === 'BANK_TRANSFER'
                    ? 'Hoàn Tất Đặt Hàng'
                    : `Thanh Toán Ngay Qua ${paymentMethod}`}
                </span>
                {!loading && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
