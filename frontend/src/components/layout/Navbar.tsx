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
  LayoutDashboard 
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
    ...(!isAuthenticated ? [{ name: t('nav.signUp'), path: '/register' }] : [])
  ];

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {config.customLogoUrl ? (
              <img src={config.customLogoUrl} alt={config.brandName} className="h-9 max-w-[150px] object-contain" />
            ) : (
              <div className="w-9 h-9 bg-exclusive-red rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-5 h-5" />
              </div>
            )}
            <span className="text-2xl font-bold tracking-tight font-poppins text-black">
              {config.brandName}<span className="text-exclusive-red">{config.brandHighlight}</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 text-sm lg:text-base transition-colors hover:text-black ${
                    isActive ? 'text-black font-semibold' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gray-600"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-48 lg:w-64 pl-4 pr-10 py-2 bg-exclusive-bg text-xs lg:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative text-black hover:text-exclusive-red transition-colors p-1"
              title="Danh sách yêu thích"
            >
              <Heart className={`w-6 h-6 ${wishlistItems.length > 0 ? 'text-exclusive-red fill-exclusive-red' : ''}`} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-exclusive-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-fade-in">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-black hover:text-exclusive-red transition-colors p-1"
              title="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-exclusive-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Dropdown / Login Button */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`p-1 rounded-full transition-colors ${
                    isUserDropdownOpen ? 'bg-exclusive-red text-white' : 'text-black hover:text-exclusive-red'
                  }`}
                  title={user?.name}
                >
                  <UserIcon className="w-6 h-6" />
                </button>

                {/* Dropdown Menu (Figma Blur Style) */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-black/80 backdrop-blur-md rounded-md shadow-2xl py-3 px-2 z-50 text-white animate-fade-in border border-gray-700">
                    <div className="px-3 py-2 border-b border-gray-700/60 mb-2">
                      <p className="font-semibold text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      {user?.role === 'admin' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-exclusive-red text-[10px] font-bold rounded">
                          ADMINISTRATOR
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                    >
                      <UserIcon className="w-5 h-5 text-gray-300" />
                      <span>{t('nav.manageAccount')}</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                    >
                      <Package className="w-5 h-5 text-gray-300" />
                      <span>{t('nav.myOrder')}</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-gray-300" />
                      <span>{t('nav.myCancellations')}</span>
                    </Link>

                    <Link
                      to="/shop"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                    >
                      <Star className="w-5 h-5 text-gray-300" />
                      <span>{t('nav.myReviews')}</span>
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded text-exclusive-red hover:bg-white/10 transition-colors font-medium"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>{t('nav.adminDashboard')}</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-700/60 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-exclusive-red hover:bg-exclusive-red-hover rounded transition-colors"
              >
                {t('nav.logIn')}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1 text-black"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full pl-4 pr-10 py-2 bg-exclusive-bg text-sm rounded-md focus:outline-none"
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
                className="block py-2 text-sm font-medium text-gray-700 hover:text-exclusive-red"
              >
                {link.name}
              </Link>
            ))}

            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-exclusive-red"
              >
                {t('nav.logIn')}
              </Link>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
