import React, { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import useVideos from '../../../hooks/useVideos';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { toEmbedUrl } from '../../../service/videoEmbed';
import { toast, confirmAction } from '../../../service/swal';
import AdminListEditor from '../../../components/admin/AdminListEditor';
import { useLang } from '../../../i18n/LanguageContext';

export default function VideosSection() {
  const { videos, loading, error, addVideo, updateVideo, removeVideo } = useVideos();
  const { t } = useLang();
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
      toast('warning', t('admin.videos.fillRequired'));
      return;
    }
    if (!preview) {
      toast('error', t('admin.videos.invalidLink'));
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
      toast('success', t('admin.videos.added'));
      setForm({ title: '', url: '', description: '' });
      setPreview(null);
    } else {
      toast('error', t('admin.videos.addFailed'));
    }
  };

  const handleSaveItem = async (item) => {
    const embed = toEmbedUrl(item.url || '');
    if (!embed) {
      toast('error', t('admin.videos.unknownFor', { title: item.title }));
      return;
    }
    const result = await updateVideo(item.id, { ...item, embedUrl: embed.embedUrl });
    if (result.ok) {
      toast('success', t('admin.videos.savedItem'));
    } else {
      toast('error', t('admin.saveError'));
    }
    return result.ok;
  };

  const handleRemove = async (item) => {
    const confirmed = await confirmAction({
      title: t('admin.videos.removeTitle'),
      text: t('admin.videos.removeText', { title: item.title || t('ui.untitled') }),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
    });
    if (!confirmed) return false;
    const result = await removeVideo(item.id);
    if (result.ok) {
      toast('success', t('admin.videos.deleted'));
    } else {
      toast('error', t('admin.saveError'));
    }
    return result.ok;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.videos.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          {t('admin.videos.sub')}
        </p>
      </div>

      {loading && <Loading variant="form" />}
      {error && <ErrorBanner message={t('admin.videos.error')} />}

      {!loading && !error && (
        <>
      <div className="card-root p-6 md:p-8">
        <h2 className="text-lg font-bold text-black dark:text-white">{t('admin.videos.addTitle')}</h2>
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label-root mb-2">{t('admin.videos.field.videoTitle')}</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-root"
              placeholder={t('admin.videos.field.titlePlaceholder')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-root mb-2">{t('admin.videos.field.videoLink')}</label>
            <input
              value={form.url}
              onChange={handleUrlChange}
              className="input-root"
              placeholder={t('admin.videos.linkPlaceholder')}
            />
            {preview ? (
              <p className="mt-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {t('admin.videos.validLink', { provider: preview.provider })}
              </p>
            ) : (
              form.url && (
                <p className="mt-2.5 text-sm font-semibold text-red-500">
                  {t('admin.videos.invalidLink')}
                </p>
              )
            )}
            {preview && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-body dark:text-body-dark mb-2.5">
                  {t('admin.videos.previewOf', { provider: preview.provider })}
                </p>
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={preview.embedUrl}
                    title={t('admin.videos.previewTitle')}
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
            <label className="label-root mb-2">{t('admin.videos.field.desc')}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="input-root"
              placeholder={t('admin.videos.descPlaceholder')}
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary-root sm:col-span-2 disabled:opacity-60">
            <FiPlusCircle className="w-4 h-4" /> {saving ? t('common.saving') : t('admin.videos.publish')}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-black dark:text-white mb-5">{t('admin.videos.existing')}</h2>
        <AdminListEditor
          items={videos}
          onChange={() => {}}
          titleKey="title"
          hideAdd
          onSaveItem={handleSaveItem}
          onRemoveItem={handleRemove}
          fields={[
            { key: 'title', label: t('admin.videos.field.title') },
            { key: 'url', label: t('admin.videos.field.linkFull'), full: true },
            { key: 'description', label: t('admin.videos.field.desc'), type: 'textarea', rows: 3, full: true },
          ]}
        />
      </div>
        </>
      )}
    </div>
  );
}
