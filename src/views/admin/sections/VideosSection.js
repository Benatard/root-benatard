import React, { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import useVideos from '../../../hooks/useVideos';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { toEmbedUrl } from '../../../service/videoEmbed';
import { toast, confirmAction } from '../../../service/swal';
import AdminListEditor from '../../../components/admin/AdminListEditor';

export default function VideosSection() {
  const { videos, loading, error, addVideo, updateVideo, removeVideo } = useVideos();
  const [form, setForm] = useState({ title: '', url: '', description: '' });
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

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
      toast('error', 'Lien non reconnu — utilisez un lien YouTube, Google Drive, Vimeo ou Dailymotion');
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

  const handleSaveItem = async (item) => {
    const embed = toEmbedUrl(item.url || '');
    if (!embed) {
      toast('error', `Lien non reconnu pour « ${item.title} »`);
      return;
    }
    const result = await updateVideo(item.id, { ...item, embedUrl: embed.embedUrl });
    if (result.ok) {
      toast('success', 'Vidéo enregistrée');
    } else {
      toast('error', "Échec de l'enregistrement : API inaccessible");
    }
    return result.ok;
  };

  const handleRemove = async (item) => {
    const confirmed = await confirmAction({
      title: 'Supprimer cette vidéo ?',
      text: `« ${item.title || 'Sans titre'} » sera définitivement supprimée.`,
    });
    if (!confirmed) return false;
    const result = await removeVideo(item.id);
    if (result.ok) {
      toast('success', 'Vidéo supprimée');
    } else {
      toast('error', "Échec de la suppression : API inaccessible");
    }
    return result.ok;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">Vidéos</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          Ajoutez un tutoriel avec un lien YouTube, Drive, Vimeo ou Dailymotion.
        </p>
      </div>

      {loading && <Loading variant="form" />}
      {error && <ErrorBanner message="API inaccessible : impossible de publier ou de modifier une vidéo." />}

      {!loading && !error && (
        <>
      <div className="card-root p-6 md:p-8">
        <h2 className="text-lg font-bold text-black dark:text-white">Ajouter une vidéo</h2>
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label-root mb-2">Titre de la vidéo</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-root"
              placeholder="Ex : Créer une API REST avec Node.js"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-root mb-2">Lien de la vidéo</label>
            <input
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
          <div className="sm:col-span-2">
            <label className="label-root mb-2">Description (optionnel)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="input-root"
              placeholder="Ce que les apprenants découvriront dans ce tutoriel..."
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary-root sm:col-span-2 disabled:opacity-60">
            <FiPlusCircle className="w-4 h-4" /> {saving ? 'Ajout en cours...' : 'Publier la vidéo'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-black dark:text-white mb-5">Vidéos existantes</h2>
        <AdminListEditor
          items={videos}
          onChange={() => {}}
          titleKey="title"
          hideAdd
          onSaveItem={handleSaveItem}
          onRemoveItem={handleRemove}
          fields={[
            { key: 'title', label: 'Titre' },
            { key: 'url', label: 'Lien (YouTube, Drive, Vimeo, Dailymotion)', full: true },
            { key: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
          ]}
        />
      </div>
        </>
      )}
    </div>
  );
}