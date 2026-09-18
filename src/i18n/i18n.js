import { translations, LANGS } from './translations';

export const DEFAULT_LANG = 'fr';

const hasWindow = () => typeof window !== 'undefined';

export const detectLang = () => {
  if (hasWindow()) {
    const saved = window.localStorage.getItem('lang');
    if (saved && LANGS.some((l) => l.code === saved)) return saved;
    try {
      const nav = window.navigator?.language || '';
      if (nav.toLowerCase().startsWith('en')) return 'en';
    } catch {
      /* ignore */
    }
  }
  return DEFAULT_LANG;
};

let currentLang = detectLang();

export const getLang = () => currentLang;

export const setLang = (lang) => {
  currentLang = LANGS.some((l) => l.code === lang) ? lang : DEFAULT_LANG;
};

export const t = (key = '', vars = {}) => {
  const dict = translations[currentLang] || translations[DEFAULT_LANG];
  let str = dict[key];
  if (str == null) str = translations[DEFAULT_LANG][key];
  if (str == null) str = key;
  if (Object.keys(vars).length) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replaceAll(`{{${k}}}`, v == null ? '' : String(v));
    });
  }
  return str;
};