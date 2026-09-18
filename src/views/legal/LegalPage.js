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

export default function LegalPage() {
  const { t } = useLang();
  return (
    <div>
      <PageMeta
        title={t('legal.metaTitle')}
        description={t('legal.metaDesc')}
      />

      <div className="space-y-8">
        <div className="pb-4">
          <span className="eyebrow-root">{t('legal.eyebrow')}</span>
          <h1 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white">
            {t('legal.title')}
          </h1>
          <p className="mt-4 text-sm text-body dark:text-body-dark">
            {t('legal.updated')}
          </p>
        </div>

        <Section title={t('legal.s1')}>
          <p><strong>{t('legal.s1p1Strong')}</strong>{t('legal.s1p1Tail')}</p>
          <p>{t('legal.s1p2')}</p>
        </Section>

        <Section title={t('legal.s2')}>
          <p>
            {t('legal.s2p1')}
          </p>
        </Section>

        <Section title={t('legal.s3')}>
          <p>
            {t('legal.s3p1')}
          </p>
        </Section>

        <Section title={t('legal.s4')}>
          <p>
            {t('legal.s4p1')}
          </p>
        </Section>

        <Section title={t('legal.s5')}>
          <p>
            {t('legal.s5p1')}
          </p>
        </Section>
      </div>
    </div>
  );
}
