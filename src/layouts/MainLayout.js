import React from 'react';
import Navbar from '../components/header/Navbar';
import Footer from '../components/footer/Footer';
import ProfileAside from '../components/aside/ProfileAside';
import BackToTop from '../components/ui/BackToTop';
import { useProfile } from '../context/ProfileContext';

export default function MainLayout({ children, hideFooter }) {
  const { profile } = useProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold"
      >
        Aller au contenu principal
      </a>
      <Navbar profile={profile} />
      <main id="main" tabIndex={-1} className="flex-1">
        <div className="page-container">
          <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5 lg:items-stretch">
            <div className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto  pr-0.5">
                <ProfileAside profile={profile} />
              </div>
            </div>
            <div className="min-w-0 pb-10">
              <div className="lg:hidden mb-6">
                <ProfileAside profile={profile} compact />
              </div>
              
              {children}
            </div>
          </div>
        </div>
      </main>
      {!hideFooter && <Footer profile={profile} />}
      <BackToTop />
    </div>
  );
}