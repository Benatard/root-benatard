import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import useResource from '../../../hooks/useResource';
import { skillsAPI } from '../../../service/api';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { skillIcons, toDbCategory } from '../../../config/icons';
import { toast } from '../../../service/swal';
import { useLang } from '../../../i18n/LanguageContext';

const ICON_KEYS = Object.keys(skillIcons);

export default function SkillsSection() {
  const { t } = useLang();
  const { data: skills, loading, error } = useResource(skillsAPI.get);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (skills) {
      setCategories((skills.categories || []).map((c, i) => ({
        ...toDbCategory(c),
        id: c.id ?? `local-${i}-${Date.now()}`,
      })));
    }
  }, [skills]);

  const updateCategory = (id, patch) =>
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const removeCategory = (id) => setCategories((prev) => prev.filter((c) => c.id !== id));
  const addCategory = () =>
    setCategories((prev) => [...prev, { id: `local-${Date.now()}`, name: '', icon: 'code', color: '#4A6CF7', skills: [] }]);

  const updateSkill = (catId, skillIdx, patch) =>
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, skills: c.skills.map((s, i) => (i === skillIdx ? { ...s, ...patch } : s)) }
          : c
      )
    );
  const removeSkill = (catId, skillIdx) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, skills: c.skills.filter((_, i) => i !== skillIdx) } : c))
    );
  const addSkill = (catId) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, skills: [...c.skills, { name: '', level: 70 }] } : c))
    );

  const save = async () => {
    const stripId = ({ id, ...rest }) => rest;
    const payload = { categories: categories.map(stripId) };
    setSaving(true);
    try {
      await skillsAPI.update(payload);
      toast('success', t('admin.skills.saved'));
    } catch {
      toast('error', t('admin.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.skills.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          {t('admin.skills.sub')}
        </p>
      </div>

      {loading && <Loading variant="list" />}
      {error && <ErrorBanner message={t('admin.skills.error')} />}

      {!loading && !error && (
        <>
      {categories.map((category) => (
        <div key={category.id} className="card-root p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                {category.icon && skillIcons[category.icon] ? (
                  React.createElement(skillIcons[category.icon], { className: 'w-4 h-4 text-primary' })
                ) : null}
              </span>
              <div className="flex items-center gap-2.5">
                <input
                  value={category.name || ''}
                  onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                  className="input-root w-52"
                  placeholder={t('admin.skills.categoryPlaceholder')}
                />
                <select
                  value={category.icon || 'code'}
                  onChange={(e) => updateCategory(category.id, { icon: e.target.value })}
                  className="input-root w-44"
                >
                  {ICON_KEYS.map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
                <input
                  type="color"
                  value={category.color || '#4A6CF7'}
                  onChange={(e) => updateCategory(category.id, { color: e.target.value })}
                  className="h-10 w-14 cursor-pointer border border-stroke/70 dark:border-[#2C303B] bg-transparent"
                  title={t('admin.skills.categoryColor')}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeCategory(category.id)}
              aria-label={t('admin.skills.deleteCategory')}
              className="h-9 w-9 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {category.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  value={skill.name || ''}
                  onChange={(e) => updateSkill(category.id, idx, { name: e.target.value })}
                  className="input-root flex-1"
                  placeholder={t('admin.skills.skillPlaceholder')}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skill.level || 0}
                  onChange={(e) => updateSkill(category.id, idx, { level: Number(e.target.value) })}
                  className="input-root w-24"
                  placeholder={t('admin.skills.level')}
                />
                <button
                  type="button"
                  onClick={() => removeSkill(category.id, idx)}
                  aria-label={t('admin.skills.deleteSkill')}
                  className="h-9 w-9 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSkill(category.id)}
              className="btn-outline-root w-full"
            >
              <FiPlus className="w-4 h-4" /> {t('admin.skills.addSkill')}
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addCategory} className="btn-outline-root w-full">
        <FiPlus className="w-4 h-4" /> {t('admin.skills.addCategory')}
      </button>

      <button onClick={save} disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
        <FiSave className="w-4 h-4" /> {saving ? t('common.saving') : t('admin.skills.save')}
      </button>
        </>
      )}
    </div>
  );
}