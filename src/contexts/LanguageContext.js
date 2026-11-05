'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../../locales/en.json';
import te from '../../locales/te.json';

const LanguageContext = createContext();

const translations = { en, te };

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  // Load language from local storage on mount
  useEffect(() => {
    const storedLang = localStorage.getItem('temple_lang');
    if (storedLang && (storedLang === 'en' || storedLang === 'te')) {
      setLang(storedLang);
      document.documentElement.lang = storedLang;
    } else {
      document.documentElement.lang = 'en';
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('temple_lang', newLang);
    document.documentElement.lang = newLang;
  };

  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let current = translations[lang];
    for (let k of keys) {
      if (current[k] === undefined) {
        return keyPath; // fallback
      }
      current = current[k];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
