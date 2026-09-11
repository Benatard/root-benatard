import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiYoutube, FiTwitter, FiGlobe, FiLock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { publicRoutes } from '../../routes/routes';
import { contactAPI } from '../../service/api';
import { toast } from '../../service/swal';

const socialIcons = {
  github: FiGithub,
  linkedin: FiLinkedin,
  youtube: FiYoutube,
  twitter: FiTwitter,
};

export default function Footer({ profile }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast('warning', 'Veuillez saisir votre email');
      return;
    }
    setSubscribing(true);
    try {
      await contactAPI.subscribeNewsletter(email.trim());
      setSubscribed(true);
      toast('success', 'Inscription confirmée à la newsletter');
    } catch {
      toast('error', "Impossible de s'inscrire pour le moment — réessayez plus tard");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="relative bg-transparent">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="page-container pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/logo-mark.svg" alt={profile?.name} className="h-10 w-10" />
              <span className="text-xl font-extrabold tracking-tight text-black dark:text-white">
                {profile?.name}<span className="text-primary">.dev</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-body dark:text-body-dark max-w-xs">
              {profile?.tagline}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {(profile?.socials || []).map(({ key, label, url }) => {
                const Icon = socialIcons[key] || FiGlobe;
                return (
                  <a
                    key={key}
                    href={url}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="h-10 w-10 bg-gray2 dark:bg-[#2C303B] flex items-center justify-center text-dark dark:text-white hover:text-white hover:bg-primary hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">Liens rapides</h3>
            <ul className="mt-5 space-y-3 text-sm text-body dark:text-body-dark">
              {publicRoutes.map((route) => (
                <li key={route.path}>
                  <Link to={route.path} className="inline-flex items-center gap-2 hover:text-primary hover:translate-x-0.5 transition-all duration-300">
                    <span className="h-1 w-1 bg-primary/40" />
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">Mes compétences</h3>
            <ul className="mt-5 space-y-3 text-sm text-body dark:text-body-dark">
              <li>
                <Link to="/competences" className="inline-flex items-center gap-2 hover:text-primary hover:translate-x-0.5 transition-all duration-300">
                  <span className="h-1 w-1 bg-primary/40" /> Frontend (React, Tailwind)
                </Link>
              </li>
              <li>
                <Link to="/competences" className="inline-flex items-center gap-2 hover:text-primary hover:translate-x-0.5 transition-all duration-300">
                  <span className="h-1 w-1 bg-primary/40" /> Backend (Node.js, PHP)
                </Link>
              </li>
              <li>
                <Link to="/competences" className="inline-flex items-center gap-2 hover:text-primary hover:translate-x-0.5 transition-all duration-300">
                  <span className="h-1 w-1 bg-primary/40" /> Bases de données
                </Link>
              </li>
              <li>
                <Link to="/videos" className="inline-flex items-center gap-2 hover:text-primary hover:translate-x-0.5 transition-all duration-300">
                  <span className="h-1 w-1 bg-primary/40" /> Tutos vidéo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">Newsletter</h3>
            <p className="mt-3 text-sm leading-relaxed text-body dark:text-body-dark">
              Recevez mes derniers tutos et projets, une fois par mois.
            </p>
            {subscribed ? (
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <FiCheckCircle className="w-4 h-4" /> Inscription confirmée !
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="input-root flex-1 min-w-0"
                  aria-label="Email pour la newsletter"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  aria-label="S'inscrire à la newsletter"
                  className="h-11 w-11 flex-shrink-0 bg-primary text-white flex items-center justify-center hover:bg-primary-dark hover:shadow-btn transition-all duration-300 disabled:opacity-60"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </form>
            )}
            <h3 className="mt-8 text-lg font-bold text-black dark:text-white">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-body dark:text-body-dark">
              <li className="flex items-start gap-3">
                <span className="h-9 w-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-4 h-4 text-primary" />
                </span>
                <span className="mt-1.5">{profile?.location}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-9 w-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-4 h-4 text-primary" />
                </span>
                <span className="mt-0.5">{profile?.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-9 w-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-4 h-4 text-primary" />
                </span>
                <span className="mt-0.5">{profile?.email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-7 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-stroke/70 dark:border-[#2C303B]">
          <p className="text-sm text-body dark:text-body-dark">
            &copy; {new Date().getFullYear()} {profile?.name}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-body dark:text-body-dark">
            <Link to="/confidentialite" className="hover:text-primary transition-colors">Politique de confidentialité</Link>
            <Link to="/mentions-legales" className="hover:text-primary transition-colors">Mentions légales</Link>
            <Link to="/admin" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
              <FiLock className="w-3 h-3" /> Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}