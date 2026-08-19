import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useSiteConfigStore } from '../../store/useSiteConfigStore';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../i18n/translations';

export const TopHeader: React.FC = () => {
  const { currentLanguage, languageInfo, setLanguage, t } = useLanguageStore();
  const { getLocalizedConfig } = useSiteConfigStore();
  const config = getLocalizedConfig(currentLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!config.showTopBar) return null;

  return (
    <div className="bg-black text-white text-xs sm:text-sm py-2.5 px-4 relative z-50 font-poppins">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Promotion Banner Text */}
        <div className="flex-1 text-center sm:text-center sm:pl-28 flex flex-wrap items-center justify-center gap-1.5">
          <span>{config.topBarText || t('top.banner')}</span>
          <Link 
            to={config.topBarLink || '/shop'} 
            className="font-semibold underline hover:text-exclusive-red transition-colors ml-1"
          >
            {config.topBarButtonText || t('top.shopNow')}
          </Link>
        </div>

        {/* Interactive Language Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 cursor-pointer hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-white/10 text-xs sm:text-sm"
            aria-label="Select Language"
          >
            <span className="text-base leading-none">{languageInfo.flag}</span>
            <span>{languageInfo.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Language Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-md shadow-2xl py-1.5 z-50 text-white animate-fade-in divide-y divide-neutral-800">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
                <Globe className="w-3 h-3" />
                <span>Select Language</span>
              </div>

              <div className="py-1">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                        isSelected 
                          ? 'bg-exclusive-red text-white font-semibold' 
                          : 'hover:bg-neutral-800 text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{lang.flag}</span>
                        <div>
                          <p className="font-medium">{lang.name}</p>
                          <p className="text-[10px] text-neutral-400">{lang.nativeName}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
