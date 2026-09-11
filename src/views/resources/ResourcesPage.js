import React, { useState } from 'react';
import { FiPlusCircle, FiSmartphone, FiGlobe } from 'react-icons/fi';
import PageMeta from '../../components/PageMeta';
import Reveal from '../../components/ui/Reveal';
import SectionTitle from '../../components/ui/SectionTitle';
import ResourceCard from '../../components/ui/ResourceCard';
import Loading from '../../components/ui/Loading';
import ErrorBanner from '../../components/ui/ErrorBanner';
import useResources from '../../hooks/useResources';
import useAuth from '../../hooks/useAuth';
import { FORGE_CONFIGURED } from '../../service/api';
import { toast } from '../../service/swal';

const FALLBACK_IMG = '/images/resource-placeholder.svg';

const emptyForm = { type: 'app', title: '', description: '', image: '', url: '' };

export default function ResourcesPage() {
  const { resources, loading, error, addResource, removeResource } = useResources();
  const { authed } = useAuth();
  const isAdmin = FORGE_CONFIGURED && authed;
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      toast('warning', 'Veuillez renseigner le titre et le lien de la ressource');
      return;
    }
    setSaving(true);
    const { ok } = await addResource({
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim() || FALLBACK_IMG,
      url: form.url.trim(),
      store: form.type === 'app' ? 'Google Play / App Store' : 'Plateforme web',
    });
    setSaving(false);
    if (ok) {
      toast('success', 'Ressource ajoutée avec succès');
      setForm(emptyForm);
    } else {
      toast('error', "Impossible d'ajouter la ressource");
    }
  };

  const apps = resources.filter((r) => r.type === 'app');
  const sites = resources.filter((r) => r.type !== 'app');

  return (
    <div>
      <PageMeta title="Ressources" description="Mes applications mobiles et les sites importants que j'utilise au quotidien." />

      <section className="relative pl-5 overflow-hidden bg-white dark:bg-gray-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,108,247,0.12)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative py-16 md:py-19 border-b border-stroke/70 dark:border-[#2C303B]">
          <Reveal className="max-w-3xl">
            <span className="eyebrow-root">
              <span className="h-1.5 w-1.5 bg-primary inline-block" />
              Mes ressources
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black dark:text-white">
              Applications mobiles &{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">sites de référence</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-body dark:text-body-dark leading-relaxed">
              Les applications que j'ai développées et les plateformes qui m'inspirent et m'aident
              au quotidien dans mon métier de développeur.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-3">
          {isAdmin && (
          <>
          <SectionTitle
            eyebrow="Ajouter une ressource"
            title="Enregistrer une app ou un site"
            sub="Ajoutez une ressource avec une image, une description et le lien vers la plateforme."
          />
          <Reveal>
            <form onSubmit={handleSubmit} className="card-root p-8 md:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: 'app' })}
                  className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    form.type === 'app'
                      ? 'bg-primary text-white shadow-btn'
                      : 'bg-gray2 dark:bg-[#2C303B] text-body dark:text-body-dark hover:text-primary'
                  }`}
                >
                  <FiSmartphone className="w-4 h-4" /> Application mobile
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: 'site' })}
                  className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    form.type === 'site'
                      ? 'bg-primary text-white shadow-btn'
                      : 'bg-gray2 dark:bg-[#2C303B] text-body dark:text-body-dark hover:text-primary'
                  }`}
                >
                  <FiGlobe className="w-4 h-4" /> Site / Plateforme
                </button>
              </div>

              <div>
                <label className="label-root mb-2.5">Titre</label>
                <input name="title" value={form.title} onChange={handleChange} className="input-root" placeholder="Ex : Ma super application" />
              </div>
              <div>
                <label className="label-root mb-2.5">Lien vers la plateforme</label>
                <input name="url" type="url" value={form.url} onChange={handleChange} className="input-root" placeholder="https://..." />
              </div>
              <div>
                <label className="label-root mb-2.5">Image (URL)</label>
                <input name="image" type="url" value={form.image} onChange={handleChange} className="input-root" placeholder="https://.../image.png" />
                {form.image && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-body dark:text-body-dark mb-2.5">Aperçu</p>
                    <div className="relative h-36 w-full overflow-hidden bg-gray2 dark:bg-[#2C303B]">
                      <img
                        src={form.image}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="label-root mb-2.5">Description (optionnel)</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="input-root" placeholder="Ce que cette ressource m'apporte..."></textarea>
              </div>
              <button type="submit" disabled={saving} className="btn-primary-root w-full disabled:opacity-60">
                <FiPlusCircle className="w-4 h-4" /> {saving ? 'Ajout en cours...' : 'Enregistrer la ressource'}
              </button>
            </form>
          </Reveal>

          {error && (
            <div className="mt-8">
              <ErrorBanner message="API inaccessible : ajouter ou supprimer une ressource est impossible pour le moment." />
            </div>
          )}
          </>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow="Mes créations mobiles"
            title="Applications mobiles"
            sub="Les applications que j'ai conçues et développées."
          />
          {loading ? (
            <Loading variant="cards" />
          ) : error ? (
            <ErrorBanner message="Impossible de charger les ressources." />
          ) : apps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((resource, index) => (
                <Reveal key={resource.id || resource.title} delay={(index % 3) * 100}>
                  <ResourceCard resource={resource} removable={isAdmin} onRemove={removeResource} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="card-root p-12 text-center">
              <FiSmartphone className="mx-auto w-10 h-10 text-primary/40" />
              <p className="mt-4 text-body dark:text-body-dark">Aucune application pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-19">
          <SectionTitle
            eyebrow="Mes références"
            title="Sites importants"
            sub="Les plateformes qui m'inspirent et me permettent de progresser chaque jour."
          />
          {loading ? (
            <Loading variant="cards" />
          ) : error ? (
            <ErrorBanner message="Impossible de charger les ressources." />
          ) : sites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((resource, index) => (
                <Reveal key={resource.id || resource.title} delay={(index % 3) * 100}>
                  <ResourceCard resource={resource} removable={isAdmin} onRemove={removeResource} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="card-root p-12 text-center">
              <FiGlobe className="mx-auto w-10 h-10 text-primary/40" />
              <p className="mt-4 text-body dark:text-body-dark">Aucun site enregistré pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}