import React, { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import useGallery from '../../../hooks/useGallery';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { toast, confirmAction } from '../../../service/swal';
import AdminListEditor from '../../../components/admin/AdminListEditor';

export default function GallerySection() {
  const { photos, loading, error, addPhoto, updatePhoto, removePhoto } = useGallery();
  const [form, setForm] = useState({ image: '', title: '', caption: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image.trim()) {
      toast('warning', 'Veuillez renseigner l\'URL de la photo');
      return;
    }
    setSaving(true);
    const { ok } = await addPhoto({
      image: form.image.trim(),
      title: form.title.trim(),
      caption: form.caption.trim(),
    });
    setSaving(false);
    if (ok) {
      toast('success', 'Photo ajoutée avec succès');
      setForm({ image: '', title: '', caption: '' });
    } else {
      toast('error', "Impossible d'ajouter la photo");
    }
  };

  const handleSaveItem = async (item) => {
    if (!item.image || !String(item.image).trim()) {
      toast('error', 'La photo doit avoir une image (URL)');
      return false;
    }
    const result = await updatePhoto(item.id, item);
    if (result.ok) {
      toast('success', 'Photo enregistrée');
    } else {
      toast('error', "Échec de l'enregistrement : API inaccessible");
    }
    return result.ok;
  };

  const handleRemove = async (item) => {
    const confirmed = await confirmAction({
      title: 'Supprimer cette photo ?',
      text: `« ${item.title || 'Photo sans titre'} » sera définitivement supprimée.`,
    });
    if (!confirmed) return false;
    const result = await removePhoto(item.id);
    if (result.ok) {
      toast('success', 'Photo supprimée');
    } else {
      toast('error', "Échec de la suppression : API inaccessible");
    }
    return result.ok;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">Galerie</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          Les photos du carrousel (page /galerie et accueil). Celle de gauche sert de première slide.
        </p>
      </div>

      {loading && <Loading variant="form" />}
      {error && <ErrorBanner message="API inaccessible : impossible d'ajouter ou de modifier une photo." />}

      {!loading && !error && (
        <>
      <div className="card-root p-6 md:p-8">
        <h2 className="text-lg font-bold text-black dark:text-white">Ajouter une photo</h2>
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label-root mb-2">Image (URL ou chemin local)</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="input-root"
              placeholder="https://.../photo.jpg ou /images/photo.jpg"
            />
            {form.image && (
              <div className="mt-4 flex items-start gap-4">
                <div className="w-40 overflow-hidden bg-gray2 dark:bg-[#2C303B]">
                  <img
                    src={form.image}
                    alt="Aperçu"
                    className="w-full h-28 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/resource-placeholder.svg';
                    }}
                  />
                </div>
                <p className="text-xs text-body dark:text-body-dark">Aperçu de la photo.</p>
              </div>
            )}
          </div>
          <div>
            <label className="label-root mb-2">Titre (optionnel)</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-root"
              placeholder="Ex : Câblage Hôpital CMOK"
            />
          </div>
          <div>
            <label className="label-root mb-2">Légende (optionnel)</label>
            <input
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="input-root"
              placeholder="Courte description"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary-root sm:col-span-2 disabled:opacity-60">
            <FiPlusCircle className="w-4 h-4" /> {saving ? 'Ajout en cours...' : 'Ajouter la photo'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-black dark:text-white mb-5">Photos existantes</h2>
        <AdminListEditor
          items={photos}
          onChange={() => {}}
          titleKey="title"
          hideAdd
          onSaveItem={handleSaveItem}
          onRemoveItem={handleRemove}
          fields={[
            { key: 'image', label: 'Image (URL)', type: 'image' },
            { key: 'title', label: 'Titre' },
            { key: 'caption', label: 'Légende', type: 'textarea', rows: 2, full: true },
          ]}
        />
      </div>
        </>
      )}
    </div>
  );
}