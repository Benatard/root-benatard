import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiBookOpen, FiBriefcase, FiCheck, FiTarget, FiEye, FiDownload } from 'react-icons/fi';
import PageMeta from '../../components/PageMeta';
import { useProfile } from '../../context/ProfileContext';
import Reveal from '../../components/ui/Reveal';
import SectionTitle from '../../components/ui/SectionTitle';
import Loading from '../../components/ui/Loading';
import ErrorBanner from '../../components/ui/ErrorBanner';
import useResource from '../../hooks/useResource';
import { experienceAPI } from '../../service/api';
import { resolveUploadUrl } from '../../config/config';

export default function AboutPage() {
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { data: experience, loading: experienceLoading, error: experienceError } = useResource(experienceAPI.get);

  const experiences = experience?.experiences || [];
  const education = experience?.education || [];
  const values = experience?.values || [];

  if (profileLoading) {
    return (
      <>
        <PageMeta title="À propos" />
        <div className="py-8"><Loading variant="hero" /></div>
      </>
    );
  }

  if (profileError || !profile) {
    return (
      <>
        <PageMeta title="À propos" />
        <div className="max-w-5xl mx-auto px-5 py-16 text-center">
          <ErrorBanner message="Impossible de charger le profil. L'API est peut-être inaccessible." />
        </div>
      </>
    );
  }

  return (
    <div>
      <PageMeta title="À propos" description={profile ? `${profile.title} — parcours, expérience et formation.` : undefined} />

      <section className="relative pl-5 overflow-hidden bg-white dark:bg-gray-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,108,247,0.12)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative py-16 md:py-19 border-b border-stroke/70 dark:border-[#2C303B]">
          <Reveal className="max-w-3xl">
            <span className="eyebrow-root">
              <span className="h-1.5 w-1.5 bg-primary inline-block" />
              À propos de moi
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black dark:text-white">
              De la curiosité au{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">métier de développeur</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-body dark:text-body-dark leading-relaxed">
              {profile.bio}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow="Mon parcours"
            title="Expérience professionnelle"
            sub="Chaque étape m'a permis de monter en compétence, du premier projet au développement d'ERP."
          />
          {experienceLoading ? (
            <Loading variant="list" />
          ) : experienceError ? (
            <ErrorBanner message="Impossible de charger le parcours professionnel." />
          ) : (
            <div className="space-y-6">
              {experiences.map(({ role, company, period, desc }, index) => (
                <Reveal key={`${role}-${company}`} delay={index * 100}>
                  <div className="group card-root p-8 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <span className="h-12 w-12 bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-blue-600 transition-all duration-300">
                          <FiBriefcase className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-black dark:text-white">{role}</h3>
                          <p className="mt-1 text-sm font-semibold text-primary">{company}</p>
                        </div>
                      </div>
                      <span className="badge-root flex-shrink-0">{period}</span>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-body dark:text-body-dark">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow="Mes études"
            title="Formation"
            sub="Une base solide en informatique complétée par des certifications pratiques."
          />
          {experienceLoading ? (
            <Loading variant="cardGrid2" />
          ) : experienceError ? (
            <ErrorBanner message="Impossible de charger la formation." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map(({ degree, school, period, desc }, index) => (
                <Reveal key={`${degree}-${school}`} delay={index * 100}>
                  <div className="card-root p-8 h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">
                    <div className="flex items-center gap-4">
                      <span className="h-12 w-12 bg-primary/10 flex items-center justify-center">
                        <FiBookOpen className="w-5 h-5 text-primary" />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-black dark:text-white">{degree}</h3>
                        <p className="text-sm font-semibold text-primary mt-0.5">{school}</p>
                      </div>
                    </div>
                    <span className="badge-root mt-5">{period}</span>
                    <p className="mt-4 text-sm leading-relaxed text-body dark:text-body-dark">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="pb-4 pt-16 md:pt-24">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-root p-8 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">
                <div className="h-12 w-12 bg-primary/10 flex items-center justify-center">
                  <FiEye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-black dark:text-white">Ma vision</h3>
                <p className="mt-3 text-sm leading-relaxed text-body dark:text-body-dark">
                  Contribuer à la transformation digitale de la région en concevant des applications web
                  accessibles, performantes et utiles au plus grand nombre.
                </p>
              </div>
              <div className="card-root p-8 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">
                <div className="h-12 w-12 bg-primary/10 flex items-center justify-center">
                  <FiTarget className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-black dark:text-white">Ma mission</h3>
                <p className="mt-3 text-sm leading-relaxed text-body dark:text-body-dark">
                  Livrer un code de qualité, apprendre chaque jour et partager mes connaissances à travers
                  des tutoriels vidéo pour faire grandir la communauté des développeurs.
                </p>
              </div>
            </div>
          </Reveal>
          {profile.resumeUrl && (
            <div className="mt-10 text-center">
              <a
                href={resolveUploadUrl(profile.resumeUrl)}
                download
                aria-label={`Télécharger le CV de ${profile.name}`}
                className="btn-outline-root"
              >
                <FiDownload className="w-4 h-4" /> Télécharger mon CV (PDF)
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow="Ce qui me guide"
            title="Mes valeurs"
            sub="Les principes qui orientent mon travail au quotidien."
          />
          {experienceLoading ? (
            <Loading variant="cards" count={4} />
          ) : experienceError ? (
            <ErrorBanner message="Impossible de charger les valeurs." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ title, desc }, index) => (
                <Reveal key={title} delay={index * 100}>
                  <div className="card-root p-8 h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">
                    <span className="text-3xl font-extrabold text-[#E9EDF4] dark:text-[#2E3542]">
                      0{index + 1}
                    </span>
                    <div className="mt-4 h-11 w-11 bg-primary/10 flex items-center justify-center">
                      <FiCheck className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-black dark:text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-body dark:text-body-dark">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
          <Reveal className="mt-14">
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 px-8 py-12 md:px-16 text-center">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />
              <h2 className="relative text-2xl md:text-3xl font-bold tracking-tight text-white">
                Envie de collaborer sur un projet ?
              </h2>
              <div className="relative mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn-white-root">
                  Travaillons ensemble <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/projets" className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold bg-black/25 border border-white/25 text-white hover:bg-black/40 transition-colors duration-300">
                  <FiAward className="w-4 h-4" /> Mes projets
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}