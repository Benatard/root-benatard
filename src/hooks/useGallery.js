import { useState, useEffect, useCallback } from 'react';
import { galleryAPI } from '../service/api';

export default function useGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');

  useEffect(() => {
    let mounted = true;
    galleryAPI
      .get()
      .then((result) => {
        if (!mounted) return;
        setPhotos(Array.isArray(result) ? result : []);
        setSource('api');
      })
      .catch(() => {
        if (!mounted) return;
        setPhotos([]);
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

  const addPhoto = useCallback(async (payload) => {
    try {
      const created = await galleryAPI.create(payload);
      setPhotos((prev) => [created, ...prev]);
      setSource('api');
      return { ok: true, local: false };
    } catch (err) {
      return { ok: false, local: false, error: err };
    }
  }, []);

  const updatePhoto = useCallback(async (id, payload) => {
    try {
      const updated = await galleryAPI.update(id, payload);
      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...(updated || payload) } : p)));
      setSource('api');
      return { ok: true, local: false };
    } catch (err) {
      return { ok: false, local: false, error: err };
    }
  }, []);

  const removePhoto = useCallback(async (id) => {
    try {
      await galleryAPI.remove(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      setSource('api');
      return { ok: true, local: false };
    } catch (err) {
      return { ok: false, local: false, error: err };
    }
  }, []);

  return { photos, setPhotos, loading, error, source, addPhoto, updatePhoto, removePhoto };
}