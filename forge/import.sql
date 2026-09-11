-- ============================================================
-- Forge — Import complet du portfolio (tables + données)
-- Dialecte : PostgreSQL
--
-- Usage :
--   Self-hosted (fgc) :  psql "$FORGE_DATABASE_URL" -f forge/import.sql
--   Playground /sql hébergé : les CREATE TABLE peuvent être rejetés
--   ("limité à vos tables") → créer les tables dans l'éditeur Schema
--   (voir forge/schema.md) puis exécuter uniquement la section INSERT.
--
-- Idempotent : ré-exécutable sans risque (IF NOT EXISTS, pas de DROP).
-- Le compte admin ne s'insère PAS ici : il se crée via l'Auth playground
-- (le mot de passe doit être hashé par Forge).
-- Pour une base DÉJÀ peuplée (cas du cloud), utiliser forge/push-cloud.sql.
-- ============================================================

-- ---------- Création des tables ----------

CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  role text,
  level text,
  title text,
  tagline text,
  bio text,
  availability text,
  photo text,
  email text,
  phone text,
  location text,
  website text,
  resume_url text,
  socials jsonb,
  stats jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categories jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiences jsonb,
  education jsonb,
  values jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  category text,
  year text,
  image text,
  description text,
  stack jsonb,
  demo text,
  repo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  url text,
  embed_url text,
  description text,
  date text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text,
  title text,
  description text,
  image text,
  url text,
  store text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image text,
  title text,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text,
  email text,
  message text,
  read boolean NOT NULL DEFAULT false,
  date text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  password text,
  role text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SECTION INSERT — ne fonctionne que si les tables ci-dessus
-- (ou leurs équivalents Schema) existent.
-- ============================================================

-- ---------- profile (1 ligne) ----------
INSERT INTO profile (id, name, role, level, title, tagline, bio, availability, photo, email, phone, location, website, resume_url, socials, stats) VALUES (
  '11111111-1111-4111-8111-111111111111',
  'Bénatard',
  'Ingénieur en Informatique & Développeur Full-Stack',
  'Développeur Junior',
  'Ingénieur en Informatique — Développeur Full-Stack Junior',
  'Du design UI/UX au câblage réseau : je conçois des solutions complètes et je forme ceux qui les utilisent.',
  'Ingénieur en informatique et développeur Full-Stack junior, diplômé d''une licence LMD en génie logiciel (1er de la promotion) avec 4 ans d''expérience. Solide sur le front-end comme sur le back-end et le design UI/UX, j''interviens aussi sur la partie physique des infrastructures — câblage, connectique et supervision réseau. Passionné par la transmission, je forme régulièrement des agents, des équipes et des étudiants.',
  'Ouvert aux missions freelance & formations',
  '/images/avatar.svg',
  'benatard.dev@gmail.com',
  '+243 000 000 000',
  'Kolwezi, Province du Lualaba, RDC',
  'www.benatard.dev',
  '/cv.pdf',
  '[{"key":"github","label":"GitHub","url":"https://github.com/benatard"},{"key":"linkedin","label":"LinkedIn","url":"https://linkedin.com/in/benatard"},{"key":"twitter","label":"Twitter","url":"https://twitter.com/benatard"},{"key":"youtube","label":"YouTube","url":"https://youtube.com/@benatard"}]',
  '[{"number":"4+","label":"ANS D''EXPÉRIENCE"},{"number":"1er","label":"DE MA PROMOTION"},{"number":"3e","label":"PRIX COMPÉTITION ISIPA"},{"number":"6+","label":"PROJETS RÉALISÉS"}]'
);

-- ---------- skills (1 ligne) ----------
INSERT INTO skills (id, categories) VALUES (
  '22222222-2222-4222-8222-222222222222',
  '[{"name":"Frontend","icon":"code","color":"#4A6CF7","skills":[{"name":"React","level":85},{"name":"JavaScript / ES6+","level":85},{"name":"HTML / CSS","level":90},{"name":"Tailwind CSS","level":85}]},{"name":"Backend","icon":"server","color":"#10B981","skills":[{"name":"Node.js / Express","level":80},{"name":"REST APIs","level":80},{"name":"Bases de données (SQL)","level":75},{"name":"Python","level":60}]},{"name":"Design UI/UX","icon":"monitor","color":"#F59E0B","skills":[{"name":"Maquettage d''interfaces","level":80},{"name":"Expérience utilisateur","level":75},{"name":"Design responsive","level":85},{"name":"Outils de design","level":70}]},{"name":"Réseaux & Infrastructure","icon":"globe","color":"#06B6D4","skills":[{"name":"Câblage structuré","level":85},{"name":"Architecture réseau","level":75},{"name":"Maintenance & supervision","level":80},{"name":"TCP/IP & LAN","level":70}]},{"name":"Formation & Pédagogie","icon":"layers","color":"#8B5CF6","skills":[{"name":"Formation d''agents & personnel","level":85},{"name":"Tutoriels & accompagnement","level":80},{"name":"Accompagnement d''étudiants","level":80}]}]'
);

-- ---------- experience (1 ligne) ----------
INSERT INTO experience (id, experiences, education, values) VALUES (
  '33333333-3333-4333-8333-333333333333',
  '[{"role":"Informaticien IT — CDI","company":"Umoja Industry","period":"2024 — Présent","desc":"Membre de l''équipe en charge du câblage réseau du grand bâtiment de l''Hôpital CMOK (4 niveaux) à Kolwezi ; direction d''une équipe IT pour le câblage du bâtiment de 4 niveaux de l''Hôpital SKK ; direction d''une équipe IT sur un chantier à 5 niveaux. Encadrement et formation des agents sur le logiciel et le système complet."},{"role":"Stagiaire Développeur logiciel (en ligne)","company":"Root","period":"2023 — 2024","desc":"Stage en développement logiciel réalisé en ligne : conception et développement d''applications web complètes."},{"role":"Stagiaire IT & Développeur","company":"NexusTech","period":"2023","desc":"Stage professionnel à l''issue duquel j''ai obtenu un certificat Node.js."},{"role":"Informaticien IT","company":"Umoja Industry","period":"2022 — 2023","desc":"Assistance et formation des agents à la maîtrise du logiciel et du système complet ; maintenance préventive du parc informatique pendant 1 mois."},{"role":"Stagiaire professionnel","company":"Umoja Industry","period":"2022","desc":"Stage de 2 mois : participation au déploiement d''un système hospitalier local et assistance au design de l''architecture réseau du bâtiment."}]',
  '[{"degree":"Licence LMD — Génie Logiciel","school":"Université de Kolwezi","period":"2019 — 2024","desc":"5 ans d''études universitaires en génie logiciel, obtenues avec la 1re place de la promotion."},{"degree":"Certificat Node.js","school":"NexusTech","period":"2023","desc":"Certification obtenue à l''issue d''un stage professionnel."}]',
  '[{"title":"Transmission du savoir","desc":"Passionné de formation : j''accompagne des agents, du personnel et des étudiants pour rendre la technologie accessible à tous."},{"title":"Rigueur d''ingénieur","desc":"Une approche méthodique, du design de l''architecture réseau au déploiement d''un logiciel, en passant par le câblage."},{"title":"Leadership d''équipe","desc":"Direction d''équipes IT sur le terrain : chantier d''un bâtiment de 5 niveaux, Hôpital SKK, câblage CMOK."},{"title":"Apprentissage continu","desc":"Une veille constante en développement et en infrastructure pour rester à la pointe."}]'
);

-- ---------- projects ----------
INSERT INTO projects (id, title, category, year, image, description, stack, demo, repo) VALUES
('a0000000-0000-4000-8000-000000000001', 'Câblage réseau — Hôpital CMOK', 'Infrastructure Réseau', '2025', '/images/services/infra-it.svg', 'Membre de l''équipe réseau ayant réalisé le câblage du grand bâtiment de l''Hôpital CMOK (4 niveaux) à Kolwezi : chemins de câbles, brassage, points de connexion et mise en service du réseau.', '["Câblage structuré","Réseau LAN","Brassage & connectique"]', '#', '#'),
('a0000000-0000-4000-8000-000000000002', 'Câblage réseau — Hôpital SKK', 'Infrastructure Réseau', '2024', '/images/services/infra-it.svg', 'Direction d''une équipe IT pour le câblage et la connectique du bâtiment de 4 niveaux de l''Hôpital SKK, jusqu''à la mise en service.', '["Câblage structuré","Réseau LAN","Gestion d''équipe"]', '#', '#'),
('a0000000-0000-4000-8000-000000000003', 'Supervision IT — Chantier 5 niveaux', 'Infrastructure Réseau', '2024', '/images/services/maintenance.svg', 'Direction d''une équipe IT sur un chantier d''un bâtiment de 5 niveaux : supervision réseau, installation des postes et coordination des intervenants.', '["Supervision réseau","Câblage","Postes & périphériques"]', '#', '#'),
('a0000000-0000-4000-8000-000000000004', 'Déploiement d''un système hospitalier', 'Système hospitalier', '2022', '/images/services/dev-software.svg', 'Participation au déploiement d''un système hospitalier local chez Umoja Industry : installation, configuration et formation des agents à l''utilisation du logiciel et du système complet.', '["Node.js","Bases de données","Réseau local","Formation utilisateurs"]', '#', '#'),
('a0000000-0000-4000-8000-000000000005', 'Architecture réseau & maintenance', 'Infrastructure Réseau', '2023', '/images/services/maintenance.svg', 'Assistance au design de l''architecture réseau du bâtiment d''Umoja Industry, puis maintenance préventive du parc informatique pendant 1 mois.', '["Architecture réseau","Maintenance préventive","Support utilisateurs"]', '#', '#'),
('a0000000-0000-4000-8000-000000000006', 'Applications web Full-Stack', 'Développement web', '2023', '/images/services/dev-software.svg', 'Conception et développement d''applications web complètes : front-end (React, Tailwind CSS), back-end (Node.js) et design UI/UX intégrés.', '["React","Tailwind CSS","Node.js","UI/UX"]', '#', '#');

-- ---------- videos ----------
-- Table volontairement VIDE : les tutos seront ajoutés depuis /admin.

-- ---------- resources ----------
-- Table volontairement VIDE : les ressources seront ajoutées depuis /admin.

-- ---------- gallery (photos de démo, remplaçables via /admin) ----------
INSERT INTO gallery (image, title, caption) VALUES
  ('/images/platforms/miner-dashboard.svg', 'Plateforme Minière', 'Application de suivi pour le secteur minier.'),
  ('/images/platforms/afya-dashboard.svg',     'Plateforme Afya',    'Système hospitalier déployé chez Umoja Industry.'),
  ('/images/services/infra-it.svg',            'Infrastructure réseau', 'Câblage et connectique Hôpital CMOK / SKK.'),
  ('/images/services/robotics.svg',            'Robotique',          'Projet robotique — prix compétition ISIPA.');

-- ---------- newsletter ----------
-- (aucune ligne à insérer au départ)

-- ---------- admin ----------
-- NE PAS insérer ici : le compte admin se crée via l'Auth playground (signup)
-- afin que le mot de passe soit correctement hashé par Forge.
-- Ensuite, si la colonne role n'a pas de valeur par défaut :
--   UPDATE admin SET role = 'admin' WHERE email = 'benatard.dev@gmail.com';
-- (ou définir role = 'admin' comme valeur par défaut dans l'éditeur de schéma)