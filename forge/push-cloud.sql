-- ============================================================
-- Forge — Push des données du portfolio vers une base DÉJÀ peuplée
-- À coller dans le Playground /sql de Forge (ou via `fgc`).
--
-- Ce fichier suppose que les tables existent ET contiennent déjà
-- des lignes (cas du cloud). Stratégie :
--   profile / skills / experience  → UPDATE de l'unique ligne
--   projects                       → DELETE toutes + INSERT des vrais projets
--   videos / resources             → DELETE (tables volontairement vides)
-- Ré-exécutable sans risque.
-- ============================================================

-- ---------- profile (1 ligne) ----------
UPDATE profile SET
  name = 'Bénatard',
  role = 'Ingénieur en Informatique & Développeur Full-Stack',
  level = 'Développeur Junior',
  title = 'Ingénieur en Informatique — Développeur Full-Stack Junior',
  tagline = 'Du design UI/UX au câblage réseau : je conçois des solutions complètes et je forme ceux qui les utilisent.',
  bio = 'Ingénieur en informatique et développeur Full-Stack junior, diplômé d''une licence LMD en génie logiciel (1er de la promotion) avec 4 ans d''expérience. Solide sur le front-end comme sur le back-end et le design UI/UX, j''interviens aussi sur la partie physique des infrastructures — câblage, connectique et supervision réseau. Passionné par la transmission, je forme régulièrement des agents, des équipes et des étudiants.',
  availability = 'Ouvert aux missions freelance & formations',
  photo = '/images/avatar.svg',
  email = 'benatard.dev@gmail.com',
  phone = '+243 000 000 000',
  location = 'Kolwezi, Province du Lualaba, RDC',
  website = 'www.benatard.dev',
  resume_url = '/cv.pdf',
  socials = '[{"key":"github","label":"GitHub","url":"https://github.com/benatard"},{"key":"linkedin","label":"LinkedIn","url":"https://linkedin.com/in/benatard"},{"key":"twitter","label":"Twitter","url":"https://twitter.com/benatard"},{"key":"youtube","label":"YouTube","url":"https://youtube.com/@benatard"}]'::jsonb,
  stats = '[{"number":"4+","label":"ANS D''EXPÉRIENCE"},{"number":"1er","label":"DE MA PROMOTION"},{"number":"3e","label":"PRIX COMPÉTITION ISIPA"},{"number":"6+","label":"PROJETS RÉALISÉS"}]'::jsonb;

-- ---------- skills (1 ligne) ----------
UPDATE skills SET
  categories = '[{"name":"Frontend","icon":"code","color":"#4A6CF7","skills":[{"name":"React","level":85},{"name":"JavaScript / ES6+","level":85},{"name":"HTML / CSS","level":90},{"name":"Tailwind CSS","level":85}]},{"name":"Backend","icon":"server","color":"#10B981","skills":[{"name":"Node.js / Express","level":80},{"name":"REST APIs","level":80},{"name":"Bases de données (SQL)","level":75},{"name":"Python","level":60}]},{"name":"Design UI/UX","icon":"monitor","color":"#F59E0B","skills":[{"name":"Maquettage d''interfaces","level":80},{"name":"Expérience utilisateur","level":75},{"name":"Design responsive","level":85},{"name":"Outils de design","level":70}]},{"name":"Réseaux & Infrastructure","icon":"globe","color":"#06B6D4","skills":[{"name":"Câblage structuré","level":85},{"name":"Architecture réseau","level":75},{"name":"Maintenance & supervision","level":80},{"name":"TCP/IP & LAN","level":70}]},{"name":"Formation & Pédagogie","icon":"layers","color":"#8B5CF6","skills":[{"name":"Formation d''agents & personnel","level":85},{"name":"Tutoriels & accompagnement","level":80},{"name":"Accompagnement d''étudiants","level":80}]}]'::jsonb;

-- ---------- lms (1 ligne) — formation par modules ----------
-- ON CONFLICT : id stable (ré-exécutable sans casser l'id mémorisé).
-- Leçon 1 réelle (le lien vidéo « YOUTUBE_ID » est à remplacer).
INSERT INTO lms (id, modules) VALUES (
  '99999999-9999-4999-8999-999999999999',
  '[{"id":"module-methode","title":"Ma méthode de programmation","description":"Une méthode simple et éprouvée : analyser le besoin, découper le projet en modules indépendants, puis avancer module par module avec une vérification à chaque étape. Chaque leçon combine une vidéo de démonstration et un résumé écrit.","lessons":[{"id":"lecon-1","title":"Leçon 1 — Bien définir le besoin avant de coder","url":"https://www.youtube.com/watch?v=YOUTUBE_ID","embedUrl":"https://www.youtube.com/embed/YOUTUBE_ID","content":"Bienvenue dans cette première leçon ! Elle pose la base de toute la méthode que je te partage. Elle vient directement de ma pratique quotidienne : avant d''écrire la moindre ligne de code, je prends toujours le temps de comprendre précisément ce que l''on veut construire.\n\nLa boucle de travail, étape par étape :\n\n1. Décrire le besoin en une phrase simple.\n2. Analyser ce qui existe déjà avant de modifier quoi que ce soit.\n3. Clarifier par des questions ciblées plutôt que de supposer.\n4. Découper le projet en petits modules livrables un par un.\n5. Implémenter chaque module, puis vérifier immédiatement (compiler, builder).\n6. Documenter ce qui a été fait (SQL, schéma, notes) pour ne rien perdre.\n\nC''est exactement cette boucle — besoin, analyse, clarification, plan, module, vérification, itération — que j''applique en développement, seul ou en équipe, avec ou sans l''aide d''un assistant IA. Elle t''évite d''écrire des lignes inutiles et te fait gagner un temps précieux."}]}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  modules = EXCLUDED.modules,
  updated_at = now();

-- ---------- experience (1 ligne) ----------
UPDATE experience SET
  experiences = '[{"role":"Informaticien IT — CDI","company":"Umoja Industry","period":"2024 — Présent","desc":"Membre de l''équipe en charge du câblage réseau du grand bâtiment de l''Hôpital CMOK (4 niveaux) à Kolwezi ; direction d''une équipe IT pour le câblage du bâtiment de 4 niveaux de l''Hôpital SKK ; direction d''une équipe IT sur un chantier à 5 niveaux. Encadrement et formation des agents sur le logiciel et le système complet."},{"role":"Stagiaire Développeur logiciel (en ligne)","company":"Root","period":"2023 — 2024","desc":"Stage en développement logiciel réalisé en ligne : conception et développement d''applications web complètes."},{"role":"Stagiaire IT & Développeur","company":"NexusTech","period":"2023","desc":"Stage professionnel à l''issue duquel j''ai obtenu un certificat Node.js."},{"role":"Informaticien IT","company":"Umoja Industry","period":"2022 — 2023","desc":"Assistance et formation des agents à la maîtrise du logiciel et du système complet ; maintenance préventive du parc informatique pendant 1 mois."},{"role":"Stagiaire professionnel","company":"Umoja Industry","period":"2022","desc":"Stage de 2 mois : participation au déploiement d''un système hospitalier local et assistance au design de l''architecture réseau du bâtiment."}]'::jsonb,
  education = '[{"degree":"Licence LMD — Génie Logiciel","school":"Université de Kolwezi","period":"2019 — 2024","desc":"5 ans d''études universitaires en génie logiciel, obtenues avec la 1re place de la promotion."},{"degree":"Certificat Node.js","school":"NexusTech","period":"2023","desc":"Certification obtenue à l''issue d''un stage professionnel."}]'::jsonb,
  values = '[{"title":"Transmission du savoir","desc":"Passionné de formation : j''accompagne des agents, du personnel et des étudiants pour rendre la technologie accessible à tous."},{"title":"Rigueur d''ingénieur","desc":"Une approche méthodique, du design de l''architecture réseau au déploiement d''un logiciel, en passant par le câblage."},{"title":"Leadership d''équipe","desc":"Direction d''équipes IT sur le terrain : chantier d''un bâtiment de 5 niveaux, Hôpital SKK, câblage CMOK."},{"title":"Apprentissage continu","desc":"Une veille constante en développement et en infrastructure pour rester à la pointe."}]'::jsonb;

-- ---------- projects (remplacement complet) ----------
DELETE FROM projects;

INSERT INTO projects (id, title, category, year, image, description, stack, demo, repo) VALUES
('a0000000-0000-4000-8000-000000000001', 'Câblage réseau — Hôpital CMOK', 'Infrastructure Réseau', '2025', '/images/services/infra-it.svg', 'Membre de l''équipe réseau ayant réalisé le câblage du grand bâtiment de l''Hôpital CMOK (4 niveaux) à Kolwezi : chemins de câbles, brassage, points de connexion et mise en service du réseau.', '["Câblage structuré","Réseau LAN","Brassage & connectique"]'::jsonb, '#', '#'),
('a0000000-0000-4000-8000-000000000002', 'Câblage réseau — Hôpital SKK', 'Infrastructure Réseau', '2024', '/images/services/infra-it.svg', 'Direction d''une équipe IT pour le câblage et la connectique du bâtiment de 4 niveaux de l''Hôpital SKK, jusqu''à la mise en service.', '["Câblage structuré","Réseau LAN","Gestion d''équipe"]'::jsonb, '#', '#'),
('a0000000-0000-4000-8000-000000000003', 'Supervision IT — Chantier 5 niveaux', 'Infrastructure Réseau', '2024', '/images/services/maintenance.svg', 'Direction d''une équipe IT sur un chantier d''un bâtiment de 5 niveaux : supervision réseau, installation des postes et coordination des intervenants.', '["Supervision réseau","Câblage","Postes & périphériques"]'::jsonb, '#', '#'),
('a0000000-0000-4000-8000-000000000004', 'Déploiement d''un système hospitalier', 'Système hospitalier', '2022', '/images/services/dev-software.svg', 'Participation au déploiement d''un système hospitalier local chez Umoja Industry : installation, configuration et formation des agents à l''utilisation du logiciel et du système complet.', '["Node.js","Bases de données","Réseau local","Formation utilisateurs"]'::jsonb, '#', '#'),
('a0000000-0000-4000-8000-000000000005', 'Architecture réseau & maintenance', 'Infrastructure Réseau', '2023', '/images/services/maintenance.svg', 'Assistance au design de l''architecture réseau du bâtiment d''Umoja Industry, puis maintenance préventive du parc informatique pendant 1 mois.', '["Architecture réseau","Maintenance préventive","Support utilisateurs"]'::jsonb, '#', '#'),
('a0000000-0000-4000-8000-000000000006', 'Applications web Full-Stack', 'Développement web', '2023', '/images/services/dev-software.svg', 'Conception et développement d''applications web complètes : front-end (React, Tailwind CSS), back-end (Node.js) et design UI/UX intégrés.', '["React","Tailwind CSS","Node.js","UI/UX"]'::jsonb, '#', '#');

-- ---------- videos / resources (vidées) ----------
DELETE FROM videos;
DELETE FROM resources;

-- ---------- admin ----------
-- Ne rien faire ici : le compte admin se gère via l'Auth playground.
-- Vérifier après exécution que la colonne role = 'admin' :
--   UPDATE admin SET role = 'admin' WHERE email = 'benatard.dev@gmail.com';