import {
  FiCode, FiServer, FiDatabase, FiTool, FiMonitor, FiGlobe, FiCpu, FiShield, FiLayers, FiTerminal, FiCloud,
  FiUsers, FiBookOpen, FiShare2, FiEdit3, FiActivity, FiWifi, FiBox, FiSliders,
} from 'react-icons/fi';
import {
  SiJavascript, SiTypescript, SiPython, SiPhp, SiHtml5, SiCss, SiGraphql, SiMarkdown,
  SiReact, SiVuedotjs, SiSvelte, SiAngular, SiNextdotjs, SiTailwindcss, SiBootstrap, SiBulma,
  SiExpress, SiNestjs, SiDjango, SiLaravel, SiSymfony, SiFastapi, SiFlask, SiDotnet,
  SiPostgresql, SiMysql, SiSqlite, SiMongodb, SiRedis, SiSupabase, SiPrisma, SiFirebase, SiSqlalchemy,
  SiOpenapiinitiative, SiSwagger, SiPostman, SiInsomnia,
  SiDocker, SiKubernetes, SiNginx, SiApache, SiLinux, SiUbuntu, SiDebian, SiAlpinelinux,
  SiGit, SiGithub, SiGitlab, SiGooglecloud, SiCloudflare, SiVercel, SiNetlify, SiNodedotjs, SiNpm, SiYarn,
  SiCisco, SiMikrotik, SiUbiquiti, SiFortinet,
  SiFigma, SiSketch, SiFramer, SiWebflow, SiBlender, SiPhotopea, SiGooglechrome,
  SiYoutube, SiMoodle, SiUdemy, SiGoogleclassroom, SiCoursera, SiFreecodecamp, SiDevdotto, SiStackoverflow, SiDiscord,
  SiArduino, SiRaspberrypi, SiEsphome, SiHomeassistant, SiPhpstorm, SiWebstorm,
} from 'react-icons/si';

/* ---------------- Icônes de catégories ---------------- */

export const skillIcons = {
  code: FiCode,
  server: FiServer,
  database: FiDatabase,
  tool: FiTool,
  monitor: FiMonitor,
  globe: FiGlobe,
  cpu: FiCpu,
  shield: FiShield,
  layers: FiLayers,
  terminal: FiTerminal,
  cloud: FiCloud,
};

export const iconKeyOf = (icon) => {
  if (typeof icon === 'string') return skillIcons[icon] ? icon : 'code';
  return Object.entries(skillIcons).find(([, Component]) => Component === icon)?.[0] || 'code';
};

export const skillIconOf = (icon) =>
  (typeof icon === 'string' ? skillIcons[icon] : icon) || FiCode;

/* ---------------- Logos de technologies ---------------- */

/* Clés = slugs : ils servent aussi de correspondance directe avec le nom
   de la compétence ("React" -> slug "react" -> techIcons.react). */
export const techIcons = {
  // Langages
  javascript: SiJavascript,
  typescript: SiTypescript,
  python: SiPython,
  php: SiPhp,
  html5: SiHtml5,
  css: SiCss,
  graphql: SiGraphql,
  markdown: SiMarkdown,
  // Frameworks / bibliothèques
  react: SiReact,
  vuedotjs: SiVuedotjs,
  svelte: SiSvelte,
  angular: SiAngular,
  nextdotjs: SiNextdotjs,
  tailwindcss: SiTailwindcss,
  bootstrap: SiBootstrap,
  bulma: SiBulma,
  express: SiExpress,
  nestjs: SiNestjs,
  django: SiDjango,
  laravel: SiLaravel,
  symfony: SiSymfony,
  fastapi: SiFastapi,
  flask: SiFlask,
  dotnet: SiDotnet,
  // Données
  postgresql: SiPostgresql,
  mysql: SiMysql,
  sqlite: SiSqlite,
  mongodb: SiMongodb,
  redis: SiRedis,
  supabase: SiSupabase,
  prisma: SiPrisma,
  firebase: SiFirebase,
  sqlalchemy: SiSqlalchemy,
  // API & outils
  openapiinitiative: SiOpenapiinitiative,
  swagger: SiSwagger,
  postman: SiPostman,
  insomnia: SiInsomnia,
  // Infrastructure
  docker: SiDocker,
  kubernetes: SiKubernetes,
  nginx: SiNginx,
  apache: SiApache,
  linux: SiLinux,
  ubuntu: SiUbuntu,
  debian: SiDebian,
  alpinelinux: SiAlpinelinux,
  git: SiGit,
  github: SiGithub,
  gitlab: SiGitlab,
  googlecloud: SiGooglecloud,
  cloudflare: SiCloudflare,
  vercel: SiVercel,
  netlify: SiNetlify,
  nodejs: SiNodedotjs,
  npm: SiNpm,
  yarn: SiYarn,
  // Réseaux
  cisco: SiCisco,
  mikrotik: SiMikrotik,
  ubiquiti: SiUbiquiti,
  fortinet: SiFortinet,
  // Design
  figma: SiFigma,
  sketch: SiSketch,
  framer: SiFramer,
  webflow: SiWebflow,
  blender: SiBlender,
  photopea: SiPhotopea,
  chrome: SiGooglechrome,
  // Pédagogie / contenu
  youtube: SiYoutube,
  moodle: SiMoodle,
  udemy: SiUdemy,
  googleclassroom: SiGoogleclassroom,
  coursera: SiCoursera,
  freecodecamp: SiFreecodecamp,
  devdotto: SiDevdotto,
  stackoverflow: SiStackoverflow,
  discord: SiDiscord,
  // Matériel & objets connectés
  arduino: SiArduino,
  raspberrypi: SiRaspberrypi,
  esphome: SiEsphome,
  homeassistant: SiHomeassistant,
  phpstorm: SiPhpstorm,
  webstorm: SiWebstorm,
  // Génériques (aucun logo de marque n'existe pour ces domaines)
  users: FiUsers,
  book: FiBookOpen,
  network: FiShare2,
  palette: FiEdit3,
  tools: FiTool,
  activity: FiActivity,
  wifi: FiWifi,
  box: FiBox,
  sliders: FiSliders,
  cpu: FiCpu,
};

/* Couleurs de marque officielles. Absente => icône en currentColor. */
export const techBrands = {
  javascript: '#F7DF1E',
  typescript: '#3178C6',
  python: '#3776AB',
  php: '#777BB4',
  html5: '#E34F26',
  css: '#1572B6',
  graphql: '#E10098',
  react: '#61DAFB',
  vuedotjs: '#4FC08D',
  svelte: '#FF3E00',
  angular: '#DD0031',
  tailwindcss: '#06B6D4',
  bootstrap: '#7952B3',
  bulma: '#00D1B2',
  nestjs: '#E0234E',
  django: '#092E20',
  laravel: '#FF2D20',
  fastapi: '#009688',
  dotnet: '#512BD4',
  postgresql: '#4169E1',
  mysql: '#4479A1',
  sqlite: '#003B57',
  mongodb: '#47A248',
  redis: '#DC382D',
  supabase: '#3ECF8E',
  prisma: '#2D3748',
  firebase: '#FFCA28',
  sqlalchemy: '#D71F00',
  openapiinitiative: '#6BA539',
  swagger: '#85EA2D',
  postman: '#FF6C37',
  insomnia: '#4000BF',
  docker: '#2496ED',
  kubernetes: '#326CE5',
  nginx: '#009639',
  apache: '#D22128',
  linux: '#FCC624',
  ubuntu: '#E95420',
  debian: '#A81D33',
  alpinelinux: '#0D597F',
  git: '#F05032',
  github: '#181717',
  gitlab: '#FC6D26',
  googlecloud: '#4285F4',
  cloudflare: '#F38020',
  netlify: '#00C7B7',
  nodejs: '#339933',
  npm: '#CB3837',
  yarn: '#2C8EBB',
  cisco: '#049FD9',
  ubiquiti: '#0559C9',
  fortinet: '#EE1C25',
  figma: '#F24E1E',
  sketch: '#FDB300',
  framer: '#0055FF',
  webflow: '#4353FF',
  blender: '#E87D0D',
  photopea: '#31A8FF',
  chrome: '#4285F4',
  youtube: '#FF0000',
  moodle: '#F48C20',
  udemy: '#A435F0',
  googleclassroom: '#0F9D58',
  coursera: '#0056D2',
  freecodecamp: '#0A0A23',
  stackoverflow: '#F58025',
  discord: '#5865F2',
  arduino: '#00979D',
  raspberrypi: '#C51A4A',
  esphome: '#18BCF2',
  homeassistant: '#41BDF5',
};

/* Groupes pour le sélecteur de logo de l'admin. */
export const techGroups = [
  { id: 'langages', keys: ['javascript', 'typescript', 'python', 'php', 'html5', 'css', 'graphql', 'markdown'] },
  {
    id: 'frameworks',
    keys: [
      'react', 'vuedotjs', 'svelte', 'angular', 'nextdotjs', 'tailwindcss', 'bootstrap', 'bulma',
      'express', 'nestjs', 'django', 'laravel', 'symfony', 'fastapi', 'flask', 'dotnet',
    ],
  },
  {
    id: 'data',
    keys: ['postgresql', 'mysql', 'sqlite', 'mongodb', 'redis', 'supabase', 'prisma', 'firebase', 'sqlalchemy'],
  },
  { id: 'api', keys: ['openapiinitiative', 'swagger', 'postman', 'insomnia'] },
  {
    id: 'infra',
    keys: [
      'docker', 'kubernetes', 'nginx', 'apache', 'linux', 'ubuntu', 'debian', 'alpinelinux',
      'git', 'github', 'gitlab', 'googlecloud', 'cloudflare', 'vercel', 'netlify', 'nodejs', 'npm', 'yarn',
    ],
  },
  { id: 'reseaux', keys: ['cisco', 'mikrotik', 'ubiquiti', 'fortinet'] },
  { id: 'design', keys: ['figma', 'sketch', 'framer', 'webflow', 'blender', 'photopea', 'chrome'] },
  { id: 'pedagogie', keys: ['youtube', 'moodle', 'udemy', 'googleclassroom', 'coursera', 'freecodecamp', 'devdotto', 'stackoverflow', 'discord'] },
  { id: 'materiel', keys: ['arduino', 'raspberrypi', 'esphome', 'homeassistant', 'phpstorm', 'webstorm'] },
  { id: 'generiques', keys: ['users', 'book', 'network', 'palette', 'tools', 'activity', 'wifi', 'box', 'sliders', 'cpu'] },
];

/* Correspondance nom de compétence -> logo, pour les compétences qui ne sont pas
   écrites exactement comme la clé ("Node.js / Express" -> "nodejs"). */
const TECH_ALIASES = {
  'html css': 'html5',
  'css3': 'css',
  'javascript es6': 'javascript',
  'js': 'javascript',
  'es6': 'javascript',
  'ts': 'typescript',
  'tailwind css': 'tailwindcss',
  'node js express': 'nodejs',
  'nodejs express': 'nodejs',
  'node express': 'nodejs',
  'rest apis': 'openapiinitiative',
  'api': 'openapiinitiative',
  'apis': 'openapiinitiative',
  'rest api': 'openapiinitiative',
  'sql': 'postgresql',
  'bases de donnees sql': 'postgresql',
  'bases de donnees': 'postgresql',
  'base de donnees': 'postgresql',
  'database': 'postgresql',
  'maquettage d interfaces': 'figma',
  'maquette': 'figma',
  'interface': 'figma',
  'ux': 'sketch',
  'ui': 'figma',
  'experience utilisateur': 'sketch',
  'design responsive': 'chrome',
  'responsive': 'chrome',
  'outils de design': 'framer',
  'design': 'framer',
  'cablage structure': 'cisco',
  'cablage': 'cisco',
  'architecture reseau': 'mikrotik',
  'reseau': 'mikrotik',
  'maintenance supervision': 'ubiquiti',
  'supervision': 'ubiquiti',
  'tcp ip lan': 'network',
  'tcp ip': 'network',
  'lan': 'network',
  'formation d agents personnel': 'users',
  'formation': 'users',
  'equipe': 'users',
  'tutoriels accompagnement': 'youtube',
  'tutoriels': 'youtube',
  'videos': 'youtube',
  'accompagnement d etudiants': 'book',
  'etudiants': 'book',
  'formation et pedagogie': 'book',
  'ci cd': 'github',
};

export const techSlug = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const techKeyOf = (skill) => {
  const slug = techSlug(skill?.name);
  return TECH_ALIASES[slug] || slug;
};

export const techIconOf = (key) => techIcons[key] || FiCode;

export const resolveTechIcon = (skill) => techIcons[skill?.icon] || techIcons[techKeyOf(skill)] || FiCode;

export const resolveTechBrand = (skill) => techBrands[skill?.icon] || techBrands[techKeyOf(skill)] || null;

/* ---------------- Couleurs de catégories ---------------- */

const GRADIENT_MAP = {
  'from-primary to-blue-600': '#4A6CF7',
  'from-emerald-500 to-teal-600': '#10B981',
  'from-amber-500 to-orange-600': '#F59E0B',
  'from-violet-500 to-purple-600': '#8B5CF6',
  'from-rose-500 to-pink-600': '#F43F5E',
  'from-cyan-500 to-sky-600': '#06B6D4',
};

const HEX_TO_GRADIENT = Object.fromEntries(Object.entries(GRADIENT_MAP).map(([g, h]) => [h.toLowerCase(), g]));

export const hexToGradient = (color) => {
  if (!color) return 'from-primary to-blue-600';
  if (String(color).startsWith('from-')) return color;
  return HEX_TO_GRADIENT[String(color).toLowerCase()] || 'from-primary to-blue-600';
};

export const gradientToHex = (color) => {
  if (!color) return '#4A6CF7';
  if (/^#/.test(color)) return color;
  return GRADIENT_MAP[color] || '#4A6CF7';
};

/* ---------------- Normalisation ---------------- */

export const normalizeCategory = (category) => ({
  ...category,
  icon: skillIconOf(category.icon),
  color: hexToGradient(category.color),
  skills: (Array.isArray(category.skills) ? category.skills : []).map((skill) => ({
    name: skill?.name,
    Icon: resolveTechIcon(skill),
    brand: resolveTechBrand(skill),
  })),
});

const toDbSkill = ({ Icon, brand, ...skill }) => skill;

export const toDbCategory = (category) => ({
  ...category,
  icon: iconKeyOf(category.icon),
  color: gradientToHex(category.color),
  skills: (Array.isArray(category.skills) ? category.skills : []).map(toDbSkill),
});

export const normalizeSkills = (skills) =>
  skills && Array.isArray(skills.categories)
    ? { ...skills, categories: skills.categories.map(normalizeCategory) }
    : skills;

export const skillColors = Object.keys(GRADIENT_MAP);
