import React, { useState, useEffect, useRef } from 'react';
import { FiSave } from 'react-icons/fi';
import useResource from '../../../hooks/useResource';
import { projectsAPI } from '../../../service/api';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { syncList } from '../../../service/adminSync';
import AdminListEditor from '../../../components/admin/AdminListEditor';
import { toast } from '../../../service/swal';

export default function ProjectsSection() {
  const { data: projects, loading, error } = useResource(projectsAPI.get);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const savedRef = useRef([]);

  useEffect(() => {
    const next = Array.isArray(projects) ? projects : [];
    setItems(next);
    savedRef.current = next;
  }, [projects]);

  const save = async () => {
    setSaving(true);
    try {
      await syncList(projectsAPI, savedRef.current, items);
      savedRef.current = items;
      toast('success', 'Projets synchronisés');
    } catch {
      toast('error', "Échec de l'enregistrement : API inaccessible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">Projets</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          Cliquez sur un projet pour le modifier, ajoutez-en avec le bouton en bas, puis enregistrez tout.
        </p>
      </div>

      {loading && <Loading variant="list" />}
      {error && <ErrorBanner message="API inaccessible : impossible de charger ou de synchroniser les projets." />}

      {!loading && !error && (
        <>
          <AdminListEditor
            items={items}
            onChange={setItems}
            titleKey="title"
            newItem={{ title: '', category: '', year: '', image: '', desc: '', stack: [], demo: '', repo: '' }}
            addLabel="Ajouter un projet"
            fields={[
              { key: 'title', label: 'Titre du projet' },
              { key: 'category', label: 'Catégorie', placeholder: 'Application web' },
              { key: 'year', label: 'Année' },
              { key: 'image', label: 'Image (URL)', type: 'image' },
              { key: 'desc', label: 'Description', type: 'textarea', rows: 4, full: true },
              { key: 'stack', label: 'Technologies (virgules)', type: 'tags', full: true },
              { key: 'demo', label: 'Lien démo', type: 'url' },
              { key: 'repo', label: 'Lien code source', type: 'url' },
            ]}
          />

          <button onClick={save} disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
            <FiSave className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer les projets'}
          </button>
        </>
      )}
    </div>
  );
}