import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Home, Calendar, CreditCard, Truck } from 'lucide-react';
import { ordersApi } from '../services/api';
import { Order } from '../types';
import { formatPrice } from '../components/common/ProductCard';

export const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ordersApi.getById(id).then((res) => {
        setOrder(res.data.data);
      }).finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-gray-900">Đặt Hàng Thành Công!</h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Cảm ơn bạn đã mua hàng tại AshaShop. Mã đơn hàng của bạn là{' '}
          <strong className="text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">{id}</strong>
        </p>
      </div>

      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm text-left space-y-6">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" /> Chi Tiết Đơn Hàng
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
            <div>
              <span className="font-semibold block text-gray-400">Người nhận:</span>
              <p className="font-bold text-gray-800">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
            </div>

            <div>
              <span className="font-semibold block text-gray-400">Thanh toán:</span>
              <p className="font-bold text-gray-800">{order.paymentMethod}</p>
              <p className="mt-1">
                Trạng thái: <span className="font-bold text-emerald-600">{order.orderStatus}</span>
              </p>
              <p className="font-bold text-emerald-600 mt-2 text-base">
                Tổng tiền: {formatPrice(order.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>Theo Dõi Đơn Hàng</span>
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-2xl transition flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Về Trang Chủ</span>
        </Link>
      </div>
    </div>
  );
};
