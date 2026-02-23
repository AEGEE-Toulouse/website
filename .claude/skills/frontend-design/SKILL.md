---
name: frontend-design
description: "Use when improving existing front-end UI in this Astro project: create/refactor components, add purposeful animations, run UI audits, and apply focused fixes. Supports strict execution when the user gives explicit instructions and guided creativity when the user asks for design ideas, while always preserving project design tokens and visual identity."
---

# Frontend Design — Localized UI Skill

## Scope

This skill is for localized UI work only.

- Allowed:
  - Create or update components
  - Refactor UI markup/classes
  - Add meaningful animations
  - Audit UI quality and apply fixes
- Not in scope by default:
  - Generating full pages from scratch

## Project stack and constraints (must follow)

- Framework: Astro 5.x
- Styling: Tailwind CSS v3.x (`tailwind.config.mjs`)
- Types: TypeScript strict
- Design tokens: use existing `brand-*`, `font-*`, spacing and shadow tokens
- Text/i18n: follow project translation pattern (`t()`) for user-facing strings
- Keep JS minimal and purposeful

If a user request conflicts with these, follow the user request and note the deviation.

## Operating modes

### 1) Strict mode (default when user is explicit)

Use this when the user provides precise UI instructions.

- Execute exactly what is requested
- Do not expand scope
- Keep visual consistency with existing design system
- Make only minimal structural changes needed to implement the request

### 2) Creative mode (when user asks for ideas/inspiration)

Use this when user intent is exploratory.

- Propose exactly 2 distinct UI directions
- Keep each direction compatible with the current visual identity
- Then implement one direction after user choice, or implement the top recommendation if asked

## Design rules

- Respect existing visual language first (colors, typography, radius, spacing, depth)
- Avoid generic UI output; keep layout and hierarchy intentional
- Every interactive element must have:
  - hover
  - focus-visible
  - active
- Do not use `transition-all`; animate only `transform` and `opacity`
- Keep animations subtle and functional (entrance, emphasis, feedback)

## Accessibility baseline

Target: WCAG 2.2 AA for edited UI areas.

Minimum checks on each change:

- Semantic structure is valid (headings/landmarks)
- Keyboard navigation works on edited components
- Focus is visible and not trapped unexpectedly
- Form controls have clear labels and states
- Text contrast is acceptable for primary content/actions
- Non-text controls have accessible names (`aria-label`/visible label)

Use `references/ui-audit-checklist.md` for quick validation.

## Standard workflow

1. Read task and detect mode: strict or creative.
2. Inspect impacted component(s) and nearby design patterns.
3. Implement localized change only.
4. Run a quick UI audit on edited surface (accessibility + consistency).
5. If issues are found, fix immediately.
6. Return concise summary:
   - what changed
   - why
   - checks performed

## Output format for UI audits

When user asks for audit/review:

- Default format: short
  - concise bullet list of findings + direct fixes
- If user asks for a detailed report:
  - Report findings first by severity:
    - Critical
    - Major
    - Minor
  - For each finding:
    - location (file/component)
    - issue
    - impact
    - concrete fix

## Mini screenshot protocol (before/after)

Use this protocol for visible UI changes.

1. Before:
   - capture screenshot of current state on impacted component/section
2. Implement change
3. After:
   - capture screenshot of updated state at same viewport
4. Quick check:
   - confirm requested change is visible
   - confirm no obvious visual regression around edited area

Preferred viewports:
- Desktop: 1440x900
- Mobile: 375x812

## Refactor guidance

- Prefer small, reversible refactors
- Preserve public component API unless user asks otherwise
- Reduce class duplication when it improves maintainability
- Keep token usage centralized and explicit
