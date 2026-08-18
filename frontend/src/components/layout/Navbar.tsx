import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  User as UserIcon,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  ShieldAlert,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemsCount, fetchCart } = useCartStore();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchKeyword.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
              AshaShop
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg relative items-center"
          >
            <input
              type="text"
              placeholder="Tìm kiếm điện thoại, laptop, thời trang..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-semibold hover:bg-emerald-700 transition"
            >
              Tìm
            </button>
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-emerald-600 transition">
              Trang Chủ
            </Link>
            <Link to="/shop" className="hover:text-emerald-600 transition">
              Cửa Hàng
            </Link>
          </nav>

          {/* Right Actions (Cart & User) */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-xl transition"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {itemsCount > 99 ? '99+' : itemsCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth Buttons */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-gray-100 transition border border-gray-200"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="hidden sm:inline-block text-sm font-medium text-gray-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          <ShieldAlert className="w-3 h-3" /> Quản trị viên
                        </span>
                      )}
                    </div>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-700 font-semibold hover:bg-emerald-50 transition"
                      >
                        <ShieldAlert className="w-4 h-4 text-emerald-600" />
                        Trang Quản Trị
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      Thông tin tài khoản
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Package className="w-4 h-4 text-gray-400" />
                      Đơn hàng của tôi
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-block px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 shadow-sm transition"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </form>
            <div className="flex flex-col gap-2 font-medium text-gray-700">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Trang Chủ
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Tất Cả Sản Phẩm
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold"
                >
                  Trang Quản Trị
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
