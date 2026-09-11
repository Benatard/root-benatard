import React, { useState } from 'react';
import { FiLock, FiShield, FiMail } from 'react-icons/fi';
import config from '../../config/config';

export default function AdminLogin({ onLogin, loading = false, error = null }) {
  const [email, setEmail] = useState(config.ADMIN_EMAIL || '');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    onLogin(email.trim(), password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray2 dark:bg-[#161B24]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm card-root p-8 md:p-10">
        <div className="mx-auto h-14 w-14 bg-primary/10 flex items-center justify-center">
          <FiLock className="w-6 h-6 text-primary" />
        </div>
        <h1 className="mt-5 text-center text-2xl font-extrabold text-black dark:text-white">Espace Admin</h1>
        <p className="mt-2 text-center text-sm text-body dark:text-body-dark">
          Connectez-vous avec votre compte admin Forge pour accéder au dashboard.
        </p>

        <div className="mt-7 space-y-4">
          <div>
            <label className="label-root mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <FiMail className="w-4 h-4 text-body dark:text-body-dark" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-root pl-11"
                placeholder="admin@example.com"
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="label-root mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-root"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary-root w-full mt-6 disabled:opacity-60">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-body dark:text-body-dark text-center">
          <FiShield className="w-3.5 h-3.5" /> Authentification sécurisée via Forge (JWT)
        </p>
      </form>
    </div>
  );
}