import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User as UserIcon, 
  Menu, 
  X, 
  LogOut, 
  Package, 
  XCircle, 
  Star, 
  LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    ...(!isAuthenticated ? [{ name: 'Sign Up', path: '/register' }] : [])
  ];

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-exclusive-red rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-poppins text-black">
              Asha<span className="text-exclusive-red">Shop</span>
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
                    isActive ? 'text-black font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar & Action Icons */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            {/* Search Input */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center relative bg-exclusive-bg rounded px-4 py-2.5 w-52 lg:w-64">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs lg:text-sm text-black placeholder-gray-500 focus:outline-none w-full pr-6"
              />
              <button type="submit" className="absolute right-3 text-black hover:text-exclusive-red transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Wishlist Icon */}
            <Link to="/shop" title="Wishlist" className="relative p-1 text-black hover:text-exclusive-red transition-colors">
              <Heart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-exclusive-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" title="Cart" className="relative p-1 text-black hover:text-exclusive-red transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-exclusive-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Account / Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`p-1.5 rounded-full transition-colors ${
                    isUserDropdownOpen ? 'bg-exclusive-red text-white' : 'text-black hover:bg-gray-100'
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
                      <span>Manage My Account</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                    >
                      <Package className="w-5 h-5 text-gray-300" />
                      <span>My Order</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-gray-300" />
                      <span>My Cancellations</span>
                    </Link>

                    <Link
                      to="/shop"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                    >
                      <Star className="w-5 h-5 text-gray-300" />
                      <span>My Reviews</span>
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded text-exclusive-red hover:bg-white/10 transition-colors font-medium"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Admin Dashboard</span>
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
                        <span>Logout</span>
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
                Log In
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1 text-black hover:text-exclusive-red"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 px-2 space-y-3 bg-white">
            <form onSubmit={handleSearch} className="flex items-center bg-exclusive-bg rounded px-3 py-2">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-black focus:outline-none w-full pr-2"
              />
              <button type="submit">
                <Search className="w-4 h-4 text-black" />
              </button>
            </form>

            <nav className="flex flex-col space-y-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded"
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-white bg-exclusive-red text-center rounded mt-2"
                >
                  Log In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
