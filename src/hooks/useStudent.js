import { useState, useEffect, useCallback } from 'react';
import { studentsAPI, FORGE_CONFIGURED } from '../service/api';
import { useAuth } from '../context/AuthContext';

/*
 * Fiche progression de l'apprenant.
 *
 * Identité  : l'email du JWT (contexte d'auth) — plus aucune clé posée dans
 *             le navigateur pour dire "qui je suis".
 * Fiche     : ligne `students` retrouvée/créée par email.
 * Progression : forme exacte de l'ancien `lms_progress`
 *             { [moduleId]: { [lessonId]: true } }, miroir local toujours
 *             alimenté + synchro serveur (onglet admin « Apprenants »).
 *
 * statut : 'loading' — session en cours de résolution / fiche à venir
 *          'guest'   — pas de compte → l'écran affiche le portail d'accès
 *          'ready'   — on peut naviguer et cocher des leçons
 *
 * Sans Forge configuré (mode local documenté dans DashboardSection) on est
 * toujours 'ready' et la progression reste en localStorage.
 */

const LOCAL_PROGRESS_KEY = 'lms_progress';

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const readLocalProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
};

const writeLocalProgress = (next) => {
  try {
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(next));
  } catch {
    /* stockage indisponible : la session serveur reste la référence */
  }
};

export default function useStudent() {
  const { user, authed, isAdmin, status: authStatus } = useAuth();
  const email = normalizeEmail(user && user.email);
  const isLearner = authed && !isAdmin && Boolean(email);

  const [student, setStudent] = useState(null);
  const [resolved, setResolved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(readLocalProgress);

  useEffect(() => {
    setResolved(false);
    if (!isLearner || !FORGE_CONFIGURED) {
      setStudent(null);
      return undefined;
    }

    let mounted = true;

    (async () => {
      try {
        const all = await studentsAPI.get();
        if (!mounted) return;

        let found = (all || []).find((item) => normalizeEmail(item.email) === email);
        if (!found) {
          // Provisionnement : le compte existe (auth) mais pas encore de fiche.
          // On repart de la progression locale pour ne rien perdre.
          try {
            found = await studentsAPI.create({ name: '', email, progress: readLocalProgress() });
          } catch {
            const again = await studentsAPI.get();
            found = (again || []).find((item) => normalizeEmail(item.email) === email);
          }
          if (!mounted || !found) throw new Error('no-student-row');
        }

        const next = { ...readLocalProgress(), ...(found.progress || {}) };
        writeLocalProgress(next);
        setStudent(found);
        setProgress(next);
        setResolved(true);
      } catch {
        if (!mounted) return;
        // API injoignable : on garde l'apprenant sur son miroir local plutôt
        // que de lui bloquer la formation.
        setStudent(null);
        setProgress(readLocalProgress());
        setResolved(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isLearner, email]);

  const isDone = (moduleId, lessonId) => !!(progress[moduleId] && progress[moduleId][lessonId]);

  const moduleProgress = (module) => {
    const lessons = module?.lessons || [];
    if (!lessons.length) return 0;
    const done = lessons.filter((lesson) => isDone(module.id, lesson.id)).length;
    return Math.round((done / lessons.length) * 100);
  };

  const persist = useCallback(
    (next, previous) => {
      writeLocalProgress(next);
      if (!FORGE_CONFIGURED || !student) return;
      setSyncing(true);
      studentsAPI
        .update(student.id, { progress: next })
        .catch(() => {
          writeLocalProgress(previous);
          setProgress(previous);
        })
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

  let status = 'ready';
  if (!FORGE_CONFIGURED) status = 'ready';
  else if (authStatus === 'loading') status = 'loading';
  else if (!authed) status = 'guest';
  else if (isLearner && !resolved) status = 'loading';

  return {
    status,
    student,
    email,
    progress,
    isDone,
    moduleProgress,
    toggleDone,
    syncing,
  };
}
