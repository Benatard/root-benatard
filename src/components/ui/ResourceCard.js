import React, { useState } from 'react';
import { FiExternalLink, FiTrash2, FiSmartphone, FiGlobe } from 'react-icons/fi';
import { resolveUploadUrl } from '../../config/config';
import { toast } from '../../service/swal';
import { useLang } from '../../i18n/LanguageContext';

const FALLBACK_IMG = '/images/resource-placeholder.svg';

export default function ResourceCard({ resource, onRemove, removable = false }) {
  const [imgSrc, setImgSrc] = useState(resolveUploadUrl(resource.image) || FALLBACK_IMG);
  const { t } = useLang();
  const isApp = resource.type === 'app';

  const handleRemove = async () => {
    const result = await onRemove(resource.id);
    if (result && result.ok === false) {
      toast('error', t('ui.deleteFailed'));
    }
  };

  return (
    <div className="group card-root overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">
      <div className="relative h-40 overflow-hidden bg-white dark:bg-gray-dark">
        <img
          src={imgSrc}
          alt={resource.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgSrc(FALLBACK_IMG)}
        />
        <span className={`badge-root absolute top-4 left-4 ${isApp ? '' : 'bg-emerald-600'}`}>
          {isApp ? t('resources.typeApp') : t('resources.typeSite')}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <span className={`h-10 w-10 flex items-center justify-center ${isApp ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {isApp ? <FiSmartphone className="w-4 h-4" /> : <FiGlobe className="w-4 h-4" />}
          </span>
          {removable && onRemove && (
            <button
              onClick={handleRemove}
              aria-label={t('ui.deleteResource')}
              className="h-8 w-8 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <h3 className="mt-4 text-lg font-bold text-black dark:text-white">{resource.title}</h3>
        {resource.store && (
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-primary">{resource.store}</p>
        )}
        {resource.description && (
          <p className="mt-2.5 text-sm leading-relaxed text-body dark:text-body-dark flex-1">{resource.description}</p>
        )}
        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="mt-auto pt-5 inline-flex items-center justify-center gap-2.5 text-sm font-semibold text-white bg-primary px-5 py-2.5 shadow-btn hover:bg-primary-dark hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            {t('ui.visitPlatform')} <FiExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}