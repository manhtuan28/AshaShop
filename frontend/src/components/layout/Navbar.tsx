import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User as UserIcon, 
  Menu, 
  X, 
  Package, 
  XCircle, 
  Star, 
  LogOut, 
  LayoutDashboard,
  LogIn
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useSiteConfigStore } from '../../store/useSiteConfigStore';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { currentLanguage, t } = useLanguageStore();
  const { getLocalizedConfig } = useSiteConfigStore();
  const config = getLocalizedConfig(currentLanguage);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.shop'), path: '/shop' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-md z-40 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            {config.customLogoUrl ? (
              <img src={config.customLogoUrl} alt={config.brandName} className="h-9 max-w-[150px] object-contain" />
            ) : (
              <div className="w-9 h-9 bg-exclusive-red rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-5 h-5" />
              </div>
            )}
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
              {config.brandName}<span className="text-exclusive-red">{config.brandHighlight}</span>
            </span>
          </Link>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 xl:gap-10 font-medium flex-shrink-0">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1.5 text-xs lg:text-sm xl:text-base whitespace-nowrap transition-colors hover:text-black ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-exclusive-red rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-4 lg:gap-5 flex-shrink-0">
            
            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-36 md:w-44 lg:w-56 xl:w-64 pl-3.5 pr-9 py-2 bg-exclusive-bg text-xs lg:text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-400 transition-all border border-transparent focus:border-slate-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors cursor-pointer"
                title="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative text-slate-800 hover:text-exclusive-red transition-colors p-2 rounded-full hover:bg-slate-100"
              title="Danh sách yêu thích"
            >
              <Heart className={`w-5 h-5 ${wishlistItems.length > 0 ? 'text-exclusive-red fill-exclusive-red' : ''}`} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-exclusive-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-fade-in shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-slate-800 hover:text-exclusive-red transition-colors p-2 rounded-full hover:bg-slate-100"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-exclusive-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Auth Section */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isUserDropdownOpen ? 'bg-exclusive-red text-white' : 'text-slate-800 hover:text-exclusive-red hover:bg-slate-100'
                  }`}
                  title={user?.name}
                >
                  <UserIcon className="w-5 h-5" />
                </button>

                {/* Dropdown Menu (Figma Blur Style) */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl py-3 px-2.5 z-50 text-white animate-fade-in border border-slate-700/80">
                    <div className="px-3 py-2 border-b border-slate-700/60 mb-2">
                      <p className="font-bold text-sm truncate text-white">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
                      {user?.role === 'admin' && (
                        <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-exclusive-red text-[10px] font-bold rounded-full shadow-sm">
                          ADMINISTRATOR
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-300" />
                      <span>{t('nav.manageAccount')}</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-300" />
                      <span>{t('nav.myOrder')}</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-slate-300" />
                      <span>{t('nav.myCancellations')}</span>
                    </Link>

                    <Link
                      to="/shop"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <Star className="w-4 h-4 text-slate-300" />
                      <span>{t('nav.myReviews')}</span>
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm rounded-xl text-exclusive-red bg-exclusive-red/10 hover:bg-exclusive-red/20 transition-colors font-bold mt-1"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{t('nav.adminDashboard')}</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-700/60 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs sm:text-sm rounded-xl hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/register"
                  className="hidden md:inline-flex items-center text-xs lg:text-sm font-semibold text-slate-700 hover:text-exclusive-red px-2.5 py-2 transition-colors whitespace-nowrap"
                >
                  {t('nav.signUp')}
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs lg:text-sm font-bold text-white bg-exclusive-red hover:bg-exclusive-red-hover rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer hover:shadow-md"
                >
                  <LogIn className="w-4 h-4 hidden sm:block" />
                  <span>{t('nav.logIn')}</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3 animate-fade-in">
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full pl-4 pr-10 py-2.5 bg-exclusive-bg text-sm rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-gray-700 hover:text-exclusive-red"
              >
                {link.name}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl"
                >
                  {t('nav.signUp')}
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold text-white bg-exclusive-red rounded-xl shadow-sm"
                >
                  {t('nav.logIn')}
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
