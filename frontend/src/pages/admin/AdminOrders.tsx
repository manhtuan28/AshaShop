import React, { useEffect, useState } from 'react';
import { ordersApi } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { formatPrice } from '../../components/common/ProductCard';
import { Clock, CheckCircle2, Truck, XCircle, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (selectedStatus) params.status = selectedStatus;
      const res = await ordersApi.getAllAdmin(params);
      setOrders(res.data.data.items || []);
    } catch (error) {
      console.error('Lỗi tải danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersApi.updateStatus(orderId, { orderStatus: newStatus });
      toast.success(`Cập nhật đơn sang ${newStatus} thành công`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
      }
    } catch (error: any) {
      toast.error('Lỗi cập nhật trạng thái đơn');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg flex items-center gap-1"><Clock className="w-3 h-3" /> Chờ xử lý</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Đã xác nhận</span>;
      case 'SHIPPING':
        return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg flex items-center gap-1"><Truck className="w-3 h-3" /> Đang giao</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Đã giao</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-lg flex items-center gap-1"><XCircle className="w-3 h-3" /> Đã hủy</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Quản Lý Đơn Hàng</h1>
          <p className="text-xs text-gray-500">Xem và cập nhật trạng thái đơn hàng của khách hàng</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý (PENDING)</option>
            <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
            <option value="SHIPPING">Đang giao hàng (SHIPPING)</option>
            <option value="DELIVERED">Đã giao thành công (DELIVERED)</option>
            <option value="CANCELLED">Đã hủy (CANCELLED)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Mã đơn</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Ngày đặt</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Cập nhật nhanh</th>
                <th className="p-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4 font-mono font-bold text-gray-500">#{o._id.slice(-6)}</td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{o.shippingAddress?.fullName}</p>
                      <p className="text-xs text-gray-400">{o.shippingAddress?.phone}</p>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 font-extrabold text-emerald-600">
                      {formatPrice(o.totalPrice)}
                    </td>
                    <td className="p-4">{getStatusBadge(o.orderStatus)}</td>
                    <td className="p-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateStatus(o._id, e.target.value as OrderStatus)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-700"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPING">SHIPPING</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900">
                  Chi Tiết Đơn Hàng #{selectedOrder._id}
                </h3>
                <p className="text-xs text-gray-400">
                  Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient info */}
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm bg-gray-50 p-4 rounded-2xl">
              <div>
                <span className="font-bold text-gray-500 block mb-1">Địa chỉ nhận hàng:</span>
                <p className="font-bold text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                <p className="text-gray-600">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}</p>
              </div>
              <div>
                <span className="font-bold text-gray-500 block mb-1">Thanh toán & Trạng thái:</span>
                <p>Phương thức: <strong>{selectedOrder.paymentMethod}</strong></p>
                <p>Trạng thái thanh toán: <strong>{selectedOrder.paymentStatus}</strong></p>
                <p className="mt-1">Trạng thái đơn: {getStatusBadge(selectedOrder.orderStatus)}</p>
              </div>
            </div>

            {/* Items list */}
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2">
                Danh sách sản phẩm
              </h4>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 pt-3 first:pt-0">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-400">Số lượng: x{item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Tổng tiền đơn hàng:</span>
              <span className="text-xl font-black text-emerald-600">
                {formatPrice(selectedOrder.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
