import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiGrid, FiUser, FiCode, FiFolder, FiBriefcase, FiPlayCircle, FiBookOpen, FiLink, FiImage, FiMail,
  FiLogOut, FiExternalLink, FiShield,
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import AdminLogin from '../../components/admin/AdminLogin';
import DashboardSection from './sections/DashboardSection';
import ProfileSection from './sections/ProfileSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import ExperienceSection from './sections/ExperienceSection';
import VideosSection from './sections/VideosSection';
import LMSSection from './sections/LMSSection';
import GallerySection from './sections/GallerySection';
import ResourcesSection from './sections/ResourcesSection';
import MessagesSection from './sections/MessagesSection';
import { useLang } from '../../i18n/LanguageContext';

const TABS = [
  { key: 'dashboard', icon: FiGrid },
  { key: 'profile', icon: FiUser },
  { key: 'skills', icon: FiCode },
  { key: 'projects', icon: FiFolder },
  { key: 'experience', icon: FiBriefcase },
  { key: 'videos', icon: FiPlayCircle },
  { key: 'lms', icon: FiBookOpen },
  { key: 'gallery', icon: FiImage },
  { key: 'resources', icon: FiLink },
  { key: 'messages', icon: FiMail },
];

export default function AdminPage() {
  const { authed, login, logout, loading, error, checking } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState('dashboard');

  if (!authed) return <AdminLogin onLogin={login} loading={loading || checking} error={error} />;

  const renderSection = () => {
    switch (tab) {
      case 'profile':
        return <ProfileSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'experience':
        return <ExperienceSection />;
      case 'videos':
        return <VideosSection />;
      case 'lms':
        return <LMSSection />;
      case 'gallery':
        return <GallerySection />;
      case 'resources':
        return <ResourcesSection />;
      case 'messages':
        return <MessagesSection />;
      default:
        return <DashboardSection onNavigate={setTab} />;
    }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_minmax(0,1fr)] bg-gray2 dark:bg-[#161B24]">
      <aside className="hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen bg-white dark:bg-gray-dark border-r border-stroke/70 dark:border-[#2C303B]">
        <div className="px-6 h-20 flex items-center gap-3 border-b border-stroke/70 dark:border-[#2C303B]">
          <span className="h-10 w-10 bg-primary/10 flex items-center justify-center">
            <FiShield className="w-5 h-5 text-primary" />
          </span>
          <div>
            <p className="text-base font-extrabold text-black dark:text-white leading-none">{t('admin.title')}</p>
            <p className="mt-1 text-[11px] font-semibold text-body dark:text-body-dark">{t('admin.subtitle')}</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto no-scrollbar">
          {TABS.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                tab === key
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-body dark:text-body-dark hover:text-primary hover:bg-gray2 dark:hover:bg-[#2C303B] border-l-2 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" /> {t(`admin.tabs.${key}`)}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-stroke/70 dark:border-[#2C303B] space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors"
          >
            <FiExternalLink className="w-4 h-4" /> {t('admin.seeSite')}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors"
          >
            <FiLogOut className="w-4 h-4" /> {t('admin.logout')}
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="lg:hidden sticky top-0 z-20 bg-white/95 dark:bg-gray-dark/95 backdrop-blur border-b border-stroke/70 dark:border-[#2C303B]">
          <div className="flex items-center justify-between px-4 h-16 border-b border-stroke/70 dark:border-[#2C303B]">
            <span className="flex items-center gap-2.5 text-base font-extrabold text-black dark:text-white">
              <FiShield className="w-4 h-4 text-primary" /> {t('admin.title')}
            </span>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="h-9 w-9 bg-primary text-white flex items-center justify-center"
                aria-label={t('admin.seeSite')}
              >
                <FiExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={logout}
                className="h-9 w-9 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center"
                aria-label={t('admin.logout')}
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="px-2 py-2.5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {TABS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  tab === key
                    ? 'bg-primary text-white'
                    : 'bg-gray2 dark:bg-[#2C303B] text-body dark:text-body-dark'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {t(`admin.tabs.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <main className="p-5 md:p-8 lg:p-10 max-w-5xl">{renderSection()}</main>
      </div>
    </div>
  );
}