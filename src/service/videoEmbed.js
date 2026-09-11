const YOUTUBE_PATTERNS = [
  /youtube\.com\/watch\?v=([\w-]{11})/,
  /youtu\.be\/([\w-]{11})/,
  /youtube\.com\/shorts\/([\w-]{11})/,
  /youtube\.com\/live\/([\w-]{11})/,
  /youtube\.com\/embed\/([\w-]{11})/,
];

const DRIVE_PATTERNS = [
  /drive\.google\.com\/file\/d\/([\w-]+)/,
  /drive\.google\.com\/open\?id=([\w-]+)/,
  /drive\.google\.com\/uc\?id=([\w-]+)/,
];

const VIMEO_PATTERN = /(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/;

const DAILYMOTION_PATTERNS = [
  /dailymotion\.com\/video\/([\w]+)/,
  /dai\.ly\/([\w]+)/,
];

export function toEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const value = url.trim();
  if (!value) return null;

  for (const pattern of YOUTUBE_PATTERNS) {
    const match = value.match(pattern);
    if (match) {
      return {
        embedUrl: `https://www.youtube.com/embed/${match[1]}`,
        provider: 'YouTube',
      };
    }
  }

  for (const pattern of DRIVE_PATTERNS) {
    const match = value.match(pattern);
    if (match) {
      return {
        embedUrl: `https://drive.google.com/file/d/${match[1]}/preview`,
        provider: 'Google Drive',
      };
    }
  }

  const vimeoMatch = value.match(VIMEO_PATTERN);
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      provider: 'Vimeo',
    };
  }

  for (const pattern of DAILYMOTION_PATTERNS) {
    const match = value.match(pattern);
    if (match) {
      return {
        embedUrl: `https://www.dailymotion.com/embed/video/${match[1]}`,
        provider: 'Dailymotion',
      };
    }
  }

  return null;
}

export function isSupportedVideoUrl(url) {
  return toEmbedUrl(url) !== null;
}