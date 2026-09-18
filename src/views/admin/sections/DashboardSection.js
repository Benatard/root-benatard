import React from 'react';
import { FiFolder, FiPlayCircle, FiLink, FiMail, FiCode, FiInfo, FiCheckCircle, FiCloudOff } from 'react-icons/fi';
import useResource from '../../../hooks/useResource';
import useVideos from '../../../hooks/useVideos';
import useResources from '../../../hooks/useResources';
import useMessages from '../../../hooks/useMessages';
import { skillsAPI, projectsAPI, FORGE_CONFIGURED } from '../../../service/api';
import config from '../../../config/config';
import { useLang } from '../../../i18n/LanguageContext';

export default function DashboardSection({ onNavigate }) {
  const { data: skills } = useResource(skillsAPI.get);
  const { data: projects } = useResource(projectsAPI.get);
  const { videos } = useVideos();
  const { resources } = useResources();
  const { messages } = useMessages();
  const { t } = useLang();

  const cards = [
    { key: 'projects', label: t('admin.tabs.projects'), value: Array.isArray(projects) ? projects.length : 0, icon: FiFolder },
    { key: 'skills', label: t('admin.dashboard.categorySkills'), value: skills?.categories?.length || 0, icon: FiCode },
    { key: 'videos', label: t('admin.dashboard.videos'), value: videos.length, icon: FiPlayCircle },
    { key: 'resources', label: t('admin.dashboard.resources'), value: resources.length, icon: FiLink },
    { key: 'messages', label: t('admin.dashboard.messages'), value: messages.length, icon: FiMail },
  ];
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.dashboard.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          {t('admin.dashboard.sub')}
        </p>
      </div>

      {FORGE_CONFIGURED ? (
        <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 px-5 py-4">
          <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-body dark:text-body-dark leading-relaxed">
            <span className="font-semibold text-dark dark:text-white">{t('admin.dashboard.apiConnected')}</span>{' '}
            {t('admin.dashboard.apiConnectedTail', { url: config.FORGE.BASE_URL })}
            <span className="font-semibold text-dark dark:text-white">{config.ADMIN_EMAIL || 'admin'}</span>.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 px-5 py-4">
          <FiCloudOff className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-body dark:text-body-dark leading-relaxed">
            <span className="font-semibold text-dark dark:text-white">{t('admin.dashboard.localMode')}</span>{' '}
            {t('admin.dashboard.localModeTail')} <code className="font-mono text-xs bg-gray2 dark:bg-[#2C303B] px-1.5 py-0.5">
            REACT_APP_FORGE_PROJECT_KEY</code> {t('admin.dashboard.localModeAnd')} <code className="font-mono text-xs bg-gray2 dark:bg-[#2C303B] px-1.5 py-0.5">
            REACT_APP_FORGE_API_KEY</code> {t('admin.dashboard.localModeIn')} <code className="font-mono text-xs bg-gray2 dark:bg-[#2C303B] px-1.5 py-0.5">.env</code>
            {t('admin.dashboard.localModeEnd')}
          </p>
        </div>
      )}

      <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 px-5 py-4">
        <FiInfo className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-body dark:text-body-dark leading-relaxed">
          {t('admin.dashboard.forgeInfo', { url: config.FORGE.BASE_URL })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(({ key, label, value, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className="card-root p-5 text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="h-10 w-10 bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </span>
            <div className="mt-4 text-2xl font-extrabold text-black dark:text-white">{value}</div>
            <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-body dark:text-body-dark">
              {label}
            </div>
          </button>
        ))}
      </div>

      {unread > 0 && (
        <button
          onClick={() => onNavigate('messages')}
          className="w-full card-root p-5 flex items-center justify-between hover:shadow-card-hover transition-shadow"
        >
          <span className="flex items-center gap-3 text-sm font-semibold text-dark dark:text-white">
            <FiMail className="w-4 h-4 text-primary" />
            {unread > 1
              ? t('admin.dashboard.unreadPlural', { count: unread })
              : t('admin.dashboard.unread', { count: unread })}
          </span>
          <span className="text-xs font-semibold text-primary">{t('admin.dashboard.see')}</span>
        </button>
      )}
    </div>
  );
}