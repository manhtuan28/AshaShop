import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, XCircle, Truck, AlertCircle } from 'lucide-react';
import { ordersApi } from '../services/api';
import { Order, OrderStatus } from '../types';
import { formatPrice } from '../components/common/ProductCard';
import toast from 'react-hot-toast';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getMyOrders();
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    try {
      await ordersApi.cancel(orderId);
      toast.success('Hủy đơn hàng thành công');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Chờ xử lý</span>;
      case 'CONFIRMED':
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Đã xác nhận</span>;
      case 'SHIPPING':
        return <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Đang giao hàng</span>;
      case 'DELIVERED':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Đã giao thành công</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-lg flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Đã hủy</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Đơn Hàng Của Tôi
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi và quản lý lịch sử mua hàng tại AshaShop
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-40 border border-gray-100" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 space-y-4">
          <Package className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">Bạn chưa có đơn hàng nào</h3>
          <p className="text-sm text-gray-500">
            Các đơn hàng bạn đặt sẽ hiển thị danh sách tại đây.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition text-sm"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-gray-400">MÃ ĐƠN: #{order._id}</span>
                  <p className="text-xs text-gray-500">
                    Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.orderStatus)}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-50">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-50"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">Số lượng: x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                <div className="text-xs text-gray-500">
                  <span>Giao tới: <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.phone}) - {order.shippingAddress.address}, {order.shippingAddress.city}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">Tổng tiền:</span>
                    <span className="text-base font-black text-emerald-600">{formatPrice(order.totalPrice)}</span>
                  </div>
                  {order.orderStatus === 'PENDING' && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition"
                    >
                      Hủy Đơn Hàng
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
