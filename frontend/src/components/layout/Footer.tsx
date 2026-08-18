import React from 'react';
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20 border-t border-gray-800">
      {/* Features Bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Giao Hàng Toàn Quốc</h4>
                <p className="text-xs text-gray-400 mt-0.5">Miễn phí cho đơn từ 500k</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Chính Hãng 100%</h4>
                <p className="text-xs text-gray-400 mt-0.5">Bảo hành và hoàn tiền nếu lỗi</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Đổi Trả Dễ Dàng</h4>
                <p className="text-xs text-gray-400 mt-0.5">Trong vòng 7 ngày miễn phí</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Hỗ Trợ 24/7</h4>
                <p className="text-xs text-gray-400 mt-0.5">Tư vấn tận tâm, phản hồi nhanh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">AshaShop</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nền tảng thương mại điện tử hiện đại, cung cấp các sản phẩm công nghệ, thời trang và phụ kiện chính hãng với giá tốt nhất.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Khám Phá</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="hover:text-emerald-400 transition">Tất cả sản phẩm</Link></li>
              <li><Link to="/shop?category=dien-thoai-tablet" className="hover:text-emerald-400 transition">Điện thoại & Tablet</Link></li>
              <li><Link to="/shop?category=laptop-may-tinh" className="hover:text-emerald-400 transition">Laptop & Máy tính</Link></li>
              <li><Link to="/shop?category=am-thanh-phu-kien-so" className="hover:text-emerald-400 transition">Âm thanh & Phụ kiện</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Dịch Vụ & Hỗ Trợ</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>Chính sách bảo hành</li>
              <li>Chính sách vận chuyển</li>
              <li>Chính sách bảo mật</li>
              <li>Hướng dẫn thanh toán</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Dự Án Thực Tập</h3>
            <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
              <p className="font-semibold text-emerald-400">Báo cáo thực tập tốt nghiệp</p>
              <p className="text-gray-300">Công nghệ: ReactJS, NestJS, MongoDB, Redis, Docker, CI/CD</p>
              <p className="text-gray-400">Sinh viên thực hiện: AshaShop Team</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 AshaShop. Bản quyền thuộc về đề tài Báo Cáo Thực Tập.</p>
          <div className="flex items-center gap-1">
            <span>Xây dựng với</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>bằng React & NestJS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
