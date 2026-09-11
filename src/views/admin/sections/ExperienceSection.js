import React, { useState, useEffect } from 'react';
import { FiSave, FiBriefcase, FiAward, FiStar } from 'react-icons/fi';
import useResource from '../../../hooks/useResource';
import { experienceAPI } from '../../../service/api';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import AdminListEditor from '../../../components/admin/AdminListEditor';
import { toast } from '../../../service/swal';

const blocks = [
  {
    key: 'experiences',
    title: 'Expériences professionnelles',
    icon: FiBriefcase,
    newItem: { role: '', company: '', period: '', desc: '' },
    fields: [
      { key: 'role', label: 'Poste' },
      { key: 'company', label: 'Entreprise' },
      { key: 'period', label: 'Période', placeholder: '2023 — Aujourd\'hui' },
      { key: 'desc', label: 'Description', type: 'textarea', rows: 4, full: true },
    ],
  },
  {
    key: 'education',
    title: 'Formation',
    icon: FiAward,
    newItem: { degree: '', school: '', period: '', desc: '' },
    titleKey: 'degree',
    fields: [
      { key: 'degree', label: 'Diplôme' },
      { key: 'school', label: 'École / Université' },
      { key: 'period', label: 'Période' },
      { key: 'desc', label: 'Description', type: 'textarea', rows: 3, full: true },
    ],
  },
  {
    key: 'values',
    title: 'Valeurs',
    icon: FiStar,
    newItem: { title: '', desc: '' },
    fields: [
      { key: 'title', label: 'Titre' },
      { key: 'desc', label: 'Description', type: 'textarea', rows: 3, full: true },
    ],
  },
];

export default function ExperienceSection() {
  const { data: experience, loading, error } = useResource(experienceAPI.get);
  const [form, setForm] = useState(experience);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (experience) setForm(experience);
  }, [experience]);

  const current = form ?? experience ?? {};

  const updateList = (key) => (items) => setForm((f) => ({ ...(f || {}), [key]: items }));

  const save = async () => {
    setSaving(true);
    try {
      await experienceAPI.update(current);
      toast('success', 'Expérience enregistrée');
    } catch {
      toast('error', "Échec de l'enregistrement : API inaccessible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">Expérience</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          Parcours professionnel, formation et valeurs de la page À propos.
        </p>
      </div>

      {loading && <Loading variant="list" />}
      {error && <ErrorBanner message="API inaccessible : impossible de charger ou d'enregistrer l'expérience." />}

      {!loading && !error && (
        <>
          {blocks.map((block) => (
            <div key={block.key} className="card-root p-6 md:p-8">
              <h2 className="flex items-center gap-2.5 text-lg font-bold text-black dark:text-white">
                <block.icon className="w-4 h-4 text-primary" /> {block.title}
              </h2>
              <div className="mt-5">
                <AdminListEditor
                  items={current[block.key] || []}
                  onChange={updateList(block.key)}
                  titleKey={block.titleKey || 'role'}
                  newItem={block.newItem}
                  fields={block.fields}
                  addLabel={`Ajouter une entrée`}
                />
              </div>
            </div>
          ))}

          <button onClick={save} disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
            <FiSave className="w-4 h-4" /> {saving ? 'Enregistrement...' : "Enregistrer l'expérience"}
          </button>
        </>
      )}
    </div>
  );
}