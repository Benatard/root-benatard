import React, { useState, useEffect } from 'react';
import { FiSave, FiBriefcase, FiAward, FiStar } from 'react-icons/fi';
import useResource from '../../../hooks/useResource';
import { experienceAPI } from '../../../service/api';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import AdminListEditor from '../../../components/admin/AdminListEditor';
import { toast } from '../../../service/swal';
import { useLang } from '../../../i18n/LanguageContext';

export default function ExperienceSection() {
  const { data: experience, loading, error } = useResource(experienceAPI.get);
  const { t } = useLang();

  const blocks = [
    {
      key: 'experiences',
      title: t('admin.experience.block.experiences'),
      icon: FiBriefcase,
      newItem: { role: '', company: '', period: '', desc: '' },
      fields: [
        { key: 'role', label: t('admin.experience.field.role') },
        { key: 'company', label: t('admin.experience.field.company') },
        { key: 'period', label: t('admin.experience.field.period'), placeholder: t('admin.experience.field.periodPlaceholder') },
        { key: 'desc', label: t('admin.experience.field.desc'), type: 'textarea', rows: 4, full: true },
      ],
    },
    {
      key: 'education',
      title: t('admin.experience.block.education'),
      icon: FiAward,
      newItem: { degree: '', school: '', period: '', desc: '' },
      titleKey: 'degree',
      fields: [
        { key: 'degree', label: t('admin.experience.field.degree') },
        { key: 'school', label: t('admin.experience.field.school') },
        { key: 'period', label: t('admin.experience.field.period') },
        { key: 'desc', label: t('admin.experience.field.desc'), type: 'textarea', rows: 3, full: true },
      ],
    },
    {
      key: 'values',
      title: t('admin.experience.block.values'),
      icon: FiStar,
      newItem: { title: '', desc: '' },
      fields: [
        { key: 'title', label: t('admin.experience.field.title') },
        { key: 'desc', label: t('admin.experience.field.desc'), type: 'textarea', rows: 3, full: true },
      ],
    },
  ];
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
      toast('success', t('admin.experience.saved'));
    } catch {
      toast('error', t('admin.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.experience.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          {t('admin.experience.sub')}
        </p>
      </div>

      {loading && <Loading variant="list" />}
      {error && <ErrorBanner message={t('admin.experience.error')} />}

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
                  addLabel={t('admin.experience.addEntry')}
                />
              </div>
            </div>
          ))}

          <button onClick={save} disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
            <FiSave className="w-4 h-4" /> {saving ? t('common.saving') : t('admin.experience.save')}
          </button>
        </>
      )}
    </div>
  );
}