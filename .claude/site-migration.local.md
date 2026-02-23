# Site Migration — AEGEE Toulouse

## Project config
- project_name: AEGEE Toulouse
- source_type: static-html
- source_framework: HTML + CSS + JS modulaire
- target_framework: Astro 5
- i18n_default_locale: fr
- deploy_target: Cloudflare Pages

## Pages P0 (must migrate first)
| Slug | Source file | H1 | Meta description |
|------|-------------|----|------------------|
| `/` | `index.html` | AEGEE Toulouse | AEGEE Toulouse - Association européenne des étudiants, événements, projets culturels et échanges internationaux à Toulouse |
| `/en/` | `en/index.html` | AEGEE Toulouse | AEGEE Toulouse - European students association, events, cultural projects, and international exchanges in Toulouse |

## Pages P1
Aucune page P1 pour ce projet.

## Design tokens (source of truth)
- Fichier source: `styles/tokens.css`
- Couleurs clés: `--primary-color`, `--dark-color`, `--accent-color`, `--light-color`, `--gray-*`
- Typographie: `--font-family-heading` (`Raleway`), `--font-family-body` (`Open Sans`)
- Espacements: `--spacing-*`
- Rayons: `--radius-*`
- Ombres: `--shadow-*`

## Component map
| Component/Bloc | File | Used on pages |
|----------------|------|---------------|
| Header + topbar + menu mobile | `src/content/fr-body.html`, `src/content/en-body.html` | `/`, `/en/` |
| Main sections (hero, événements, partenaires, projets, contact) | `src/content/fr-body.html`, `src/content/en-body.html` | `/`, `/en/` |
| Footer + back-to-top | `src/content/fr-body.html`, `src/content/en-body.html` | `/`, `/en/` |
| SEO layout | `src/layouts/BaseLayout.astro` | `/`, `/en/` |
| Runtime interactions | `public/scripts/main.js`, `public/scripts/components.js`, `public/scripts/utils.js` | `/`, `/en/` |

## Notes projet
- Les assets doivent être servis depuis `public/` (images, scripts, CSS compilé).
- Le CSS compilé cible `public/site.css`.
- Conserver les ancres one-page (`#accueil`, `#evenements`, `#partenaires`, `#projets`, `#contact`).
- Préserver le switch langue FR/EN (`/` et `/en/`).
- Préserver les scripts d'interaction et l'embed Tally.
