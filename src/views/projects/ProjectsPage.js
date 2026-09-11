import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import PageMeta from '../../components/PageMeta';
import Reveal from '../../components/ui/Reveal';
import SectionTitle from '../../components/ui/SectionTitle';
import ProjectCard from '../../components/ui/ProjectCard';
import Loading from '../../components/ui/Loading';
import ErrorBanner from '../../components/ui/ErrorBanner';
import useResource from '../../hooks/useResource';
import { projectsAPI } from '../../service/api';

const filters = ['Tous', 'Full-Stack Web', 'ERP', 'SaaS', 'Frontend', 'Embedded'];

export default function ProjectsPage() {
  const { data: projects, loading, error } = useResource(projectsAPI.get);
  const [activeFilter, setActiveFilter] = useState('Tous');

  const list = Array.isArray(projects) ? projects : [];
  const filtered = activeFilter === 'Tous' ? list : list.filter((p) => p.category === activeFilter);

  return (
    <div>
      <PageMeta title="Projets" description="Découvrez mes projets de développement web : ERP, SaaS, applications full-stack." />

      <section className="relative pl-5 overflow-hidden bg-white dark:bg-gray-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,108,247,0.12)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative py-16 md:py-19 border-b border-stroke/70 dark:border-[#2C303B]">
          <Reveal className="max-w-3xl">
            <span className="eyebrow-root">
              <span className="h-1.5 w-1.5 bg-primary inline-block" />
              Mes réalisations
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black dark:text-white">
              Mes{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">projets</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-body dark:text-body-dark leading-relaxed">
              Des applications web complètes, du design à la mise en production : ERP, SaaS,
              dashboards et sites vitrines.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-19">
          <div className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-primary text-white shadow-btn'
                    : 'bg-white dark:bg-gray-dark text-body dark:text-body-dark hover:text-primary shadow-card'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {loading ? (
            <Loading variant="cards" />
          ) : error ? (
            <ErrorBanner message="Impossible de charger les projets." />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, index) => (
                <Reveal key={project.id || project.title} delay={(index % 3) * 100}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="card-root p-12 text-center">
              <p className="text-body dark:text-body-dark">Aucun projet dans cette catégorie pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="py-16 md:py-19">
          <Reveal>
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 px-8 py-12 md:px-16 text-center">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />
              <h2 className="relative text-2xl md:text-3xl font-bold tracking-tight text-white">
                Vous avez un projet similaire en tête ?
              </h2>
              <p className="relative mt-4 text-white/80 max-w-xl mx-auto">
                Parlons-en ensemble : je peux vous aider à le concrétiser, du cahier des charges au déploiement.
              </p>
              <div className="relative mt-8 flex justify-center">
                <Link to="/contact" className="btn-white-root">
                  Discuter de mon projet <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}