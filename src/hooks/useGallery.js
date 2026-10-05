import { useState, useEffect, useCallback, useRef } from 'react';
import { galleryAPI } from '../service/api';
import { useLang } from '../i18n/LanguageContext';

export default function useGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');
  const hasData = useRef(false);
  const photosRef = useRef([]);
  const { dataVersion } = useLang();

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    let mounted = true;
    if (!hasData.current) setSource('refreshing');
    galleryAPI
      .get()
      .then((result) => {
        if (!mounted) return;
        hasData.current = true;
        setPhotos(Array.isArray(result) ? result : []);
        setSource('api');
      })
      .catch(() => {
        if (!mounted) return;
        if (!hasData.current) {
          setPhotos([]);
          setSource('error');
          setError(new Error('API inaccessible'));
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [dataVersion]);

  const addPhoto = useCallback(async (payload) => {
    try {
      const created = await galleryAPI.create({ ...payload, sortOrder: photosRef.current.length + 1 });
      setPhotos((prev) => [...prev, created]);
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

  const saveOrder = useCallback(async (orderedPhotos) => {
    try {
      await Promise.all(
        orderedPhotos.map((photo, index) => galleryAPI.updateOrder(photo.id, index + 1))
      );
      const positions = new Map(orderedPhotos.map((photo, index) => [photo.id, index]));
      setPhotos((prev) =>
        prev
          .map((photo) => ({ ...photo, sortOrder: (positions.get(photo.id) ?? 0) + 1 }))
          .sort((a, b) => (positions.get(a.id) ?? 0) - (positions.get(b.id) ?? 0))
      );
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

  return {
    photos,
    setPhotos,
    loading,
    error,
    source,
    addPhoto,
    updatePhoto,
    saveOrder,
    removePhoto,
  };
}