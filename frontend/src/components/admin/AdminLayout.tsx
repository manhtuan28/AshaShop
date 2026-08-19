import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Users,
  Tag,
  Palette,
  Megaphone,
  ImageIcon,
  LayoutGrid,
  ShieldCheck,
  BookOpen,
  PhoneCall,
  CreditCard,
  Settings,
  Globe,
  LogOut,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSiteConfigStore } from '../../store/useSiteConfigStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../i18n/translations';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { config } = useSiteConfigStore();
  const { currentLanguage, languageInfo, setLanguage, t } = useLanguageStore();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Structured Navigation Groups
  const navigationGroups = [
    {
      title: t('admin.group.overview') || 'TỔNG QUAN HỆ THỐNG',
      items: [
        { label: t('admin.nav.dashboard') || 'Báo Cáo & Số Liệu', path: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: t('admin.group.collections') || 'BỘ SƯU TẬP SẢN PHẨM',
      items: [
        { label: t('admin.nav.products') || 'Sản Phẩm Thời Trang', path: '/admin/products', icon: Package },
        { label: t('admin.nav.categories') || 'Danh Mục Quần Áo', path: '/admin/categories', icon: FolderTree },
        { label: t('admin.nav.orders') || 'Quản Lý Đơn Hàng', path: '/admin/orders', icon: ShoppingBag },
        { label: t('admin.nav.coupons') || 'Mã Giảm Giá (Coupons)', path: '/admin/coupons', icon: Tag },
      ],
    },
    {
      title: t('admin.group.cms') || 'QUẢN TRỊ TRANG WEB & NỘI DUNG',
      items: [
        { label: t('admin.nav.cms.branding') || 'Logo & Thương Hiệu', path: '/admin/cms/branding', icon: Palette },
        { label: t('admin.nav.cms.topbar') || 'Thanh Thông Báo Header', path: '/admin/cms/topbar', icon: Megaphone },
        { label: t('admin.nav.cms.sections') || 'Khối Sản Phẩm Trang Chủ', path: '/admin/cms/sections', icon: Sparkles },
        { label: t('admin.nav.cms.hero') || 'Banner Hero & Flash Sale', path: '/admin/cms/hero', icon: ImageIcon },
        { label: t('admin.nav.cms.bento') || 'Lookbook & Bento Grid', path: '/admin/cms/bento', icon: LayoutGrid },
        { label: t('admin.nav.cms.badges') || '3 Cam Kết Dịch Vụ', path: '/admin/cms/badges', icon: ShieldCheck },
        { label: t('admin.nav.cms.about') || 'Nội Dung Giới Thiệu', path: '/admin/cms/about', icon: BookOpen },
        { label: t('admin.nav.cms.footer') || 'Chân Trang & Liên Hệ', path: '/admin/cms/footer', icon: PhoneCall },
        { label: t('admin.nav.cms.banking') || 'Tài Khoản Ngân Hàng', path: '/admin/cms/banking', icon: CreditCard },
      ],
    },
    {
      title: t('admin.group.system') || 'HỆ THỐNG & NGƯỜI DÙNG',
      items: [
        { label: t('admin.nav.users') || 'Tài Khoản & Quyền Hạn', path: '/admin/users', icon: Users },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-poppins">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 flex flex-col justify-between flex-shrink-0 border-r border-slate-800">
        <div>
          {/* Logo & Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-exclusive-red flex items-center justify-center text-white font-black shadow-md">
                {config.brandName?.charAt(0) || 'A'}
              </div>
              <div>
                <h1 className="font-extrabold text-white text-base tracking-tight">
                  {config.brandName}<span className="text-exclusive-red">{config.brandHighlight}</span>
                </h1>
                <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {t('admin.portal') || 'CMS Studio'}
                </p>
              </div>
            </Link>
          </div>

          {/* Grouped Navigation Links */}
          <div className="py-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navigationGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                <div className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-exclusive-red text-white shadow-md font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Sidebar Profile & Quick Links */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{t('admin.viewSite') || 'Xem Website'}</span>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white truncate max-w-[100px]">{user?.name}</p>
                <p className="text-[10px] text-slate-400">{user?.role || 'Admin'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-800 text-sm">
              {t('nav.adminDashboard') || 'Trang Quản Trị Hệ Thống'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher Dropdown in Admin Header */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                <span>{languageInfo.flag}</span>
                <span>{languageInfo.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs text-slate-700 animate-fade-in divide-y divide-slate-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                    Ngôn ngữ hiển thị
                  </div>
                  <div className="py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = currentLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as LanguageCode);
                            setIsLangOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition ${
                            isSelected ? 'text-exclusive-red font-bold bg-red-50/50' : ''
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-exclusive-red" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <span className="text-xs text-slate-500 hidden sm:inline">
              <strong>{user?.email}</strong>
            </span>
          </div>
        </header>

        <div className="p-6 sm:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
