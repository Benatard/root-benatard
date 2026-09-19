import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiCode } from 'react-icons/fi';
import useLMS from '../../../hooks/useLMS';
import { toEmbedUrl } from '../../../service/videoEmbed';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { toast } from '../../../service/swal';
import { useLang } from '../../../i18n/LanguageContext';

const uid = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const toSections = (lesson) => {
  if (Array.isArray(lesson.sections)) {
    return lesson.sections.map((s, i) => ({ id: s.id || `local-s-${i}-${uid()}`, ...s }));
  }
  const sections = [];
  if (lesson.code) {
    sections.push({
      id: uid(),
      kind: 'code',
      summary: lesson.codeSummary || '',
      language: lesson.codeLanguage || '',
      code: lesson.code,
    });
  }
  return sections;
};

export default function LMSSection() {
  const { t } = useLang();
  const { modules, loading, error, save } = useLMS();
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (Array.isArray(modules)) {
      setItems(modules.map((m, i) => ({
        ...m,
        id: m.id || `local-${i}-${uid()}`,
        lessons: (m.lessons || []).map((l, j) => ({ ...l, id: l.id || `local-l-${i}-${j}-${uid()}`, sections: toSections(l) })),
      })));
    }
  }, [modules]);

  const updateModule = (id, patch) =>
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const removeModule = (id) => setItems((prev) => prev.filter((m) => m.id !== id));
  const addModule = () =>
    setItems((prev) => [...prev, { id: uid(), title: '', description: '', lessons: [] }]);

  const updateLesson = (mId, lId, patch) =>
    setItems((prev) =>
      prev.map((m) =>
        m.id === mId ? { ...m, lessons: m.lessons.map((l) => (l.id === lId ? { ...l, ...patch } : l)) } : m
      )
    );
  const removeLesson = (mId, lId) =>
    setItems((prev) =>
      prev.map((m) => (m.id === mId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lId) } : m))
    );
  const addLesson = (mId) =>
    setItems((prev) =>
      prev.map((m) =>
        m.id === mId
          ? { ...m, lessons: [...m.lessons, { id: uid(), title: '', url: '', embedUrl: '', content: '', sections: [] }] }
          : m
      )
    );

  const updateSection = (mId, lId, sId, patch) =>
    setItems((prev) =>
      prev.map((m) =>
        m.id === mId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lId ? { ...l, sections: (l.sections || []).map((s) => (s.id === sId ? { ...s, ...patch } : s)) } : l)) }
          : m
      )
    );
  const removeSection = (mId, lId, sId) =>
    setItems((prev) =>
      prev.map((m) =>
        m.id === mId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lId ? { ...l, sections: (l.sections || []).filter((s) => s.id !== sId) } : l)) }
          : m
      )
    );
  const insertSection = (mId, lId, afterIdx, section) =>
    setItems((prev) =>
      prev.map((m) =>
        m.id === mId
          ? { ...m, lessons: m.lessons.map((l) => {
              if (l.id !== lId) return l;
              const sections = Array.isArray(l.sections) ? l.sections.slice() : [];
              sections.splice(afterIdx + 1, 0, { id: uid(), ...section });
              return { ...l, sections };
            }) }
          : m
      )
    );
  const appendSection = (mId, lId, section) =>
    setItems((prev) =>
      prev.map((m) =>
        m.id === mId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lId ? { ...l, sections: [...(l.sections || []), { id: uid(), ...section }] } : l)) }
          : m
      )
    );

  const handleUrlChange = (mId, lId, value) => {
    const embed = toEmbedUrl(value);
    updateLesson(mId, lId, { url: value, embedUrl: embed ? embed.embedUrl : '' });
  };

  const handleSave = async () => {
    setSaving(true);
    const { ok } = await save(items);
    setSaving(false);
    if (ok) {
      toast('success', t('admin.lms.saved'));
    } else {
      toast('error', t('admin.saveError'));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.lms.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">
          {t('admin.lms.sub')}
        </p>
      </div>

      {loading && <Loading variant="list" />}
      {error && <ErrorBanner message={t('admin.lms.error')} />}

      {!loading && !error && (
        <>
          {items.map((module) => (
            <div key={module.id} className="card-root p-6 md:p-8 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <input
                  value={module.title || ''}
                  onChange={(e) => updateModule(module.id, { title: e.target.value })}
                  className="input-root flex-1"
                  placeholder={t('admin.lms.modulePlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => removeModule(module.id)}
                  aria-label={t('admin.lms.deleteModule')}
                  className="h-9 w-9 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="label-root mb-2">{t('admin.lms.moduleDescription')}</label>
                <textarea
                  value={module.description || ''}
                  onChange={(e) => updateModule(module.id, { description: e.target.value })}
                  rows="3"
                  className="input-root"
                  placeholder={t('admin.lms.moduleDescriptionPlaceholder')}
                />
              </div>

              <div className="space-y-4">
                {module.lessons.map((lesson) => {
                  const embed = toEmbedUrl(lesson.url);
                  return (
                    <div
                      key={lesson.id}
                      className="border border-stroke/70 dark:border-[#2C303B] p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <input
                          value={lesson.title || ''}
                          onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                          className="input-root flex-1"
                          placeholder={t('admin.lms.lessonPlaceholder')}
                        />
                        <button
                          type="button"
                          onClick={() => removeLesson(module.id, lesson.id)}
                          aria-label={t('admin.lms.deleteLesson')}
                          className="h-9 w-9 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="label-root mb-2">{t('admin.lms.videoLink')}</label>
                        <input
                          value={lesson.url || ''}
                          onChange={(e) => handleUrlChange(module.id, lesson.id, e.target.value)}
                          className="input-root"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        {embed ? (
                          <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {t('admin.videos.validLink', { provider: embed.provider })}
                          </p>
                        ) : (
                          lesson.url && (
                            <p className="mt-2 text-sm font-semibold text-red-500">
                              {t('admin.videos.invalidLink')}
                            </p>
                          )
                        )}
                        {embed && (
                          <div className="mt-4">
                            <div className="relative aspect-video bg-black">
                              <iframe
                                src={embed.embedUrl}
                                title={t('admin.lms.previewTitle', { title: lesson.title || t('videos.lesson') })}
                                className="absolute inset-0 w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="label-root mb-2">{t('admin.lms.contentLabel')}</label>
                        <textarea
                          value={lesson.content || ''}
                          onChange={(e) => updateLesson(module.id, lesson.id, { content: e.target.value })}
                          rows="4"
                          className="input-root"
                          placeholder={t('admin.lms.contentPlaceholder')}
                        />
                      </div>

                      <div>
                        <label className="label-root mb-2">{t('admin.lms.sectionsLabel')}</label>
                        {lesson.sections.length === 0 && (
                          <p className="mb-3 text-sm text-body dark:text-body-dark">
                            {t('admin.lms.sectionsHint')}
                          </p>
                        )}
                        <div className="space-y-4">
                          {lesson.sections.map((section, sIdx) => (
                            <div
                              key={section.id}
                              className="border border-stroke/70 dark:border-[#2C303B] p-4 space-y-3"
                            >
                              {section.kind === 'text' ? (
                                <div>
                                  <label className="label-root mb-2">{t('admin.lms.textSectionLabel')}</label>
                                  <textarea
                                    value={section.text || ''}
                                    onChange={(e) => updateSection(module.id, lesson.id, section.id, { text: e.target.value })}
                                    rows="3"
                                    className="input-root"
                                    placeholder={t('admin.lms.textSectionPlaceholder')}
                                  />
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                      <FiCode className="w-4 h-4" /> {t('admin.lms.codeSectionLabel')}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeSection(module.id, lesson.id, section.id)}
                                      aria-label={t('admin.lms.removeSection')}
                                      className="h-8 w-8 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                      <FiTrash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div>
                                    <label className="label-root mb-2">{t('admin.lms.codeSummaryLabel')}</label>
                                    <textarea
                                      value={section.summary || ''}
                                      onChange={(e) => updateSection(module.id, lesson.id, section.id, { summary: e.target.value })}
                                      rows="2"
                                      className="input-root"
                                      placeholder={t('admin.lms.codeSummaryPlaceholder')}
                                    />
                                  </div>
                                  <div>
                                    <label className="label-root mb-2">{t('admin.lms.codeLanguageLabel')}</label>
                                    <input
                                      value={section.language || ''}
                                      onChange={(e) => updateSection(module.id, lesson.id, section.id, { language: e.target.value })}
                                      className="input-root"
                                      placeholder={t('admin.lms.codeLanguagePlaceholder')}
                                    />
                                  </div>
                                  <div>
                                    <label className="label-root mb-2">{t('admin.lms.codeLabel')}</label>
                                    <textarea
                                      value={section.code || ''}
                                      onChange={(e) => updateSection(module.id, lesson.id, section.id, { code: e.target.value })}
                                      rows="6"
                                      className="input-root font-mono text-[13px] leading-relaxed"
                                      placeholder={t('admin.lms.codePlaceholder')}
                                    />
                                  </div>
                                </>
                              )}

                              {section.kind === 'text' && (
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => removeSection(module.id, lesson.id, section.id)}
                                    aria-label={t('admin.lms.removeSection')}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:underline"
                                  >
                                    <FiTrash2 className="w-3.5 h-3.5" /> {t('admin.lms.removeSection')}
                                  </button>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stroke/60 dark:border-[#2C303B]">
                                <span className="text-xs font-semibold text-body dark:text-body-dark mr-auto">
                                  {t('admin.lms.insertHere')}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => insertSection(module.id, lesson.id, sIdx, { kind: 'text', text: '' })}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray2 dark:bg-[#2C303B] text-dark dark:text-body-dark hover:bg-stroke transition-colors"
                                >
                                  <FiPlus className="w-3.5 h-3.5" /> {t('admin.lms.addTextSection')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => insertSection(module.id, lesson.id, sIdx, { kind: 'code', summary: '', language: '', code: '' })}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray2 dark:bg-[#2C303B] text-dark dark:text-body-dark hover:bg-stroke transition-colors"
                                >
                                  <FiCode className="w-3.5 h-3.5" /> {t('admin.lms.addCodeSection')}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {lesson.sections.length === 0 && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => appendSection(module.id, lesson.id, { kind: 'text', text: '' })}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-gray2 dark:bg-[#2C303B] text-dark dark:text-body-dark hover:bg-stroke transition-colors"
                            >
                              <FiPlus className="w-3.5 h-3.5" /> {t('admin.lms.addTextSection')}
                            </button>
                            <button
                              type="button"
                              onClick={() => appendSection(module.id, lesson.id, { kind: 'code', summary: '', language: '', code: '' })}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-gray2 dark:bg-[#2C303B] text-dark dark:text-body-dark hover:bg-stroke transition-colors"
                            >
                              <FiCode className="w-3.5 h-3.5" /> {t('admin.lms.addCodeSection')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => addLesson(module.id)}
                className="btn-outline-root w-full"
              >
                <FiPlus className="w-4 h-4" /> {t('admin.lms.addLesson')}
              </button>
            </div>
          ))}

          <button type="button" onClick={addModule} className="btn-outline-root w-full">
            <FiPlus className="w-4 h-4" /> {t('admin.lms.addModule')}
          </button>

          <button onClick={handleSave} disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
            <FiSave className="w-4 h-4" /> {saving ? t('common.saving') : t('admin.lms.save')}
          </button>
        </>
      )}
    </div>
  );
}