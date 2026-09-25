ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS sort_order integer;

WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      ORDER BY
        CASE
          WHEN year ~ '^[0-9]{4}$' THEN year::integer
          ELSE NULL
        END DESC NULLS LAST,
        created_at ASC,
        id ASC
    ) AS position
  FROM projects
)
UPDATE projects AS p
SET sort_order = ranked.position::integer
FROM ranked
WHERE p.id = ranked.id
  AND p.sort_order IS NULL;

ALTER TABLE projects
  ALTER COLUMN sort_order SET DEFAULT 1;

UPDATE projects
SET sort_order = 1
WHERE sort_order IS NULL;

ALTER TABLE projects
  ALTER COLUMN sort_order SET NOT NULL;

CREATE INDEX IF NOT EXISTS projects_sort_order_idx
  ON projects (sort_order);
