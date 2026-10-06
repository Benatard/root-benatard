import { useState, useEffect, useCallback, useRef } from 'react';
import { lmsAPI, videosAPI } from '../service/api';
import { useLang } from '../i18n/LanguageContext';

const SEED_FLAG = 'lms_seeded_v1';

/*
 * Ids déterministes, dérivés de la position, et NON aléatoires.
 * Les ids servent de clés pour la progression des apprenants
 * (students.progress = { moduleId: { lessonId: true } }) : ils doivent donc
 * être identiques d'un chargement à l'autre. uid() (Date.now + aléa) rendait
 * la progression invalide à chaque rechargement.
 * Un id déjà présent (données seed, création depuis /admin) est conservé.
 */
const ensureFormationIds = (formations) =>
  (formations || []).map((f, i) => ({
    ...f,
    id: f.id || `formation-${i}`,
    modules: (f.modules || []).map((m, j) => ({
      ...m,
      id: m.id || `module-${i}-${j}`,
      lessons: (m.lessons || []).map((l, k) => ({
        ...l,
        id: l.id || `lesson-${i}-${j}-${k}`,
      })),
    })),
  }));

/* À enregistrer en base : les ids sont conservés (voir ci-dessus). */
const toPersistedFormations = (formations) =>
  (formations || []).map((formation) => ({
    ...formation,
    modules: (formation.modules || []).map((module) => ({
      ...module,
      lessons: (module.lessons || []).map((lesson) => ({ ...lesson })),
    })),
  }));

const toFormations = (row) => {
  if (Array.isArray(row.formations)) return row.formations;
  if (Array.isArray(row.modules)) {
    return [{ id: 'formation-default', title: '', description: '', modules: row.modules }];
  }
  return [];
};

export default function useLMS() {
  const [formations, setFormations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');
  const hasData = useRef(false);
  const { dataVersion } = useLang();

  useEffect(() => {
    let mounted = true;
    if (!hasData.current) setSource('refreshing');
    const load = async () => {
      try {
        let list = toFormations((await lmsAPI.get()) || {});

        if (list.length === 0 && !localStorage.getItem(SEED_FLAG)) {
          const legacy = await videosAPI.get().catch(() => []);
          if (Array.isArray(legacy) && legacy.length > 0) {
            list = [
              {
                id: 'formation-videotheque',
                title: '',
                description: '',
                modules: [
                  {
                    id: 'module-videotheque',
                    title: 'Vidéothèque',
                    description: 'Mes anciens tutoriels, regroupés au fil de la formation.',
                    lessons: legacy.map((video, i) => ({
                      id: video.id || `lesson-legacy-${i}`,
                      title: video.title || 'Sans titre',
                      url: video.url || '',
                      embedUrl: video.embedUrl || '',
                      content: video.description || '',
                    })),
                  },
                ],
              },
            ];
            await lmsAPI.save({ formations: toPersistedFormations(list) }).catch(() => {});
          }
          localStorage.setItem(SEED_FLAG, '1');
        }

        if (!mounted) return;
        hasData.current = true;
        setFormations(ensureFormationIds(list));
        setSource('api');
      } catch (err) {
        if (!mounted) return;
        if (!hasData.current) {
          setFormations([]);
          setSource('error');
          setError(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [dataVersion]);

  const save = useCallback(async (fms) => {
    try {
      const row = await lmsAPI.save({ formations: toPersistedFormations(fms) });
      const saved = toFormations(row || {});
      setFormations(ensureFormationIds(saved.length ? saved : fms));
      setSource('api');
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  }, []);

  const modules = Array.isArray(formations)
    ? formations.flatMap((f) => f.modules || [])
    : null;

  return { formations, modules, setFormations, loading, error, source, save };
}