-- ============================================================
-- Forge — Table `gallery` (galerie photo + carrousel)
-- Dialecte : PostgreSQL
--
-- Usage :
--   Self-hosted (fgc) :  psql "$FORGE_DATABASE_URL" -f forge/gallery.sql
--   Playground /sql hébergé : les CREATE TABLE peuvent être rejetés
--   → créer la table via l'éditeur Schema (Forge Console → Schema)
--     avec les colonnes ci-dessous (ID uuid).
--
-- Idempotent : ré-exécutable (IF NOT EXISTS, pas de DROP).
-- Les photos de démonstration sont remplaçables depuis /admin → Galerie.
-- ============================================================

CREATE TABLE IF NOT EXISTS gallery (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image       text,
  title       text,
  caption     text,
  sort_order  integer NOT NULL DEFAULT 1,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------- Photos démo (remplaçables via /admin) ----------
INSERT INTO gallery (image, title, caption, sort_order) VALUES
  ('/images/platforms/miner-dashboard.svg', 'Plateforme Minière', 'Application de suivi pour le secteur minier.', 1),
  ('/images/platforms/afya-dashboard.svg',     'Plateforme Afya',    'Système hospitalier déployé chez Umoja Industry.', 2),
  ('/images/services/infra-it.svg',            'Infrastructure réseau', 'Câblage et connectique Hôpital CMOK / SKK.', 3),
  ('/images/services/robotics.svg',            'Robotique',          'Projet robotique — prix compétition ISIPA.', 4);