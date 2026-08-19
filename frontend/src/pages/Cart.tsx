import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../store/useLanguageStore';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'EXCLUSIVE10' || couponCode.trim().toUpperCase() === 'ASHASHOP') {
      const discount = totalPrice * 0.1;
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else {
      alert('Coupon code invalid! Try: EXCLUSIVE10 or ASHASHOP');
    }
  };

  const finalTotal = Math.max(0, totalPrice - discountAmount);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-poppins space-y-6">
        <div className="w-20 h-20 bg-exclusive-bg rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-black">{t('cart.empty')}</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          {t('cart.emptyDesc')}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('cart.returnToShop')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-10">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <span className="text-black font-medium">{t('cart.title')}</span>
      </nav>

      {/* Cart Table */}
      <div className="space-y-6">
        
        {/* Table Header Card */}
        <div className="bg-white shadow-exclusive-sm border border-gray-100 rounded px-6 py-4 grid grid-cols-12 text-sm font-semibold text-black hidden sm:grid">
          <span className="col-span-5">{t('cart.product')}</span>
          <span className="col-span-2 text-center">{t('cart.price')}</span>
          <span className="col-span-3 text-center">{t('cart.quantity')}</span>
          <span className="col-span-2 text-right">{t('cart.subtotal')}</span>
        </div>

        {/* Cart Item Rows */}
        <div className="space-y-4">
          {items.map((item) => {
            const itemSubtotal = item.product.price * item.quantity;
            return (
              <div
                key={item.product._id}
                className="bg-white shadow-exclusive-sm border border-gray-100 rounded px-4 sm:px-6 py-4 flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 relative group"
              >
                {/* Product Column */}
                <div className="col-span-5 flex items-center gap-4 w-full">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                      alt={item.product.name}
                      className="w-14 h-14 object-contain bg-exclusive-bg rounded p-1"
                    />
                    <button
                      onClick={() => removeItem(item.product._id)}
                      title="Remove product"
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-exclusive-red text-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/product/${item.product.slug || item.product._id}`}
                      className="text-sm font-medium text-black hover:text-exclusive-red transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    {item.selectedAttributes?.size && (
                      <span className="text-xs text-gray-500">Size: {item.selectedAttributes.size}</span>
                    )}
                  </div>
                </div>

                {/* Price Column */}
                <div className="col-span-2 text-center text-sm font-medium w-full sm:w-auto flex sm:block justify-between">
                  <span className="sm:hidden text-gray-500">{t('cart.price')}:</span>
                  <span>{formatCurrency(item.product.price)}</span>
                </div>

                {/* Quantity Column */}
                <div className="col-span-3 flex justify-center w-full sm:w-auto">
                  <div className="flex items-center border border-gray-300 rounded px-2 py-1 gap-3">
                    <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                    <div className="flex flex-col">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="text-xs font-bold text-gray-600 hover:text-black leading-none"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                        className="text-xs font-bold text-gray-600 hover:text-black leading-none mt-1"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotal Column */}
                <div className="col-span-2 text-right text-sm font-semibold text-black w-full sm:w-auto flex sm:block justify-between">
                  <span className="sm:hidden text-gray-500">{t('cart.subtotal')}:</span>
                  <span>{formatCurrency(itemSubtotal)}</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Action Buttons: Return To Shop & Update Cart */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-3 border border-black hover:bg-black hover:text-white font-medium text-sm rounded transition-colors text-center"
          >
            {t('cart.returnToShop')}
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-8 py-3 border border-black hover:bg-black hover:text-white font-medium text-sm rounded transition-colors"
          >
            {t('cart.updateCart')}
          </button>
        </div>

      </div>

      {/* Bottom Section: Coupon Code & Cart Total */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
        
        {/* Left Coupon Input */}
        <div className="lg:col-span-6">
          <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder={t('cart.couponPlaceholder')}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border border-black rounded px-6 py-3 text-sm focus:outline-none flex-1"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium text-sm rounded transition-colors flex-shrink-0"
            >
              {t('cart.applyCoupon')}
            </button>
          </form>
          {couponApplied && (
            <p className="text-xs text-exclusive-green font-medium mt-2">
              ✓ Coupon applied: 10% discount (-{formatCurrency(discountAmount)})
            </p>
          )}
        </div>

        {/* Right Cart Total Box */}
        <div className="lg:col-span-6 border-2 border-black rounded p-6 sm:p-8 space-y-4">
          <h3 className="font-bold text-lg text-black">{t('cart.cartTotal')}</h3>
          
          <div className="space-y-3 divide-y divide-gray-200 text-sm">
            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-600">{t('cart.subtotal')}:</span>
              <span className="font-semibold text-black">{formatCurrency(totalPrice)}</span>
            </div>

            {couponApplied && (
              <div className="flex items-center justify-between pt-2 text-exclusive-red">
                <span>{t('cart.discount')}</span>
                <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-600">{t('cart.shipping')}</span>
              <span className="font-semibold text-exclusive-green">{t('cart.shippingFree')}</span>
            </div>

            <div className="flex items-center justify-between pt-3 text-base">
              <span className="font-bold text-black">{t('cart.total')}</span>
              <span className="font-bold text-exclusive-red text-lg">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium text-sm rounded transition-colors"
            >
              {t('cart.proceedCheckout')}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
