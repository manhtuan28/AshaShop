import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Package,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../services/api';
import { formatPrice } from '../../components/common/ProductCard';
import { useLanguageStore } from '../../store/useLanguageStore';
import { translateDynamic } from '../../i18n/translator';

export const AdminDashboard: React.FC = () => {
  const { currentLanguage } = useLanguageStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          ordersApi.getAdminStats(),
          ordersApi.getAllAdmin({ limit: 5 }),
        ]);
        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data.items || []);
      } catch (error) {
        console.error('Lỗi tải dữ liệu Dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8 font-poppins">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {translateDynamic('Tổng Quan Hoạt Động Cửa Hàng', currentLanguage)}
          </h1>
          <p className="text-sm text-slate-300">
            {translateDynamic('Theo dõi doanh thu bán hàng, trạng thái đơn hàng và kiểm soát hoạt động kinh doanh AshaShop Fashion', currentLanguage)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-semibold rounded-lg shadow transition-colors"
          >
            <span>{translateDynamic('Quản Lý Sản Phẩm', currentLanguage)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {translateDynamic('Tổng Doanh Thu', currentLanguage)}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {formatPrice(stats.totalRevenue)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {translateDynamic('Tổng Đơn Hàng', currentLanguage)}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {stats.totalOrders}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {translateDynamic('Chờ Xử Lý', currentLanguage)}
            </span>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">
              {stats.pendingOrders}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {translateDynamic('Tổng Số Sản Phẩm', currentLanguage)}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {stats.totalProducts}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900">
            {translateDynamic('Đơn Hàng Gần Đây', currentLanguage)}
          </h3>
          <Link to="/admin/orders" className="text-xs font-semibold text-exclusive-red hover:underline">
            {translateDynamic('Xem Tất Cả Đơn Hàng', currentLanguage)} →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">{translateDynamic('Mã Đơn', currentLanguage)}</th>
                <th className="p-3">{translateDynamic('Khách Hàng', currentLanguage)}</th>
                <th className="p-3">{translateDynamic('Số Điện Thoại', currentLanguage)}</th>
                <th className="p-3">{translateDynamic('Tổng Tiền', currentLanguage)}</th>
                <th className="p-3">{translateDynamic('Phương thức thanh toán', currentLanguage) || 'Payment'}</th>
                <th className="p-3">{translateDynamic('Trạng Thái', currentLanguage)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {translateDynamic('Chưa có đơn hàng nào.', currentLanguage)}
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-500">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="p-3 font-semibold text-slate-900">{order.shippingAddress?.fullName || 'Customer'}</td>
                    <td className="p-3 text-slate-600">{order.shippingAddress?.phone || 'N/A'}</td>
                    <td className="p-3 font-bold text-exclusive-red">{formatPrice(order.totalPrice)}</td>
                    <td className="p-3 text-slate-600">{order.paymentMethod}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg">
                        {translateDynamic(order.orderStatus, currentLanguage)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

