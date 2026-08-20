import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Package,
  ArrowLeft,
  Star,
  XCircle,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  ChevronRight,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersApi } from '../services/api';
import { Order } from '../types';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCartStore } from '../store/useCartStore';

type TabType = 'ALL' | 'PENDING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

interface OrderHistoryProps {
  defaultTab?: TabType;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ defaultTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const { addItem } = useCartStore();

  const queryTab = searchParams.get('tab')?.toUpperCase() as TabType;
  const initialTab: TabType = defaultTab || (queryTab === 'CANCELLED' ? 'CANCELLED' : queryTab || 'ALL');

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync tab with URL search parameter
  useEffect(() => {
    if (queryTab && ['ALL', 'PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED'].includes(queryTab)) {
      setActiveTab(queryTab as TabType);
    }
  }, [queryTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'ALL') {
      searchParams.delete('tab');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab: tab.toLowerCase() });
    }
  };

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleCancelOrder = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    try {
      const res = await ordersApi.cancel(id);
      if (res.data.success) {
        toast.success('Đã hủy đơn hàng thành công');
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, orderStatus: 'CANCELLED' } : o))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể hủy đơn hàng này.');
    }
  };

  const handleReorder = (order: Order) => {
    let count = 0;
    order.items.forEach((item) => {
      addItem(
        {
          _id: typeof item.product === 'object' ? (item.product as any)._id : item.product,
          name: item.name,
          price: item.price,
          images: [item.image],
          category: '' as any,
          stock: 99,
          slug: '',
          description: '',
          isFeatured: false,
          rating: 5,
          numReviews: 0,
        },
        item.quantity,
        item.selectedAttributes
      );
      count += item.quantity;
    });
    toast.success(`Đã thêm ${count} sản phẩm vào giỏ hàng!`);
    navigate('/cart');
  };

  // Counts for each tab
  const countAll = orders.length;
  const countPending = orders.filter(
    (o) => (o.orderStatus || (o as any).status || 'PENDING').toUpperCase() === 'PENDING'
  ).length;
  const countShipping = orders.filter((o) => {
    const s = (o.orderStatus || (o as any).status || '').toUpperCase();
    return s === 'SHIPPING' || s === 'SHIPPED' || s === 'CONFIRMED' || s === 'PROCESSING';
  }).length;
  const countDelivered = orders.filter(
    (o) => (o.orderStatus || (o as any).status || '').toUpperCase() === 'DELIVERED'
  ).length;
  const countCancelled = orders.filter(
    (o) => (o.orderStatus || (o as any).status || '').toUpperCase() === 'CANCELLED'
  ).length;

  // Filter orders by active tab
  const filteredOrders = orders.filter((order) => {
    const s = (order.orderStatus || (order as any).status || 'PENDING').toUpperCase();
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return s === 'PENDING';
    if (activeTab === 'SHIPPING') return s === 'SHIPPING' || s === 'SHIPPED' || s === 'CONFIRMED' || s === 'PROCESSING';
    if (activeTab === 'DELIVERED') return s === 'DELIVERED';
    if (activeTab === 'CANCELLED') return s === 'CANCELLED';
    return true;
  });

  const getStatusBadge = (status: string = 'PENDING') => {
    const s = status.toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã Giao Thành Công
          </span>
        );
      case 'SHIPPING':
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold shadow-sm">
            <Truck className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            Đang Vận Chuyển
          </span>
        );
      case 'CONFIRMED':
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold shadow-sm">
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            Đang Xử Lý Đơn
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Đã Hủy Đơn Hàng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-full text-xs font-bold shadow-sm">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Chờ Xác Nhận
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-8 animate-fade-in">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/profile" className="hover:text-black transition-colors">{t('nav.manageAccount')}</Link>
        <span>/</span>
        <span className="text-black font-semibold">
          {activeTab === 'CANCELLED' ? 'Đơn Hàng Đã Hủy' : t('orders.title')}
        </span>
      </nav>

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            {activeTab === 'CANCELLED' ? (
              <>
                <XCircle className="w-7 h-7 text-exclusive-red" />
                <span>Đơn Hàng Đã Hủy Của Tôi</span>
              </>
            ) : (
              <>
                <Package className="w-7 h-7 text-slate-800" />
                <span>Quản Lý Đơn Hàng Của Tôi</span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeTab === 'CANCELLED'
              ? 'Danh sách tất cả các đơn hàng bạn đã thực hiện yêu cầu hủy giao dịch'
              : 'Theo dõi tiến trình xử lý, trạng thái giao vận và lịch sử mua sắm chi tiết'}
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl shadow transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>

      {/* SEPARATED STATUS TABS */}
      <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1 overflow-x-auto">
        
        <button
          onClick={() => handleTabChange('ALL')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-white text-black shadow-sm'
              : 'text-slate-600 hover:text-black hover:bg-white/60'
          }`}
        >
          <span>Tất Cả</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {countAll}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('PENDING')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'PENDING'
              ? 'bg-white text-black shadow-sm'
              : 'text-slate-600 hover:text-black hover:bg-white/60'
          }`}
        >
          <span>Chờ Xác Nhận</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'PENDING' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {countPending}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('SHIPPING')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'SHIPPING'
              ? 'bg-white text-black shadow-sm'
              : 'text-slate-600 hover:text-black hover:bg-white/60'
          }`}
        >
          <span>Đang Vận Chuyển</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'SHIPPING' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {countShipping}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('DELIVERED')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'DELIVERED'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-black hover:bg-white/60'
          }`}
        >
          <span>Đã Giao Hàng</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'DELIVERED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {countDelivered}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('CANCELLED')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'CANCELLED'
              ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
              : 'text-red-600 hover:text-red-700 hover:bg-red-50'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Đơn Đã Hủy</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'CANCELLED' ? 'bg-white text-red-600 font-extrabold' : 'bg-red-100 text-red-700'}`}>
            {countCancelled}
          </span>
        </button>

      </div>

      {/* ORDERS LIST CONTAINER */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl border border-slate-200"></div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 space-y-4">
          {activeTab === 'CANCELLED' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Không có đơn hàng nào bị hủy</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Tất cả các đơn hàng của bạn đều đang được xử lý hoặc giao hàng thành công tốt đẹp.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Không tìm thấy đơn hàng nào</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Bạn chưa có đơn hàng nào trong mục này. Khám phá ngay các bộ sưu tập thời trang cao cấp của AshaShop!
              </p>
            </>
          )}

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-bold rounded-xl transition-all shadow-md shadow-exclusive-red/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Khám phá sản phẩm ngay</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const currentStatus = order.orderStatus || (order as any).status || 'PENDING';
            const total = order.totalPrice || (order as any).totalAmount || 0;
            const isCancelled = currentStatus.toUpperCase() === 'CANCELLED';
            const isDelivered = currentStatus.toUpperCase() === 'DELIVERED';
            const isPending = currentStatus.toUpperCase() === 'PENDING';

            return (
              <div
                key={order._id}
                className={`bg-white rounded-2xl p-6 sm:p-7 space-y-5 transition-all ${
                  isCancelled
                    ? 'border-2 border-red-100 shadow-sm bg-red-50/20'
                    : 'border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Order Top Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 text-sm">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">Mã Đơn Hàng:</span>
                      <span className="font-mono text-slate-900 font-extrabold bg-slate-100 px-2.5 py-0.5 rounded-md">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Ngày đặt:{' '}
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}{' '}
                      - {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                {/* Cancelled Banner info */}
                {isCancelled && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                    <div>
                      <span className="font-bold">Đơn hàng này đã được hủy giao dịch thành công.</span>
                      <p className="text-red-600 mt-0.5">
                        Bạn có thể nhấn nút "Mua Lại Đơn Này" bên dưới để nhanh chóng đặt lại các sản phẩm này.
                      </p>
                    </div>
                  </div>
                )}

                {/* Items in this order */}
                <div className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => {
                    const attrs = item.selectedAttributes || {};
                    const attrString = Object.entries(attrs)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ');

                    return (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={
                              item.image ||
                              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80'
                            }
                            alt={item.name}
                            className="w-14 h-14 object-cover bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0"
                          />
                          <div className="space-y-0.5">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{item.name}</p>
                            {attrString && (
                              <p className="text-[11px] text-slate-500 font-medium">Phân loại: {attrString}</p>
                            )}
                            <p className="text-xs text-slate-400">Số lượng: x{item.quantity}</p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {formatCurrency(item.price)} / sp
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total and Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="text-sm">
                    <span className="text-slate-500">Tổng thanh toán: </span>
                    <span className="font-extrabold text-exclusive-red text-lg">
                      {formatCurrency(total)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    
                    {/* Re-order button for cancelled orders or delivered orders */}
                    {(isCancelled || isDelivered) && (
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Mua Lại Đơn Này</span>
                      </button>
                    )}

                    {/* Review Button for Delivered Orders */}
                    {isDelivered && (
                      <Link
                        to="/my-reviews"
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-amber-500/20"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Đánh Giá Sản Phẩm</span>
                      </Link>
                    )}

                    {/* Cancel button for Pending orders */}
                    {isPending && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Hủy Đơn Hàng
                      </button>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
