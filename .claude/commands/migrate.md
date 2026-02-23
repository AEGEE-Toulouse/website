---
description: Orchestre le workflow complet de migration vers Astro + Cloudflare Pages en 6 phases
---

# Commande /migrate — Orchestrateur de workflow

## Les 6 phases

| Phase | Nom | Livrable clé |
|-------|-----|-------------|
| 1 | Extraction contenu | EXTRAITS.md, tokens, screenshots, produits.json |
| 2 | Setup Astro | Projet initialisé, Tailwind, tokens, i18n |
| 3 | Construction pages | Toutes les pages P0+P1 en Astro |
| 4 | Population contenu | Vrai contenu, vraies images, zéro placeholder |
| 5 | QA Visuelle | Toutes les pages passent le parity check |
| 6 | Déploiement | Live sur Cloudflare Pages, DNS configuré |

## Comportement

### Première exécution (pas de fichier config)

1. Demander : source URL, Wix ou WordPress, nom du projet, URL cible
2. Créer `.claude/site-migration.local.md` avec les valeurs (phase 1)
3. Expliquer les 6 phases → demander confirmation pour démarrer Phase 1
4. Si oui : lancer `/extract [url] [type]`

### Exécutions suivantes (config présente)

1. Lire `current_phase` depuis `.claude/site-migration.local.md`
2. Afficher : "Migration **[project_name]** — Phase [N]/6 : [nom]"
3. Suggérer l'action selon la phase :
   - Phase 1 → "Lancer `/extract [source_url] [source_type]`"
   - Phase 2 → "Utiliser `superpowers:writing-plans` pour planifier le setup Astro"
   - Phase 3 → "Utiliser `superpowers:subagent-driven-development` pour construire les pages P0"
   - Phase 4 → "Peupler le contenu depuis EXTRAITS.md dans les composants"
   - Phase 5 → "Lancer `/qa-visual` pour comparer Astro vs screenshots source"
   - Phase 6 → "Suivre le skill `cloudflare-deploy`"
4. Rappeler après chaque phase : "Mettre à jour `current_phase` vers [N+1] dans `.claude/site-migration.local.md`"

## Conditions de transition

- **Phase 1 → 2 :** Toutes les pages P0 ont des screenshots + EXTRAITS.md peuplé
- **Phase 2 → 3 :** `npm run build` réussit, tokens Tailwind configurés, i18n en place
- **Phase 3 → 4 :** Toutes les pages P0 en `.astro` avec layout correct
- **Phase 4 → 5 :** Zéro "Lorem ipsum", zéro image placeholder
- **Phase 5 → 6 :** Toutes les pages P0 passent `/qa-visual` sans BLOCKING
