import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { absoluteUrl, resolveUploadUrl } from '../config/config';

export default function PageMeta({ title, description, type = 'website' }) {
  const { profile } = useProfile();
  const location = useLocation();
  const siteName = profile?.name || 'Bénatard';
  const siteTitle = profile?.title || 'Développeur Full-Stack';
  const fullTitle = siteName ? (title ? `${title} — ${siteName}` : `${siteName} — ${siteTitle}`) : title || '';
  const desc = description || (profile ? `${siteTitle}. ${profile.tagline}` : '');
  const pageUrl = absoluteUrl(location.pathname);
  const ogImage = profile?.photo
    ? absoluteUrl(resolveUploadUrl(profile.photo))
    : absoluteUrl('/images/logo-mark.svg');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={pageUrl} />
      <meta name="description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}