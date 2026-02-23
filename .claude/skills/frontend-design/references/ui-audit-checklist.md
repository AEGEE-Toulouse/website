# UI Audit Checklist (Localized Changes)

## A. Consistency with project design

- [ ] Uses existing tokens (`brand-*`, `font-*`, radius, shadows, spacing)
- [ ] Keeps established visual hierarchy (title, body, actions)
- [ ] No off-brand color/typography introduced without request

## B. Accessibility (AA target)

- [ ] Semantic HTML is appropriate for the component role
- [ ] Keyboard navigation works for edited controls
- [ ] Focus-visible state is obvious
- [ ] Interactive controls have accessible names
- [ ] Contrast is sufficient for key text and actions
- [ ] Motion does not block interaction or readability

## C. Interaction quality

- [ ] Hover/focus/active states all present on clickable elements
- [ ] No `transition-all`
- [ ] Animations use transform/opacity only
- [ ] Animations are purposeful, not decorative noise

## D. Code quality

- [ ] Change is localized to intended component(s)
- [ ] No unnecessary page-level restructuring
- [ ] Repeated class patterns simplified when reasonable
- [ ] No hardcoded user-facing text if i18n is expected

## E. Final pass

- [ ] Before screenshot captured (edited surface)
- [ ] After screenshot captured (same viewport)
- [ ] Desktop and mobile rendering still coherent
- [ ] No obvious regressions in nearby components
- [ ] Requested outcome fully implemented
