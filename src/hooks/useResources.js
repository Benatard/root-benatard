import { useState, useEffect, useCallback } from 'react';
import { resourcesAPI } from '../service/api';

export default function useResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');

  useEffect(() => {
    let mounted = true;
    resourcesAPI
      .get()
      .then((result) => {
        if (!mounted) return;
        setResources(Array.isArray(result) ? result : []);
        setSource('api');
      })
      .catch(() => {
        if (!mounted) return;
        setResources([]);
        setSource('error');
        setError(new Error('API inaccessible'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const addResource = useCallback(async (payload) => {
    try {
      const created = await resourcesAPI.create(payload);
      setResources((prev) => [created, ...prev]);
      setSource('api');
      return { ok: true, local: false };
    } catch (err) {
      return { ok: false, local: false, error: err };
    }
  }, []);

  const updateResource = useCallback(async (id, payload) => {
    try {
      const updated = await resourcesAPI.update(id, payload);
      setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...(updated || payload) } : r)));
      setSource('api');
      return { ok: true, local: false };
    } catch (err) {
      return { ok: false, local: false, error: err };
    }
  }, []);

  const removeResource = useCallback(async (id) => {
    try {
      await resourcesAPI.remove(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      setSource('api');
      return { ok: true, local: false };
    } catch (err) {
      return { ok: false, local: false, error: err };
    }
  }, []);

  return { resources, setResources, loading, error, source, addResource, updateResource, removeResource };
}