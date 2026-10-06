import { useState, useEffect, useCallback } from 'react';
import { studentsAPI, FORGE_CONFIGURED } from '../service/api';

/*
 * Inscription des apprenants + progression serveur.
 *
 * - Une personne s'inscrit une fois (nom + email, sans mot de passe) depuis
 *   /videos. Son identifiant est gardé dans localStorage : elle n'a plus à se
 *   re-identifier à chaque visite.
 * - La progression (même forme que l'ancien localStorage `lms_progress`)
 *   { moduleId: { lessonId: true } } est envoyée au serveur à chaque leçon
 *   marquée comme faite : l'onglet admin « Apprenants » la lit.
 * - Sans Forge configuré (mode local documenté dans DashboardSection), le
 *   portail est contourné et la progression reste en localStorage.
 */

const STUDENT_KEY = 'lms_student_id';
const LOCAL_PROGRESS_KEY = 'lms_progress';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const readLocalProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
};

export default function useEnrollment() {
  const [status, setStatus] = useState(() => (FORGE_CONFIGURED ? 'loading' : 'ready'));
  const [student, setStudent] = useState(null);
  // miroir local toujours alimenté : sert de repli si l'API est indisponible
  const [progress, setProgress] = useState(readLocalProgress);
  const [registering, setRegistering] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!FORGE_CONFIGURED) return undefined;
    let mounted = true;

    const id = localStorage.getItem(STUDENT_KEY);
    if (!id) {
      setStatus('pending');
      return undefined;
    }

    studentsAPI
      .get()
      .then((all) => {
        if (!mounted) return;
        const found = (all || []).find((item) => item.id === id);
        if (found) {
          const next = found.progress || {};
          setStudent(found);
          setProgress(next);
          localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(next));
          setStatus('ready');
        } else {
          localStorage.removeItem(STUDENT_KEY);
          setStudent(null);
          setProgress({});
          setStatus('pending');
        }
      })
      .catch(() => {
        if (!mounted) return;
        // API injoignable : on garde l'apprenant connecté sur son miroir
        // local plutôt que de lui bloquer la formation.
        setStatus('ready');
      });

    return () => {
      mounted = false;
    };
  }, []);

  const isDone = (moduleId, lessonId) => !!(progress[moduleId] && progress[moduleId][lessonId]);

  const moduleProgress = (module) => {
    const lessons = module?.lessons || [];
    if (!lessons.length) return 0;
    const done = lessons.filter((lesson) => isDone(module.id, lesson.id)).length;
    return Math.round((done / lessons.length) * 100);
  };

  const persist = useCallback(
    (next, previous) => {
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(next));
      if (!FORGE_CONFIGURED || !student) return;
      setSyncing(true);
      studentsAPI
        .update(student.id, { progress: next })
        .catch(() => setProgress(previous))
        .finally(() => setSyncing(false));
    },
    [student]
  );

  const toggleDone = useCallback(
    (moduleId, lessonId) => {
      const previous = progress;
      const current = !!(progress[moduleId] && progress[moduleId][lessonId]);
      const next = {
        ...progress,
        [moduleId]: { ...(progress[moduleId] || {}), [lessonId]: !current },
      };
      setProgress(next);
      persist(next, previous);
    },
    [progress, persist]
  );

  const register = useCallback(async ({ name, email }) => {
    const cleanName = String(name || '').trim();
    const cleanEmail = normalizeEmail(email);

    if (!cleanName) return { ok: false, error: 'videos.enroll.nameRequired' };
    if (!cleanEmail) return { ok: false, error: 'videos.enroll.emailRequired' };
    if (!EMAIL_RE.test(cleanEmail)) return { ok: false, error: 'videos.enroll.emailInvalid' };

    if (!FORGE_CONFIGURED) {
      // pas de portail en mode local : on est déjà en 'ready'
      return { ok: true };
    }

    setRegistering(true);
    try {
      const all = await studentsAPI.get();
      let found = (all || []).find((item) => normalizeEmail(item.email) === cleanEmail);

      if (!found) {
        try {
          found = await studentsAPI.create({ name: cleanName, email: cleanEmail, progress: {} });
        } catch (err) {
          // index unique sur l'email : doublon concurrent → on reprend la ligne existante
          const again = await studentsAPI.get();
          found = (again || []).find((item) => normalizeEmail(item.email) === cleanEmail);
          if (!found) throw err;
        }
      }

      // on adopte la fiche : la progression locale éventuelle (réalisée avant
      // l'existence du portail) est conservée, le serveur reste prioritaire
      // sur les clés communes.
      const next = { ...readLocalProgress(), ...(found.progress || {}) };
      localStorage.setItem(STUDENT_KEY, found.id);
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(next));
      setStudent(found);
      setProgress(next);
      setStatus('ready');
      return { ok: true };
    } catch {
      return { ok: false, error: 'videos.enroll.error' };
    } finally {
      setRegistering(false);
    }
  }, []);

  return {
    status,
    student,
    progress,
    isDone,
    moduleProgress,
    toggleDone,
    register,
    registering,
    syncing,
  };
}
