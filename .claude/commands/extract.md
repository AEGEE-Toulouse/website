---
description: Lance la Phase 1 d'extraction depuis un site source (Wix ou WordPress)
argument-hint: [url] [type]
---

# Commande /extract

## Comportement

1. **Valider les arguments**
   - `url` doit commencer par `https://` — si absent, le préfixer
   - `type` doit être `wix` ou `wordpress` — si autre chose, demander clarification

2. **Vérifier une extraction existante**
   - Si `screenshots/[type]/` existe déjà dans le répertoire courant, avertir :
     > "Données d'extraction [type] trouvées dans screenshots/[type]/. Continuer et écraser ? (oui/non)"
   - Si non → "Extraction annulée. Données existantes préservées."

3. **Lire la config projet**
   - Lire `.claude/site-migration.local.md` si présent
   - Extraire `project_name` pour l'affichage (fallback vers le domaine de l'URL)

4. **Dispatcher l'extraction**
   - Annoncer : "Démarrage de l'extraction Phase 1 pour **[project_name]**..."
   - Utiliser le skill `site-migration:extract-from-wix` ou `site-migration:extract-from-wordpress` selon le type fourni
   - Passer en arguments : `source_url`, `source_type`, `output_dir` (répertoire courant)

5. **Post-extraction**
   - Afficher le rapport de complétion
   - Suggérer : "Extraction terminée. Étape suivante : lancer `superpowers:writing-plans` pour planifier la Phase 2."

## Exemples

```
/extract https://aegeetoulouse.com wix
/extract https://client-wordpress-site.com wordpress
```

**Arguments :** `$ARGUMENTS`
