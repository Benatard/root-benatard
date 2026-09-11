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

export default function PrivacyPage() {
  return (
    <div>
      <PageMeta
        title="Politique de confidentialité"
        description="Comment vos données personnelles sont collectées et traitées sur ce portfolio."
      />

      <div className="space-y-8">
        <div className="pb-4">
          <span className="eyebrow-root">Confidentialité</span>
          <h1 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white">
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-sm text-body dark:text-body-dark">
            Dernière mise à jour : septembre 2026
          </p>
        </div>

        <Section title="1. Responsable du traitement">
          <p>
            Le présent site est édité par Bénatard, en qualité de développeur indépendant. Toute question
            relative au traitement de vos données peut être adressée via le formulaire de contact du site.
          </p>
        </Section>

        <Section title="2. Données collectées">
          <p>Seules les données que vous nous transmettez volontairement sont collectées :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Formulaire de contact</strong> : nom, adresse e-mail et contenu du message.</li>
            <li><strong>Newsletter</strong> : adresse e-mail, pour l'envoi d'actualités.</li>
          </ul>
          <p>
            Les données saisies sont stockées de manière sécurisée via la plateforme Forge, qui n'est utilisée
            que comme hébergeur de données. Aucune autre donnée personnelle n'est collectée à votre insu.
          </p>
        </Section>

        <Section title="3. Finalités du traitement">
          <p>Vos données sont utilisées uniquement pour :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>répondre à vos demandes via le formulaire de contact ;</li>
            <li>vous envoyer la newsletter à laquelle vous avez consenti.</li>
          </ul>
          <p>Ces données ne sont jamais vendues ni transmises à des tiers à des fins commerciales.</p>
        </Section>

        <Section title="4. Base légale">
          <p>
            Les traitements reposent sur votre consentement (article 6.1.a du RGPD) pour la newsletter et sur
            l'intérêt légitime à répondre à vos demandes pour le formulaire de contact.
          </p>
        </Section>

        <Section title="5. Durée de conservation">
          <p>
            Les messages de contact sont conservés le temps nécessaire à la gestion de votre demande.
            Les adresses de newsletter sont conservées jusqu'à votre désinscription.
          </p>
        </Section>

        <Section title="6. Cookies et stockage local">
          <p>
            Ce site n'utilise pas de cookies de mesure d'audience. Une préférence de thème (clair / sombre) est
            mémorisée localement sur votre navigateur (localStorage) ; elle n'est jamais transmise à des tiers.
          </p>
        </Section>

        <Section title="7. Vos droits">
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation,
            d'opposition et de portabilité de vos données. Pour exercer ces droits, contactez-nous via le
            formulaire de contact du site.
          </p>
        </Section>
      </div>
    </div>
  );
}
