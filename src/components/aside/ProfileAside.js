import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiLinkedin, FiYoutube, FiTwitter, FiDownload, FiCheckCircle, FiMaximize, FiX,
} from 'react-icons/fi';
import { resolveUploadUrl } from '../../config/config';
import Loading from '../ui/Loading';
import { useLang } from '../../i18n/LanguageContext';

const socialIcons = {
  github: FiGithub,
  linkedin: FiLinkedin,
  youtube: FiYoutube,
  twitter: FiTwitter,
};

function ProfilePhotoPopup({ open, onClose, src, alt }) {
  const { t } = useLang();
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('aside.photoPopupAria')}
    >
      <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={alt}
          className="max-w-[92vw] max-h-[82vh] w-auto h-auto object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label={t('ui.closePhoto')}
          className="absolute -top-3 -right-3 h-10 w-10 bg-white/10 text-white flex items-center justify-center hover:bg-primary transition-colors rounded-full shadow-lg"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function ProfileAside({ profile, compact = false }) {
  const [photoOpen, setPhotoOpen] = useState(false);
  const { t } = useLang();

  if (!profile) return <Loading variant="profile" />;

  const photoUrl = resolveUploadUrl(profile.photo);

  const contactRows = [
    { icon: FiMail, label: t('aside.contactEmail'), value: profile.email, href: `mailto:${profile.email}` },
    { icon: FiPhone, label: t('aside.contactPhone'), value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { icon: FiMapPin, label: t('aside.contactLocation'), value: profile.location },
    { icon: FiGlobe, label: t('aside.contactWebsite'), value: profile.website, href: `https://${profile.website}` },
  ];

  if (compact) {
    return (
      <>
        <div className="card-root p-5 flex items-center gap-5">
          <button
            type="button"
            onClick={() => setPhotoOpen(true)}
            aria-label={t('aside.enlargePhotoOf', { name: profile.name })}
            title={t('aside.enlargePhoto')}
            className="group relative flex-shrink-0 rounded-full ring-4 ring-primary/20 hover:ring-primary/40 transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-primary"
          >
            <img src={photoUrl} alt={profile.name} className="h-20 w-20 rounded-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <FiMaximize className="w-5 h-5" />
            </span>
          </button>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-black dark:text-white truncate">{profile.name}</h2>
            <p className="text-sm font-medium text-primary">{profile.role}</p>
            <p className="text-xs text-body dark:text-body-dark mt-0.5">{profile.level}</p>
            <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <FiCheckCircle className="w-3.5 h-3.5" /> {profile.availability}
            </span>
          </div>
        </div>
        <ProfilePhotoPopup open={photoOpen} onClose={() => setPhotoOpen(false)} src={photoUrl} alt={profile.name} />
      </>
    );
  }

  return (
    <>
      <aside className="space-y-6">
      <div className="card-root overflow-hidden">
        <div className="h-24 bg-gradient-to-br relative">
          <div className="absolute inset-0 bg-[size:18px_18px]" />
        </div>
        <div className="relative px-8 pb-8 -mt-14 text-center">
          <button
            type="button"
            onClick={() => setPhotoOpen(true)}
            aria-label={t('aside.enlargePhotoOf', { name: profile.name })}
            title={t('aside.enlargePhoto')}
            className="group relative block mx-auto w-28 h-28 overflow-hidden rounded-lg ring-4 ring-white dark:ring-gray-dark bg-gray2 shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary"
          >
            <img src={photoUrl} alt={profile.name} className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <FiMaximize className="w-6 h-6" />
            </span>
          </button>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-black dark:text-white">{profile.name}</h2>
          <p className="mt-1.5 text-sm font-semibold text-primary">{profile.role}</p>
          <p className="mt-0.5 text-xs text-body dark:text-body-dark">{profile.level}</p>
          <span className="badge-root mt-5 bg-emerald-600">
            <FiCheckCircle className="w-3.5 h-3.5" /> {profile.availability}
          </span>
          <p className="mt-5 text-sm leading-relaxed text-body dark:text-body-dark">{profile.tagline}</p>
        </div>
      </div>

      <div className="card-root p-7">
        <div className="divide-y divide-stroke/70 dark:divide-[#2C303B]">
          {contactRows.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <div className="flex items-start gap-4 group/row">
                <span className="h-11 w-11 bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/row:bg-gradient-to-br group-hover/row:from-primary group-hover/row:to-blue-600">
                  <Icon className="w-5 h-5 text-primary transition-colors duration-300 group-hover/row:text-white" />
                </span>
                <div className="min-w-0 pt-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-body dark:text-body-dark">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-dark dark:text-white break-words">{value}</p>
                </div>
              </div>
            );
            return href ? (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="block py-4 first:pt-0 last:pb-0">
                {content}
              </a>
            ) : (
              <div key={label} className="py-4 first:pt-0 last:pb-0">{content}</div>
            );
          })}
        </div>
      </div>

      <div className="card-root p-7 grid grid-cols-2 gap-4 text-center">
        { (profile.stats || []).map(({ number, label }) => (
          <div key={label} className="py-2">
            <div className="text-2xl font-extrabold text-primary">{number}</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-body dark:text-body-dark">{label}</div>
          </div>
        ))}
      </div>

      {profile.resumeUrl && (
        <a
          href={resolveUploadUrl(profile.resumeUrl)}
          download
          aria-label={t('aside.downloadCvOf', { name: profile.name })}
          className="btn-primary-root w-full"
        >
          <FiDownload className="w-4 h-4" /> {t('aside.downloadCv')}
        </a>
      )}

      <div className="card-root p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-body dark:text-body-dark text-center">{t('aside.findMe')}</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          {(profile.socials || []).map(({ key, label, url }) => {
            const Icon = socialIcons[key] || FiGlobe;
            return (
              <a
                key={key}
                href={url}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 bg-gray2 dark:bg-[#2C303B] flex items-center justify-center text-dark dark:text-white hover:text-white hover:bg-primary hover:-translate-y-0.5 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>
    </aside>
      <ProfilePhotoPopup open={photoOpen} onClose={() => setPhotoOpen(false)} src={photoUrl} alt={profile.name} />
    </>
  );
}