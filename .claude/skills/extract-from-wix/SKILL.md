---
name: extract-from-wix
description: Use when extracting content from a Wix site to prepare for Astro migration. Guides systematic capture of text, images, CSS tokens, and screenshots using Playwright MCP.
---

# Extract from Wix — Procédure d'extraction

## Prérequis

- Plugin Playwright MCP installé et actif
- Accès réseau au site Wix source
- Répertoire de sortie = répertoire courant du projet

## Pages à extraire (ordre de priorité)

| Priorité | Slug | Chemin URL |
|----------|------|-----------|
| P0 | home | `/` |
| P0 | evenements | `/` (ancre `#evenements`) |
| P0 | partenaires | `/` (ancre `#partenaires`) |
| P0 | projets | `/` (ancre `#projets`) |
| P1 | actualites | `/actualites` |
| P1 | contact | `/contact` |
| P1 | home-en | `/en/` |
| P1 | contact | `/` (ancre `#contact`) |

Vérifier `.claude/site-migration.local.md` section `## Pages P0` pour la liste réelle si différente.

## Étape 1 : Screenshots (pour chaque page)

Pour chaque page, capturer deux viewports :

```javascript
// Desktop (1440×900)
await page.setViewportSize({ width: 1440, height: 900 })
await page.goto(PAGE_URL)
await page.waitForLoadState('networkidle')
// Scroller pour déclencher le lazy-loading
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(1000)
await page.screenshot({
  path: 'screenshots/wix/[slug]-desktop.png',
  fullPage: true
})

// Mobile (375×812)
await page.setViewportSize({ width: 375, height: 812 })
await page.screenshot({
  path: 'screenshots/wix/[slug]-mobile.png',
  fullPage: true
})
```

Sauvegarder dans : `screenshots/wix/[slug]-desktop.png` et `screenshots/wix/[slug]-mobile.png`

## Étape 2 : Design Tokens CSS

Naviguer vers la page d'accueil et extraire toutes les variables CSS custom :

```javascript
await page.goto(SOURCE_URL)
await page.waitForLoadState('networkidle')

const tokens = await page.evaluate(() => {
  const style = getComputedStyle(document.documentElement)
  const result = { colors: {}, fonts: {} }

  // Wix stocke les design tokens comme --color_N
  for (let i = 0; i <= 40; i++) {
    const colorVal = style.getPropertyValue(`--color_${i}`).trim()
    if (colorVal) result.colors[`--color_${i}`] = colorVal
  }

  // Polices : capturer les valeurs computées sur les éléments typiques
  const h1 = document.querySelector('h1')
  const p = document.querySelector('p')
  if (h1) result.fonts.heading = getComputedStyle(h1).fontFamily
  if (p) result.fonts.body = getComputedStyle(p).fontFamily

  return result
})
```

Sauvegarder dans `tokens-wix.json` :

```json
{
  "colors": {
    "--color_1": "#FFFFFF",
    "--color_11": "#2C4A1E",
    "--color_15": "#8B6914"
  },
  "fonts": {
    "heading": "\"Madefor\", sans-serif",
    "body": "\"Madefor\", sans-serif"
  }
}
```

## Étape 3 : Contenu textuel (page par page)

Pour chaque page, extraire le texte visible :

```javascript
const textContent = await page.evaluate(() => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement
        if (!parent) return NodeFilter.FILTER_REJECT
        const tag = parent.tagName.toLowerCase()
        if (['script', 'style', 'noscript'].includes(tag)) return NodeFilter.FILTER_REJECT
        const style = getComputedStyle(parent)
        if (style.display === 'none' || style.visibility === 'hidden') return NodeFilter.FILTER_REJECT
        const text = node.textContent.trim()
        if (text.length < 3) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      }
    }
  )
  const texts = []
  let node
  while (node = walker.nextNode()) {
    texts.push(node.textContent.trim())
  }
  return texts
})
```

Organiser dans `EXTRAITS.md` :

```markdown
# Extraits de contenu — [Nom du projet]

> Source: [SOURCE_URL] | Date: [YYYY-MM-DD]

### Page: Accueil (/)

### Hero
[texte capturé]

### Section 2
[texte capturé]

### Page: Événements (/ #evenements)
[...]
```

## Étape 4 : Images produits

Les images Wix suivent ce pattern : `https://static.wixstatic.com/media/[hash]_*.jpg`

```javascript
const images = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('img[src*="wixstatic.com"]'))
    .map(img => ({
      src: img.src.split('~')[0],  // supprimer les params de resize
      alt: img.alt,
      width: img.naturalWidth,
      height: img.naturalHeight
    }))
})
```

Télécharger chaque image vers `assets-wix/[slug-name].[ext]` avec WebFetch.

## Étape 5 : Catalogue contenu (sections projets/partenaires)

```javascript
const products = await page.evaluate(() => {
  // Essayer JSON-LD en premier
  const jsonLd = document.querySelector('script[type="application/ld+json"]')
  if (jsonLd) {
    try { return JSON.parse(jsonLd.textContent) } catch(e) {}
  }
  // Fallback : extraction DOM Wix Stores
  return Array.from(document.querySelectorAll('[data-hook="product-item"]'))
    .map(el => ({
      name: el.querySelector('[data-hook="product-item-name"]')?.textContent?.trim(),
      price: el.querySelector('[data-hook="product-item-price-to-pay"]')?.textContent?.trim(),
      image: el.querySelector('img')?.src?.split('~')[0],
      href: el.querySelector('a')?.href,
    }))
    .map(p => ({
      ...p,
      id: (p.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      currency: 'EUR',
      description: '',
      category: '',
    }))
})
```

Sauvegarder dans `produits.json` :

```json
[
  {
    "id": "cuvee-terroir",
    "name": "Cuvée Terroir",
    "price": "12.50",
    "currency": "EUR",
    "image": "assets-wix/cuvee-terroir.jpg",
    "description": "",
    "category": "rouge"
  }
]
```

## Livrables attendus

Après extraction, ces fichiers doivent exister :

- [ ] `screenshots/wix/home-desktop.png`
- [ ] `screenshots/wix/home-mobile.png`
- [ ] `screenshots/wix/evenements-desktop.png`
- [ ] `screenshots/wix/evenements-mobile.png`
- [ ] (... une paire par page P0)
- [ ] `tokens-wix.json` (couleurs + polices)
- [ ] `EXTRAITS.md` (tout le texte par page)
- [ ] `produits.json` (catalogue)
- [ ] `assets-wix/` (images téléchargées)

## Dépannage

**Images lazy-loadées non capturées :**
→ Scroller avant screenshot : `await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))`

**Overlay cookie consent :**
→ `await page.click('[data-testid="consent-banner-decline-button"]')` ou similaire

**CSS vars retournent vide :**
→ Wix peut inliner les styles — essayer `document.querySelector('[style*="--color"]')` pour trouver les vars inline

**Wix storefront nécessite login :**
→ Utiliser l'URL `/preview` si disponible, sinon noter l'étape manuelle dans `EXTRAITS.md`
