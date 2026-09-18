import React, { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import useResources from '../../../hooks/useResources';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { toast, confirmAction } from '../../../service/swal';
import AdminListEditor from '../../../components/admin/AdminListEditor';
import { useLang } from '../../../i18n/LanguageContext';

export default function ResourcesSection() {
  const { resources, loading, error, addResource, updateResource, removeResource } = useResources();
  const { t } = useLang();
  const TYPE_OPTIONS = [
    { value: 'app', label: t('resources.typeApp') },
    { value: 'site', label: t('resources.typeSite') },
  ];
  const [form, setForm] = useState({ type: 'app', title: '', url: '', image: '', description: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      toast('warning', t('resources.fillRequired'));
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
      toast('success', t('resources.added'));
      setForm({ type: 'app', title: '', url: '', image: '', description: '' });
    } else {
      toast('error', t('resources.addError'));
    }
  };

  const handleSaveItem = async (item) => {
    const result = await updateResource(item.id, item);
    if (result.ok) {
      toast('success', t('admin.resources.savedItem'));
    } else {
      toast('error', t('admin.saveError'));
    }
    return result.ok;
  };

  const handleRemove = async (item) => {
    const confirmed = await confirmAction({
      title: t('admin.resources.removeTitle'),
      text: t('admin.resources.removeText', { title: item.title || t('ui.untitled') }),
    });
    if (!confirmed) return false;
    const result = await removeResource(item.id);
    if (result.ok) {
      toast('success', t('admin.resources.deleted'));
    } else {
      toast('error', t('admin.saveError'));
    }
    return result.ok;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.resources.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          {t('admin.resources.sub')}
        </p>
      </div>

      {loading && <Loading variant="form" />}
      {error && <ErrorBanner message={t('admin.resources.error')} />}

      {!loading && !error && (
        <>
      <div className="card-root p-6 md:p-8">
        <h2 className="text-lg font-bold text-black dark:text-white">{t('admin.resources.addTitle')}</h2>
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-root mb-2">{t('admin.resources.field.type')}</label>
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
            <label className="label-root mb-2">{t('admin.resources.field.title')}</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-root"
              placeholder={t('admin.resources.titlePlaceholder')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-root mb-2">{t('admin.resources.field.url')}</label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="input-root"
              placeholder="https://..."
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-root mb-2">{t('admin.resources.field.image')}</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="input-root"
              placeholder="https://.../image.png"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-root mb-2">{t('admin.resources.field.description')}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="input-root"
              placeholder={t('admin.resources.descPlaceholder')}
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary-root sm:col-span-2 disabled:opacity-60">
            <FiPlusCircle className="w-4 h-4" /> {saving ? t('resources.adding') : t('admin.resources.addButton')}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-black dark:text-white mb-5">{t('admin.resources.existing')}</h2>
        <AdminListEditor
          items={resources}
          onChange={() => {}}
          titleKey="title"
          hideAdd
          onSaveItem={handleSaveItem}
          onRemoveItem={handleRemove}
          fields={[
            { key: 'type', label: t('admin.resources.field.type'), type: 'select', options: TYPE_OPTIONS },
            { key: 'title', label: t('admin.resources.field.title') },
            { key: 'url', label: t('admin.resources.field.url'), type: 'url' },
            { key: 'image', label: t('resources.imageLabel'), type: 'image' },
            { key: 'description', label: t('admin.resources.field.description'), type: 'textarea', rows: 3, full: true },
          ]}
        />
      </div>
        </>
      )}
    </div>
  );
}