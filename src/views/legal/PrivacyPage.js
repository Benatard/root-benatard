import React from 'react';
import PageMeta from '../../components/PageMeta';
import { useLang } from '../../i18n/LanguageContext';

function Section({ title, children }) {
  return (
    <div className="card-root p-7 md:p-8">
      <h2 className="text-lg font-bold text-black dark:text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-body dark:text-body-dark">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  const { t } = useLang();
  return (
    <div>
      <PageMeta
        title={t('privacy.metaTitle')}
        description={t('privacy.metaDesc')}
      />

      <div className="space-y-8">
        <div className="pb-4">
          <span className="eyebrow-root">{t('privacy.eyebrow')}</span>
          <h1 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white">
            {t('privacy.title')}
          </h1>
          <p className="mt-4 text-sm text-body dark:text-body-dark">
            {t('privacy.updated')}
          </p>
        </div>

        <Section title={t('privacy.s1')}>
          <p>
            {t('privacy.s1p1')}
          </p>
        </Section>

        <Section title={t('privacy.s2')}>
          <p>{t('privacy.s2p1')}</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>{t('privacy.s2li1Strong')}</strong>{t('privacy.s2li1Tail')}</li>
            <li><strong>{t('privacy.s2li2Strong')}</strong>{t('privacy.s2li2Tail')}</li>
          </ul>
          <p>
            {t('privacy.s2p2')}
          </p>
        </Section>

        <Section title={t('privacy.s3')}>
          <p>{t('privacy.s3p1')}</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('privacy.s3li1')}</li>
            <li>{t('privacy.s3li2')}</li>
          </ul>
          <p>{t('privacy.s3p2')}</p>
        </Section>

        <Section title={t('privacy.s4')}>
          <p>
            {t('privacy.s4p1')}
          </p>
        </Section>

        <Section title={t('privacy.s5')}>
          <p>
            {t('privacy.s5p1')}
          </p>
        </Section>

        <Section title={t('privacy.s6')}>
          <p>
            {t('privacy.s6p1')}
          </p>
        </Section>

        <Section title={t('privacy.s7')}>
          <p>
            {t('privacy.s7p1')}
          </p>
        </Section>
      </div>
    </div>
  );
}
