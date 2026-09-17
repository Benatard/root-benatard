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
| colonne | type |
|---------|------|
| modules | json |

> `modules` est un tableau de modules de formation. Chaque module :
> `{ "id", "title", "description", "lessons": [ ... ] }`.
> Chaque leçon d'un module :
> `{ "id", "title", "url", "embedUrl", "content" }` —
> `url` = lien de la vidéo (YouTube, Google Drive, Vimeo ou Dailymotion),
> `embedUrl` = URL d'iframe générée par le site, `content` = récapitulatif
> écrit de la leçon. La progression des apprenants est stockée côté visiteur
> dans le localStorage (clé `lms_progress`), pas en base.

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

> Création : `forge/gallery.sql` (self-hosted) ou éditeur Schema. Le carrousel
> est affiché sur `/galerie` et en version compacte sur l'accueil ; les photos
> se gèrent dans `/admin` → onglet **Galerie**.

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

### `admin` — table d'authentification (end-user auth)
| colonne  | type   | option        |
|----------|--------|---------------|
| email    | text   | identifiant   |
| password | text   | **hidden**    |
| role     | text   | (ex: "admin") |

## 2. Auth (onglet **Auth**)
- Table : `admin`
- Colonne identifiant : `email`
- Colonne mot de passe : `password` (hidden — stocke le hash)
- JWT lifetime : `12` heures
- Créer le compte admin via le **Auth playground** (signup) avec l'email de
  `REACT_APP_ADMIN_EMAIL` et un mot de passe fort — ne pas insérer la ligne
  admin manuellement (le hash doit être généré par Forge).

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