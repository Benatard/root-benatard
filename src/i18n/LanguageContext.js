import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGS, translations } from './translations';
import { getLang, setLang as setLangCode, t as translate } from './i18n';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(getLang);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    setLangCode(lang);
    try {
      window.localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback(
    (code) => {
      if (!LANGS.some((l) => l.code === code)) return;
      if (code !== lang) {
        setLangState(code);
        setDataVersion((v) => v + 1);
      }
    },
    [lang]
  );

  const t = useCallback((key, vars) => translate(key, vars), []);

  const value = useMemo(
    () => ({ lang, setLang, t, dataVersion, LANGS, translations }),
    [lang, setLang, t, dataVersion]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider');
  return ctx;
};