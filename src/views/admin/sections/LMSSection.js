import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import useLMS from '../../../hooks/useLMS';
import { toEmbedUrl } from '../../../service/videoEmbed';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { toast } from '../../../service/swal';

const uid = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function LMSSection() {
  const { modules, loading, error, save } = useLMS();
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (Array.isArray(modules)) {
      setItems(modules.map((m, i) => ({
        ...m,
        id: m.id || `local-${i}-${uid()}`,
        lessons: (m.lessons || []).map((l, j) => ({ ...l, id: l.id || `local-l-${i}-${j}-${uid()}` })),
      })));
    }
  }, [modules]);

  const updateModule = (id, patch) =>
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const removeModule = (id) => setItems((prev) => prev.filter((m) => m.id !== id));
  const addModule = () =>
    setItems((prev) => [...prev, { id: uid(), title: '', description: '', lessons: [] }]);

  const updateLesson = (mId, lId, patch) =>
    setItems((prev) =>
      prev.map((m) =>
        m.id === mId ? { ...m, lessons: m.lessons.map((l) => (l.id === lId ? { ...l, ...patch } : l)) } : m
      )
    );
  const removeLesson = (mId, lId) =>
    setItems((prev) =>
      prev.map((m) => (m.id === mId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lId) } : m))
    );
  const addLesson = (mId) =>
    setItems((prev) =>
      prev.map((m) =>
        m.id === mId ? { ...m, lessons: [...m.lessons, { id: uid(), title: '', url: '', embedUrl: '', content: '' }] } : m
      )
    );

  const handleUrlChange = (mId, lId, value) => {
    const embed = toEmbedUrl(value);
    updateLesson(mId, lId, { url: value, embedUrl: embed ? embed.embedUrl : '' });
  };

  const handleSave = async () => {
    setSaving(true);
    const { ok } = await save(items);
    setSaving(false);
    if (ok) {
      toast('success', 'Formation enregistrée');
    } else {
      toast('error', "Échec de l'enregistrement : API inaccessible");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">Formation</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          Le mini-LMS : des modules (ma méthode de programmation) composés de leçons avec une vidéo (YouTube,
          Drive, Vimeo, Dailymotion) et un contenu écrit.
        </p>
      </div>

      {loading && <Loading variant="list" />}
      {error && <ErrorBanner message="API inaccessible : impossible de charger ou d'enregistrer la formation." />}

      {!loading && !error && (
        <>
          {items.map((module) => (
            <div key={module.id} className="card-root p-6 md:p-8 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <input
                  value={module.title || ''}
                  onChange={(e) => updateModule(module.id, { title: e.target.value })}
                  className="input-root flex-1"
                  placeholder="Titre du module (ex : Ma méthode de programmation)"
                />
                <button
                  type="button"
                  onClick={() => removeModule(module.id)}
                  aria-label="Supprimer le module"
                  className="h-9 w-9 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="label-root mb-2">Description du module (écrit)</label>
                <textarea
                  value={module.description || ''}
                  onChange={(e) => updateModule(module.id, { description: e.target.value })}
                  rows="3"
                  className="input-root"
                  placeholder="Ce que l'apprenant découvrira dans ce module..."
                />
              </div>

              <div className="space-y-4">
                {module.lessons.map((lesson) => {
                  const embed = toEmbedUrl(lesson.url);
                  return (
                    <div
                      key={lesson.id}
                      className="border border-stroke/70 dark:border-[#2C303B] p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <input
                          value={lesson.title || ''}
                          onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                          className="input-root flex-1"
                          placeholder="Titre de la leçon"
                        />
                        <button
                          type="button"
                          onClick={() => removeLesson(module.id, lesson.id)}
                          aria-label="Supprimer la leçon"
                          className="h-9 w-9 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="label-root mb-2">Lien de la vidéo</label>
                        <input
                          value={lesson.url || ''}
                          onChange={(e) => handleUrlChange(module.id, lesson.id, e.target.value)}
                          className="input-root"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        {embed ? (
                          <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            Lien valide — {embed.provider}
                          </p>
                        ) : (
                          lesson.url && (
                            <p className="mt-2 text-sm font-semibold text-red-500">
                              Lien non reconnu — utilisez un lien YouTube, Google Drive, Vimeo ou Dailymotion
                            </p>
                          )
                        )}
                        {embed && (
                          <div className="mt-4">
                            <div className="relative aspect-video bg-black">
                              <iframe
                                src={embed.embedUrl}
                                title={`Aperçu — ${lesson.title || 'leçon'}`}
                                className="absolute inset-0 w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="label-root mb-2">Contenu écrit (optionnel)</label>
                        <textarea
                          value={lesson.content || ''}
                          onChange={(e) => updateLesson(module.id, lesson.id, { content: e.target.value })}
                          rows="4"
                          className="input-root"
                          placeholder="Le récapitulatif écrit de la leçon..."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => addLesson(module.id)}
                className="btn-outline-root w-full"
              >
                <FiPlus className="w-4 h-4" /> Ajouter une leçon
              </button>
            </div>
          ))}

          <button type="button" onClick={addModule} className="btn-outline-root w-full">
            <FiPlus className="w-4 h-4" /> Ajouter un module
          </button>

          <button onClick={handleSave} disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
            <FiSave className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer la formation'}
          </button>
        </>
      )}
    </div>
  );
}