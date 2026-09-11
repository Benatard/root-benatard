import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import PageMeta from '../../components/PageMeta';
import { useProfile } from '../../context/ProfileContext';
import Reveal from '../../components/ui/Reveal';
import SectionTitle from '../../components/ui/SectionTitle';
import SkillBar from '../../components/ui/SkillBar';
import Loading from '../../components/ui/Loading';
import ErrorBanner from '../../components/ui/ErrorBanner';
import useResource from '../../hooks/useResource';
import { skillsAPI } from '../../service/api';
import { normalizeSkills } from '../../config/icons';

export default function SkillsPage() {
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { data: skills, loading: skillsLoading, error: skillsError } = useResource(skillsAPI.get);

  const categories = normalizeSkills(skills)?.categories || [];

  if (profileLoading) {
    return (
      <>
        <PageMeta title="Compétences" />
        <div className="py-8"><Loading variant="hero" /></div>
      </>
    );
  }

  if (profileError || !profile) {
    return (
      <>
        <PageMeta title="Compétences" />
        <div className="max-w-5xl mx-auto px-5 py-16 text-center">
          <ErrorBanner message="Impossible de charger le profil. L'API est peut-être inaccessible." />
        </div>
      </>
    );
  }

  return (
    <div>
      <PageMeta title="Compétences" description="Les technologies que je maîtrise : frontend, backend, bases de données et outils DevOps." />

      <section className="relative pl-5 overflow-hidden bg-white dark:bg-gray-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,108,247,0.12)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative py-16 md:py-19 border-b border-stroke/70 dark:border-[#2C303B]">
          <Reveal className="max-w-3xl">
            <span className="eyebrow-root">
              <span className="h-1.5 w-1.5 bg-primary inline-block" />
              Mes compétences
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black dark:text-white">
              Les technologies que{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">je maîtrise</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-body dark:text-body-dark leading-relaxed">
              Un profil polyvalent de développeur Full-Stack : du design d'interface React à la
              conception d'API et de bases de données, en passant par le déploiement.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow="Niveaux de maîtrise"
            title="Mes domaines d'expertise"
            sub="Des niveaux évalués sur la base de mes projets et de ma pratique quotidienne."
          />
          {skillsLoading ? (
            <Loading variant="cardGrid2" />
          ) : skillsError ? (
            <ErrorBanner message="Impossible de charger les compétences." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map(({ icon: Icon, name, color, skills: categorySkills }, index) => (
                <Reveal key={name} delay={(index % 2) * 100}>
                  <div className="card-root p-8 h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">
                    <div className="flex items-center gap-4">
                      <span className={`h-12 w-12 bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </span>
                      <h2 className="text-xl font-bold text-black dark:text-white">{name}</h2>
                    </div>
                    <div className="mt-7 space-y-6">
                      {categorySkills.map((skill) => (
                        <SkillBar key={skill.name} name={skill.name} level={skill.level} color={color} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="py-16 md:py-19">
          <Reveal>
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 px-8 py-12 md:px-14">
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-black/10 blur-3xl pointer-events-none" />
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {(profile.stats || []).map(({ number, label }, index) => (
                  <div key={label} className={index > 0 ? 'md:border-l md:border-white/15' : ''}>
                    <div className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-sm">{number}</div>
                    <div className="mt-2 text-sm text-white/80">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <div className="mt-12 text-center">
            <Link to="/projets" className="btn-primary-root">
              Voir mes projets concrets <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}