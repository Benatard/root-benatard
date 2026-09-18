import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useLang } from '../../i18n/LanguageContext';

export default function ErrorBanner({ message, className = '' }) {
  const { t } = useLang();
  return (
    <div className={`rounded-md border border-red-500/40 bg-red-500/5 px-4 py-3 flex items-start gap-3 ${className}`}>
      <FiAlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">{t('ui.errorTitle')}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-body dark:text-body-dark">{message || t('ui.errorDefaultMsg')}</p>
      </div>
    </div>
  );
}