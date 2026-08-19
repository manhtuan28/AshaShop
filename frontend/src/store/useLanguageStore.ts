import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LanguageCode, LanguageInfo, SUPPORTED_LANGUAGES, translations } from '../i18n/translations';

interface LanguageState {
  currentLanguage: LanguageCode;
  languageInfo: LanguageInfo;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'vi',
      languageInfo: SUPPORTED_LANGUAGES[0],

      setLanguage: (code: LanguageCode) => {
        const info = SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
        set({ currentLanguage: code, languageInfo: info });
      },

      t: (key: string) => {
        const lang = get().currentLanguage;
        const dict = translations[lang] || translations.vi;
        return dict[key] || translations.en[key] || key;
      },
    }),
    {
      name: 'ashashop_language_storage',
    }
  )
);
