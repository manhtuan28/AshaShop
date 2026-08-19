import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp, Search, Sparkles } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSiteConfigStore } from '../store/useSiteConfigStore';

export const FAQ: React.FC = () => {
  const { t } = useLanguageStore();
  const { config } = useSiteConfigStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      q: 'Làm thế nào để chọn size quần áo vừa vặn nhất?',
      a: 'Bạn có thể tham khảo bảng thông số size chi tiết (S, M, L, XL, XXL) ở từng trang chi tiết sản phẩm. Ngoài ra, đội ngũ stylist của chúng tôi luôn sẵn sàng hỗ trợ tư vấn chiều cao - cân nặng 24/7 qua hotline hoặc khung chat.'
    },
    {
      q: 'Phí vận chuyển và thời gian giao hàng mất bao lâu?',
      a: 'AshaShop miễn phí vận chuyển toàn quốc cho tất cả đơn hàng từ 500.000đ. Thời gian giao hàng nội thành Hà Nội & TP.HCM từ 1-2 ngày làm việc, các tỉnh thành khác từ 2-4 ngày.'
    },
    {
      q: 'Chính sách đổi trả và đổi size như thế nào?',
      a: 'Bạn được quyền thử đồ và đổi size hoặc đổi mẫu hoàn toàn miễn phí trong vòng 30 ngày kể từ ngày nhận hàng. Shipper sẽ đến tận nơi giao đồ mới và nhận lại đồ cũ.'
    },
    {
      q: 'AshaShop hỗ trợ các phương thức thanh toán nào?',
      a: 'Chúng tôi hỗ trợ: 1. Thanh toán khi nhận hàng (COD), 2. Chuyển khoản ngân hàng qua mã QR Techcombank, 3. Thanh toán qua thẻ tín dụng/ghi nợ quốc tế Visa/Mastercard.'
    },
    {
      q: 'Làm sao để tôi kiểm tra tình trạng đơn hàng?',
      a: 'Bạn có thể vào mục "Tài Khoản" -> "Đơn Hàng Của Tôi" để theo dõi trực tiếp trạng thái đơn hàng (Đang xử lý -> Đã xác nhận -> Đang vận chuyển -> Đã giao).'
    }
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <span className="text-black font-medium">{t('footer.faq') || 'Câu Hỏi Thường Gặp'}</span>
      </nav>

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-exclusive-red text-xs font-bold rounded-full">
          <HelpCircle className="w-4 h-4" />
          <span>Trung Tâm Trợ Giúp Khách Hàng</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          {t('footer.faq') || 'Câu Hỏi Thường Gặp'}
        </h1>
        <p className="text-xs text-gray-500">
          Giải đáp các thắc mắc phổ biến về đặt hàng, bảng size, vận chuyển và bảo hành tại {config.brandName}{config.brandHighlight}
        </p>

        {/* Search */}
        <div className="relative pt-2">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi thắc mắc (ví dụ: đổi size, giao hàng, thanh toán)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-black"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-5" />
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-4 pt-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-exclusive-red transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-exclusive-red flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions */}
      <div className="p-8 bg-slate-900 text-white rounded-2xl text-center space-y-4">
        <h3 className="text-lg font-bold">Bạn vẫn còn câu hỏi cần giải đáp?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Đội ngũ tư vấn viên của chúng tôi luôn túc trực hỗ trợ bạn mọi lúc mọi nơi.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/contact"
            className="px-6 py-2.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs font-bold rounded-lg transition-colors"
          >
            Gửi Tin Nhắn Cho Chúng Tôi
          </Link>
          <a
            href={`tel:${config.hotline}`}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Gọi Hotline: {config.hotline}
          </a>
        </div>
      </div>
    </div>
  );
};
