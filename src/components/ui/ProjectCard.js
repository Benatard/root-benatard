import React from 'react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { resolveUploadUrl } from '../../config/config';

export default function ProjectCard({ project }) {
  return (
    <div className="group card-root overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">
      <div className="relative h-44 overflow-hidden bg-white dark:bg-gray-dark">
        <img
          src={resolveUploadUrl(project.image)}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="badge-root absolute top-4 left-4">{project.category}</span>
        {project.year && (
          <span className="absolute top-4 right-4 bg-white dark:bg-gray-dark px-3 py-1 text-xs font-bold text-dark dark:text-white shadow-card">
            {project.year}
          </span>
        )}
      </div>
      <div className="p-7 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-black dark:text-white">{project.title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-body dark:text-body-dark flex-1">{project.desc}</p>
        {project.stack?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className="bg-gray2 dark:bg-[#2C303B] px-2.5 py-1 text-[11px] font-semibold text-body dark:text-body-dark">
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-5 flex items-center gap-5 text-sm font-semibold">
          {project.demo && project.demo !== '#' && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
              <FiExternalLink className="w-4 h-4" /> Démo
            </a>
          )}
          {project.repo && project.repo !== '#' && (
            <a href={project.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-body dark:text-body-dark hover:text-primary transition-colors">
              <FiGithub className="w-4 h-4" /> Code source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}