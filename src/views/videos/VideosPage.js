import React, { useState, useEffect } from 'react';
import {
  FiPlayCircle, FiArrowLeft, FiCheckCircle, FiCircle, FiChevronRight, FiCheck, FiBookOpen,
} from 'react-icons/fi';
import PageMeta from '../../components/PageMeta';
import Reveal from '../../components/ui/Reveal';
import Loading from '../../components/ui/Loading';
import ErrorBanner from '../../components/ui/ErrorBanner';
import useLMS from '../../hooks/useLMS';
import { useLang } from '../../i18n/LanguageContext';

const PROGRESS_KEY = 'lms_progress';

const readProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
};

const renderText = (text) =>
  (text || '')
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line, i) => <p key={i} className="leading-relaxed">{line}</p>);

export default function VideosPage() {
  const { modules, loading, error } = useLMS();
  const { t } = useLang();
  const list = modules || [];
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [progress, setProgress] = useState(readProgress);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const activeModule = list.find((m) => m.id === activeModuleId) || null;
  const lessons = activeModule ? activeModule.lessons || [] : [];
  const activeLessonIdx = lessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = lessons[activeLessonIdx] || null;

  const isDone = (mId, lId) => !!(progress[mId] && progress[mId][lId]);

  const toggleDone = (mId, lId) =>
    setProgress((p) => {
      const current = !!(p[mId] && p[mId][lId]);
      return { ...p, [mId]: { ...(p[mId] || {}), [lId]: !current } };
    });

  const moduleProgress = (m) => {
    const ls = m?.lessons || [];
    if (!ls.length) return 0;
    const done = ls.filter((l) => isDone(m.id, l.id)).length;
    return Math.round((done / ls.length) * 100);
  };

  const openModule = (m) => {
    setActiveModuleId(m.id);
    setActiveLessonId((m.lessons && m.lessons[0] && m.lessons[0].id) || null);
  };

  const closeModule = () => {
    setActiveModuleId(null);
    setActiveLessonId(null);
  };

  const goToLesson = (idx) => {
    if (lessons[idx]) setActiveLessonId(lessons[idx].id);
  };

  return (
    <div>
      <PageMeta
        title={t('videos.metaTitle')}
        description={t('videos.metaDesc')}
      />

      <section className="relative pl-5 overflow-hidden bg-white dark:bg-gray-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,108,247,0.12)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative py-16 md:py-19 border-b border-stroke/70 dark:border-[#2C303B]">
          <Reveal className="max-w-3xl">
            <span className="eyebrow-root">
              <span className="h-1.5 w-1.5 bg-primary inline-block" />
              {t('videos.eyebrow')}
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black dark:text-white">
              {t('videos.title1')}{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{t('videos.titleHighlight')}</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-body dark:text-body-dark leading-relaxed">
              {t('videos.intro')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="py-16 md:py-19">
          {loading ? (
            <Loading variant="cardGrid2" />
          ) : error ? (
            <ErrorBanner />
          ) : activeModule ? (
            <Reveal>
              <section key={activeModule.id} className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
                <aside className="card-root p-5 lg:sticky lg:top-24">
                  <button
                    type="button"
                    onClick={closeModule}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    <FiArrowLeft className="w-4 h-4" /> {t('videos.allModules')}
                  </button>

                  <h2 className="mt-5 text-lg font-extrabold text-black dark:text-white leading-snug">
                    {activeModule.title}
                  </h2>
                  {activeModule.description && (
                    <p className="mt-2 text-sm text-body dark:text-body-dark leading-relaxed">
                      {activeModule.description}
                    </p>
                  )}

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-body dark:text-body-dark">
                      <span>{lessons.length} {lessons.length > 1 ? t('videos.lessons') : t('videos.lesson')}</span>
                      <span className="text-primary">{moduleProgress(activeModule)}%</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray2 dark:bg-[#2C303B] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                        style={{ width: `${moduleProgress(activeModule)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    {lessons.map((lesson, idx) => {
                      const done = isDone(activeModule.id, lesson.id);
                      const active = lesson.id === activeLessonId;
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => goToLesson(idx)}
                          className={`w-full flex items-start gap-3 px-3.5 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                            active
                              ? 'bg-primary/10 text-primary'
                              : 'text-dark dark:text-body-dark hover:bg-gray2 dark:hover:bg-[#2C303B]'
                          }`}
                        >
                          <span className="mt-0.5 flex-shrink-0">
                            {done ? (
                              <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <FiCircle className="w-4 h-4 opacity-40" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1 leading-snug">
                            <span className="block truncate">{lesson.title || t('videos.untitledLesson')}</span>
                            <span className="block text-[11px] font-medium opacity-60">
                              {t('videos.lessonN', { n: idx + 1 })}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </aside>

                <div className="min-w-0">
                  {activeLesson ? (
                    <Reveal key={activeLesson.id}>
                      <div className="card-root overflow-hidden">
                        <div className="relative aspect-video bg-black">
                          {activeLesson.embedUrl ? (
                            <iframe
                              src={activeLesson.embedUrl}
                              title={activeLesson.title}
                              className="absolute inset-0 w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-body dark:text-body-dark">
                              {t('videos.videoComing')}
                            </div>
                          )}
                        </div>
                        <div className="p-6 md:p-8 space-y-5">
                          <h3 className="text-xl md:text-2xl font-extrabold text-black dark:text-white leading-snug">
                            {activeLesson.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleDone(activeModule.id, activeLesson.id)}
                              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                                isDone(activeModule.id, activeLesson.id)
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                                  : 'bg-primary text-white hover:bg-primary-dark'
                              }`}
                            >
                              {isDone(activeModule.id, activeLesson.id) ? (
                                <FiCheck className="w-4 h-4" />
                              ) : (
                                <FiCheckCircle className="w-4 h-4" />
                              )}
                              {isDone(activeModule.id, activeLesson.id) ? t('videos.done') : t('videos.markDone')}
                            </button>
                            <div className="flex items-center gap-2 ml-auto">
                              <button
                                type="button"
                                onClick={() => goToLesson(activeLessonIdx - 1)}
                                disabled={activeLessonIdx === 0}
                                className="btn-outline-root disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {t('videos.prev')}
                              </button>
                              <button
                                type="button"
                                onClick={() => goToLesson(activeLessonIdx + 1)}
                                disabled={activeLessonIdx === lessons.length - 1}
                                className="btn-outline-root disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {t('videos.next')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {activeLesson.content && (
                        <div className="card-root mt-6 p-6 md:p-8">
                          <p className="text-xs font-semibold uppercase tracking-widest text-body dark:text-body-dark">
                            {t('videos.keyTakeaways')}
                          </p>
                          <div className="mt-4 space-y-4 text-[15px] text-dark dark:text-body-dark">
                            {renderText(activeLesson.content)}
                          </div>
                        </div>
                      )}
                    </Reveal>
                  ) : (
                    <div className="card-root p-12 text-center">
                      <FiBookOpen className="mx-auto w-10 h-10 text-primary/40" />
                      <p className="mt-4 text-body dark:text-body-dark">
                        {t('videos.moreLessons')}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </Reveal>
          ) : list.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {list.map((m, index) => {
                const done = moduleProgress(m);
                return (
                  <Reveal key={m.id} delay={(index % 2) * 100}>
                    <button
                      type="button"
                      onClick={() => openModule(m)}
                      className="card-root p-6 md:p-8 text-left transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 w-full h-full flex flex-col"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-extrabold text-black dark:text-white leading-snug">
                          {m.title || t('videos.untitledModule')}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 flex-shrink-0">
                          <FiPlayCircle className="w-3.5 h-3.5" />
                          {(m.lessons || []).length}
                        </span>
                      </div>
                      {m.description && (
                        <p className="mt-3 text-sm text-body dark:text-body-dark leading-relaxed flex-1">
                          {m.description}
                        </p>
                      )}
                      <div className="mt-5">
                        <div className="flex items-center justify-between text-xs font-semibold text-body dark:text-body-dark">
                          <span className="inline-flex items-center gap-1.5">
                            <FiChevronRight className="w-4 h-4 text-primary" /> {t('videos.start')}
                          </span>
                          <span className="text-primary">{done}%</span>
                        </div>
                        <div className="mt-2 h-1.5 bg-gray2 dark:bg-[#2C303B] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                            style={{ width: `${done}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="card-root p-12 text-center">
              <FiBookOpen className="mx-auto w-10 h-10 text-primary/40" />
              <p className="mt-4 text-body dark:text-body-dark">
                {t('videos.comingSoon')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}