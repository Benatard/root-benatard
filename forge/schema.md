# Forge — Schéma du portfolio

Base des endpoints : `https://forgeconsole.app/api/public/v1/<project-key>/...`

## 1. Tables à créer (onglet **Schema**)

Choisir l'ID **uuid** pour toutes les tables. Créer les colonnes suivantes
(les colonnes listées sans type sont `text`) :

### `profile` — 1 seule ligne (les blocs sociaux/statistiques en JSON)
| colonne     | type  |
|-------------|-------|
| name        | text  |
| role        | text  |
| level       | text  |
| title       | text  |
| tagline     | text  |
| bio         | text  |
| availability| text  |
| photo       | text  |
| email       | text  |
| phone       | text  |
| location    | text  |
| website     | text  |
| resume_url  | text  |
| socials     | json  |
| stats       | json  |

> **CV** : le champ `resume_url` accepte une URL directe vers le PDF. Pour un CV
> hébergé sur le site, placer le fichier dans `public/cv.pdf` et mettre `/cv.pdf`
> dans le champ (deux boutons « Télécharger mon CV » s'affichent : sidebar et page
> À propos). Pour un hébergement externe (ex. Drive), utiliser une URL de
> téléchargement direct (Drive : `&export=download`), sinon l'attribut `download`
> ne fonctionnera pas.

### `skills` — 1 seule ligne
| colonne    | type |
|------------|------|
| categories | json |

### `lms` — 1 seule ligne (mini-LMS : formation par modules)
| colonne   | type |
|-----------|------|
| formations | json |
| modules   | json |

> `formations` est la clé **active** : un tableau de formations, chacune
> `{ "id", "title", "description", "modules": [ ... ] }`.
> `modules` est le repli rétro-compat (le tableau de modules de la 1ʳᵉ
> formation) : la sauvegarde écrit les **deux** clés, car le PATCH Forge
> remplace le blob de la ligne.
>
> Chaque module :
> `{ "id", "title", "description", "lessons": [ ... ] }`.
> Chaque leçon d'un module :
> `{ "id", "title", "url", "embedUrl", "content" }` —
> `url` = lien de la vidéo (YouTube, Google Drive, Vimeo ou Dailymotion),
> `embedUrl` = URL d'iframe générée par le site, `content` = récapitulatif
> écrit de la leçon. La progression des apprenants est stockée côté visiteur
> dans le localStorage (clé `lms_progress`) et synchronisée sur `students`
> via le portail d'inscription de `/videos`.
>
> ⚠️ Forge peut renvoyer une colonne JSON en **string** selon son type en
> base : tout le côté lecture passe par `parseJSONField`
> (`src/service/api.js`) — ne jamais lire `row.formations` brute.

### `experience` — 1 seule ligne
| colonne     | type |
|-------------|------|
| experiences | json |
| education   | json |
| values      | json |

### `projects` — lignes
| colonne     | type |
|-------------|------|
| title       | text |
| category    | text |
| year        | text |
| image       | text |
| description | text |
| stack       | json |
| demo        | text |
| repo        | text |
| sort_order  | integer |

### `videos` — lignes
| colonne     | type |
|-------------|------|
| title       | text |
| url         | text |
| embed_url   | text |
| description | text |
| date        | text |

### `resources` — lignes
| colonne     | type |
|-------------|------|
| type        | text |
| title       | text |
| description | text |
| image       | text |
| url         | text |
| store       | text |

### `gallery` — lignes (galerie photo / carrousel)
| colonne | type |
|---------|------|
| image   | text (URL ou chemin local, ex. `/images/photo.jpg`) |
| title   | text (optionnel, légende principale) |
| caption | text (optionnel, description sous le titre) |
| sort_order | integer (position dans le carrousel, 1 = affiché en premier) |

> Création : `forge/gallery.sql` (self-hosted) ou éditeur Schema. Le carrousel
> est affiché sur `/galerie` et en version compacte sur l'accueil ; les photos
> se gèrent dans `/admin` → onglet **Galerie**.
> La colonne `sort_order` s'ajoute sur une base existante avec
> `forge/gallery-order.sql` (ré-exécutable) ; l'ordre de réordonnancement se
> règle avec les flèches dans l'admin.

### `messages` — lignes
| colonne | type |
|---------|------|
| nom     | text |
| email   | text |
| message | text |
| read    | bool |
| date    | text |

### `newsletter` — lignes
| colonne | type |
|---------|------|
| email   | text |

### `students` — apprenants de la formation
| colonne    | type | option |
|------------|------|--------|
| name       | text | nom affiché dans l'admin |
| email      | text | unique (insensible à la casse) — sert d'identifiant |
| progress   | jsonb | `{ "<module-id>": { "<lesson-id>": true } }` |

> Création : `forge/students.sql` (self-hosted) ou éditeur Schema.
> Une ligne = un apprenant, liée à son compte d'authentification (§2) **par
> l'email** (normalisé en minuscules). Le nom est saisi à la création du
> compte puis conservé ici. `progress` reprend la structure de l'ancien
> `localStorage['lms_progress']` ; l'avancement se lit dans `/admin` →
> onglet **Apprenants**.
> La fiche est créée automatiquement : au signup, puis par provisionnement
> paresseux (`src/hooks/useStudent.js`) si elle manque au login.
> Les comptes sans mot de passe de l'ancien portail sont ignorés : il n'y a
> pas de migration, l'apprenant crée simplement un compte sur `/videos`.
> ⚠️ `require_auth` étant projet entier (§3) et désactivé, la table est
> lisible par quiconque possède la clé API — comme `messages`. Restreindre
> la lecture dans la console Forge si l'option existe.
> Les ids de modules/leçons doivent être stables : ils sont produits par
> `ensureFormationIds` (`src/hooks/useLMS.js`) et persistés à la sauvegarde.

### `admin` — table d'authentification (end-user auth)
| colonne  | type   | option        |
|----------|--------|---------------|
| email    | text   | identifiant   |
| password | text   | **hidden**    |
| role     | text   | (ex: "admin") |

> Cette table sert **toutes** les sessions : admin **et** apprenants. Un
> apprenant y a une ligne (créée par signup) avec `role` vide ; seul
> `role === 'admin'` ouvre `/admin`. `src/service/api.js` lit la table par
> `GET /admin?limit=200` et ne renvoie que le rôle (jamais `password`).
> ⚠️ La lecture publique expose le hash `password` de cette table ; vérifier
> dans la console Forge s'il est possible de masquer cette colonne en lecture.

## 2. Auth (onglet **Auth**)
- Table : `admin`
- Colonne identifiant : `email`
- Colonne mot de passe : `password` (hidden — stocke le hash)
- Endpoints : `POST /auth/signup` (`{email, password}` → `{user, token}`),
  `POST /auth/login`, `GET /auth/me`
- JWT lifetime : `30` jours (720 h) — constaté sur signup **et** login
- Claims du JWT : `iat, exp, sub, email, pid, tid` — **aucun `role`**.
  `GET /auth/me` renvoie `{id, email, created_at}` — pas de `role` non plus.
  → Le rôle est donc relu dans la table `admin` par email à chaque session.
- Créer le compte admin via le **Auth playground** (signup) avec l'email de
  `REACT_APP_ADMIN_EMAIL` et un mot de passe fort — ne pas insérer la ligne
  admin manuellement (le hash doit être généré par Forge), puis passer son
  `role` à `admin` dans l'éditeur de table.

## 3. Middlewares (onglet **Middlewares**)
- **CORS** : activer pour l'origine du site (ex: `http://localhost:3000`).
- **require_auth** (optionnel) : `{ "claims_equals": { "role": "admin" } }`.
  ⚠️ Le middleware s'applique au projet entier : s'il bloque aussi les
  lectures publiques (profile, projects, videos…), laisse-le désactivé et
  protège uniquement les écritures côté client via le JWT (déjà en place).
  Le site public reste fonctionnel dans les deux cas.

## 4. Clés (onglet **API**)
Renseigner dans `.env` :
```
REACT_APP_FORGE_PROJECT_KEY=<project-key>
REACT_APP_FORGE_API_KEY=<api-key>
```
Puis `npm run build` ou redémarrer le serveur de dev.

## 5. Seed
- **Self-hosted (fgc)** : `forge/import.sql` crée les tables ET insère les données :
  `psql "$FORGE_DATABASE_URL" -f forge/import.sql`
- **Hébergé (Playground `/sql`)** : les `CREATE TABLE` peuvent être rejetés —
  créer les tables via l'éditeur Schema (section 1), puis exécuter les INSERT
  de `forge/seed.sql` (ou la section INSERT de `forge/import.sql`).