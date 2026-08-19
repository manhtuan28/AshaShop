import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { ordersApi } from '../services/api';
import { Order } from '../types';
import { useLanguageStore } from '../store/useLanguageStore';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguageStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await ordersApi.getMyOrders();
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status: string = 'PENDING') => {
    const s = status.toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">Delivered</span>;
      case 'SHIPPING':
      case 'SHIPPED':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">Shipped</span>;
      case 'CONFIRMED':
      case 'PROCESSING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">Processing</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-xs font-bold">Pending</span>;
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await ordersApi.cancel(id);
      if (res.data.success) {
        setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: 'CANCELLED' } : o));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-8">
      
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/profile" className="hover:text-black transition-colors">{t('nav.manageAccount')}</Link>
        <span>/</span>
        <span className="text-black font-medium">{t('orders.title')}</span>
      </nav>

      <h1 className="text-3xl font-bold text-black tracking-wide">{t('orders.title')}</h1>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-exclusive-bg rounded p-8 space-y-4">
          <Package className="w-16 h-16 text-gray-400 mx-auto" />
          <h3 className="text-xl font-bold text-black">No Orders Placed Yet</h3>
          <p className="text-sm text-gray-500">You haven't placed any orders with us yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('cart.returnToShop')}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatus = order.orderStatus || (order as any).status || 'PENDING';
            const total = order.totalPrice || (order as any).totalAmount || 0;

            return (
              <div
                key={order._id}
                className="bg-white shadow-exclusive-sm border border-gray-100 rounded p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 text-sm">
                  <div>
                    <span className="font-semibold text-black">{t('orders.orderId')}: </span>
                    <span className="font-mono text-gray-600 font-bold">#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                  </div>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                {/* Items in this order */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-exclusive-bg rounded p-1"
                        />
                        <div>
                          <p className="text-sm font-medium text-black line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">{t('cart.quantity')}: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-black">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total and Cancel Option */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-600">{t('orders.totalAmount')}: </span>
                    <span className="font-bold text-exclusive-red text-base">{formatCurrency(total)}</span>
                  </div>

                  {(currentStatus.toUpperCase() === 'PENDING') && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold rounded transition-colors"
                    >
                      {t('orders.cancelOrder')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
