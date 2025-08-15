# 🏗️ Architecture AEGEE Toulouse - Sources de Vérité

## 📋 Vue d'ensemble

Ce document définit les responsabilités et sources de vérité pour chaque composant du projet AEGEE Toulouse après refactorisation.

## 🎨 CSS - Sources de Vérité

### **Variables et Configuration**
- **Fichier :** `styles/variables.css` 
- **Responsabilité :** TOUTES les variables CSS (couleurs, espacements, polices, transitions)
- **Règle :** Modification uniquement dans ce fichier

### **Styles de Base**
- **Fichier :** `styles/main.css`
- **Responsabilité :** Reset CSS, typographie de base, utilitaires généraux
- **Contenu :** Body, headings, liens, focus states

### **Système de Mise en Page**
- **Fichier :** `styles/layout.css` ⭐ **NOUVEAU**
- **Responsabilité :** Grilles, containers, utilitaires de layout
- **Contenu :** `.grid`, `.flex`, `.container`, responsive grid

### **Utilitaires**
- **Fichier :** `styles/utilities.css`
- **Responsabilité :** Classes utilitaires (spacing, couleurs, texte)
- **Contenu :** `.mt-*`, `.bg-*`, `.text-*`, `.section--padded`

### **Effets et Animations**
- **Fichier :** `styles/effects.css`
- **Responsabilité :** TOUTES les animations, transitions, effets visuels
- **Contenu :** `@keyframes`, `.animate-on-scroll`, `.ripple-effect`, `.lazy`

### **Composants UI**

#### Boutons
- **Fichier :** `styles/buttons.css`
- **Responsabilité :** TOUS les styles de boutons
- **Contenu :** `.btn`, `.btn--primary`, `.btn--hero`, variants

#### Header
- **Fichier :** `styles/header.css`
- **Responsabilité :** Header principal, logo, navigation desktop
- **Contenu :** `.header`, `.nav`, `.logo`

#### Composants Interactifs
- **Fichier :** `styles/components.css`
- **Responsabilité :** Top-bar, menu mobile, éléments interactifs
- **Contenu :** `.top-bar`, `.mobile-menu`, `.social-link`

#### Hero Section
- **Fichier :** `styles/hero.css`
- **Responsabilité :** Section hero uniquement
- **Contenu :** `.hero`, `.hero__title`, `.hero__actions`

#### Cartes et Conteneurs
- **Fichier :** `styles/cards.css`
- **Responsabilité :** Système de cartes, contenus texte/média
- **Contenu :** `.card`, `.text-content`, `.media-content`

#### Footer
- **Fichier :** `styles/footer.css`
- **Responsabilité :** Footer et éléments associés
- **Contenu :** `.site-footer`, `.back-to-top`

### **Responsive Design**
- **Fichier :** `styles/responsive.css`
- **Responsabilité :** Media queries globales, adaptations mobile
- **Contenu :** Breakpoints, adaptations cross-composants

## 🔧 JavaScript - Sources de Vérité

### **Utilitaires Partagés**
- **Fichier :** `scripts/utils.js`
- **Responsabilité :** TOUS les utilitaires réutilisables
- **API :** `window.AEGEEUtils`
- **Contenu :** `debounce`, `throttle`, `AnimationManager`, `RippleManager`

### **Application Principale**
- **Fichier :** `scripts/main.js`
- **Responsabilité :** Initialisation, navigation, gestion d'état
- **API :** `window.AEGEEApp`
- **Contenu :** Configuration, scroll spy, langue, état global

### **Composants UI**
- **Fichier :** `scripts/components.js`
- **Responsabilité :** Logique des composants interactifs
- **Dépendances :** `window.AEGEEApp`, `window.AEGEEUtils`
- **Contenu :** Menu mobile, smooth scroll, accessibilité

## 📜 Règles Strictes

### ❌ **INTERDICTIONS**

1. **CSS dans JavaScript**
   - ❌ JAMAIS d'injection de styles via `createElement('style')`
   - ❌ JAMAIS de styles inline dans JS

2. **Duplication de Code**
   - ❌ JAMAIS de fonction utilitaire dupliquée
   - ❌ JAMAIS de variable CSS redéfinie
   - ❌ JAMAIS de grille définie dans plusieurs fichiers

3. **Responsabilités Croisées**
   - ❌ PAS de styles de boutons hors de `buttons.css`
   - ❌ PAS d'animations hors de `effects.css`
   - ❌ PAS de grilles hors de `layout.css`

### ✅ **BONNES PRATIQUES**

1. **Ajout de Nouvelles Fonctionnalités**
   ```
   Nouveau bouton → buttons.css
   Nouvelle animation → effects.css  
   Nouveau layout → layout.css
   Nouvel utilitaire → utils.js
   ```

2. **Ordre de Chargement CSS** (RESPECT OBLIGATOIRE)
   ```html
   1. variables.css (base)
   2. main.css (reset + typo)
   3. utilities.css (utilitaires)
   4. layout.css (grilles + layout)
   5. effects.css (animations)
   6. [composants].css (header, buttons, etc.)
   7. responsive.css (media queries)
   ```

3. **Dépendances JavaScript**
   ```
   utils.js → chargé en premier
   main.js → utilise AEGEEUtils
   components.js → utilise AEGEEApp + AEGEEUtils
   ```

## 🔍 Comment Identifier les Violations

### **Signes d'Alerte**
- Code CSS dans un fichier JS
- Même classe définie dans 2+ fichiers CSS
- Fonction avec même nom dans 2+ fichiers JS
- Styles inline dans HTML (`style="..."`)

### **Outils de Validation**
```bash
# Rechercher duplications CSS
grep -r "\.grid {" styles/
grep -r "\.btn {" styles/

# Rechercher injections CSS
grep -r "createElement.*style" scripts/
grep -r "innerHTML.*<style" scripts/

# Rechercher fonctions dupliquées  
grep -r "function debounce" scripts/
```

## 🚀 Workflow de Développement

### **Ajout d'un Nouveau Composant**
1. Identifier la responsabilité (bouton/layout/animation/etc.)
2. Modifier le fichier source de vérité approprié
3. Tester sur toutes les tailles d'écran
4. Vérifier qu'aucune duplication n'a été créée

### **Modification d'un Style Existant**
1. Identifier le fichier source de vérité
2. Modifier UNIQUEMENT dans ce fichier
3. Vérifier l'impact sur tous les composants
4. Tester responsive + accessibilité

### **Debug de Conflit CSS**
1. Vérifier l'ordre de chargement dans `index.html`
2. S'assurer qu'une seule définition existe
3. Utiliser les DevTools pour identifier la source
4. Corriger dans le fichier source de vérité

## 📊 Métriques Post-Refactorisation

### **Avant → Après**
- ❌ CSS injecté via JS → ✅ CSS statique uniquement
- ❌ `.hero` défini 2x → ✅ `hero.css` source unique
- ❌ `.grid` défini 3x → ✅ `layout.css` source unique  
- ❌ `debounce` défini 2x → ✅ `utils.js` source unique
- ❌ 150+ lignes dupliquées → ✅ 0 duplication

### **Architecture Finale**
```
styles/
├── variables.css     (variables)
├── main.css         (base + reset)
├── utilities.css    (utilitaires)
├── layout.css       (grilles + layout) ⭐ NOUVEAU
├── effects.css      (animations)
├── buttons.css      (boutons)
├── header.css       (header)
├── components.css   (composants)
├── hero.css         (hero)
├── cards.css        (cartes)
├── footer.css       (footer)
└── responsive.css   (media queries)

scripts/
├── utils.js         (utilitaires)
├── main.js          (app principale)
└── components.js    (composants UI)
```

---

**🎯 Cette architecture garantit :**
- 🔒 **Pas de duplication** - Une seule source de vérité par fonctionnalité
- 🧩 **Modularité parfaite** - Chaque fichier a une responsabilité claire
- 🚀 **Maintenance facile** - Savoir exactement où modifier chaque élément
- 📈 **Évolutivité** - Ajout simple de nouveaux composants

**⚠️ Respecter cette architecture est OBLIGATOIRE pour maintenir la qualité du code !**
