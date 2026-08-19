import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { ordersApi } from '../services/api';

export const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name || '',
    companyName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    phone: user?.phone || '',
    email: user?.email || '',
    saveInfo: true,
  });

  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cod'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'EXCLUSIVE10' || couponCode.trim().toUpperCase() === 'ASHASHOP') {
      setDiscountAmount(totalPrice * 0.1);
    } else {
      alert('Coupon code invalid! Try: EXCLUSIVE10');
    }
  };

  const finalTotal = Math.max(0, totalPrice - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.streetAddress || !formData.city || !formData.phone) {
      setError('Please fill in all required billing information.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderPayload = {
        items: items.map(i => ({
          product: i.product._id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images?.[0] || '',
          attributes: i.selectedAttributes || {}
        })),
        shippingAddress: {
          fullName: formData.firstName,
          phone: formData.phone,
          addressLine: `${formData.apartment ? formData.apartment + ', ' : ''}${formData.streetAddress}`,
          city: formData.city,
        },
        paymentMethod: paymentMethod,
        subtotal: totalPrice,
        discount: discountAmount,
        shippingFee: 0,
        totalAmount: finalTotal,
      };

      const res = await ordersApi.create(orderPayload);
      if (res.data.success) {
        clearCart();
        navigate(`/order-success/${res.data.data._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-poppins space-y-4">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-exclusive-red text-white rounded">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-10">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">Account</Link>
        <span>/</span>
        <Link to="/profile" className="hover:text-black transition-colors">My Account</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-black transition-colors">View Cart</Link>
        <span>/</span>
        <span className="text-black font-medium">CheckOut</span>
      </nav>

      <h1 className="text-3xl font-bold text-black tracking-wide">Billing Details</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      {/* Main Grid: Billing Form (Left) & Order Summary (Right) */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Billing Form Inputs */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">
              First Name<span className="text-exclusive-red">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">
              Street Address<span className="text-exclusive-red">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="House number and street name"
              value={formData.streetAddress}
              onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">Apartment, floor, etc. (optional)</label>
            <input
              type="text"
              value={formData.apartment}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">
              Town/City<span className="text-exclusive-red">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">
              Phone Number<span className="text-exclusive-red">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium">
              Email Address<span className="text-exclusive-red">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
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
            <label htmlFor="saveInfo" className="text-sm text-black cursor-pointer">
              Save this information for faster check-out next time
            </label>
          </div>

        </div>

        {/* Right Column: Order Summary & Payment */}
        <div className="lg:col-span-6 space-y-8 lg:pl-6">
          
          {/* Order Items List */}
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.product._id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                    alt={item.product.name}
                    className="w-12 h-12 object-contain bg-exclusive-bg rounded p-1 flex-shrink-0"
                  />
                  <span className="text-sm font-medium text-black truncate">
                    {item.product.name} x {item.quantity}
                  </span>
                </div>
                <span className="text-sm font-semibold text-black flex-shrink-0">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Calculations Summary */}
          <div className="space-y-3 divide-y divide-gray-200 text-sm">
            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-black">{formatCurrency(totalPrice)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between pt-2 text-exclusive-red">
                <span>Discount:</span>
                <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold text-exclusive-green">Free</span>
            </div>

            <div className="flex items-center justify-between pt-3 text-base">
              <span className="font-bold text-black">Total:</span>
              <span className="font-bold text-exclusive-red text-xl">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Payment Methods (Figma Radio Style) */}
          <div className="space-y-4 pt-2">
            
            {/* Bank Card Radio */}
            <div 
              onClick={() => setPaymentMethod('bank')}
              className="flex items-center justify-between p-3 rounded border border-gray-200 cursor-pointer hover:border-black transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  id="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                <label htmlFor="bank" className="text-sm font-medium text-black cursor-pointer">
                  Bank / Credit Card
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">VISA</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded">Mastercard</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-pink-100 text-pink-800 rounded">bKash</span>
              </div>
            </div>

            {/* Cash on Delivery Radio */}
            <div 
              onClick={() => setPaymentMethod('cod')}
              className="flex items-center justify-between p-3 rounded border border-gray-200 cursor-pointer hover:border-black transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  id="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                <label htmlFor="cod" className="text-sm font-medium text-black cursor-pointer">
                  Cash on delivery
                </label>
              </div>
              <Truck className="w-5 h-5 text-gray-500" />
            </div>

          </div>

          {/* Coupon Input */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border border-black rounded px-4 py-2.5 text-sm focus:outline-none flex-1"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-6 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium text-sm rounded transition-colors"
            >
              Apply Coupon
            </button>
          </div>

          {/* Place Order Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium text-base rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};
