# Exploration: react-site-from-reporte

## Current State

`Reporte.pdf` is an official Colombian public-sector CV form ("Hoja de Vida",
Formato Unico, DAFP, Leyes 190/1995 and 489/443 1998), 5 pages, belonging to
Maria Isabel Garcia Quimbayo. Content:

1. Datos personales: full name, cedula (national ID — PII, never quoted
   literally in this repo), exact birth date and city of birth (Manizales —
   PII), exact home address in Manizales, Caldas (PII), email
   `migarciaq@unal.edu.co`.
2. Formacion academica: Bachillerato (2015); Pregrado Ingenieria Fisica
   (graduated 09/2021, tarjeta profesional number — PII, never quoted
   literally in this repo); Maestria en Ciencias - Fisica (in progress, 1
   semester).
3. Educacion informal: SENA English courses (2019); Universidad del Norte
   programming courses (2022).
4. Idiomas: table present but empty.
5. Experiencia laboral: 2021-2025 roles at Universidad Tecnologica de Pereira
   and Universidad Nacional de Colombia (sede Manizales), plus earlier private
   roles at DunderLab SAS and Comdata Colombia S.A.S.
6. Experiencia docente: empty.
7. Tiempo total de experiencia: 2y9m publico, 1y8m privado, 0 independiente,
   0 docente.
8/9. Blank signature/HR-observation fields.

No figures, charts, data tables, or narrative research content are present.

The existing site (`index.html`/`styles.css`/`script.js`) is a well-built,
accessible, dependency-free vanilla portfolio, but its narrative is fictional
(a "PINN / thermodynamic-cycle researcher" persona with fake publications and
placeholder links) and does not match the real CV. Reusable elements: the CSS
design-token system, sticky header + mobile nav, IntersectionObserver
scroll-reveal/scroll-spy, accessible skip-link/focus-visible, responsive card
grids. Not reusable: the "Proyectos & Publicaciones" narrative and body copy.

## Affected Areas

- `index.html`, `styles.css`, `script.js` — fully replaced by a React app;
  design tokens/interaction patterns may inform new components.
- `Reporte.pdf` — source content; contains PII that must be triaged before
  any public deploy.
- New (later phases): `package.json`, `vite.config.js`, `src/`,
  `.github/workflows/*.yml`.
- `openspec/config.yaml` — stack/test-runner decisions still pending
  (`strict_tdd: false`).

## Approaches Considered

1. **Vite + React** (recommended) — lightweight, fast dev/build, first-class
   static SPA output, trivial GitHub Pages `base` config, easy Vitest
   addition later. Effort: low.
2. **Create React App** — officially deprecated by the React team since
   2025-02-14 (maintenance-only, no security patches). Disqualified.
3. **Next.js static export** — overkill for a single-page CV with no
   backend; static export disables SSR/ISR/API routes with no payoff here.
   Effort: medium.

## Recommendation

Vite + React, deployed via GitHub Actions
(`actions/upload-pages-artifact` + `actions/deploy-pages`), Pages source set
to "GitHub Actions", `base: '/<repo-name>/'` in `vite.config.js`, build
output `dist/`. Single-page anchor-scroll design (no React Router) — avoids
the GitHub Pages SPA-refresh/404 workaround and fits the CV's size.

## Risks

- **PII exposure (critical, blocking)**: the PDF contains cedula, exact home
  address, and birth date. Publishing these verbatim on public GitHub Pages
  exposes sensitive personal data. Must be resolved before content ships.
- Narrative mismatch: none of the existing site's fictional copy is reusable;
  all body content must be authored fresh from the real CV data.
- No backend on GitHub Pages: the current fake contact-form submission needs
  a static-form service (e.g. Formspree) or a `mailto:` link.
- `strict_tdd` is `false` pending stack selection; sdd-design/sdd-tasks must
  select Vitest as an early task.
- Brand-new repo, no commits yet — no rollback safety net for the first
  change.

## Open Product Decisions

1. **PII handling (blocking)** — which fields are safe to publish vs. must
   be redacted/omitted (cedula, home address, exact birth date, employer
   phone numbers)?
2. Single-page anchor-scroll site (recommended) vs. multi-page/Router site.
3. Content language: Spanish vs. English vs. bilingual.
4. Offer the (possibly redacted) PDF as downloadable/embedded, or distilled
   HTML only?
5. Visual style: evolve the existing design-token system vs. a fresh
   direction.
6. Contact mechanism: real form via static-form service vs. `mailto:` link.
7. Keep a "Proyectos/Publicaciones" section, given the CV has none.

## Readiness

Conditionally ready for `sdd-propose` — blocked on decision 1 (PII handling).
Decisions 2-7 can be resolved inside `sdd-propose`/`sdd-design`.
