import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGS, translations } from './translations';
import { getLang, setLang as setLangCode, t as translate } from './i18n';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(getLang);

  useEffect(() => {
    setLangCode(lang);
    try {
      window.localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((code) => {
    if (LANGS.some((l) => l.code === code)) setLangState(code);
  }, []);

  const t = useCallback((key, vars) => translate(key, vars), []);

  const value = useMemo(
    () => ({ lang, setLang, t, LANGS, translations }),
    [lang, setLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider');
  return ctx;
};