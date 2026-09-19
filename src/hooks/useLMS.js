import { useState, useEffect, useCallback, useRef } from 'react';
import { lmsAPI, videosAPI } from '../service/api';
import { useLang } from '../i18n/LanguageContext';

const SEED_FLAG = 'lms_seeded_v1';

const uid = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const ensureFormationIds = (formations) =>
  (formations || []).map((f, i) => ({
    ...f,
    id: f.id || `local-f-${i}-${uid()}`,
    modules: (f.modules || []).map((m, j) => ({
      ...m,
      id: m.id || `local-m-${i}-${j}-${uid()}`,
      lessons: (m.lessons || []).map((l, k) => ({
        ...l,
        id: l.id || `local-l-${i}-${j}-${k}-${uid()}`,
      })),
    })),
  }));

const stripFormationIds = (formations) =>
  formations.map(({ id, ...formation }) => ({
    ...formation,
    modules: (formation.modules || []).map(({ id: mId, ...module }) => ({
      ...module,
      lessons: (module.lessons || []).map(({ id: lId, ...lesson }) => ({
        ...lesson,
        sections: (lesson.sections || []).map(({ id: sId, ...section }) => section),
      })),
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
                      id: video.id || `lesson-${i}-${uid()}`,
                      title: video.title || 'Sans titre',
                      url: video.url || '',
                      embedUrl: video.embedUrl || '',
                      content: video.description || '',
                    })),
                  },
                ],
              },
            ];
            await lmsAPI.save({ formations: stripFormationIds(list) }).catch(() => {});
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
      const row = await lmsAPI.save({ formations: stripFormationIds(fms) });
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