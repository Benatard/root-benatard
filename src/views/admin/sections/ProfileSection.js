import React, { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import useResource from '../../../hooks/useResource';
import { useProfile } from '../../../context/ProfileContext';
import { profileAPI } from '../../../service/api';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import AdminListEditor from '../../../components/admin/AdminListEditor';
import { toast } from '../../../service/swal';

function Field({ label, value, onChange, type = 'text', full, textarea, placeholder }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="label-root mb-2">{label}</label>
      {textarea ? (
        <textarea
          rows={4}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="input-root"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="input-root"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

export default function ProfileSection() {
  const { data: profile, loading, error } = useResource(profileAPI.get);
  const { refresh } = useProfile();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const current = form ?? profile ?? {};

  const update = (patch) => setForm((f) => ({ ...(f || {}), ...patch }));
  const updateList = (key) => (items) => setForm((f) => ({ ...(f || {}), [key]: items }));

  const save = async () => {
    setSaving(true);
    try {
      await profileAPI.update(current);
      await refresh();
      toast('success', 'Profil enregistré');
    } catch {
      toast('error', "Échec de l'enregistrement : API inaccessible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">Profil</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          Informations personnelles affichées sur tout le site.
        </p>
      </div>

      {loading && <Loading variant="form" />}
      {error && <ErrorBanner message="API inaccessible : impossible de charger ou d'enregistrer le profil." />}

      {!loading && !error && (
        <>
          <div className="card-root p-6 md:p-8">
            <h2 className="text-lg font-bold text-black dark:text-white">Identité</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nom complet" value={current.name || ''} onChange={(v) => update({ name: v })} />
              <Field label="Rôle" value={current.role || ''} onChange={(v) => update({ role: v })} />
              <Field label="Niveau" value={current.level || ''} onChange={(v) => update({ level: v })} />
              <Field label="Disponibilité" value={current.availability || ''} onChange={(v) => update({ availability: v })} />
              <Field label="Titre complet (bandeau)" full value={current.title || ''} onChange={(v) => update({ title: v })} />
              <Field label="Slogan (tagline)" full value={current.tagline || ''} onChange={(v) => update({ tagline: v })} />
              <Field
                label="Biographie"
                full
                textarea
                value={current.bio || ''}
                onChange={(v) => update({ bio: v })}
              />
            </div>
          </div>

          <div className="card-root p-6 md:p-8">
            <h2 className="text-lg font-bold text-black dark:text-white">Photo & contacts</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-root mb-2">Photo de profil</label>
                <input
                  type="url"
                  value={current.photo || ''}
                  onChange={(e) => update({ photo: e.target.value })}
                  className="input-root"
                  placeholder="https://.../avatar.png (ou /images/avatar.svg)"
                />
                {current.photo && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-body dark:text-body-dark mb-2.5">Aperçu</p>
                    <div className="h-32 w-32 overflow-hidden bg-gray2 dark:bg-[#2C303B]">
                      <img
                        src={current.photo}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/avatar.svg';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <Field label="Email" type="email" value={current.email || ''} onChange={(v) => update({ email: v })} />
              <Field label="Téléphone" value={current.phone || ''} onChange={(v) => update({ phone: v })} />
              <Field label="Localisation" value={current.location || ''} onChange={(v) => update({ location: v })} />
              <Field label="Site web" type="url" value={current.website || ''} onChange={(v) => update({ website: v })} />
              <Field
                label="Lien CV (résumé)"
                type="url"
                full
                placeholder="/cv.pdf ou https://.../cv.pdf"
                value={current.resumeUrl || ''}
                onChange={(v) => update({ resumeUrl: v })}
              />
              <p className="sm:col-span-2 -mt-2 text-xs text-body dark:text-body-dark">
                Astuce : pour un CV hébergé sur ce site, placez le fichier dans le dossier
                <code className="mx-1 font-mono bg-gray2 dark:bg-[#2C303B] px-1.5 py-0.5">public/cv.pdf</code>
                puis mettez
                <code className="mx-1 font-mono bg-gray2 dark:bg-[#2C303B] px-1.5 py-0.5">/cv.pdf</code>
                ici. Les boutons « Télécharger mon CV » s'afficheront dès que le champ est rempli.
              </p>
            </div>
          </div>

          <div className="card-root p-6 md:p-8">
            <h2 className="text-lg font-bold text-black dark:text-white">Réseaux sociaux</h2>
            <div className="mt-5">
              <AdminListEditor
                items={current.socials || []}
                onChange={updateList('socials')}
                titleKey="label"
                newItem={{ key: '', label: '', url: '' }}
                fields={[
                  { key: 'label', label: 'Nom du réseau', placeholder: 'GitHub' },
                  { key: 'url', label: 'Lien', type: 'url' },
                  { key: 'key', label: 'Icône (github, linkedin, youtube, twitter)', placeholder: 'github' },
                ]}
                addLabel="Ajouter un réseau"
              />
            </div>
          </div>

          <div className="card-root p-6 md:p-8">
            <h2 className="text-lg font-bold text-black dark:text-white">Statistiques</h2>
            <div className="mt-5">
              <AdminListEditor
                items={current.stats || []}
                onChange={updateList('stats')}
                titleKey="label"
                newItem={{ number: '', label: '' }}
                fields={[
                  { key: 'number', label: 'Valeur', placeholder: '10+' },
                  { key: 'label', label: 'Libellé', placeholder: 'PROJETS RÉALISÉS' },
                ]}
                addLabel="Ajouter une statistique"
              />
            </div>
          </div>

          <button onClick={save} disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
            <FiSave className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer le profil'}
          </button>
        </>
      )}
    </div>
  );
}