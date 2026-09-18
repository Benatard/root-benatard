import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiSend, FiCheckCircle, FiGithub, FiLinkedin, FiYoutube, FiTwitter } from 'react-icons/fi';
import PageMeta from '../../components/PageMeta';
import { useProfile } from '../../context/ProfileContext';
import Reveal from '../../components/ui/Reveal';
import Loading from '../../components/ui/Loading';
import useMessages from '../../hooks/useMessages';
import { toast } from '../../service/swal';
import { useLang } from '../../i18n/LanguageContext';

const socialIcons = {
  github: FiGithub,
  linkedin: FiLinkedin,
  youtube: FiYoutube,
  twitter: FiTwitter,
};

export default function ContactPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { addMessage } = useMessages();
  const { t } = useLang();
  const [form, setForm] = useState({ nom: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.message) {
      toast('warning', t('contact.fillFields'));
      return;
    }
    setLoading(true);
    const { ok } = await addMessage(form);
    if (ok) {
      toast('success', t('contact.messageSent'));
    } else {
      toast('error', t('contact.messageError'));
    }
    setLoading(false);
    setForm({ nom: '', email: '', message: '' });
  };

  const infoCards = profile
    ? [
        { icon: FiMail, label: t('aside.contactEmail'), value: profile.email, href: `mailto:${profile.email}` },
        { icon: FiPhone, label: t('aside.contactPhone'), value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
        { icon: FiMapPin, label: t('aside.contactLocation'), value: profile.location },
        { icon: FiGlobe, label: t('aside.contactWebsite'), value: profile.website, href: `https://${profile.website}` },
      ]
    : [];

  return (
    <div>
      <PageMeta title={t('contact.metaTitle')} description={profile ? t('contact.metaDesc', { name: profile.name }) : undefined} />

      <section className="relative pl-5 overflow-hidden bg-white dark:bg-gray-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,108,247,0.12)_1px,transparent_0)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[480px] h-[480px] bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative py-16 md:py-19 border-b border-stroke/70 dark:border-[#2C303B]">
          <Reveal className="max-w-3xl">
            <span className="eyebrow-root">
              <span className="h-1.5 w-1.5 bg-primary inline-block" />
              {t('contact.eyebrow')}
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black dark:text-white">
              {t('contact.title1')}{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{t('contact.titleHighlight')}</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-body dark:text-body-dark leading-relaxed">
              {t('contact.intro')}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <FiCheckCircle className="w-4 h-4" /> {profile?.availability}
            </span>
          </Reveal>
        </div>
      </section>

      <section className="bg-transparent">
        <div className="py-16 md:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Reveal>
              <div className="card-root p-8 md:p-10">
                <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">{t('contact.sendMessage')}</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label className="label-root mb-2.5" htmlFor="contact-nom">{t('contact.yourName')}</label>
                    <input id="contact-nom" name="nom" value={form.nom} onChange={handleChange} className="input-root" placeholder={t('contact.namePlaceholder')} />
                  </div>
                  <div>
                    <label className="label-root mb-2.5" htmlFor="contact-email">{t('contact.yourEmail')}</label>
                    <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} className="input-root" placeholder={t('contact.emailPlaceholder')} />
                  </div>
                  <div>
                    <label className="label-root mb-2.5" htmlFor="contact-message">{t('contact.yourMessage')}</label>
                    <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} rows="5" className="input-root" placeholder={t('contact.messagePlaceholder')}></textarea>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary-root w-full disabled:opacity-60">
                    <FiSend className="w-4 h-4" /> {loading ? t('contact.sending') : t('contact.sendMessageButton')}
                  </button>
                </form>
              </div>
            </Reveal>

            {profileLoading ? (
              <Loading variant="profile" className="py-2" />
            ) : (
              <Reveal delay={150}>
                <div className="space-y-6">
                  {infoCards.map(({ icon: Icon, label, value, href }) => {
                    const card = (
                      <div className="group card-root p-6 flex items-start gap-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
                        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-blue-600">
                          <Icon className="w-6 h-6 text-primary transition-colors duration-300 group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-body dark:text-body-dark">{label}</p>
                          <p className="mt-1 text-base font-semibold text-dark dark:text-white break-words">{value}</p>
                        </div>
                      </div>
                    );
                    return href ? (
                      <a key={label} href={href} target="_blank" rel="noreferrer" className="block">
                        {card}
                      </a>
                    ) : (
                      <div key={label}>{card}</div>
                    );
                  })}

                  <div className="card-root p-7">
                    <p className="text-xs font-semibold uppercase tracking-widest text-body dark:text-body-dark">
                      {t('contact.findMe')}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      {(profile?.socials || []).map(({ key, label, url }) => {
                        const Icon = socialIcons[key] || FiGlobe;
                        return (
                          <a
                            key={key}
                            href={url}
                            aria-label={label}
                            target="_blank"
                            rel="noreferrer"
                            className="h-11 w-11 bg-gray2 dark:bg-[#2C303B] flex items-center justify-center text-dark dark:text-white hover:text-white hover:bg-primary hover:-translate-y-0.5 transition-all duration-300"
                          >
                            <Icon className="w-4 h-4" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-dark">
        <div className="py-16 md:py-19">
          <Reveal>
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 px-8 py-12 md:px-16 text-center">
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-black/10 blur-3xl pointer-events-none" />
              <h2 className="relative text-2xl md:text-3xl font-bold text-white leading-tight">
                {t('contact.ctaTitle')}
              </h2>
              <p className="relative mt-4 text-white/80 max-w-xl mx-auto">
                {t('contact.ctaDesc')}
              </p>
              <div className="relative mt-8 flex justify-center">
                <a href={`mailto:${profile?.email || ''}`} className="btn-white-root">
                  <FiMail className="w-4 h-4" /> {profile?.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}