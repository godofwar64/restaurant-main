import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as arabicTranslations } from '@/translations/ar';
import { translations as englishTranslations } from '@/translations/en';

interface LanguageContextType {
  language: 'ar' | 'en';
  translations: typeof arabicTranslations;
  toggleLanguage: () => void;
  setLanguage: (lang: 'ar' | 'en') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>('ar');

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update HTML direction and lang
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const translations = language === 'ar' ? arabicTranslations : englishTranslations;

  return (
    <LanguageContext.Provider value={{
      language,
      translations,
      toggleLanguage,
      setLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
