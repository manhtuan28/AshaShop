import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  QrCode,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useSiteConfigStore } from '../../store/useSiteConfigStore';
import {
  VisaLogo,
  MastercardLogo,
  VnPayLogo,
  MomoLogo,
  ZaloPayLogo,
  VietQrLogo,
  CodLogo,
  JcbLogo,
  AppStoreBadge,
  GooglePlayBadge
} from '../common/PaymentLogos';

export const Footer: React.FC = () => {
  const { currentLanguage, t } = useLanguageStore();
  const { getLocalizedConfig } = useSiteConfigStore();
  const config = getLocalizedConfig(currentLanguage);

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 font-poppins border-t border-neutral-900 mt-20 relative overflow-hidden">
      
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-exclusive-red/10 to-transparent blur-3xl pointer-events-none" />

      {/* TOP TRUST BADGES SECTION */}
      <div className="border-b border-neutral-900/80 bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/60">
              <div className="w-12 h-12 rounded-xl bg-exclusive-red/10 text-exclusive-red flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-white">GIAO HÀNG TOÀN QUỐC</h5>
                <p className="text-xs text-neutral-400 mt-0.5">Miễn phí cho đơn hàng từ 500K</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/60">
              <div className="w-12 h-12 rounded-xl bg-exclusive-red/10 text-exclusive-red flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-white">ĐỔI TRẢ 30 NGÀY</h5>
                <p className="text-xs text-neutral-400 mt-0.5">Thủ tục nhanh chóng, miễn phí 100%</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/60">
              <div className="w-12 h-12 rounded-xl bg-exclusive-red/10 text-exclusive-red flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-white">100% CHÍNH HÃNG</h5>
                <p className="text-xs text-neutral-400 mt-0.5">Chất liệu cao cấp chuẩn xuất khẩu</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/60">
              <div className="w-12 h-12 rounded-xl bg-exclusive-red/10 text-exclusive-red flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-white">TƯ VẤN 24/7</h5>
                <p className="text-xs text-neutral-400 mt-0.5">Hỗ trợ chọn size & phối đồ chuyên nghiệp</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* NEWSLETTER HIGHLIGHT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 p-8 sm:p-10 rounded-3xl border border-neutral-800 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-exclusive-red/10 text-exclusive-red text-xs font-bold rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ƯU ĐÃI THÀNH VIÊN MỚI</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Nhận Voucher Giảm <span className="text-exclusive-red">10%</span> Cho Đơn Hàng Đầu Tiên
            </h3>
            <p className="text-sm text-neutral-400">
              Đăng ký nhận bản tin để cập nhật sớm nhất các bộ sưu tập Lookbook và chương trình Flash Sale độc quyền.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md space-y-2">
            <div className="flex items-center bg-neutral-950 border border-neutral-700 focus-within:border-exclusive-red p-1.5 rounded-2xl transition-all shadow-inner">
              <input
                type="email"
                placeholder={t('footer.enterEmail') || 'Nhập địa chỉ email của bạn...'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-exclusive-red hover:bg-exclusive-red-hover text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 flex-shrink-0 shadow-md shadow-exclusive-red/20 cursor-pointer"
              >
                <span>Đăng Ký</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {subscribed && (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 pl-2 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cảm ơn bạn! Mã giảm giá 10% đã được gửi vào hòm thư.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* MAIN FOOTER NAVIGATION GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-900">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              {config.customLogoUrl ? (
                <img src={config.customLogoUrl} alt={config.brandName} className="h-8 max-w-[140px] object-contain" />
              ) : (
                <div className="w-9 h-9 bg-exclusive-red rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-exclusive-red/20">
                  <span>{config.brandName.charAt(0)}</span>
                </div>
              )}
              <span className="text-2xl font-extrabold tracking-tight font-poppins text-white">
                {config.brandName}<span className="text-exclusive-red">{config.brandHighlight}</span>
              </span>
            </Link>
            
            <p className="text-xs text-neutral-400 leading-relaxed">
              {config.footerDescription || 'Thương hiệu thời trang cao cấp mang phong cách hiện đại, thanh lịch và chuẩn mực sống đến cho bạn.'}
            </p>

            <div className="space-y-2 text-xs text-neutral-400 pt-2">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-exclusive-red flex-shrink-0 mt-0.5" />
                <span>{config.address || 'Số 16, Thanh Miếu, Phú Thọ'}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-exclusive-red flex-shrink-0" />
                <a href={`tel:${config.hotline || '0337832186'}`} className="hover:text-white transition-colors font-semibold">
                  {config.hotline || '03 378 321 86'}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-exclusive-red flex-shrink-0" />
                <a href={`mailto:${config.supportEmail || 'contact@tuancute.com'}`} className="hover:text-white transition-colors">
                  {config.supportEmail || 'contact@tuancute.com'}
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Bộ Sưu Tập Thời Trang */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">Bộ Sưu Tập</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/shop?category=thoi-trang-nu" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Thời Trang Nữ
                </Link>
              </li>
              <li>
                <Link to="/shop?category=thoi-trang-nam" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Thời Trang Nam
                </Link>
              </li>
              <li>
                <Link to="/shop?category=ao-khoac-blazer" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Áo Khoác & Blazer
                </Link>
              </li>
              <li>
                <Link to="/shop?category=quan-jeans" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Quần & Jeans Tuyển Chọn
                </Link>
              </li>
              <li>
                <Link to="/shop?category=tui-xach-phu-kien" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Túi Xách & Phụ Kiện
                </Link>
              </li>
              <li>
                <Link to="/shop?category=giay-dep-thoi-trang" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Giày & Dép Cao Cấp
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Dịch Vụ & Hỗ Trợ */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">Khách Hàng</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/orders" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Tra Cứu Đơn Hàng
                </Link>
              </li>
              <li>
                <Link to="/my-reviews" className="hover:text-white hover:translate-x-1 inline-block transition-transform text-exclusive-red font-semibold">
                  ★ Đánh Giá Của Tôi
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Giỏ Hàng Mua Sắm
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Danh Sách Yêu Thích
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Quản Lý Tài Khoản
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Câu Hỏi Thường Gặp (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Chính Sách & Về Chúng Tôi */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">Chính Sách</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Về Thương Hiệu AshaShop
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Điều Khoản Dịch Vụ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Liên Hệ Hợp Tác
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Thanh Toán & Tải App */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">Phương Thức Thanh Toán</h4>
            
            {/* Payment Method Badges Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div title="Thanh toán khi nhận hàng (COD)" className="h-9 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <CodLogo className="h-4 w-auto max-w-full" />
              </div>
              <div title="Chuyển khoản VietQR / MB Bank" className="h-9 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <VietQrLogo className="h-4 w-auto max-w-full" />
              </div>
              <div title="Cổng thanh toán VNPAY-QR" className="h-9 bg-white rounded-lg p-1 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <VnPayLogo className="h-4 w-auto max-w-full" />
              </div>
              <div title="Ví điện tử MoMo" className="h-9 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <MomoLogo className="h-5 w-auto max-w-full" />
              </div>
              <div title="Ví điện tử ZaloPay" className="h-9 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <ZaloPayLogo className="h-4 w-auto max-w-full" />
              </div>
              <div title="Thẻ quốc tế Visa" className="h-9 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <VisaLogo className="h-4 w-auto max-w-full" />
              </div>
              <div title="Thẻ quốc tế Mastercard" className="h-9 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <MastercardLogo className="h-5 w-auto max-w-full" />
              </div>
              <div title="Thẻ quốc tế JCB" className="h-9 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <JcbLogo className="h-4 w-auto max-w-full" />
              </div>
            </div>

            {/* Mobile App Download */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-semibold text-neutral-300 block">Trải nghiệm ứng dụng di động:</span>
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-xl flex-shrink-0 shadow-md">
                  <QrCode className="w-11 h-11 text-black" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <a href="#app-store" className="hover:opacity-80 transition-opacity">
                    <AppStoreBadge className="h-6 w-auto" />
                  </a>
                  <a href="#google-play" className="hover:opacity-80 transition-opacity">
                    <GooglePlayBadge className="h-6 w-auto" />
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM COPYRIGHT & SOCIAL BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          
          <p>{config.copyrightText || '© Copyright AshaShop 2026. All rights reserved.'}</p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-neutral-400">
            {config.facebookUrl && (
              <a
                href={config.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-exclusive-red hover:text-white hover:border-exclusive-red transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {config.instagramUrl && (
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-exclusive-red hover:text-white hover:border-exclusive-red transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {config.twitterUrl && (
              <a
                href={config.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-exclusive-red hover:text-white hover:border-exclusive-red transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {config.linkedinUrl && (
              <a
                href={config.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-exclusive-red hover:text-white hover:border-exclusive-red transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 text-neutral-400">
            <span>🇻🇳 Việt Nam</span>
            <span>•</span>
            <span>VND (₫)</span>
          </div>

        </div>

      </div>
    </footer>
  );
};
