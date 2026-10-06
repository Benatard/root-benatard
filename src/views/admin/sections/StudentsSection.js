import React from 'react';
import { FiUsers } from 'react-icons/fi';
import useStudents from '../../../hooks/useStudents';
import useLMS from '../../../hooks/useLMS';
import Loading from '../../../components/ui/Loading';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { useLang } from '../../../i18n/LanguageContext';

const formatDate = (iso, lang) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/* % global : leçons cochées / total des leçons de tous les modules. */
const overallPercent = (progress, modules) => {
  if (!Array.isArray(modules) || !modules.length) return null;
  let total = 0;
  let done = 0;
  modules.forEach((module) => {
    const lessons = module?.lessons || [];
    total += lessons.length;
    done += lessons.filter((lesson) => progress && progress[module.id] && progress[module.id][lesson.id]).length;
  });
  if (!total) return null;
  return Math.round((done / total) * 100);
};

export default function StudentsSection() {
  const { t, lang } = useLang();
  const { students, loading, error } = useStudents();
  const { modules } = useLMS();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white">{t('admin.students.title')}</h1>
        <p className="mt-2 text-sm text-body dark:text-body-dark">{t('admin.students.sub')}</p>
      </div>

      {loading && <Loading variant="list" />}
      {error && <ErrorBanner message={t('admin.students.loadError')} />}

      {!loading && !error && students.length === 0 ? (
        <div className="card-root p-12 text-center">
          <FiUsers className="mx-auto w-10 h-10 text-primary/40" />
          <p className="mt-4 text-body dark:text-body-dark">{t('admin.students.empty')}</p>
        </div>
      ) : (
        <div className="card-root overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stroke/70 dark:border-[#2C303B] text-left text-[11px] uppercase tracking-widest text-body dark:text-body-dark">
                <th className="px-5 py-3.5 font-semibold">{t('admin.students.name')}</th>
                <th className="px-5 py-3.5 font-semibold">{t('admin.students.email')}</th>
                <th className="px-5 py-3.5 font-semibold">{t('admin.students.registeredAt')}</th>
                <th className="px-5 py-3.5 font-semibold text-right">{t('admin.students.progress')}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const percent = overallPercent(student.progress, modules);
                return (
                  <tr
                    key={student.id}
                    className="border-b border-stroke/50 dark:border-[#2C303B] last:border-0"
                  >
                    <td className="px-5 py-4 font-bold text-dark dark:text-white">
                      {student.name || '—'}
                    </td>
                    <td className="px-5 py-4 text-body dark:text-body-dark">{student.email || '—'}</td>
                    <td className="px-5 py-4 text-body dark:text-body-dark">
                      {formatDate(student.created_at, lang)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 justify-end min-w-[160px]">
                        <div className="h-1.5 flex-1 bg-gray2 dark:bg-[#2C303B] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                            style={{ width: `${percent || 0}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-bold text-primary">
                          {percent === null ? '—' : `${percent}%`}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
