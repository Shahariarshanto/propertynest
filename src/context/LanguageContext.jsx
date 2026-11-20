import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, toBengaliNumber } from '../locales/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Default to 'bn' (Bangla) as requested since majority of users are from Barishal
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('pn_lang') || 'bn';
  });

  useEffect(() => {
    localStorage.setItem('pn_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang) => {
    if (newLang === 'bn' || newLang === 'en') {
      setLangState(newLang);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'bn' ? 'en' : 'bn'));
  }, []);

  const t = useCallback(
    (key) => {
      const currentDict = translations[lang] || translations.bn;
      if (currentDict[key]) return currentDict[key];
      // Fallback to English if key missing
      return translations.en[key] || key;
    },
    [lang]
  );

  const formatNumber = useCallback(
    (num) => {
      return toBengaliNumber(num, lang === 'bn');
    },
    [lang]
  );

  const isBn = lang === 'bn';

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        formatNumber,
        isBn,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
