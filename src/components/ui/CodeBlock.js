import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useLang } from '../../i18n/LanguageContext';

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
};

export default function CodeBlock({ code, language }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyText(String(code || '').trimEnd());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden bg-[#0d1117] dark:bg-[#0d1117] ring-1 ring-black/10 dark:ring-white/10">
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-black/20 border-b border-white/10">
        {language ? (
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">{language}</span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            copied ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          {copied ? (
            <>
              <FiCheck className="w-3.5 h-3.5" /> {t('videos.codeCopied')}
            </>
          ) : (
            <>
              <FiCopy className="w-3.5 h-3.5" /> {t('videos.codeCopy')}
            </>
          )}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-[13px] leading-relaxed font-mono text-gray-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}