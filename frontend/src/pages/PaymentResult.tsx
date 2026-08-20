import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  Home,
  ArrowRight,
  RefreshCw,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import { paymentsApi } from '../services/api';
import { formatPrice } from '../components/common/ProductCard';
import {
  VnPayLogo,
  MomoLogo,
  VietQrLogo,
  VisaLogo,
  MastercardLogo,
} from '../components/common/PaymentLogos';

export const PaymentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [method, setMethod] = useState<string>('VNPAY');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Detect Payment Gateway
    let detectedMethod = 'VNPAY';
    if (
      location.pathname.includes('momo') ||
      params.partnerCode === 'MOMO' ||
      params.orderId?.includes('MOMO')
    ) {
      detectedMethod = 'MOMO';
    } else if (
      location.pathname.includes('paypal') ||
      params.token ||
      params.PayerID
    ) {
      detectedMethod = 'PAYPAL';
    } else if (
      location.pathname.includes('vnpay') ||
      params.vnp_ResponseCode ||
      params.vnp_TxnRef
    ) {
      detectedMethod = 'VNPAY';
    }

    setMethod(detectedMethod);

    const verify = async () => {
      try {
        setLoading(true);
        const res = await paymentsApi.verifyPayment({
          method: detectedMethod,
          params,
        });

        if (res.data && res.data.success) {
          setSuccess(true);
          setOrderId(res.data.data?.orderId || res.data.data?.order?._id || params.orderId || params.vnp_TxnRef || '');
          setOrder(res.data.data?.order);
          setMessage(res.data.data?.message || 'Thanh toán thành công!');
        } else {
          setSuccess(false);
          setOrderId(res.data.data?.orderId || params.orderId || params.vnp_TxnRef || '');
          setMessage(res.data.data?.message || 'Thanh toán không thành công hoặc đã bị hủy.');
        }
      } catch (err: any) {
        setSuccess(false);
        const errMessage =
          err.response?.data?.message || 'Có lỗi xảy ra trong quá trình xác thực giao dịch.';
        setMessage(errMessage);
        setOrderId(params.orderId || params.vnp_TxnRef || '');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [location]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 font-poppins min-h-[60vh] flex flex-col justify-center">
      {loading ? (
        <div className="space-y-4 py-12">
          <div className="w-16 h-16 border-4 border-exclusive-red border-t-transparent rounded-full animate-spin mx-auto flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-exclusive-red animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Đang xác thực kết quả thanh toán...
          </h2>
          <p className="text-sm text-gray-500">
            Vui lòng không đóng trình duyệt hoặc quay lại trang trước.
          </p>
        </div>
      ) : success ? (
        <div className="space-y-8">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 ring-8 ring-emerald-50 animate-bounce">
            <CheckCircle2 className="w-14 h-14" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Giao Dịch Thành Công
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Cảm Ơn Bạn Đã Thanh Toán!
            </h1>
            <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
              Đơn hàng của bạn đã được thanh toán và hệ thống đang tiến hành đóng gói vận chuyển.
            </p>
          </div>

          {/* Transaction Summary Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-md text-left space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-sm font-semibold text-gray-500">Cổng thanh toán:</span>
              <div className="flex items-center gap-2">
                {method === 'VNPAY' && <VnPayLogo className="h-6 w-auto" />}
                {method === 'MOMO' && <MomoLogo className="h-6 w-auto" />}
                {method === 'PAYPAL' && (
                  <span className="font-bold text-blue-700 text-sm">PayPal Official</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
              <div>
                <span className="text-gray-400 block text-xs">Mã đơn hàng:</span>
                <p className="font-mono font-bold text-gray-900 text-sm mt-0.5">
                  #{orderId || 'ASHA-' + Date.now()}
                </p>
              </div>

              <div>
                <span className="text-gray-400 block text-xs">Trạng thái thanh toán:</span>
                <p className="font-bold text-emerald-600 text-sm mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  ĐÃ THANH TOÁN (PAID)
                </p>
              </div>

              {order?.totalPrice && (
                <div>
                  <span className="text-gray-400 block text-xs">Tổng số tiền:</span>
                  <p className="font-bold text-exclusive-red text-base mt-0.5">
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>
              )}

              <div>
                <span className="text-gray-400 block text-xs">Thời gian thực hiện:</span>
                <p className="font-medium text-gray-800 text-xs mt-0.5">
                  {new Date().toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Xem Lịch Sử Đơn Hàng</span>
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-exclusive-bg hover:bg-gray-200 text-black font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tiếp Tục Mua Sắm</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Failure Icon */}
          <div className="w-24 h-24 bg-red-50 text-exclusive-red rounded-full flex items-center justify-center mx-auto shadow-xl shadow-red-500/10 ring-8 ring-red-50">
            <XCircle className="w-14 h-14" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Thanh Toán Chưa Hoàn Tất
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Giao Dịch Bị Hủy Hoặc Thất Bại
            </h1>
            <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
              {message || 'Giao dịch qua cổng thanh toán chưa được xác nhận. Vui lòng thử lại hoặc chọn hình thức khác.'}
            </p>
          </div>

          {orderId && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 max-w-md mx-auto">
              <span>Mã đơn hàng liên quan: </span>
              <strong className="font-mono text-black">#{orderId}</strong>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-8 py-3.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-semibold rounded-xl transition-all shadow-lg shadow-exclusive-red/20 flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Xem Chi Tiết Đơn Hàng</span>
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-exclusive-bg hover:bg-gray-200 text-black font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Về Bộ Sưu Tập</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
