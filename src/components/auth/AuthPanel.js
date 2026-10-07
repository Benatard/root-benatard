import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useAuth, MIN_PASSWORD } from '../../context/AuthContext';
import { useLang } from '../../i18n/LanguageContext';

/*
 * Portail d'accès aux formations : connexion ou création de compte.
 * Déclenché au clic sur « Commencer » (les formations restent visibles
 * sans compte ; c'est l'entrée dans une formation qui demande la session).
 */
export default function AuthPanel({ onDone, onCancel }) {
  const { login, signup, busy } = useAuth();
  const { t } = useLang();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const isSignup = mode === 'signup';

  const switchMode = (next) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isSignup ? await signup(form) : await login(form);
    if (result.ok) {
      setError(null);
      setForm({ name: '', email: '', password: '' });
      if (onDone) onDone(mode);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="card-root p-6 md:p-8">
        <span className="eyebrow-root">
          <span className="h-1.5 w-1.5 bg-primary inline-block" />
          {t('videos.enroll.eyebrow')}
        </span>
        <h2 className="mt-5 text-2xl font-extrabold text-black dark:text-white">
          {mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}
        </h2>
        <p className="mt-3 text-sm text-body dark:text-body-dark leading-relaxed">
          {t('videos.enroll.subtitle')}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-1 bg-gray2 dark:bg-[#2C303B] p-1">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                mode === m
                  ? 'bg-white dark:bg-gray-dark text-primary'
                  : 'text-body dark:text-body-dark'
              }`}
            >
              {t(`auth.tab.${m}`)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignup && (
            <div>
              <label className="label-root mb-2.5" htmlFor="auth-name">
                {t('auth.name')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  <FiUser className="w-4 h-4 text-body dark:text-body-dark" />
                </span>
                <input
                  id="auth-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-root pl-11"
                  placeholder={t('auth.namePlaceholder')}
                />
              </div>
            </div>
          )}

          <div>
            <label className="label-root mb-2.5" htmlFor="auth-email">
              {t('auth.email')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <FiMail className="w-4 h-4 text-body dark:text-body-dark" />
              </span>
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-root pl-11"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="label-root mb-2.5" htmlFor="auth-password">
              {t('auth.password')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <FiLock className="w-4 h-4 text-body dark:text-body-dark" />
              </span>
              <input
                id="auth-password"
                name="password"
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-root pl-11"
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>
            {isSignup && (
              <p className="mt-2 text-xs text-body dark:text-body-dark">
                {t('auth.passwordHint', { n: MIN_PASSWORD })}
              </p>
            )}
          </div>

          {error && (
            <p className="flex items-start gap-2 text-sm font-semibold text-red-500">
              <FiAlertCircle className="mt-0.5 w-4 h-4 flex-shrink-0" />
              {t(error, { n: MIN_PASSWORD })}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-primary-root w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignup ? <FiUserPlus className="w-4 h-4" /> : <FiLogIn className="w-4 h-4" />}
            {busy
              ? t('auth.working')
              : isSignup
                ? t('auth.signupSubmit')
                : t('auth.loginSubmit')}
          </button>
        </form>

        <p className="mt-4 text-xs leading-relaxed text-body dark:text-body-dark">
          {t('auth.hint')}
        </p>

        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-outline-root w-full mt-3">
            {t('videos.allModules')}
          </button>
        )}
      </div>
    </div>
  );
}