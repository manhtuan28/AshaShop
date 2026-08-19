import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, ShoppingCart, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSiteConfigStore } from '../store/useSiteConfigStore';

export const TermsOfUse: React.FC = () => {
  const { t } = useLanguageStore();
  const { config } = useSiteConfigStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <span className="text-black font-medium">Điều Khoản Sử Dụng</span>
      </nav>

      <div className="space-y-4 border-b border-gray-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-exclusive-red text-xs font-bold rounded-full">
          <FileCheck className="w-4 h-4" />
          <span>Quy Định & Điều Khoản Mua Sắm</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          {t('footer.termsOfUse') || 'Điều Khoản Sử Dụng'}
        </h1>
        <p className="text-xs text-gray-500">Áp dụng cho tất cả các giao dịch mua sắm tại {config.brandName}{config.brandHighlight}</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-exclusive-red" />
            <span>1. Quy trình đặt hàng & Thanh toán</span>
          </h2>
          <p>
            Khách hàng có thể lựa chọn các hình thức thanh toán linh hoạt: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng trực tiếp hoặc thẻ ghi nợ/tín dụng. Đơn hàng được xác nhận sau khi hệ thống ghi nhận thành công và gửi mã vận đơn qua email hoặc tin nhắn.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-exclusive-red" />
            <span>2. Chính sách đổi trả & Hoàn tiền trong 30 ngày</span>
          </h2>
          <p>
            Chúng tôi hỗ trợ đổi size và đổi mẫu miễn phí trong vòng 30 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem mác, chưa qua sử dụng hoặc giặt ủi.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-exclusive-red" />
            <span>3. Quyền và trách nhiệm của khách hàng</span>
          </h2>
          <p>
            Khách hàng có trách nhiệm cung cấp chính xác địa chỉ nhận hàng và số điện thoại liên hệ để đảm bảo đơn hàng được giao đúng hạn. Khách hàng có quyền kiểm tra hàng trước khi thanh toán đối với hình thức COD.
          </p>
        </section>
      </div>
    </div>
  );
};
