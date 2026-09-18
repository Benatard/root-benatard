import React from 'react';
import { FiCamera, FiMaximize } from 'react-icons/fi';
import PageMeta from '../../components/PageMeta';
import Reveal from '../../components/ui/Reveal';
import SectionTitle from '../../components/ui/SectionTitle';
import Slideshow from '../../components/ui/Slideshow';
import Loading from '../../components/ui/Loading';
import ErrorBanner from '../../components/ui/ErrorBanner';
import useGallery from '../../hooks/useGallery';
import { useLang } from '../../i18n/LanguageContext';

export default function GalleryPage() {
  const { photos, loading, error } = useGallery();
  const { t } = useLang();

  return (
    <div>
      <PageMeta
        title={t('gallery.metaTitle')}
        description={t('gallery.metaDesc')}
      />

      <section className="relative pl-5 overflow-hidden bg-white dark:bg-gray-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,108,247,0.12)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative py-16 md:py-19 border-b border-stroke/70 dark:border-[#2C303B]">
          <Reveal className="max-w-3xl">
            <span className="eyebrow-root">
              <FiCamera className="w-4 h-4" /> {t('gallery.eyebrow')}
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black dark:text-white">
              {t('gallery.title1')}{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{t('gallery.titleHighlight')}</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-body dark:text-body-dark leading-relaxed">
              {t('gallery.intro')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow={t('gallery.slideshow')}
            title={t('gallery.title2')}
            sub={t('gallery.sub2')}
          />

          {loading ? (
            <div className="max-w-3xl mx-auto card-root overflow-hidden">
              <div className="aspect-video bg-gray2 dark:bg-[#2C303B] animate-pulse" />
            </div>
          ) : error ? (
            <ErrorBanner message={t('gallery.loadError')} />
          ) : photos.length > 0 ? (
            <Reveal className="max-w-3xl mx-auto">
              <Slideshow photos={photos} />
            </Reveal>
          ) : (
            <div className="max-w-3xl mx-auto card-root p-12 text-center">
              <FiMaximize className="mx-auto w-10 h-10 text-primary/40" />
              <p className="mt-4 text-body dark:text-body-dark">
                {t('gallery.noPhoto')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}