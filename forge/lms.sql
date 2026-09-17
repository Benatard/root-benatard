-- ============================================================
-- Forge — Table `lms` seule (mini-LMS : formation par modules)
--
-- À exécuter dans le Playground /sql de Forge (ou via `fgc`).
-- Ré-exécutable sans risque : id stable + ON CONFLICT DO UPDATE
-- (l'id ne change pas → l'id mémorisé dans le localStorage du
-- navigateur reste valide).
--
--   Self-hosted :  psql "$FORGE_DATABASE_URL" -f forge/lms.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS lms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modules jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- Données de démo (modules → leçons) ----------
-- ⚠️ Dans la leçon, remplacez « YOUTUBE_ID » par le vrai ID de votre
--    vidéo (ou collez un lien YouTube en gardant l'embedUrl cohérent).
-- La suite se gère depuis /admin → onglet « Formation ».
INSERT INTO lms (id, modules) VALUES (
  '99999999-9999-4999-8999-999999999999',
  '[{"id":"module-methode","title":"Ma méthode de programmation","description":"Une méthode simple et éprouvée : analyser le besoin, découper le projet en modules indépendants, puis avancer module par module avec une vérification à chaque étape. Chaque leçon combine une vidéo de démonstration et un résumé écrit.","lessons":[{"id":"lecon-1","title":"Leçon 1 — Bien définir le besoin avant de coder","url":"https://www.youtube.com/watch?v=YOUTUBE_ID","embedUrl":"https://www.youtube.com/embed/YOUTUBE_ID","content":"Bienvenue dans cette première leçon ! Elle pose la base de toute la méthode que je te partage. Elle vient directement de ma pratique quotidienne : avant d''écrire la moindre ligne de code, je prends toujours le temps de comprendre précisément ce que l''on veut construire.\n\nLa boucle de travail, étape par étape :\n\n1. Décrire le besoin en une phrase simple.\n2. Analyser ce qui existe déjà avant de modifier quoi que ce soit.\n3. Clarifier par des questions ciblées plutôt que de supposer.\n4. Découper le projet en petits modules livrables un par un.\n5. Implémenter chaque module, puis vérifier immédiatement (compiler, builder).\n6. Documenter ce qui a été fait (SQL, schéma, notes) pour ne rien perdre.\n\nC''est exactement cette boucle — besoin, analyse, clarification, plan, module, vérification, itération — que j''applique en développement, seul ou en équipe, avec ou sans l''aide d''un assistant IA. Elle t''évite d''écrire des lignes inutiles et te fait gagner un temps précieux."}]}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  modules = EXCLUDED.modules,
  updated_at = now();