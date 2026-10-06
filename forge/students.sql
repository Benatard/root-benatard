-- ============================================================
-- Forge — Apprenants de la formation (`students`)
-- Dialecte : PostgreSQL
--
-- Usage :
--   Self-hosted (fgc) :  psql "$FORGE_DATABASE_URL" -f forge/students.sql
--   Playground /sql hébergé : exécuter le CREATE TABLE + les CREATE INDEX
--   via l'éditeur Schema (onglet Tables) puis ce script pour les index.
--
-- Idempotent : ré-exécutable (IF NOT EXISTS partout).
--
-- Rôle : une ligne = une personne inscrite à la formation (/videos).
--   `progress` reprend exactement la structure de l'ancien
--   localStorage `lms_progress` :
--     { "<module-id>": { "<lesson-id>": true } }
--   ce qui permet d'ouvrir le portail sans migrer de données.
--
-- Lecture : l'onglet admin « Apprenants » (/admin → Apprenants).
-- Écriture : portail d'inscription de /videos + « Marquer comme faite ».
--
-- ⚠️ Permissions : le middleware require_auth de Forge s'applique au projet
--    entier (cf. forge/schema.md §3) et est désactivé pour laisser les
--    lectures publiques passer. La table est donc lisible par quiconque
--    possède la clé API (déjà le cas pour `messages`). Restreindre la
--    lecture de `students` dans la console Forge si l'option existe.
-- ============================================================

CREATE TABLE IF NOT EXISTS students (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text,
  email      text,
  progress   jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tri par date d'inscription (onglet admin) — ORDER BY created_at.desc
CREATE INDEX IF NOT EXISTS students_created_at_idx
  ON students (created_at DESC);

-- Un seul inscrit par email (insensible à la casse), anti-doublon au
-- moment de l'inscription. L'index est partiel : les lignes sans email
-- ne sont pas concernées.
CREATE UNIQUE INDEX IF NOT EXISTS students_email_idx
  ON students (lower(email))
  WHERE email IS NOT NULL;
