import { Helmet } from 'react-helmet-async';
import { useProfile } from '../context/ProfileContext';

export default function PageMeta({ title, description }) {
  const { profile } = useProfile();
  const siteName = profile?.name || '';
  const siteTitle = profile?.title || '';
  const fullTitle = siteName ? (title ? `${title} — ${siteName}` : `${siteName} — ${siteTitle}`) : title || '';
  const desc = description || (profile ? `${siteTitle}. ${profile.tagline}` : '');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}