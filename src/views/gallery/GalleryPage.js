import React from 'react';
import { FiCamera, FiMaximize } from 'react-icons/fi';
import PageMeta from '../../components/PageMeta';
import Reveal from '../../components/ui/Reveal';
import SectionTitle from '../../components/ui/SectionTitle';
import Slideshow from '../../components/ui/Slideshow';
import Loading from '../../components/ui/Loading';
import ErrorBanner from '../../components/ui/ErrorBanner';
import useGallery from '../../hooks/useGallery';

export default function GalleryPage() {
  const { photos, loading, error } = useGallery();

  return (
    <div>
      <PageMeta
        title="Galerie photos"
        description="Galerie photos : mes projets, chantiers réseau, sites et applications développés."
      />

      <section className="relative pl-5 overflow-hidden bg-white dark:bg-gray-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,108,247,0.12)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative py-16 md:py-19 border-b border-stroke/70 dark:border-[#2C303B]">
          <Reveal className="max-w-3xl">
            <span className="eyebrow-root">
              <FiCamera className="w-4 h-4" /> Mes réalisations en images
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black dark:text-white">
              La{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">galerie photo</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-body dark:text-body-dark leading-relaxed">
              Chantiers réseau, installations, applications et événements : un aperçu en diaporama de mes
              réalisations sur le terrain comme à l'écran.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow="Diaporama"
            title="Découvrez mon univers en images"
            sub="Utilisez les flèches, les vignettes ou le clavier (←/→). Cliquez sur une photo pour l'agrandir."
          />

          {loading ? (
            <div className="max-w-3xl mx-auto card-root overflow-hidden">
              <div className="aspect-video bg-gray2 dark:bg-[#2C303B] animate-pulse" />
            </div>
          ) : error ? (
            <ErrorBanner message="Impossible de charger la galerie." />
          ) : photos.length > 0 ? (
            <Reveal className="max-w-3xl mx-auto">
              <Slideshow photos={photos} />
            </Reveal>
          ) : (
            <div className="max-w-3xl mx-auto card-root p-12 text-center">
              <FiMaximize className="mx-auto w-10 h-10 text-primary/40" />
              <p className="mt-4 text-body dark:text-body-dark">
                Aucune photo pour le moment. Revenez bientôt !
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}