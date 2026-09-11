import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiArrowRight } from 'react-icons/fi';
import { publicRoutes } from '../../routes/routes';

export default function Navbar({ profile }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-dark/95 backdrop-blur-md shadow-card border-b border-transparent'
          : 'bg-white/80 dark:bg-gray-dark/80 backdrop-blur-sm border-b border-stroke/70 dark:border-[#2C303B]'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-[65px]">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/images/logo-mark.svg"
              alt={`${profile?.name || 'Accueil'} — logo`}
              className="h-8 w-8"
            />
            <span className="text-xl font-extrabold tracking-tight text-black dark:text-white">
              {profile?.name}
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-5 xl:gap-7">
            {publicRoutes.map((route) => {
              const active = location.pathname === route.path;
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`group relative text-[15px] font-medium transition-colors ${
                    active ? 'text-primary' : 'text-dark dark:text-body-dark hover:text-primary'
                  }`}
                >
                  {route.label}
                  <span
                    className={`absolute left-0 -bottom-1.5 h-0.5 bg-primary transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden xl:flex items-center gap-4">
            <button
              onClick={() => setDark(!dark)}
              aria-label="Basculer le thème"
              className="h-10 w-10 flex items-center justify-center text-dark dark:text-white hover:text-primary hover:ring-4 hover:ring-primary/15 transition-all"
            >
              {dark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-dark font-semibold dark:text-white hover:bg-primary-dark hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              Me contacter <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              aria-label="Basculer le thème"
              className="h-10 w-10 bg-gray2 dark:bg-[#2C303B] flex items-center justify-center text-dark dark:text-white hover:text-primary transition-colors"
            >
              {dark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-dark dark:text-white"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-menu" className="lg:hidden py-4 space-y-3 border-t border-stroke/70 dark:border-[#2C303B]">
            {publicRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`block text-base font-medium ${location.pathname === route.path ? 'text-primary' : 'text-dark dark:text-body-dark'}`}
                onClick={() => setMobileOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link to="/contact" className="btn-primary-root w-full" onClick={() => setMobileOpen(false)}>
                Me contacter <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}