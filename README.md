## Conventions de nommage
- **Fichiers/dossiers** : minuscules avec tirets (`hero-section.jpg`)
- **Classes CSS** : BEM simplifié (`.hero__title`, `.card--highlighted`)
- **Images** : format `section-description.extension`

## Design System

### Couleurs
- **Primaires** : Bleu Institutionnel (#0055A4), Bleu Profond (#003366), Bleu Clair (#CCE5FF)
- **Accents** : Or Toulouse (#FFD700), Bleu Ciel (#87CEEB), Crème (#FFF8DC)

### Typographie
- **Headers** : Raleway (Medium 500, SemiBold 600, Bold 700)
  - H1: 48px Bold, H2: 32px SemiBold, H3: 24px SemiBold, H4: 18px SemiBold
- **Corps** : Open Sans (Regular 400, Medium 500)
  - Lead: 18px, Body: 16px, Small: 14px

### Espacement
- Système basé sur multiples de 4px (4px, 8px, 12px, 16px, 24px, 32px)

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

## Installation et développement
- Cloner le repository
- Ouvrir `index.html` avec Live Server (VS Code)
- Modifications en temps réel

## Déploiement
- Push sur branche `main`
- Déploiement automatique via GitHub Pages
- Domaine personnalisé configuré