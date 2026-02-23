---
name: cloudflare-deploy
description: Use when deploying the migrated Astro site to Cloudflare Pages. Covers build configuration, custom domain setup, branch conventions, smoke tests, and rollback procedures.
---

# Cloudflare Deploy — Guide de déploiement

## Prérequis

- Compte Cloudflare avec accès Pages
- Repository Git poussé sur GitHub ou GitLab
- `npm run build` réussit localement sans erreur
- Toutes les pages P0 passent `/qa-visual` (zéro issue BLOCKING)

## Étape 1 : Créer le projet Cloudflare Pages

Dashboard Cloudflare → Pages → Create a project → Connect to Git :

| Paramètre | Valeur |
|-----------|--------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (laisser vide sauf monorepo) |
| Node.js version | 20.x |

Ajouter si nécessaire : `NODE_VERSION=20`

## Étape 2 : Conventions de branches

| Branche | Environnement CF | URL |
|---------|-----------------|-----|
| `main` | Production | `[projet].pages.dev` puis domaine custom |
| `dev` | Preview | `dev.[projet].pages.dev` |
| `feature/*` | Preview isolé | `[hash].[projet].pages.dev` |

**Ne jamais pousser du code non testé sur `main`.** Valider sur `dev` d'abord.

## Étape 3 : Setup domaine custom

Pages → Custom domains → Add custom domain :
1. Ajouter `[domaine-client.com]`
2. Cloudflare génère : `CNAME [domaine-client.com] → [projet].pages.dev`
3. Si domaine sur DNS Cloudflare : automatique
4. Si domaine ailleurs : suivre les instructions DNS de Cloudflare

Vérifier `.claude/site-migration.local.md` pour `target_url` et les notes DNS.

**Note AEGEE :** vérifier la zone DNS du domaine avant bascule production.

## Étape 4 : Checklist pré-déploiement

- [ ] `npm run build` — zéro erreur
- [ ] Toutes les pages P0 passent `/qa-visual`
- [ ] `robots.txt` — ne bloque pas les crawlers
- [ ] `sitemap.xml` — généré et accessible
- [ ] Open Graph meta tags — présents sur toutes les pages P0
- [ ] Slot Google Analytics — configuré (même si ga4Id vide)
- [ ] Formulaires — gèrent l'échec gracieusement (visuel uniquement v1)
- [ ] Toutes les images chargent (aucun 404)
- [ ] HTTPS fonctionne sur le domaine custom

## Étape 5 : Smoke tests (post-déploiement)

```bash
BASE="https://aegeetoulouse.com"  # adapter au target_url

curl -I $BASE/                  # 200
curl -I $BASE/en/                # 200
curl -I # one-page: sections via anchors on / and /en/
curl -I # no dedicated route for partners: section on homepage
curl -I # contact is an in-page section
curl -I # events are in-page sections
curl -I # no dedicated legal page in current AEGEE scope
curl -I # no CGV route in current AEGEE scope
curl -I $BASE/sitemap.xml       # 200
```

## Étape 6 : Procédures de rollback

### Option 1 — Cloudflare Dashboard (< 1 min)
Pages → Deployments → déploiement précédent → Rollback

### Option 2 — Fallback DNS
Restaurer le dernier déploiement stable Cloudflare Pages ou revenir au commit précédent.

### Option 3 — Git revert
```bash
git revert HEAD
git push origin main
# Cloudflare déploie automatiquement
```

## Monitoring post-lancement

- Cloudflare Analytics → Web Analytics (sans cookies)
- Cloudflare Pages → Deployments → logs de build
