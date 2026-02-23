---
name: build-astro-site
description: Use when building Astro pages/components for the AEGEE Toulouse migration, while preserving content, SEO, tokens, and interactions.
---

# Build Astro Site — AEGEE Toulouse (Static HTML → Astro)

## Source de vérité obligatoire

Avant toute implémentation Astro, lire:
- `.claude/site-migration.local.md`
- `src/pages/`
- `src/layouts/BaseLayout.astro`
- `src/content/`
- `styles/tokens.css`
- `public/scripts/`

## Contexte projet (fixe)

- Source: HTML/CSS/JS statique
- Cible: Astro 5 (statique)
- Déploiement cible: Cloudflare Pages
- Langue par défaut: français (`fr`)

## Pages P0 à migrer (ordre QA/navigation)

1. `/` → `index.html` → H1 `AEGEE Toulouse`
2. `/en/` → `en/index.html` → H1 `AEGEE Toulouse`

## Règles migration AEGEE

### R1 — Fidélité contenu stricte
- Conserver tous les textes, l'ordre des sections, les CTA, les ancres et les liens.
- Ne pas supprimer de bloc sans justification explicite.

### R2 — Fidélité SEO stricte
- Conserver par page: `title`, `description`, `canonical`.
- Conserver les balises OG/Twitter.

### R3 — Tokens d'abord
- Utiliser les tokens de `styles/tokens.css`.
- Éviter les valeurs hardcodées quand un token existe.

### R4 — Assets et chemins
- En Astro, servir les assets depuis `public/`.
- Utiliser des chemins absolus cohérents (`/images/...`, `/scripts/...`, `/site.css`).

### R5 — Préserver les interactions JS
Reproduire les comportements utilisateur:
- menu mobile (ouverture/fermeture + ESC + overlay)
- liens nav actifs et smooth-scroll
- effets reveal/ripple
- bouton retour haut
- scripts d'embed (Tally)

## Navigation et footer à reproduire

Header:
- Accueil
- Événements
- Partenaires
- Projets
- Contact
- Switch langue FR/EN

Footer:
- Liens sections et réseaux
- Texte légal actuel
- Bouton retour haut

## Définition de terminé (Definition of Done)

Une page est terminée seulement si:
- contenu complet présent dans le bon ordre
- images correctes et affichées
- metadata (`title`, `description`, `canonical`) correcte
- ancres et liens internes fonctionnels
- interactions JS attendues préservées

## Checklist d’implémentation

- [ ] Route Astro créée pour chaque page P0
- [ ] H1 identique à la source
- [ ] Meta description identique à la source
- [ ] Canonical défini
- [ ] Header/Footer conformes à la source
- [ ] Tokens respectés
- [ ] Interactions critiques reproduites
- [ ] Aucun placeholder/Lorem/texte inventé
