import { useState, useEffect, useCallback, useRef } from 'react';
import { lmsAPI, videosAPI } from '../service/api';
import { useLang } from '../i18n/LanguageContext';

const SEED_FLAG = 'lms_seeded_v1';

const uid = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const stripIds = (modules) =>
  modules.map(({ id, ...module }) => ({
    ...module,
    lessons: (module.lessons || []).map(({ id: lessonId, ...lesson }) => lesson),
  }));

const ensureIds = (modules) =>
  modules.map((m, i) => ({
    ...m,
    id: m.id || `local-${i}-${uid()}`,
    lessons: (m.lessons || []).map((l, j) => ({ ...l, id: l.id || `local-l-${i}-${j}-${uid()}` })),
  }));

export default function useLMS() {
  const [modules, setModules] = useState(null);
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
        let mods = (await lmsAPI.get())?.modules;
        if (!Array.isArray(mods)) mods = [];

        if (mods.length === 0 && !localStorage.getItem(SEED_FLAG)) {
          const legacy = await videosAPI.get().catch(() => []);
          if (Array.isArray(legacy) && legacy.length > 0) {
            mods = [
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
            ];
            await lmsAPI.save({ modules: stripIds(mods) }).catch(() => {});
          }
          localStorage.setItem(SEED_FLAG, '1');
        }

        if (!mounted) return;
        hasData.current = true;
        setModules(ensureIds(mods));
        setSource('api');
      } catch (err) {
        if (!mounted) return;
        if (!hasData.current) {
          setModules([]);
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

  const save = useCallback(async (mods) => {
    try {
      const row = await lmsAPI.save({ modules: stripIds(mods) });
      if (row && Array.isArray(row.modules)) {
        setModules(ensureIds(row.modules));
      } else {
        setModules(ensureIds(mods));
      }
      setSource('api');
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  }, []);

  return { modules, setModules, loading, error, source, save };
}