const config = {
  FORGE: {
    BASE_URL: process.env.REACT_APP_FORGE_BASE_URL || 'https://forgeconsole.app/api/public/v1',
    PROJECT_KEY: process.env.REACT_APP_FORGE_PROJECT_KEY || '',
    API_KEY: process.env.REACT_APP_FORGE_API_KEY || '',
    IDENTIFIER_COLUMN: process.env.REACT_APP_FORGE_IDENTIFIER_COLUMN || 'email',
  },
  ADMIN_EMAIL: process.env.REACT_APP_ADMIN_EMAIL || '',
  APP_NAME: process.env.REACT_APP_APP_NAME || 'FLASH EMPIRE',
};

export const FORGE_CONFIGURED = Boolean(config.FORGE.PROJECT_KEY && config.FORGE.API_KEY);

const UPLOAD_PREFIXES = ['/storage/', '/uploads/', '/media/', '/files/'];

export const resolveUploadUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (UPLOAD_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    const base = config.FORGE.BASE_URL.replace('/api/public/v1', '');
    return `${base}${path}`;
  }
  return path;
};

export default config;