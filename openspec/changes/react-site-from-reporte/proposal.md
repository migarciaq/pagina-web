# Proposal: React CV Site from Reporte.pdf

## Intent

The repo's site content is fictional (invented research persona, fake publications). The real source, `Reporte.pdf`, is an official DAFP "Hoja de Vida" containing PII. Replace it with a Vite + React single-page CV publishing only non-sensitive data, deployed to GitHub Pages. Success: a live Pages URL with accurate redacted content, no PII leak, and a passing test suite.

## Scope

### In Scope
- Vite + React scaffold (`package.json`, `vite.config.js`, `src/`), replacing `index.html`/`styles.css`/`script.js`.
- Vitest + @testing-library/react + jsdom; flip `strict_tdd` to `true`, `test_command: npm test`.
- Sections: Perfil / Formacion / Experiencia Laboral / Habilidades / Contacto.
- Redacted content in Spanish: name, email, degrees, institutions, job titles, employers, date ranges.
- GitHub Actions Pages workflow + `base: '/<repo>/'`.

### Out of Scope
- Publishing `Reporte.pdf` or any PDF download/embed.
- React Router / multi-page, i18n, CMS, backend or third-party form service.
- Publications/Projects section (the CV has none), teaching experience, languages table (both empty in source).
- Choosing/creating the GitHub remote (prerequisite, see Dependencies).

## Capabilities

### New Capabilities
- `cv-content`: redacted CV data model and the five content sections rendered from it.
- `site-shell`: app shell, sticky header, anchor nav, scroll-spy/reveal, skip-link, focus-visible, responsive grids.
- `pages-deployment`: Vite base path, build output, and GitHub Actions deploy to Pages.

### Modified Capabilities
- None (`openspec/specs/` is empty).

## Approach

Vite + React SPA, anchor-scroll only (avoids the Pages SPA 404 workaround). CV data lives in one module — the single redaction boundary — so a PII test asserts against it. Port the reusable CSS design tokens, sticky header/mobile nav and IntersectionObserver interactions; discard all fictional copy. Contact is a plain `mailto:` link. CI follows the Vite static-deploy guide, actions pinned by SHA.

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| PII | Redact cedula, address, birth date | User-confirmed; public Pages site |
| Language | Spanish | Matches source CV and audience |
| PDF artifact | None published | The PDF is the PII carrier |
| Visual style | Evolve existing tokens | Assessed reusable in exploration |
| Contact | `mailto:` | No backend on Pages; small personal site |
| Structure | 5 sections, no Publicaciones | CV has no publications/projects |
| Routing | Anchor scroll, no Router | Avoids Pages SPA 404 workaround |

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `index.html`, `styles.css`, `script.js` | Removed | Superseded by the React app |
| `package.json`, `vite.config.js` | New | Scaffold, `base`, Vitest config |
| `src/` | New | App shell, sections, CV data module, tests |
| `.github/workflows/deploy.yml` | New | Pages build + deploy |
| `openspec/config.yaml` | Modified | `strict_tdd: true`, stack, test command |
| `Reporte.pdf` | Unchanged | Local source only; never published |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| PII leak (cedula, address, birth date) | Med | Single data module + test asserting forbidden strings absent from build output |
| Wrong `base` → asset 404s | Med | Set `base` from the chosen repo name; verify deployed URL |
| Stale Pages CDN `index.html` (~10 min) | Med | Expected CDN behavior; document, do not debug |
| No git history yet (no rollback point) | High | Commit the vanilla site before scaffolding |
| >400 changed lines in one PR | High | `auto-chain`: slice as scaffold+tests → shell → content → deploy |

## Rollback Plan

Revert the scaffolding commit(s) to restore the vanilla site. Deployment rollback: re-run the Pages workflow from the prior commit, or set Pages Source back to "None" to unpublish.

## Dependencies

- A GitHub repo for this site must exist/be chosen (distinct from `ORC-HNN-Geothermal`), with Settings → Pages → Source = "GitHub Actions".
- Node + npm toolchain.

## Success Criteria

- [ ] Live Pages URL renders all five sections from real CV data.
- [ ] Cedula, home address, and exact birth date appear nowhere in `dist/`.
- [ ] `npm test` passes; `strict_tdd: true` in `openspec/config.yaml`.
- [ ] No fictional publications/projects copy remains.
- [ ] Contact `mailto:` opens with the published email.
