import { useState, useCallback, useEffect } from 'react';
import { authAPI, FORGE_TOKEN_KEY, FORGE_CONFIGURED } from '../service/api';

export default function useAuth() {
  const [authed, setAuthed] = useState(() => Boolean(sessionStorage.getItem(FORGE_TOKEN_KEY)));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!FORGE_CONFIGURED) return;
    if (!sessionStorage.getItem(FORGE_TOKEN_KEY)) return;
    setChecking(true);
    authAPI
      .me()
      .then(() => {
        if (mounted) setAuthed(true);
      })
      .catch(() => {
        if (mounted) {
          sessionStorage.removeItem(FORGE_TOKEN_KEY);
          setAuthed(false);
        }
      })
      .finally(() => {
        if (mounted) setChecking(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      if (!FORGE_CONFIGURED) throw new Error('Forge non configuré');
      const { token } = await authAPI.login({ email, password });
      if (!token) throw new Error('Token manquant');
      sessionStorage.setItem(FORGE_TOKEN_KEY, token);
      setAuthed(true);
      return { ok: true };
    } catch (err) {
      setError('Identifiants invalides ou API indisponible');
      setAuthed(false);
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(FORGE_TOKEN_KEY);
    setAuthed(false);
  }, []);

  return { authed, login, logout, loading, error, checking };
}