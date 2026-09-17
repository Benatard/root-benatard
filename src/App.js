import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './views/HomePage';
import AboutPage from './views/about/AboutPage';
import SkillsPage from './views/skills/SkillsPage';
import ProjectsPage from './views/projects/ProjectsPage';
import ResourcesPage from './views/resources/ResourcesPage';
import VideosPage from './views/videos/VideosPage';
import GalleryPage from './views/gallery/GalleryPage';
import ContactPage from './views/contact/ContactPage';
import PrivacyPage from './views/legal/PrivacyPage';
import LegalPage from './views/legal/LegalPage';
import AdminPage from './views/admin/AdminPage';

export default function App() {
  return (
    <ProfileProvider>
      <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/a-propos" element={<MainLayout><AboutPage /></MainLayout>} />
      <Route path="/competences" element={<MainLayout><SkillsPage /></MainLayout>} />
      <Route path="/projets" element={<MainLayout><ProjectsPage /></MainLayout>} />
      <Route path="/ressources" element={<MainLayout><ResourcesPage /></MainLayout>} />
      <Route path="/videos" element={<MainLayout fullWidth><VideosPage /></MainLayout>} />
      <Route path="/galerie" element={<MainLayout><GalleryPage /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
      <Route path="/confidentialite" element={<MainLayout><PrivacyPage /></MainLayout>} />
      <Route path="/mentions-legales" element={<MainLayout><LegalPage /></MainLayout>} />
      <Route path="*" element={
        <MainLayout>
          <div className="py-20 text-center">
            <h1 className="text-4xl font-extrabold text-black dark:text-white mb-4">404</h1>
            <p className="text-body dark:text-body-dark">Page non trouvée</p>
          </div>
        </MainLayout>
      } />
      </Routes>
    </ProfileProvider>
  );
}