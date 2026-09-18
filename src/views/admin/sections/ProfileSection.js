import React, { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import useResource from '../../../hooks/useResource';
import { useProfile } from '../../../context/ProfileContext';
import { profileAPI } from '../../../service/api';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import AdminListEditor from '../../../components/admin/AdminListEditor';
import { toast } from '../../../service/swal';
import { useLang } from '../../../i18n/LanguageContext';

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
  const { t } = useLang();
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
      toast('success', t('admin.profile.saved'));
    } catch {
      toast('error', t('admin.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.profile.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          {t('admin.profile.sub')}
        </p>
      </div>

      {loading && <Loading variant="form" />}
      {error && <ErrorBanner message={t('admin.profile.error')} />}

      {!loading && !error && (
        <>
          <div className="card-root p-6 md:p-8">
            <h2 className="text-lg font-bold text-black dark:text-white">{t('admin.profile.identity')}</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('admin.identity.name')} value={current.name || ''} onChange={(v) => update({ name: v })} />
              <Field label={t('admin.identity.role')} value={current.role || ''} onChange={(v) => update({ role: v })} />
              <Field label={t('admin.identity.level')} value={current.level || ''} onChange={(v) => update({ level: v })} />
              <Field label={t('admin.identity.availability')} value={current.availability || ''} onChange={(v) => update({ availability: v })} />
              <Field label={t('admin.identity.titleFull')} full value={current.title || ''} onChange={(v) => update({ title: v })} />
              <Field label={t('admin.identity.tagline')} full value={current.tagline || ''} onChange={(v) => update({ tagline: v })} />
              <Field
                label={t('admin.identity.bio')}
                full
                textarea
                value={current.bio || ''}
                onChange={(v) => update({ bio: v })}
              />
            </div>
          </div>

          <div className="card-root p-6 md:p-8">
            <h2 className="text-lg font-bold text-black dark:text-white">{t('admin.profile.photoContact')}</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-root mb-2">{t('admin.profile.profilePhoto')}</label>
                <input
                  type="url"
                  value={current.photo || ''}
                  onChange={(e) => update({ photo: e.target.value })}
                  className="input-root"
                  placeholder={t('admin.profile.photoPlaceholder')}
                />
                {current.photo && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-body dark:text-body-dark mb-2.5">{t('common.preview')}</p>
                    <div className="h-32 w-32 overflow-hidden bg-gray2 dark:bg-[#2C303B]">
                      <img
                        src={current.photo}
                        alt={t('common.preview')}
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
              <Field label={t('admin.contact.email')} type="email" value={current.email || ''} onChange={(v) => update({ email: v })} />
              <Field label={t('admin.contact.phone')} value={current.phone || ''} onChange={(v) => update({ phone: v })} />
              <Field label={t('admin.contact.location')} value={current.location || ''} onChange={(v) => update({ location: v })} />
              <Field label={t('admin.contact.website')} type="url" value={current.website || ''} onChange={(v) => update({ website: v })} />
              <Field
                label={t('admin.profile.cvLink')}
                type="url"
                full
                placeholder={t('admin.profile.cvPlaceholder')}
                value={current.resumeUrl || ''}
                onChange={(v) => update({ resumeUrl: v })}
              />
              <p className="sm:col-span-2 -mt-2 text-xs text-body dark:text-body-dark">
                {t('admin.profile.cvHint')}
                <code className="mx-1 font-mono bg-gray2 dark:bg-[#2C303B] px-1.5 py-0.5">public/cv.pdf</code>
                {t('admin.profile.cvHintThen')}
                <code className="mx-1 font-mono bg-gray2 dark:bg-[#2C303B] px-1.5 py-0.5">/cv.pdf</code>
                {t('admin.profile.cvHintHere')}
              </p>
            </div>
          </div>

          <div className="card-root p-6 md:p-8">
            <h2 className="text-lg font-bold text-black dark:text-white">{t('admin.profile.socials')}</h2>
            <div className="mt-5">
              <AdminListEditor
                items={current.socials || []}
                onChange={updateList('socials')}
                titleKey="label"
                newItem={{ key: '', label: '', url: '' }}
                fields={[
                  { key: 'label', label: t('admin.social.networkLabel'), placeholder: 'GitHub' },
                  { key: 'url', label: t('admin.social.link'), type: 'url' },
                  { key: 'key', label: t('admin.social.icon'), placeholder: 'github' },
                ]}
                addLabel={t('admin.social.add')}
              />
            </div>
          </div>

          <div className="card-root p-6 md:p-8">
            <h2 className="text-lg font-bold text-black dark:text-white">{t('admin.profile.stats')}</h2>
            <div className="mt-5">
              <AdminListEditor
                items={current.stats || []}
                onChange={updateList('stats')}
                titleKey="label"
                newItem={{ number: '', label: '' }}
                fields={[
                  { key: 'number', label: t('admin.stats.value'), placeholder: '10+' },
                  { key: 'label', label: t('admin.stats.label'), placeholder: 'PROJETS RÉALISÉS' },
                ]}
                addLabel={t('admin.stats.add')}
              />
            </div>
          </div>

          <button onClick={save} disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
            <FiSave className="w-4 h-4" /> {saving ? t('common.saving') : t('admin.profile.save')}
          </button>
        </>
      )}
    </div>
  );
}