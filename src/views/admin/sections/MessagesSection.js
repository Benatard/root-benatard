import React from 'react';
import { FiMail, FiTrash2, FiCheck, FiRotateCcw, FiInbox } from 'react-icons/fi';
import useMessages from '../../../hooks/useMessages';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { toast } from '../../../service/swal';
import { useLang } from '../../../i18n/LanguageContext';

const formatDate = (iso, lang) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(lang === 'en' ? 'en-GB' : 'fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function MessagesSection() {
  const { t, lang } = useLang();
  const { messages, loading, error, toggleRead, removeMessage } = useMessages();

  const handleToggleRead = async (id, read) => {
    const result = await toggleRead(id, read);
    if (result && result.ok === false) toast('error', t('admin.messages.toastFailed'));
  };

  const handleRemove = async (id) => {
    const result = await removeMessage(id);
    if (result && result.ok === false) toast('error', t('admin.messages.deleteFailed'));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.messages.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          {t('admin.messages.sub')}
        </p>
      </div>

      {loading && <Loading variant="list" />}
      {error && <ErrorBanner message={t('admin.messages.error')} />}

      {!loading && !error && messages.length === 0 ? (
        <div className="card-root p-12 text-center">
          <FiInbox className="mx-auto w-10 h-10 text-primary/40" />
          <p className="mt-4 text-body dark:text-body-dark">{t('admin.messages.empty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`card-root p-6 transition-opacity ${msg.read ? 'opacity-70' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-10 w-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-4 h-4 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-dark dark:text-white truncate">
                      {msg.nom}
                      {!msg.read && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary">
                          {t('admin.messages.new')}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-body dark:text-body-dark truncate">
                      {msg.email} · {formatDate(msg.date, lang)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(msg.id, !msg.read)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-white transition-colors"
                  >
                    {msg.read ? <FiRotateCcw className="w-3.5 h-3.5" /> : <FiCheck className="w-3.5 h-3.5" />}
                    {msg.read ? t('admin.messages.markUnread') : t('admin.messages.markRead')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(msg.id)}
                    aria-label={t('admin.messages.deleteAria')}
                    className="h-9 w-9 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-body dark:text-body-dark whitespace-pre-line">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}