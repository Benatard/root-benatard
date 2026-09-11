import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from '../../service/swal';

export default function VideoCard({ video, onRemove, removable = false }) {
  const handleRemove = async () => {
    const result = await onRemove(video.id);
    if (result && result.ok === false) {
      toast('error', 'Échec de la suppression : API inaccessible');
    }
  };

  return (
    <div className="card-root overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-card-hover">
      <div className="relative aspect-video bg-black">
        <iframe
          src={video.embedUrl}
          title={video.title}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-black dark:text-white leading-snug">{video.title}</h3>
          {removable && onRemove && (
            <button
              onClick={handleRemove}
              aria-label="Supprimer la vidéo"
              className="h-8 w-8 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {video.description && (
          <p className="mt-2 text-sm leading-relaxed text-body dark:text-body-dark flex-1">{video.description}</p>
        )}
        {video.date && (
          <p className="mt-auto pt-3 text-[11px] font-semibold uppercase tracking-widest text-body dark:text-body-dark">
            Publié le {new Date(video.date).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>
    </div>
  );
}