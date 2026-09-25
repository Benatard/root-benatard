import axios from 'axios';
import config from '../config/config';

/*
 * CLIENT FORGE — https://forgeconsole.app
 * Base : https://forgeconsole.app/api/public/v1/<project-key>/<table>
 * Auth  : header "x-api-key" (clé du projet) + "Authorization: Bearer <jwt>"
 *         quand l'admin est connecté (end-user auth via /auth/login).
 *
 * Les fonctions exposées gardent exactement les mêmes signatures qu'avant,
 * pour que les hooks (useResource / useVideos / useResources / useMessages)
 * n'aient rien à changer. Si PROJECT_KEY/API_KEY sont vides dans .env, toutes
 * les requêtes rejettent → le fallback seeds + localStorage s'active.
 *
 * Mapping de schéma :
 *   profile, skills, experience  → 1 ligne avec colonnes JSON (socials, stats,
 *                                   categories, experiences, education, values)
 *   projects, videos, resources,
 *   messages, newsletter          → tables de lignes
 */

export const FORGE_CONFIGURED = Boolean(config.FORGE.PROJECT_KEY && config.FORGE.API_KEY);
export const FORGE_TOKEN_KEY = 'forge_token';

const BASE = `${config.FORGE.BASE_URL}/${config.FORGE.PROJECT_KEY}`;

const http = axios.create({ baseURL: BASE });

http.interceptors.request.use((cfg) => {
  cfg.headers['x-api-key'] = config.FORGE.API_KEY;
  const token = sessionStorage.getItem(FORGE_TOKEN_KEY) || localStorage.getItem(FORGE_TOKEN_KEY);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const req = (fn) => {
  if (!FORGE_CONFIGURED) return Promise.reject(new Error('Forge non configuré'));
  return fn().then((res) => res.data);
};

const forgeTable = (table) => ({
  list: (params) =>
    req(() => http.get(`/${table}`, { params })).then((r) => (r.data || []).map(unwrapRow)),
  get: (id) => req(() => http.get(`/${table}/${id}`)).then((r) => unwrapRow(r.data)),
  create: (payload) => req(() => http.post(`/${table}`, payload)).then((r) => unwrapRow(r.data)),
  update: (id, payload) => req(() => http.patch(`/${table}/${id}`, payload)).then((r) => unwrapRow(r.data)),
  remove: (id) => req(() => http.delete(`/${table}/${id}`)).then((r) => r.data),
});

const singleRow = (table, idStorageKey) => {
  const getId = () => localStorage.getItem(idStorageKey);
  const setId = (id) => localStorage.setItem(idStorageKey, id);
  return {
    get: async () => {
      const rows = await forgeTable(table).list({ limit: 1 });
      const row = rows[0];
      if (row) setId(row.id);
      return row || null;
    },
    save: async (payload) => {
      const id = getId();
      if (id) return forgeTable(table).update(id, payload);
      const created = await forgeTable(table).create(payload);
      setId(created.id);
      return created;
    },
  };
};

const cleanId = (item) => {
  const copy = { ...item };
  delete copy.id;
  delete copy.created_at;
  delete copy.updated_at;
  return copy;
};

const unwrapRow = (row) => row && { ...(row.data || {}), id: row.id, created_at: row.created_at, updated_at: row.updated_at };

const parseJSONField = (value) => {
  if (value == null || typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/* ---------------- Auth (admin) ---------------- */

export const authAPI = {
  login: ({ email, password }) =>
    req(() => http.post('/auth/login', { [config.FORGE.IDENTIFIER_COLUMN]: email, password })).then((data) => ({
      token: data.token || data.jwt || data.access_token,
      user: data.user || data,
    })),
  me: () => req(() => http.get('/auth/me')).then((data) => data),
};

/* ---------------- Blocs une-ligne (JSON) ---------------- */

const profileTable = singleRow('profile', 'portfolio_profile_id');

const toProfileRow = (row) =>
  row && {
    ...row,
    resumeUrl: row.resume_url ?? row.resumeUrl,
    socials: parseJSONField(row.socials),
    stats: parseJSONField(row.stats),
  };

const fromProfileRow = (payload) => ({
  ...cleanId(payload),
  resume_url: payload.resumeUrl,
});

export const profileAPI = {
  get: async () => {
    const row = await profileTable.get();
    return toProfileRow(row);
  },
  update: async (payload) => {
    const row = await profileTable.save(fromProfileRow(payload));
    return toProfileRow(row);
  },
};

const skillsTable = singleRow('skills', 'portfolio_skills_id');

const toSkillsRow = (row) => row && { ...row, categories: parseJSONField(row.categories) };

export const skillsAPI = {
  get: async () => toSkillsRow(await skillsTable.get()),
  update: async (payload) => {
    const row = await skillsTable.save(cleanId(payload));
    return toSkillsRow(row);
  },
};

const lmsTable = singleRow('lms', 'portfolio_lms_id');

const toLMSRow = (row) => row && { ...row, modules: parseJSONField(row.modules) };

export const lmsAPI = {
  get: async () => toLMSRow(await lmsTable.get()),
  save: async (payload) => {
    const row = await lmsTable.save(cleanId(payload));
    return toLMSRow(row);
  },
};

const experienceTable = singleRow('experience', 'portfolio_experience_id');

const toExperienceRow = (row) =>
  row && {
    ...row,
    experiences: parseJSONField(row.experiences),
    education: parseJSONField(row.education),
    values: parseJSONField(row.values),
  };

export const experienceAPI = {
  get: async () => toExperienceRow(await experienceTable.get()),
  update: async (payload) => {
    const row = await experienceTable.save(cleanId(payload));
    return toExperienceRow(row);
  },
};

/* ---------------- Tables de lignes ---------------- */

const projects = forgeTable('projects');

const toSortOrder = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const projectYear = (project) => {
  const year = Number.parseInt(project?.year, 10);
  return Number.isFinite(year) ? year : 0;
};

const compareProjects = (a, b) => {
  const aOrder = toSortOrder(a?.sortOrder);
  const bOrder = toSortOrder(b?.sortOrder);
  if (aOrder !== null && bOrder !== null && aOrder !== bOrder) return aOrder - bOrder;
  if (aOrder !== null && bOrder === null) return -1;
  if (aOrder === null && bOrder !== null) return 1;

  const yearDiff = projectYear(b) - projectYear(a);
  if (yearDiff !== 0) return yearDiff;

  const createdDiff = String(b?.created_at || '').localeCompare(String(a?.created_at || ''));
  if (createdDiff !== 0) return createdDiff;
  return String(a?.id || '').localeCompare(String(b?.id || ''));
};

const toProject = (row) => {
  if (!row) return row;
  const { sort_order: sortOrderField, sortOrder: sortOrderValue, ...rest } = row;
  return {
    ...rest,
    sortOrder: toSortOrder(sortOrderField ?? sortOrderValue),
    desc: row.description ?? row.desc,
    stack: parseJSONField(row.stack),
    image: row.image || '/images/app-placeholder.svg',
  };
};

const fromProject = (payload) => {
  const { desc, description, sortOrder, ...rest } = payload;
  const numericSortOrder = toSortOrder(sortOrder);
  return {
    ...cleanId(rest),
    description: desc ?? description,
    ...(numericSortOrder === null ? {} : { sort_order: numericSortOrder }),
  };
};

const getProjects = async () => {
  try {
    const rows = await projects.list({ order: 'sort_order.asc' });
    return rows.map(toProject).sort(compareProjects);
  } catch (error) {
    if (error?.response?.status !== 400) throw error;
    const rows = await projects.list();
    return rows.map(toProject).sort(compareProjects);
  }
};

export const projectsAPI = {
  get: getProjects,
  create: (payload) => projects.create(fromProject(payload)).then(toProject),
  update: (id, payload) => projects.update(id, fromProject(payload)).then(toProject),
  remove: (id) => projects.remove(id),
};

const videos = forgeTable('videos');

const toVideo = (row) =>
  row && {
    ...row,
    embedUrl: row.embed_url ?? row.embedUrl,
    date: row.date || row.created_at,
  };

const fromVideo = (payload) => ({ ...cleanId(payload), embed_url: payload.embedUrl });

export const videosAPI = {
  get: () => videos.list().then((rows) => rows.map(toVideo)),
  create: (payload) => videos.create(fromVideo(payload)).then(toVideo),
  update: (id, payload) => videos.update(id, fromVideo(payload)).then(toVideo),
  remove: (id) => videos.remove(id),
};

const resources = forgeTable('resources');

export const resourcesAPI = {
  get: () => resources.list(),
  create: (payload) => resources.create(cleanId(payload)),
  update: (id, payload) => resources.update(id, cleanId(payload)),
  remove: (id) => resources.remove(id),
};

const gallery = forgeTable('gallery');

const FALLBACK_GALLERY_IMG = '/images/resource-placeholder.svg';

const toGalleryItem = (row) =>
  row && {
    ...row,
    image: row.image || FALLBACK_GALLERY_IMG,
  };

export const galleryAPI = {
  get: () => gallery.list().then((rows) => rows.map(toGalleryItem)),
  create: (payload) => gallery.create(cleanId(payload)).then(toGalleryItem),
  update: (id, payload) => gallery.update(id, cleanId(payload)).then(toGalleryItem),
  remove: (id) => gallery.remove(id),
};

const messages = forgeTable('messages');

const toMessage = (row) =>
  row && {
    ...row,
    date: row.date || row.created_at,
  };

export const messagesAPI = {
  get: () => messages.list().then((rows) => rows.map(toMessage)),
  markRead: (id, read) => messages.update(id, { read }),
  remove: (id) => messages.remove(id),
};

/* ---------------- Divers (contact / newsletter) ---------------- */

export const contactAPI = {
  sendMessage: (payload) =>
    messages.create({
      nom: payload.nom,
      email: payload.email,
      message: payload.message,
      read: false,
      date: new Date().toISOString(),
    }),
  subscribeNewsletter: (email) => forgeTable('newsletter').create({ email }),
};

export default http;