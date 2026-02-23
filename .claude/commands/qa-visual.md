---
description: Lance la QA visuelle entre le preview Astro et les screenshots du site source
argument-hint: [page]
---

# Commande /qa-visual

## Comportement

1. **Détecter l'URL preview**
   - Vérifier si `localhost:4321` répond (serveur Astro dev)
   - Sinon, vérifier `.claude/site-migration.local.md` pour une URL CF preview
   - Si aucun : demander "Où tourne votre preview Astro ?"

2. **Déterminer le périmètre**
   - Si argument `page` fourni → tester cette page uniquement
   - Si pas d'argument → tester toutes les pages P0 de `.claude/site-migration.local.md`
   - Fallback pages P0 : home, en

3. **Vérifier les screenshots de référence**
   - Vérifier que `screenshots/[source-type]/` existe
   - Si absent : "Screenshots de référence introuvables. Lancer `/extract` d'abord."

4. **Dispatcher la QA**
   - Annoncer : "Lancement QA visuelle pour **[page ou 'toutes les pages P0']**..."
   - Dispatcher l'agent `visual-qa` avec :
     - `preview_url` : URL preview détectée
     - `page` : page demandée ou "all"
     - `reference_dir` : `screenshots/[source-type]/`

5. **Afficher les résultats**
   - Si zéro BLOCKING et zéro MAJOR : "Toutes les pages passent la QA. Prêt pour `cloudflare-deploy`."
   - Si issues : "N issues bloquants. Voir qa-report-[date].md pour les détails."

## Exemples

```
/qa-visual           ← teste toutes les pages P0
/qa-visual home      ← teste la homepage uniquement
/qa-visual en        ← teste la page EN uniquement
```
