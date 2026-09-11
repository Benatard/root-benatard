import {
  FiCode, FiServer, FiDatabase, FiTool, FiMonitor, FiGlobe, FiCpu, FiShield, FiLayers, FiTerminal, FiCloud,
} from 'react-icons/fi';

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

export const normalizeCategory = (category) => ({
  ...category,
  icon: skillIconOf(category.icon),
  color: hexToGradient(category.color),
});

export const toDbCategory = (category) => ({
  ...category,
  icon: iconKeyOf(category.icon),
  color: gradientToHex(category.color),
});

export const normalizeSkills = (skills) =>
  skills && Array.isArray(skills.categories)
    ? { ...skills, categories: skills.categories.map(normalizeCategory) }
    : skills;

export const skillColors = Object.keys(GRADIENT_MAP);