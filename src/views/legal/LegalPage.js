import React from 'react';
import PageMeta from '../../components/PageMeta';

function Section({ title, children }) {
  return (
    <div className="card-root p-7 md:p-8">
      <h2 className="text-lg font-bold text-black dark:text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-body dark:text-body-dark">{children}</div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <div>
      <PageMeta
        title="Mentions légales"
        description="Informations d'identification de l'éditeur du site et conditions d'utilisation."
      />

      <div className="space-y-8">
        <div className="pb-4">
          <span className="eyebrow-root">Légal</span>
          <h1 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white">
            Mentions légales
          </h1>
          <p className="mt-4 text-sm text-body dark:text-body-dark">
            Dernière mise à jour : septembre 2026
          </p>
        </div>

        <Section title="1. Éditeur du site">
          <p><strong>Propriétaire et éditeur</strong> : Bénatard — développeur Full-Stack.</p>
          <p>Contact : via le formulaire de contact du site.</p>
        </Section>

        <Section title="2. Hébergement">
          <p>
            Le site est hébergé par les serveurs de la plateforme Forge (Forge Console), en charge de
            l'infrastructure technique et du stockage des données.
          </p>
        </Section>

        <Section title="3. Propriété intellectuelle">
          <p>
            L'ensemble des contenus présents sur ce site (textes, visuels, logos, code, tutoriels) est la
            propriété de son éditeur, sauf mention contraire. Toute reproduction, représentation ou diffusion,
            totale ou partielle, sans autorisation préalable écrite, est interdite.
          </p>
        </Section>

        <Section title="4. Limitation de responsabilité">
          <p>
            L'éditeur s'efforce d'assurer l'exactitude des informations publiées, mais ne peut garantir leur
            exhaustivité ou leur absence d'erreur. Ce site peut contenir des liens vers des sites tiers, dont
            l'éditeur n'est pas responsable du contenu.
          </p>
        </Section>

        <Section title="5. Droit applicable">
          <p>
            Les présentes mentions sont soumises au droit applicable en vigueur. En cas de litige, les parties
            s'efforceront de trouver une solution amiable avant toute action judiciaire.
          </p>
        </Section>
      </div>
    </div>
  );
}
