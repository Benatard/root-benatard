import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCamera, FiCode, FiFolder, FiPlayCircle, FiPhone } from 'react-icons/fi';
import PageMeta from '../components/PageMeta';
import { useProfile } from '../context/ProfileContext';
import Reveal from '../components/ui/Reveal';
import SectionTitle from '../components/ui/SectionTitle';
import ProjectCard from '../components/ui/ProjectCard';
import VideoCard from '../components/ui/VideoCard';
import Slideshow from '../components/ui/Slideshow';
import SkillBar from '../components/ui/SkillBar';
import Loading from '../components/ui/Loading';
import ErrorBanner from '../components/ui/ErrorBanner';
import useResource from '../hooks/useResource';
import useVideos from '../hooks/useVideos';
import useGallery from '../hooks/useGallery';
import { skillsAPI, projectsAPI } from '../service/api';
import { normalizeSkills } from '../config/icons';
import { useLang } from '../i18n/LanguageContext';

export default function HomePage() {
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { data: skills, loading: skillsLoading, error: skillsError } = useResource(skillsAPI.get);
  const { data: projects, loading: projectsLoading, error: projectsError } = useResource(projectsAPI.get);
  const { videos, loading: videosLoading, error: videosError } = useVideos();
  const { photos: galleryPhotos, loading: galleryLoading, error: galleryError } = useGallery();
  const { t } = useLang();

  const categories = normalizeSkills(skills)?.categories || [];
  const latestProjects = Array.isArray(projects) ? projects.slice(0, 3) : [];
  const latestVideos = videos.slice(0, 2);
  const slides = galleryPhotos.slice(0, 6);

  if (profileLoading) {
    return (
      <>
        <PageMeta title={t('home.metaTitle')} />
        <div className="py-8"><Loading variant="hero" /></div>
      </>
    );
  }

  if (profileError || !profile) {
    return (
      <>
        <PageMeta title={t('home.metaTitle')} />
        <div className="max-w-5xl mx-auto px-5 py-16 text-center">
          <ErrorBanner message={t('common.profileLoadError')} />
        </div>
      </>
    );
  }

  return (
    <div>
      <PageMeta title={t('home.metaTitle')} description={profile ? `${profile.title} — ${profile.tagline}` : undefined} />

      <section className="relative pl-5 overflow-hidden bg-white dark:bg-gray-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,108,247,0.12)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative py-16 md:py-19 border-b border-stroke/70 dark:border-[#2C303B]">
          <Reveal className="max-w-3xl">
            <span className="eyebrow-root">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {profile.title}
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-black dark:text-white">
              {profile.name},{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {profile.role}
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-body dark:text-body-dark max-w-[620px]">
              {profile.bio}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/projets" className="btn-primary-root">
                {t('home.seeProjects')} <FiFolder className="w-4 h-4" />
              </Link>
              <Link to="/videos" className="btn-outline-root">
                {t('home.myTutorials')} <FiPlayCircle className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-black-root">
                {t('home.contactMe')} <FiPhone className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            { (profile.stats || []).map(({ number, label }, index) => (
              <Reveal key={label} delay={index * 100}>
                <div className="card-root p-6 text-center transition-all duration-300 hover:shadow-card-hover">
                  <div className="text-3xl font-extrabold text-primary">{number}</div>
                  <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-body dark:text-body-dark">{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow={t('home.expertise')}
            title={t('home.topSkills')}
            sub={t('home.topSkillsSub')}
          />
          {skillsLoading ? (
            <Loading variant="cardGrid2" />
          ) : skillsError ? (
            <ErrorBanner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.slice(0, 2).map(({ icon: Icon, name, color, skills: categorySkills }, index) => (
                <Reveal key={name} delay={index * 100}>
                  <div className="card-root p-8 h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">
                    <div className="flex items-center gap-4">
                      <span className={`h-12 w-12 bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </span>
                      <h3 className="text-lg font-bold text-black dark:text-white">{name}</h3>
                    </div>
                    <div className="mt-7 space-y-5">
                      {categorySkills.map((skill) => (
                        <SkillBar key={skill.name} name={skill.name} level={skill.level} color={color} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/competences" className="btn-outline-root">
              {t('home.seeAllSkills')} <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow={t('home.realisations')}
            title={t('home.recentProjects')}
            sub={t('home.recentProjectsSub')}
          />
          {projectsLoading ? (
            <Loading variant="cards" count={3} />
          ) : projectsError ? (
            <ErrorBanner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestProjects.map((project, index) => (
                <Reveal key={project.id || project.title} delay={(index % 3) * 100}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/projets" className="btn-primary-root">
              {t('home.allProjects')} <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow={t('home.learnWithMe')}
            title={t('home.latestVideos')}
            sub={t('home.latestVideosSub')}
          />
          {videosLoading ? (
            <Loading variant="cardGrid2" />
          ) : videosError ? (
            <ErrorBanner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestVideos.map((video, index) => (
                <Reveal key={video.id || video.title} delay={index * 100}>
                  <VideoCard video={video} />
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/videos" className="btn-outline-root">
              {t('home.allVideos')} <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow={t('home.inImages')}
            title={t('home.gallery')}
            sub={t('home.gallerySub')}
          />
          {galleryLoading ? (
            <div className="max-w-3xl mx-auto card-root overflow-hidden">
              <div className="aspect-video md:aspect-[16/10] bg-gray2 dark:bg-[#2C303B] animate-pulse" />
            </div>
          ) : galleryError ? (
            <ErrorBanner />
          ) : slides.length > 0 ? (
            <Reveal className="max-w-3xl mx-auto">
              <Slideshow
                photos={slides}
                lightbox={false}
                thumbnails={false}
                autoplayInterval={5000}
              />
            </Reveal>
          ) : (
            <div className="max-w-3xl mx-auto card-root p-12 text-center">
              <FiCamera className="mx-auto w-10 h-10 text-primary/40" />
              <p className="mt-4 text-body dark:text-body-dark">{t('home.noPhoto')}</p>
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/galerie" className="btn-outline-root">
              {t('home.seeGallery')} <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="pb-4 pt-16 md:pt-24">
          <Reveal>
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 px-8 py-12 md:px-16 text-center">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] pointer-events-none" />
              <h2 className="relative text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                {t('home.projectIdea')}
              </h2>
              <p className="relative mt-4 text-white/80 max-w-xl mx-auto">
                {t('home.projectIdeaDesc')}
              </p>
              <div className="relative mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn-white-root">
                  {t('home.contactMe')} <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/projets" className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold bg-black/25 border border-white/25 text-white hover:bg-black/40 transition-colors duration-300">
                  <FiCode className="w-4 h-4" /> {t('home.seeMyCode')}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}