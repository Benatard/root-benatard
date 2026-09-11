import { useState, useEffect, useCallback } from 'react';
import { videosAPI } from '../service/api';

export default function useVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');

  useEffect(() => {
    let mounted = true;
    videosAPI
      .get()
      .then((result) => {
        if (!mounted) return;
        setVideos(Array.isArray(result) ? result : []);
        setSource('api');
      })
      .catch(() => {
        if (!mounted) return;
        setVideos([]);
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

  const addVideo = useCallback(async (payload) => {
    try {
      const created = await videosAPI.create(payload);
      setVideos((prev) => [created, ...prev]);
      setSource('api');
      return { ok: true, local: false };
    } catch (err) {
      return { ok: false, local: false, error: err };
    }
  }, []);

  const updateVideo = useCallback(async (id, payload) => {
    try {
      const updated = await videosAPI.update(id, payload);
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...(updated || payload) } : v)));
      setSource('api');
      return { ok: true, local: false };
    } catch (err) {
      return { ok: false, local: false, error: err };
    }
  }, []);

  const removeVideo = useCallback(async (id) => {
    try {
      await videosAPI.remove(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
      setSource('api');
      return { ok: true, local: false };
    } catch (err) {
      return { ok: false, local: false, error: err };
    }
  }, []);

  return { videos, setVideos, loading, error, source, addVideo, updateVideo, removeVideo };
}