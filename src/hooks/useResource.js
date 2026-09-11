import { useState, useEffect } from 'react';

export default function useResource(apiCall, options = {}) {
  const { dependencies = [] } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setSource('loading');

    const load = async () => {
      try {
        const result = await apiCall();
        if (!mounted) return;
        setData(result ?? null);
        setSource('api');
      } catch (err) {
        if (!mounted) return;
        setData(null);
        setSource('error');
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, setData, loading, error, source };
}