# AEGEE Toulouse - Site Web Officiel

Site web one-page moderne et responsive pour AEGEE Toulouse avec architecture CSS modulaire.

## 🏗️ Architecture CSS Moderne

### Structure des fichiers
```
styles/
├── index.css              # Point d'entrée (orchestration CSS Layers)
├── tokens.css             # Design tokens/variables
├── base.css              # Reset CSS + typographie
├── layout.css            # Grilles + containers
├── utilities.css         # Classes utilitaires + animations
├── responsive.css        # Media queries globales
├── overrides.css         # Corrections exceptionnelles
└── components/           # Composants modulaires
    ├── topbar.css        # Barre supérieure
    ├── header.css        # Header + navigation mobile
    ├── hero.css          # Section hero
    ├── cards.css         # Système de cartes
    ├── buttons.css       # Système de boutons
    └── footer.css        # Footer
```

### CSS Cascade Layers
Ordre de priorité (du plus faible au plus fort) :
1. **tokens** - Variables CSS du design system
2. **base** - Reset et typographie de base
3. **layout** - Grilles et containers
4. **components** - Composants UI
5. **utilities** - Classes utilitaires
6. **overrides** - Corrections exceptionnelles uniquement

## 📋 Règles de développement CSS

### Convention BEM stricte
**Tous les sélecteurs** doivent suivre la convention **Block__Element--Modifier** :

```css
/* ✅ Correct */
.header__nav
.nav__link
.nav__link--active
.btn--primary
.card__content
.footer__social-link

/* ❌ Interdit */
.nav .link.active
.primary-button
.card .content
```

### Classes scopées
**Éviter les classes globales** qui peuvent créer des conflits :

```css
/* ✅ Correct - Scopé par composant */
.top-bar .icon
.site-footer .icon
.mobile-nav .icon

/* ❌ Interdit - Global */
.icon { /* peut créer des conflits */ }
```

### Responsive co-localisé
Les **media queries** doivent être intégrées dans chaque composant :

```css
/* Dans components/header.css */
.header { /* styles de base */ }

@media (max-width: 991px) {
    .header { /* styles mobiles */ }
}
```

### Interdictions strictes
- ❌ **Pas de `!important`** (sauf dans `overrides.css` avec justification)
- ❌ **Pas de duplication** de sélecteurs
- ❌ **Pas de classes globales** non scopées
- ❌ **Pas de modification directe** de `site.css`

## 🛠️ Build System PostCSS

### Installation
```bash
npm install
```

### Commandes disponibles
```bash
npm run build          # Build de production
npm run watch           # Surveillance des fichiers
npm run build:verbose   # Build avec logs détaillés
```

### Workflow de développement
1. **Modifier** les fichiers CSS dans `styles/` (jamais `site.css` directement)
2. **Lancer** `npm run watch` pour la surveillance automatique
3. **Tester** les changements compilés dans `site.css`

## 🎨 Design System

### Couleurs
- **Primaires** : Bleu Institutionnel (#0055A4), Bleu Profond (#003366), Bleu Clair (#CCE5FF)
- **Accents** : Or Toulouse (#FFD700)
- **Grises** : Palette complète de gray-50 à gray-900

### Typographie
- **Headers** : Raleway (Medium 500, SemiBold 600, Bold 700)
  - H1: 48px Bold, H2: 32px SemiBold, H3: 24px SemiBold, H4: 18px SemiBold
- **Corps** : Open Sans (Regular 400, Medium 500)
  - Lead: 18px, Body: 16px, Small: 14px

### Espacement
- Système basé sur multiples de 4px (4px, 8px, 12px, 16px, 24px, 32px)
- Variables CSS : `--spacing-1` à `--spacing-32`

## 📝 Conventions de nommage
- **Fichiers/dossiers** : minuscules avec tirets (`hero-section.jpg`)
- **Classes CSS** : BEM strict (`.block__element--modifier`)
- **Images** : format `section-description.extension`
- **Variables CSS** : kebab-case (`--primary-color`, `--font-size-lg`)

## Structure de la page
1. Header (navigation)
2. Hero (présentation + photo)
3. Événements (iframe Billetweb)
4. À propos AEGEE (Europe/Toulouse)
5. Partenaires (cards logos)
6. Projets (ErasmusJobs, WelcomeMonths, ToulouseTips, StudyBuddies)
7. Galerie photos
8. Contact (iframe Tally)
9. Footer

## Intégrations externes
- **Événements** : Billetweb (iframe)
- **Contact** : Tally (iframe)
- **Analytics** : Configuration via interface d'administration

## 🚀 Installation et développement

### Prérequis
- Node.js (version 16+)
- npm ou yarn

### Installation
```bash
git clone [url-repository]
cd aegee-toulouse-website
npm install
```

### Développement
1. **CSS** : `npm run watch` (surveillance automatique)
2. **HTML** : Ouvrir `index.html` avec Live Server (VS Code)
3. **Modifications** : Éditer uniquement les fichiers dans `styles/`

### Structure de fichiers CSS
- **NE JAMAIS** modifier `site.css` directement
- **TOUJOURS** modifier les fichiers sources dans `styles/`
- **RESPECTER** l'ordre des CSS Layers
- **TESTER** après chaque modification

## 🔧 Maintenance et bonnes pratiques

### Ajout d'un nouveau composant
1. Créer `styles/components/nouveau-composant.css`
2. Ajouter l'import dans `styles/index.css` layer(components)
3. Utiliser la convention BEM stricte
4. Inclure les media queries dans le fichier composant

### Modification d'une variable
1. Éditer `styles/tokens.css`
2. Vérifier l'impact sur tous les composants
3. Rebuilder avec `npm run build`

### Debugging CSS
1. Utiliser `npm run build:verbose` pour les détails
2. Vérifier l'ordre des CSS Layers
3. S'assurer qu'aucun `!important` n'est ajouté par erreur

## 🌐 Déploiement
- Push sur branche `main`
- Déploiement automatique via GitHub Pages
- Domaine personnalisé configuré
- `site.css` doit être mis à jour avant chaque commit