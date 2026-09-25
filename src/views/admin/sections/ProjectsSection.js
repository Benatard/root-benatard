import React, { useState, useEffect, useRef } from 'react';
import { FiSave } from 'react-icons/fi';
import useResource from '../../../hooks/useResource';
import { projectsAPI } from '../../../service/api';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { syncList } from '../../../service/adminSync';
import AdminListEditor from '../../../components/admin/AdminListEditor';
import { toast } from '../../../service/swal';
import { useLang } from '../../../i18n/LanguageContext';

const normalizeItems = (items) =>
  (Array.isArray(items) ? items : []).map((item, index) => ({
    ...item,
    sortOrder: index + 1,
  }));

const moveItem = (items, index, direction) => {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(nextIndex, 0, item);
  return next;
};

export default function ProjectsSection() {
  const { t } = useLang();
  const { data: projects, loading, error } = useResource(projectsAPI.get);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const savedRef = useRef([]);

  useEffect(() => {
    const next = normalizeItems(projects);
    setItems(next);
    savedRef.current = next;
  }, [projects]);

  const moveProject = (index, direction) => {
    setItems((current) => {
      const moved = moveItem(current, index, direction);
      return moved === current ? current : normalizeItems(moved);
    });
  };

  const updateItems = (next) => setItems(normalizeItems(next));

  const save = async () => {
    setSaving(true);
    try {
      const next = normalizeItems(items);
      setItems(next);
      const saved = await syncList(projectsAPI, savedRef.current, next);
      const synced = normalizeItems(saved);
      setItems(synced);
      savedRef.current = synced;
      toast('success', t('admin.projects.saved'));
    } catch {
      toast('error', t('admin.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.projects.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          {t('admin.projects.sub')}
        </p>
      </div>

      {loading && <Loading variant="list" />}
      {error && <ErrorBanner message={t('admin.projects.error')} />}

      {!loading && !error && (
        <>
          <AdminListEditor
            items={items}
            onChange={updateItems}
            reorderable
            onReorder={moveProject}
            addAtEnd
            titleKey="title"
            newItem={{ title: '', category: '', year: '', image: '', desc: '', stack: [], demo: '', repo: '' }}
            addLabel={t('admin.projects.add')}
            fields={[
              { key: 'title', label: t('admin.projects.field.title') },
              { key: 'category', label: t('admin.projects.field.category'), placeholder: t('admin.projects.field.categoryPlaceholder') },
              { key: 'year', label: t('admin.projects.field.year') },
              { key: 'image', label: t('admin.projects.field.image'), type: 'image' },
              { key: 'desc', label: t('admin.projects.field.desc'), type: 'textarea', rows: 4, full: true },
              { key: 'stack', label: t('admin.projects.field.stack'), type: 'tags', full: true },
              { key: 'demo', label: t('admin.projects.field.demo'), type: 'url' },
              { key: 'repo', label: t('admin.projects.field.repo'), type: 'url' },
            ]}
          />

          <button onClick={save} disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
            <FiSave className="w-4 h-4" /> {saving ? t('common.saving') : t('admin.projects.save')}
          </button>
        </>
      )}
    </div>
  );
}