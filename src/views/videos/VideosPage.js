import React, { useState } from 'react';
import { FiPlayCircle, FiPlusCircle } from 'react-icons/fi';
import PageMeta from '../../components/PageMeta';
import Reveal from '../../components/ui/Reveal';
import SectionTitle from '../../components/ui/SectionTitle';
import VideoCard from '../../components/ui/VideoCard';
import Loading from '../../components/ui/Loading';
import ErrorBanner from '../../components/ui/ErrorBanner';
import useVideos from '../../hooks/useVideos';
import useAuth from '../../hooks/useAuth';
import { FORGE_CONFIGURED } from '../../service/api';
import { toEmbedUrl } from '../../service/videoEmbed';
import { toast } from '../../service/swal';

export default function VideosPage() {
  const { videos, loading, error, addVideo, removeVideo } = useVideos();
  const { authed } = useAuth();
  const isAdmin = FORGE_CONFIGURED && authed;
  const [form, setForm] = useState({ title: '', url: '', description: '' });
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setForm({ ...form, url });
    setPreview(toEmbedUrl(url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      toast('warning', 'Veuillez renseigner le titre et le lien de la vidéo');
      return;
    }
    if (!preview) {
      toast('error', "Lien non reconnu — utilisez un lien YouTube, Google Drive, Vimeo ou Dailymotion");
      return;
    }
    setSaving(true);
    const { ok } = await addVideo({
      title: form.title.trim(),
      url: form.url.trim(),
      embedUrl: preview.embedUrl,
      description: form.description.trim(),
    });
    setSaving(false);
    if (ok) {
      toast('success', 'Vidéo ajoutée avec succès');
      setForm({ title: '', url: '', description: '' });
      setPreview(null);
    } else {
      toast('error', "Impossible d'ajouter la vidéo");
    }
  };

  return (
    <div>
      <PageMeta title="Tutos vidéo" description="Mes tutoriels vidéo de développement web : React, JavaScript, full-stack et plus." />

      <section className="relative pl-5 overflow-hidden bg-white dark:bg-gray-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,108,247,0.12)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative py-16 md:py-19 border-b border-stroke/70 dark:border-[#2C303B]">
          <Reveal className="max-w-3xl">
            <span className="eyebrow-root">
              <span className="h-1.5 w-1.5 bg-primary inline-block" />
              Apprendre avec moi
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black dark:text-white">
              Mes{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">tutos vidéo</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-body dark:text-body-dark leading-relaxed">
              Des tutoriels concrets en développement web : React, JavaScript, API, bases de données et
              bonnes pratiques.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-3">
          {isAdmin && (
          <>
          <SectionTitle
            eyebrow="Ajouter une vidéo"
            title="Publier un nouveau tutoriel"
            sub="Collez le lien de votre vidéo (YouTube, Google Drive, Vimeo ou Dailymotion) : l'aperçu se génère automatiquement."
          />
          <Reveal>
            <form onSubmit={handleSubmit} className="card-root p-8 md:p-10 space-y-6">
              <div>
                <label className="label-root mb-2.5">Titre de la vidéo</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="input-root"
                  placeholder="Ex : Créer une API REST avec Node.js"
                />
              </div>
              <div>
                <label className="label-root mb-2.5">Lien de la vidéo</label>
                <input
                  name="url"
                  value={form.url}
                  onChange={handleUrlChange}
                  className="input-root"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {preview ? (
                  <p className="mt-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Lien valide — {preview.provider}
                  </p>
                ) : (
                  form.url && (
                    <p className="mt-2.5 text-sm font-semibold text-red-500">
                      Lien non reconnu — utilisez un lien YouTube, Google Drive, Vimeo ou Dailymotion
                    </p>
                  )
                )}
                {preview && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-body dark:text-body-dark mb-2.5">
                      Aperçu ({preview.provider})
                    </p>
                    <div className="relative aspect-video bg-black">
                      <iframe
                        src={preview.embedUrl}
                        title="Aperçu de la vidéo"
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
                <label className="label-root mb-2.5">Description (optionnel)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="input-root"
                  placeholder="Ce que les apprenants découvriront dans ce tutoriel..."
                />
              </div>
              <button type="submit" disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
                <FiPlusCircle className="w-4 h-4" /> {saving ? 'Ajout en cours...' : 'Publier la vidéo'}
              </button>
            </form>
          </Reveal>

          {error && (
            <div className="mt-8">
              <ErrorBanner message="API inaccessible : publier ou supprimer une vidéo est impossible pour le moment." />
            </div>
          )}
          </>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow="La vidéothèque"
            title="Tous les tutoriels"
            sub="Regardez, apprenez et codez avec moi."
          />
          {loading ? (
            <Loading variant="cardGrid2" />
          ) : error ? (
            <ErrorBanner message="Impossible de charger les vidéos." />
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video, index) => (
                <Reveal key={video.id || video.title} delay={(index % 2) * 100}>
                  <VideoCard video={video} removable={isAdmin} onRemove={removeVideo} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="card-root p-12 text-center">
              <FiPlayCircle className="mx-auto w-10 h-10 text-primary/40" />
              <p className="mt-4 text-body dark:text-body-dark">
                Aucune vidéo pour le moment.{isAdmin ? ' Ajoutez votre premier tutoriel avec le formulaire ci-dessus.' : ''}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}