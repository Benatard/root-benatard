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
 *   messages, newsletter,
 *   students             → tables de lignes
 *   (students.progress est un JSONB { moduleId: { lessonId: true } })
 */

export const FORGE_CONFIGURED = Boolean(config.FORGE.PROJECT_KEY && config.FORGE.API_KEY);
export const FORGE_TOKEN_KEY = 'forge_token';

const BASE = `${config.FORGE.BASE_URL}/${config.FORGE.PROJECT_KEY}`;

const http = axios.create({ baseURL: BASE });

/*
 * Session — le JWT est gardé en localStorage pour survivre à la fermeture
 * de l'onglet (une formation se suit sur plusieurs jours). L'ancien
 * sessionStorage est migré puis purgé au premier accès.
 */
export const getToken = () => {
  try {
    const legacy = sessionStorage.getItem(FORGE_TOKEN_KEY);
    if (legacy) {
      sessionStorage.removeItem(FORGE_TOKEN_KEY);
      localStorage.setItem(FORGE_TOKEN_KEY, legacy);
      return legacy;
    }
    return localStorage.getItem(FORGE_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    sessionStorage.removeItem(FORGE_TOKEN_KEY);
    if (token) localStorage.setItem(FORGE_TOKEN_KEY, token);
    else localStorage.removeItem(FORGE_TOKEN_KEY);
  } catch {
    /* stockage indisponible : la session sera simplement éphémère */
  }
};

export const clearToken = () => setToken(null);

http.interceptors.request.use((cfg) => {
  cfg.headers['x-api-key'] = config.FORGE.API_KEY;
  const token = getToken();
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

export const parseJSONField = (value) => {
  if (value == null || typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/* ---------------- Auth (end-user : admin + apprenants) ---------------- */

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const toAuthPayload = (data) => ({
  token: data.token || data.jwt || data.access_token,
  user: data.user || data,
});

export const authAPI = {
  login: ({ email, password }) =>
    req(() => http.post('/auth/login', { [config.FORGE.IDENTIFIER_COLUMN]: email, password })).then(toAuthPayload),
  signup: ({ email, password }) =>
    req(() => http.post('/auth/signup', { [config.FORGE.IDENTIFIER_COLUMN]: email, password })).then(toAuthPayload),
  me: () => req(() => http.get('/auth/me')).then((data) => data.user || data),

  /*
   * Le rôle n'est NI dans le JWT (claims : iat, exp, sub, email, pid, tid)
   * NI dans /auth/me (id, email, created_at) : il vit dans la table `admin`.
   * On ne renvoie que le rôle — jamais le hash `password`.
   * Échec API → `null` : on n'élève jamais quelqu'un en admin par défaut
   * (échec fermé).
   */
  role: async (email) => {
    const target = normalizeEmail(email);
    if (!target) return null;
    try {
      const rows = await forgeTable('admin').list({ limit: 200 });
      const found = rows.find((row) => normalizeEmail(row.email) === target);
      return (found && found.role) || 'student';
    } catch {
      return null;
    }
  },
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

const LMS_ID_KEY = 'portfolio_lms_id';
const lmsTable = singleRow('lms', LMS_ID_KEY);

const toLMSRow = (row) => row && {
  ...row,
  formations: parseJSONField(row.formations),
  modules: parseJSONField(row.modules),
};

/*
 * Formations d'une ligne, quel que soit son état :
 *  - `formations` : clé active, tableau de formations ;
 *  - `modules`   : repli rétro-compat (tableau de modules → 1 formation).
 * Forge peut renvoyer une colonne JSON en string selon son type en base :
 * on parse dans les deux cas avant de tester Array.isArray.
 */
export const toFormations = (row) => {
  if (!row) return [];
  const formations = parseJSONField(row.formations);
  if (Array.isArray(formations)) return formations;
  const modules = parseJSONField(row.modules);
  if (Array.isArray(modules) && modules.length) {
    return [{ id: 'formation-default', title: '', description: '', modules }];
  }
  return [];
};

/*
 * `lms` est documenté comme « 1 seule ligne », mais la table en accumule
 * plusieurs : lignes d'exemple générées par Forge, seed SQL, contenus créés
 * depuis /admin. `list({limit:1})` ne choisit pas laquelle lire de façon
 * déterministe (les created_at sont identiques par paquet → l'ordre Postgres
 * change après chaque UPDATE) : les formations semblaient donc disparaître
 * et réapparaître au gré des enregistrements.
 *
 * On lit TOUTES les lignes et on fusionne, en dédoublonnant par id/titre.
 */
const mergeLmsRows = (rows) => {
  const merged = [];
  const seen = new Set();
  rows.forEach((row) => {
    toFormations(toLMSRow(row)).forEach((formation) => {
      const key = formation && (formation.id || formation.title);
      if (key) {
        if (seen.has(key)) return;
        seen.add(key);
      }
      merged.push(formation);
    });
  });
  return merged;
};

/* Cible d'écriture stable : la ligne la plus riche, puis id croissant. */
const lmsScore = (row) => {
  const parsed = toLMSRow(row);
  const modules = Array.isArray(parsed.modules) ? parsed.modules.length : 0;
  return toFormations(parsed).length * 10 + modules;
};

const pickLmsRow = (rows) =>
  [...rows].sort(
    (a, b) => lmsScore(b) - lmsScore(a) || String(a.id).localeCompare(String(b.id))
  )[0];

export const lmsAPI = {
  get: async () => {
    const rows = await forgeTable('lms').list({ limit: 200 });
    if (!rows.length) return null;
    const primary = pickLmsRow(rows);
    // on force la cible d'écriture sur la ligne retenue, sinon singleRow
    // réutiliserait un id potentiellement périmé gardé en localStorage.
    localStorage.setItem(LMS_ID_KEY, primary.id);
    return toLMSRow({ ...primary, formations: mergeLmsRows(rows) });
  },
  save: async (payload) => {
    const clean = cleanId(payload);
    let row;
    try {
      row = await lmsTable.save(clean);
    } catch (err) {
      // id local pointant vers une ligne déjà supprimée → on repart en création
      localStorage.removeItem(LMS_ID_KEY);
      row = await lmsTable.save(clean);
    }
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

const toGalleryItem = (row) => {
  if (!row) return row;
  const { sort_order: sortOrderField, sortOrder: sortOrderValue, ...rest } = row;
  return {
    ...rest,
    image: row.image || FALLBACK_GALLERY_IMG,
    sortOrder: toSortOrder(sortOrderField ?? sortOrderValue),
  };
};

const fromGallery = (payload) => {
  const { sortOrder, ...rest } = payload;
  const numericSortOrder = toSortOrder(sortOrder);
  return {
    ...cleanId(rest),
    ...(numericSortOrder === null ? {} : { sort_order: numericSortOrder }),
  };
};

const compareGallery = (a, b) => {
  const aOrder = toSortOrder(a?.sortOrder);
  const bOrder = toSortOrder(b?.sortOrder);
  if (aOrder !== null && bOrder !== null && aOrder !== bOrder) return aOrder - bOrder;
  if (aOrder !== null && bOrder === null) return -1;
  if (aOrder === null && bOrder !== null) return 1;

  const createdDiff = String(a?.created_at || '').localeCompare(String(b?.created_at || ''));
  if (createdDiff !== 0) return createdDiff;
  return String(a?.id || '').localeCompare(String(b?.id || ''));
};

const getGallery = async () => {
  try {
    const rows = await gallery.list({ order: 'sort_order.asc' });
    return rows.map(toGalleryItem).sort(compareGallery);
  } catch (error) {
    if (error?.response?.status !== 400) throw error;
    const rows = await gallery.list();
    return rows.map(toGalleryItem).sort(compareGallery);
  }
};

export const galleryAPI = {
  get: getGallery,
  create: (payload) => gallery.create(fromGallery(payload)).then(toGalleryItem),
  update: (id, payload) => gallery.update(id, fromGallery(payload)).then(toGalleryItem),
  updateOrder: (id, sortOrder) => gallery.update(id, { sort_order: toSortOrder(sortOrder) ?? 1 }),
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

/* ---------------- Apprenants de la formation ---------------- */

const students = forgeTable('students');

const toStudent = (row) => row && { ...row, progress: parseJSONField(row.progress) || {} };

const getStudents = async () => {
  try {
    const rows = await students.list({ order: 'created_at.desc' });
    return rows.map(toStudent);
  } catch (error) {
    if (error?.response?.status !== 400) throw error;
    const rows = await students.list();
    return rows.map(toStudent).sort((a, b) =>
      String(b?.created_at || '').localeCompare(String(a?.created_at || ''))
    );
  }
};

export const studentsAPI = {
  get: getStudents,
  create: (payload) => students.create(cleanId(payload)).then(toStudent),
  update: (id, payload) => students.update(id, cleanId(payload)).then(toStudent),
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