import { useState, useEffect, useRef } from 'react';
import { useLang } from '../i18n/LanguageContext';

export default function useResource(apiCall, options = {}) {
  const { dependencies = [] } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');
  const hasData = useRef(false);
  const { dataVersion } = useLang();

  useEffect(() => {
    let mounted = true;

    if (hasData.current) {
      setSource('refreshing');
    } else {
      setLoading(true);
      setError(null);
      setSource('loading');
    }

    const load = async () => {
      try {
        const result = await apiCall();
        if (!mounted) return;
        hasData.current = true;
        setData(result ?? null);
        setSource('api');
      } catch (err) {
        if (!mounted) return;
        if (!hasData.current) {
          setData(null);
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
  }, dependencies.concat([dataVersion]));

  return { data, setData, loading, error, source };
}