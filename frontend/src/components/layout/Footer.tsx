import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Facebook, Twitter, Instagram, Linkedin, QrCode } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useSiteConfigStore } from '../../store/useSiteConfigStore';

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
    <footer className="bg-black text-white pt-16 pb-6 font-poppins border-t border-neutral-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-neutral-800">
          
          {/* Column 1: AshaShop / Subscribe */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              {config.customLogoUrl ? (
                <img src={config.customLogoUrl} alt={config.brandName} className="h-8 max-w-[140px] object-contain" />
              ) : (
                <div className="w-9 h-9 bg-exclusive-red rounded-lg flex items-center justify-center text-white shadow-md">
                  <span className="font-bold text-lg">{config.brandName.charAt(0)}</span>
                </div>
              )}
              <span className="text-2xl font-bold tracking-tight font-poppins text-white">
                {config.brandName}<span className="text-exclusive-red">{config.brandHighlight}</span>
              </span>
            </Link>
            <h4 className="font-medium text-lg text-neutral-200">{t('footer.subscribe')}</h4>
            <p className="text-sm text-neutral-400">{config.footerDescription || t('footer.discountOffer')}</p>
            
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                placeholder={t('footer.enterEmail')}
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
            <h4 className="font-semibold text-lg text-neutral-100">{t('footer.support')}</h4>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {config.address}
            </p>
            <p className="text-sm text-neutral-400 hover:text-white transition-colors">
              <a href={`mailto:${config.supportEmail}`}>{config.supportEmail}</a>
            </p>
            <p className="text-sm text-neutral-400">
              <a href={`tel:${config.hotline}`}>{config.hotline}</a>
            </p>
          </div>

          {/* Column 3: Account */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-neutral-100">{t('footer.account')}</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">{t('nav.manageAccount')}</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">{t('nav.logIn')} / {t('nav.signUp')}</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">{t('cart.title')}</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">{t('footer.wishlist') || 'Danh Sách Yêu Thích'}</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">{t('nav.shop')}</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Link */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-neutral-100">{t('footer.quickLink')}</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">{t('footer.privacyPolicy') || 'Chính Sách Bảo Mật'}</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">{t('footer.termsOfUse') || 'Điều Khoản Sử Dụng'}</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">{t('footer.faq') || 'Câu Hỏi Thường Gặp'}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Download App & Socials */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-neutral-100">{t('footer.downloadApp')}</h4>
            <p className="text-xs text-neutral-400">{config.footerAppDiscount || t('footer.saveApp')}</p>
            
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded shadow-sm">
                <QrCode className="w-16 h-16 text-black" />
              </div>
              <div className="flex flex-col gap-2">
                <button className="bg-neutral-900 border border-neutral-700 hover:border-white px-3 py-1.5 rounded flex items-center gap-2 text-xs transition-colors">
                  <span className="text-[10px] uppercase font-mono">Google Play</span>
                </button>
                <button className="bg-neutral-900 border border-neutral-700 hover:border-white px-3 py-1.5 rounded flex items-center gap-2 text-xs transition-colors">
                  <span className="text-[10px] uppercase font-mono">App Store</span>
                </button>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-6 pt-2 text-neutral-400">
              {config.facebookUrl && (
                <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {config.twitterUrl && (
                <a href={config.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {config.instagramUrl && (
                <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {config.linkedinUrl && (
                <a href={config.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 text-center text-xs text-neutral-500">
          <p>{config.copyrightText || t('footer.copyright')}</p>
        </div>

      </div>
    </footer>
  );
};
