import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Package,
  CheckCircle2,
  TrendingUp,
  Server,
  Zap,
} from 'lucide-react';
import { ordersApi } from '../../services/api';
import { formatPrice } from '../../components/common/ProductCard';

export const AdminDashboard: React.FC = () => {
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
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>HỆ THỐNG ĐANG HOẠT ĐỘNG TỐT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Bảng Điều Khiển Quản Trị</h1>
          <p className="text-sm text-slate-300">
            Tổng quan hiệu suất bán hàng, trạng thái đơn và kiểm soát hệ thống AshaShop
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs">
          <Server className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="font-bold text-white">MongoDB & Redis Cache</p>
            <p className="text-slate-400">Kết nối ổn định</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng Doanh Thu</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {formatPrice(stats.totalRevenue)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng Đơn Hàng</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {stats.totalOrders} <span className="text-xs font-normal text-gray-400">đơn</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chờ Xử Lý</span>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {stats.pendingOrders} <span className="text-xs font-normal text-gray-400">đơn</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sản Phẩm Trong Kho</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {stats.totalProducts} <span className="text-xs font-normal text-gray-400">mặt hàng</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-extrabold text-lg text-gray-900">Đơn Hàng Gần Đây</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-100">
              <tr>
                <th className="p-3">Mã đơn</th>
                <th className="p-3">Khách hàng</th>
                <th className="p-3">Số điện thoại</th>
                <th className="p-3">Tổng tiền</th>
                <th className="p-3">Phương thức</th>
                <th className="p-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/80 transition">
                  <td className="p-3 font-mono font-bold text-gray-500">#{order._id.slice(-6)}</td>
                  <td className="p-3 font-semibold text-gray-900">{order.shippingAddress?.fullName}</td>
                  <td className="p-3 text-gray-600">{order.shippingAddress?.phone}</td>
                  <td className="p-3 font-bold text-emerald-600">{formatPrice(order.totalPrice)}</td>
                  <td className="p-3 text-gray-600">{order.paymentMethod}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg">
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
