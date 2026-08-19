import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSiteConfigStore } from '../store/useSiteConfigStore';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useLanguageStore();
  const { config } = useSiteConfigStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <span className="text-black font-medium">Chính Sách Bảo Mật</span>
      </nav>

      <div className="space-y-4 border-b border-gray-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-exclusive-red text-xs font-bold rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Bảo Vệ Quyền Riêng Tư & Dữ Liệu</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          {t('footer.privacyPolicy') || 'Chính Sách Bảo Mật'}
        </h1>
        <p className="text-xs text-gray-500">Cập nhật lần cuối: Ngày 19 Tháng 08 Năm 2026</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-exclusive-red" />
            <span>1. Mục đích thu thập thông tin cá nhân</span>
          </h2>
          <p>
            {config.brandName}{config.brandHighlight} thu thập thông tin khách hàng nhằm phục vụ cho các mục đích:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Xử lý và giao hàng tận nơi cho các đơn hàng quý khách đã đặt.</li>
            <li>Cung cấp dịch vụ chăm sóc khách hàng, tư vấn size và hỗ trợ đổi trả hàng.</li>
            <li>Thông báo về các chương trình ưu đãi, mã giảm giá và bộ sưu tập thời trang mới nhất.</li>
            <li>Nâng cao trải nghiệm người dùng và bảo mật hệ thống thanh toán.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-exclusive-red" />
            <span>2. Phạm vi thu thập thông tin</span>
          </h2>
          <p>
            Thông tin chúng tôi thu thập bao gồm: Họ và tên, số điện thoại liên hệ, địa chỉ email, địa chỉ nhận hàng và lịch sử đơn hàng của quý khách. Chúng tôi tuyệt đối <strong>không lưu trữ thông tin mật khẩu ngân hàng hoặc mã CVV thẻ tín dụng</strong> trên máy chủ.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-exclusive-red" />
            <span>3. Cam kết bảo mật thông tin</span>
          </h2>
          <p>
            Mọi thông tin cá nhân của khách hàng trên hệ thống được mã hóa bằng chuẩn bảo mật SSL/TLS cao cấp. Chúng tôi cam kết không bán, chia sẻ hoặc để lộ thông tin của quý khách cho bất kỳ bên thứ ba nào vì mục đích thương mại khi chưa có sự đồng ý.
          </p>
        </section>

        <section className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <h3 className="font-bold text-slate-900">Mọi thắc mắc về quyền riêng tư xin vui lòng liên hệ:</h3>
          <p className="text-xs text-gray-600">
            • Email hỗ trợ: <a href={`mailto:${config.supportEmail}`} className="text-exclusive-red font-semibold">{config.supportEmail}</a><br />
            • Hotline: <a href={`tel:${config.hotline}`} className="text-exclusive-red font-semibold">{config.hotline}</a><br />
            • Trụ sở: {config.address}
          </p>
        </section>
      </div>
    </div>
  );
};
