import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Facebook, Twitter, Instagram, Linkedin, QrCode } from 'lucide-react';

export const Footer: React.FC = () => {
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
    <footer className="bg-black text-white pt-16 pb-6 font-poppins border-t border-neutral-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-neutral-800">
          
          {/* Column 1: Exclusive / Subscribe */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold tracking-wider font-poppins">
                Exclusive<span className="text-exclusive-red">.</span>
              </span>
            </Link>
            <h4 className="font-medium text-lg text-neutral-200">Subscribe</h4>
            <p className="text-sm text-neutral-400">Get 10% off your first order</p>
            
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border border-white/40 rounded px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors pr-10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-exclusive-red transition-colors"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-exclusive-green">Thank you for subscribing!</p>
            )}
          </div>

          {/* Column 2: Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-neutral-100">Support</h4>
            <p className="text-sm text-neutral-400 leading-relaxed">
              111 Cau Giay, Hanoi, Vietnam
            </p>
            <p className="text-sm text-neutral-400 hover:text-white transition-colors">
              <a href="mailto:support@ashashop.com">exclusive@gmail.com</a>
            </p>
            <p className="text-sm text-neutral-400">
              <a href="tel:+84987654321">+88015-88888-9999</a>
            </p>
          </div>

          {/* Column 3: Account */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-neutral-100">Account</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">My Account</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Login / Register</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">Wishlist</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Link */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-neutral-100">Quick Link</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Terms Of Use</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Download App */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-neutral-100">Download App</h4>
            <p className="text-xs text-neutral-400">Save $3 with App New User Only</p>
            
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-white p-1.5 rounded flex items-center justify-center">
                <QrCode className="w-full h-full text-black" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="border border-white/40 rounded px-2 py-1 flex items-center gap-1 cursor-pointer hover:border-white transition-colors">
                  <span className="text-[10px] text-neutral-300">GET IT ON</span>
                  <span className="text-xs font-bold">Google Play</span>
                </div>
                <div className="border border-white/40 rounded px-2 py-1 flex items-center gap-1 cursor-pointer hover:border-white transition-colors">
                  <span className="text-[10px] text-neutral-300">Download on the</span>
                  <span className="text-xs font-bold">App Store</span>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-6 pt-2 text-white">
              <a href="#" className="hover:text-exclusive-red transition-colors" title="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-exclusive-red transition-colors" title="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-exclusive-red transition-colors" title="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-exclusive-red transition-colors" title="Linkedin"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-6 text-center text-xs text-neutral-500">
          <p>© Copyright Rimel 2022 / AshaShop 2026. All right reserved</p>
        </div>
      </div>
    </footer>
  );
};
