import React, { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import useGallery from '../../../hooks/useGallery';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { toast, confirmAction } from '../../../service/swal';
import AdminListEditor from '../../../components/admin/AdminListEditor';
import { useLang } from '../../../i18n/LanguageContext';

export default function GallerySection() {
  const { photos, loading, error, addPhoto, updatePhoto, removePhoto } = useGallery();
  const { t } = useLang();
  const [form, setForm] = useState({ image: '', title: '', caption: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image.trim()) {
      toast('warning', t('admin.gallery.urlRequired'));
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
      toast('success', t('admin.gallery.added'));
      setForm({ image: '', title: '', caption: '' });
    } else {
      toast('error', t('admin.gallery.addFailed'));
    }
  };

  const handleSaveItem = async (item) => {
    if (!item.image || !String(item.image).trim()) {
      toast('error', t('admin.gallery.imageRequired'));
      return false;
    }
    const result = await updatePhoto(item.id, item);
    if (result.ok) {
      toast('success', t('admin.gallery.savedItem'));
    } else {
      toast('error', t('admin.saveError'));
    }
    return result.ok;
  };

  const handleRemove = async (item) => {
    const confirmed = await confirmAction({
      title: t('admin.gallery.removeTitle'),
      text: t('admin.gallery.removeText', { title: item.title || t('ui.untitled') }),
    });
    if (!confirmed) return false;
    const result = await removePhoto(item.id);
    if (result.ok) {
      toast('success', t('admin.gallery.deleted'));
    } else {
      toast('error', t('admin.saveError'));
    }
    return result.ok;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.gallery.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          {t('admin.gallery.sub')}
        </p>
      </div>

      {loading && <Loading variant="form" />}
      {error && <ErrorBanner message={t('admin.gallery.error')} />}

      {!loading && !error && (
        <>
      <div className="card-root p-6 md:p-8">
        <h2 className="text-lg font-bold text-black dark:text-white">{t('admin.gallery.addTitle')}</h2>
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label-root mb-2">{t('admin.gallery.imageLabel')}</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="input-root"
              placeholder={t('admin.gallery.imagePlaceholder')}
            />
            {form.image && (
              <div className="mt-4 flex items-start gap-4">
                <div className="w-40 overflow-hidden bg-gray2 dark:bg-[#2C303B]">
                  <img
                    src={form.image}
                    alt={t('common.preview')}
                    className="w-full h-28 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/resource-placeholder.svg';
                    }}
                  />
                </div>
                <p className="text-xs text-body dark:text-body-dark">{t('admin.gallery.previewNote')}</p>
              </div>
            )}
          </div>
          <div>
            <label className="label-root mb-2">{t('admin.gallery.titleLabel')}</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-root"
              placeholder={t('admin.gallery.titlePlaceholder')}
            />
          </div>
          <div>
            <label className="label-root mb-2">{t('admin.gallery.captionLabel')}</label>
            <input
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="input-root"
              placeholder={t('admin.gallery.captionPlaceholder')}
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary-root sm:col-span-2 disabled:opacity-60">
            <FiPlusCircle className="w-4 h-4" /> {saving ? t('common.saving') : t('admin.gallery.addButton')}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-black dark:text-white mb-5">{t('admin.gallery.existing')}</h2>
        <AdminListEditor
          items={photos}
          onChange={() => {}}
          titleKey="title"
          hideAdd
          onSaveItem={handleSaveItem}
          onRemoveItem={handleRemove}
          fields={[
            { key: 'image', label: t('admin.gallery.field.image'), type: 'image' },
            { key: 'title', label: t('admin.gallery.field.title') },
            { key: 'caption', label: t('admin.gallery.field.caption'), type: 'textarea', rows: 2, full: true },
          ]}
        />
      </div>
        </>
      )}
    </div>
  );
}