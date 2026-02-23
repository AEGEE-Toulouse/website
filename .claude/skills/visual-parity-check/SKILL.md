---
name: visual-parity-check
description: Use when validating Astro output against the AEGEE Toulouse source to ensure content and navigation parity before Cloudflare deployment.
---

# Visual Parity Check — AEGEE QA

## Principe QA

Objectif: valider la fidélité de contenu et de structure.
Le pixel-perfect n'est pas requis.

### À valider impérativement
- textes complets et dans le bon ordre
- H1/H2/H3 cohérents
- images présentes et correctes
- navigation header/footer conforme
- liens CTA corrects
- métadonnées essentielles présentes (title/description/canonical)

### Différences visuelles tolérées
- écarts légers d'espacement
- variations mineures de typographie/rendu navigateur
- écarts de micro-animations

## Pages P0 à contrôler

1. `/`
2. `/en/`

## Navigation attendue

### Header
- `Accueil` / `Home`
- `Événements` / `Events`
- `Partenaires` / `Partners`
- `Projets` / `Projects`
- `Contact`
- Switch `FR` / `EN`

### Footer
- liens utiles présents
- réseaux sociaux présents
- texte légal présent

## Contrôles spécifiques AEGEE

### Home FR `/`
- hero présent (titre + sous-titre + CTA)
- section calendrier présente
- sections événements, partenaires, projets, contact présentes
- liens ancres internes fonctionnels

### Home EN `/en/`
- contenu traduit visible
- sections équivalentes à la version FR
- switch langue fonctionnel

## Classification des issues

| Type | Définition | Action |
|------|-----------|--------|
| BLOCKING | contenu manquant, image cassée, lien mort, ancre non fonctionnelle | corriger avant déploiement |
| CONTENT | texte incorrect/incomplet ou ordre de section non conforme | corriger avant déploiement |
| VISUAL | différence de style sans perte de contenu | documenter, non bloquant |

## Rapport QA

Créer un rapport par page:
- `qa-report-[slug]-[YYYY-MM-DD].md`

Format minimal:

```markdown
# Rapport QA — [slug] — [date]

Résultat: ✅ ACCEPTÉ / ❌ CORRECTIONS REQUISES
BLOCKING: N
CONTENT: N
VISUAL: N

## Vérifications
- [x] Header conforme
- [x] Footer conforme
- [x] H1 et sections conformes
- [ ] [Issue détectée]

## Corrections requises
1. [fichier cible] — [description]
```

## Critère de sortie

Le site est prêt pour déploiement quand:
- BLOCKING = 0
- CONTENT = 0
- VISUAL documenté si présent
