---
name: extract-from-nextjs
description: Use when extracting migration source data from a local Next.js App Router repository before rebuilding the site in Astro.
---

# Extract from Next.js (Local Repo) — Procedure

## Scope

This skill extracts migration facts from the local repository only (no web scraping).

Source directories to inspect:
- `app/`
- `components/`
- `src/styles/`
- `public/`

## Goal

Produce a decision-ready extraction package for Astro migration with verified values only:
- Routes + source file + H1 + metadata description
- Header navigation order
- Footer links
- CSS design tokens (`--*`) and font families
- Component map (role + usage)
- Image map (used vs unused)
- Migration pitfalls specific to Next.js static export

## Mandatory checklist before finalizing extraction

- [ ] All public routes are listed with source file, H1, and meta description
- [ ] Header navigation order is captured exactly
- [ ] Footer links are captured
- [ ] All `--*` tokens from styles are captured
- [ ] Fonts are captured from code
- [ ] Interactive components are mapped with usage scope
- [ ] Image map distinguishes used and non referenced files
- [ ] No values were invented

## Required deliverables

1. Pages table
2. Tokens table
3. Components table
4. Images table
5. Migration pitfalls notes

## Migration pitfalls to record

- Next.js `basePath` handling can break Astro routes/assets if copied blindly.
- Preserve trailing slash policy for internal links.
- Preserve SEO fields (`title`, `description`, `canonical`) from source metadata.
- Preserve runtime interactions (mobile menu, active links, smooth-scroll, back-to-top, embeds).

## Output quality rule

If any route/token/link/image usage is uncertain, mark it explicitly as uncertain and include the exact file to verify. Do not guess.
