-- ============================================================
-- Forge — Ordre d'affichage de la `gallery`
-- Dialecte : PostgreSQL
--
-- Usage :
--   Self-hosted (fgc) :  psql "$FORGE_DATABASE_URL" -f forge/gallery-order.sql
--   Playground /sql hébergé : un simple
--     ALTER TABLE gallery ADD COLUMN IF NOT EXISTS sort_order integer;
--   suffit, l'ordre en base reste celui des created_at.
--
-- Idempotent : ré-exécutable (IF NOT EXISTS, backfill limité aux NULL).
-- L'ordre actuel est conservé : le backfill reprend l'ordre d'insertion.
-- Réordonner se fait ensuite depuis /admin → Galerie (flèches).
-- ============================================================

ALTER TABLE gallery
  ADD COLUMN IF NOT EXISTS sort_order integer;

WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      ORDER BY
        created_at ASC,
        id ASC
    ) AS position
  FROM gallery
)
UPDATE gallery AS g
SET sort_order = ranked.position::integer
FROM ranked
WHERE g.id = ranked.id
  AND g.sort_order IS NULL;

ALTER TABLE gallery
  ALTER COLUMN sort_order SET DEFAULT 1;

UPDATE gallery
SET sort_order = 1
WHERE sort_order IS NULL;

ALTER TABLE gallery
  ALTER COLUMN sort_order SET NOT NULL;

CREATE INDEX IF NOT EXISTS gallery_sort_order_idx
  ON gallery (sort_order);