import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  authAPI, clearToken, FORGE_CONFIGURED, getToken, setToken, studentsAPI,
} from '../service/api';

/*
 * Identité de la session — admin ET apprenants.
 *
 * Deux tables, deux rôles :
 *   `admin`    → identifiants (email, hash, role)  — source de vérité du rôle
 *   `students` → profil + progression (name, email, progress)
 * Le lien entre les deux est l'email.
 *
 * Le rôle n'est ni dans le JWT ni dans /auth/me : il est relu dans la table
 * `admin` à chaque ouverture de session (`authAPI.role`).
 * `require_auth` étant projet entier et désactivé (forge/schema.md §3),
 * ce garde-fou protège l'UI, pas l'API — voir la doc du projet.
 */

const AuthContext = createContext(null);

export const GUEST = { id: null, email: null, role: null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

const fail = (key) => ({ ok: false, error: key });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(GUEST);
  const [status, setStatus] = useState(() => (FORGE_CONFIGURED && getToken() ? 'loading' : 'ready'));
  const [busy, setBusy] = useState(false);

  /* Ouverture de session : on revalide le token puis on relit le rôle. */
  useEffect(() => {
    if (!FORGE_CONFIGURED || !getToken()) return undefined;
    let mounted = true;
    setStatus('loading');

    authAPI
      .me()
      .then(async (me) => {
        const role = await authAPI.role(me && me.email);
        if (!mounted) return;
        setUser({ id: (me && me.id) || null, email: (me && me.email) || null, role });
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted) return;
        clearToken();
        setUser(GUEST);
        setStatus('ready');
      });

    return () => {
      mounted = false;
    };
  }, []);

  const authenticate = useCallback(async (email, password) => {
    const clean = String(email || '').trim().toLowerCase();
    if (!clean) return fail('auth.error.emailRequired');
    if (!EMAIL_RE.test(clean)) return fail('auth.error.emailInvalid');
    if (!password) return fail('auth.error.passwordRequired');
    if (String(password).length < MIN_PASSWORD) return fail('auth.error.passwordShort');

    setBusy(true);
    try {
      const { token, user: me } = await authAPI.login({ email: clean, password });
      if (!token) return fail('auth.error.credentials');
      setToken(token);
      const role = await authAPI.role(clean);
      setUser({ id: (me && me.id) || null, email: (me && me.email) || clean, role });
      setStatus('ready');
      return { ok: true };
    } catch (err) {
      const code = err?.response?.status;
      if (code === 401 || code === 400) return fail('auth.error.credentials');
      return fail('auth.error.network');
    } finally {
      setBusy(false);
    }
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const clean = String(email || '').trim().toLowerCase();
    if (!clean) return fail('auth.error.emailRequired');
    if (!EMAIL_RE.test(clean)) return fail('auth.error.emailInvalid');
    if (!password) return fail('auth.error.passwordRequired');
    if (String(password).length < MIN_PASSWORD) return fail('auth.error.passwordShort');

    setBusy(true);
    try {
      const { token, user: me } = await authAPI.signup({ email: clean, password });
      if (!token) return fail('auth.error.network');
      setToken(token);

      // Profil apprenant : une ligne `students` indexée sur l'email.
      // Échec non bloquant (doublon) — useStudent refera le pont au besoin.
      try {
        await studentsAPI.create({
          name: String(name || '').trim(),
          email: clean,
          progress: {},
        });
      } catch {
        /* déjà inscrit côté students */
      }

      setUser({ id: (me && me.id) || null, email: (me && me.email) || clean, role: 'student' });
      setStatus('ready');
      return { ok: true };
    } catch (err) {
      const code = err?.response?.status;
      if (code === 409) return fail('auth.error.emailTaken');
      if (code === 400) return fail('auth.error.passwordShort');
      return fail('auth.error.network');
    } finally {
      setBusy(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(GUEST);
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      busy,
      login: authenticate,
      signup,
      logout,
      authed: Boolean(user.email),
      isAdmin: user.role === 'admin',
      isStudent: Boolean(user.email) && user.role !== 'admin',
      configured: FORGE_CONFIGURED,
    }),
    [user, status, busy, authenticate, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export { MIN_PASSWORD };
