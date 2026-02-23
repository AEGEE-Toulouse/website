---
name: extract-from-wordpress
description: Use when extracting content from a WordPress or WooCommerce site to prepare for Astro migration. Prefers REST API extraction, falls back to Playwright for visual capture.
---

# Extract from WordPress — Procédure d'extraction

## Stratégie : API d'abord, Playwright ensuite

WordPress expose son contenu via REST API — plus rapide et fiable que le scraping DOM.

**Ordre de priorité :**
1. WordPress REST API → JSON structuré (préféré)
2. WooCommerce REST API → catalogue contenu (si section dédiée)
3. Playwright → screenshots + extraction visuelle (toujours nécessaire)

## Étape 1 : Tester la disponibilité de l'API

```javascript
const apiRoot = await fetch(`${SOURCE_URL}/wp-json/`)
if (apiRoot.ok) {
  // API REST disponible — utiliser cette méthode
} else {
  // Fallback vers extraction Playwright DOM
}
```

## Étape 2 : Extraire les pages via REST API

```javascript
const pagesRes = await fetch(`${SOURCE_URL}/wp-json/wp/v2/pages?per_page=100&status=published`)
const pages = await pagesRes.json()

for (const page of pages) {
  // page.slug, page.title.rendered, page.content.rendered, page.excerpt.rendered
  const textContent = page.content.rendered.replace(/<[^>]+>/g, ' ').trim()
}
```

Sauvegarder dans `EXTRAITS.md` avec le même format que `extract-from-wix`.

## Étape 3 : Extraire les articles (si blog/actualités)

```javascript
const postsRes = await fetch(`${SOURCE_URL}/wp-json/wp/v2/posts?per_page=100&status=published`)
const posts = await postsRes.json()
// posts[].title.rendered, posts[].content.rendered, posts[].date
```

## Étape 4 : Extraire les produits WooCommerce

```javascript
// Tester si WooCommerce est disponible
const wcCheck = await fetch(`${SOURCE_URL}/wp-json/wc/v3/products`)
// 200 → catalogue public accessible
// 401 → nécessite auth
// 404 → WooCommerce non installé → fallback DOM

const productsRes = await fetch(`${SOURCE_URL}/wp-json/wc/v3/products?per_page=100`)
const products = await productsRes.json()

const catalog = products.map(p => ({
  id: p.slug,
  name: p.name,
  price: p.price,
  currency: 'EUR',
  description: p.short_description.replace(/<[^>]+>/g, ''),
  image: p.images[0]?.src || '',
  category: p.categories[0]?.name || '',
}))
```

Si WooCommerce nécessite auth ou non installé → utiliser l'extraction DOM de `extract-from-wix` Étape 5.

## Étape 5 : Extraire les design tokens

WordPress n'utilise pas le système `--color_N` de Wix. Extraire via Playwright :

```javascript
const vars = {}
const patterns = ['--wp--', '--theme--', '--color-', '--font-', '--spacing-']

for (const sheet of document.styleSheets) {
  try {
    for (const rule of sheet.cssRules) {
      if (rule.selectorText === ':root') {
        for (const prop of rule.style) {
          if (patterns.some(p => prop.startsWith(p))) {
            vars[prop] = rule.style.getPropertyValue(prop).trim()
          }
        }
      }
    }
  } catch (e) {} // CORS sur stylesheets externes
}
```

Sauvegarder dans `tokens-wordpress.json` (même schema que `tokens-wix.json`).

## Étape 6 : Screenshots

Même procédure que `extract-from-wix` Étape 1 — sauvegarder dans `screenshots/wordpress/`.

## Mapping vers le format commun

| Fichier Wix | Fichier WordPress | Schema |
|-------------|------------------|--------|
| `tokens-wix.json` | `tokens-wordpress.json` | `{colors: {}, fonts: {}}` |
| `screenshots/wix/` | `screenshots/wordpress/` | PNG files |
| `EXTRAITS.md` | `EXTRAITS.md` | Même structure markdown |
| `produits.json` | `produits.json` | Même tableau JSON |
| `assets-wix/` | `assets-wordpress/` | Images téléchargées |

## Livrables attendus

- [ ] `screenshots/wordpress/[slug]-desktop.png` (toutes pages P0)
- [ ] `screenshots/wordpress/[slug]-mobile.png` (toutes pages P0)
- [ ] `tokens-wordpress.json`
- [ ] `EXTRAITS.md`
- [ ] `produits.json` (si WooCommerce)
- [ ] `assets-wordpress/` (images produits)
