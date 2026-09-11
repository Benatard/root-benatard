import React, { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import useResources from '../../../hooks/useResources';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { toast, confirmAction } from '../../../service/swal';
import AdminListEditor from '../../../components/admin/AdminListEditor';

const TYPE_OPTIONS = [
  { value: 'app', label: 'Application mobile' },
  { value: 'site', label: 'Site / Plateforme' },
];

export default function ResourcesSection() {
  const { resources, loading, error, addResource, updateResource, removeResource } = useResources();
  const [form, setForm] = useState({ type: 'app', title: '', url: '', image: '', description: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      toast('warning', 'Veuillez renseigner le titre et le lien de la ressource');
      return;
    }
    setSaving(true);
    const { ok } = await addResource({
      ...form,
      title: form.title.trim(),
      url: form.url.trim(),
      description: form.description.trim(),
    });
    setSaving(false);
    if (ok) {
      toast('success', 'Ressource ajoutée avec succès');
      setForm({ type: 'app', title: '', url: '', image: '', description: '' });
    } else {
      toast('error', "Impossible d'ajouter la ressource");
    }
  };

  const handleSaveItem = async (item) => {
    const result = await updateResource(item.id, item);
    if (result.ok) {
      toast('success', 'Ressource enregistrée');
    } else {
      toast('error', "Échec de l'enregistrement : API inaccessible");
    }
    return result.ok;
  };

  const handleRemove = async (item) => {
    const confirmed = await confirmAction({
      title: 'Supprimer cette ressource ?',
      text: `« ${item.title || 'Sans titre'} » sera définitivement supprimée.`,
    });
    if (!confirmed) return false;
    const result = await removeResource(item.id);
    if (result.ok) {
      toast('success', 'Ressource supprimée');
    } else {
      toast('error', "Échec de la suppression : API inaccessible");
    }
    return result.ok;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">Ressources</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          Applications mobiles et sites importants de la page Ressources.
        </p>
      </div>

      {loading && <Loading variant="form" />}
      {error && <ErrorBanner message="API inaccessible : impossible d'ajouter ou de modifier une ressource." />}

      {!loading && !error && (
        <>
      <div className="card-root p-6 md:p-8">
        <h2 className="text-lg font-bold text-black dark:text-white">Ajouter une ressource</h2>
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-root mb-2">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="input-root"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-root mb-2">Titre</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-root"
              placeholder="Ex : Notion"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-root mb-2">Lien</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="input-root"
              placeholder="https://..."
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-root mb-2">Image (URL, optionnel)</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="input-root"
              placeholder="https://.../image.png"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-root mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="input-root"
              placeholder="À quoi sert cette ressource ?"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary-root sm:col-span-2 disabled:opacity-60">
            <FiPlusCircle className="w-4 h-4" /> {saving ? 'Ajout en cours...' : 'Ajouter la ressource'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-black dark:text-white mb-5">Ressources existantes</h2>
        <AdminListEditor
          items={resources}
          onChange={() => {}}
          titleKey="title"
          hideAdd
          onSaveItem={handleSaveItem}
          onRemoveItem={handleRemove}
          fields={[
            { key: 'type', label: 'Type', type: 'select', options: TYPE_OPTIONS },
            { key: 'title', label: 'Titre' },
            { key: 'url', label: 'Lien', type: 'url' },
            { key: 'image', label: 'Image (URL)', type: 'image' },
            { key: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
          ]}
        />
      </div>
        </>
      )}
    </div>
  );
}