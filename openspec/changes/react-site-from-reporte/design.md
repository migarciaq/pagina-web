# Design: React CV Site from Reporte.pdf

## Technical Approach

Vite + React SPA served at `https://migarciaq.github.io/pagina-web/`. `App.jsx` is the
only container: it imports the single redacted data module `src/data/cv.js` and passes
slices as props to pure presentational sections. Design tokens are ported verbatim as
global CSS; per-component rules become CSS Modules. PII is guarded twice — a unit test
over the data module and a fail-closed scan of `dist/` that blocks the deploy.

## Architecture Decisions

| Decision | Choice | Rejected | Rationale |
|---|---|---|---|
| Data ownership | `App.jsx` imports `src/data/cv.js`; sections take props | Each section imports the data module | One import edge makes the redaction boundary auditable; sections test with fixtures |
| Styling | `styles/tokens.css` + `styles/global.css` global, `*.module.css` per component | Port `styles.css` wholesale; Tailwind; CSS-in-JS | Tokens are a design system (must stay global); CSS Modules are Vite zero-config and kill the BEM name collisions |
| PII guard target | `dist/` output (blocking) + data-module unit test | Source-only scan | `dist/` is what ships; it also catches copy hardcoded in JSX, which is the real boundary breach |
| Guard rule form | Regex patterns in `scripts/pii-rules.mjs` | Literal forbidden strings in the test | A literal cedula/address in a **public** repo is itself the leak |
| Test config | One `vite.config.js` with a `test` block; guard as a Node CLI | Second `vitest.config.js`; Vitest `projects` | Research S5 pattern; the CLI needs no Vitest version-specific API and runs post-build |
| Interactions | `useScrollSpy` / `useScrollReveal` hooks wrapping IntersectionObserver | Port the IIFE verbatim | React owns the DOM; hooks give observer cleanup on unmount |
| Deploy shape | Two jobs (`build`, `deploy`), actions pinned by SHA | Single job; bare `@v5` tags | Standard Pages pattern; SHA pinning per research claim 5 |

## Project Structure

```
src/
  main.jsx  App.jsx  App.module.css
  data/cv.js            # redaction boundary: only publishable fields
  data/navigation.js    # section id/label pairs (no PII)
  styles/tokens.css     # :root custom properties ported verbatim
  styles/global.css     # reset, base, skip-link, focus-visible, .container
  components/layout/    SkipLink.jsx Header.jsx Footer.jsx
  components/sections/  Perfil.jsx Formacion.jsx ExperienciaLaboral.jsx
                        Habilidades.jsx Contacto.jsx
  components/ui/        Section.jsx Card.jsx Tag.jsx TimelineItem.jsx
  hooks/                useScrollSpy.js useScrollReveal.js
  test/setup.js         # jest-dom, IntersectionObserver + matchMedia stubs
scripts/pii-rules.mjs  scripts/pii-guard.mjs
index.html  vite.config.js  .github/workflows/deploy.yml
```

## Interfaces / Contracts

```js
// src/data/cv.js — publishable fields only. No cedula, street address,
// exact birth date, tarjeta profesional, or phone numbers.
export const cv = {
  perfil:      { nombre, titular, ubicacion /* city only */, email, resumen },
  formacion:   [{ titulo, institucion, periodo, estado }],
  experiencia: [{ cargo, organizacion, periodo, sector, descripcion }],
  habilidades: [{ categoria, items: [] }],
  contacto:    { email, ubicacion },
};
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: '/pagina-web/',
  plugins: [react()],
  test: { environment: 'jsdom', globals: true,
          setupFiles: './src/test/setup.js',
          include: ['src/**/*.test.{js,jsx}'] },
});
```

```js
// scripts/pii-rules.mjs — patterns, never literals. 4-digit years unmatched.
export const PII_PATTERNS = [
  { id: 'national-id',       re: /\b\d{7,11}\b/g },
  { id: 'professional-card', re: /\b\d{5,7}-\d{6,8}\b/g },
  { id: 'street-address',    re: /\b(?:calle|cll|carrera|cra|kr|diagonal|transversal|avenida|av)\.?\s*\d+/gi },
  { id: 'exact-date',        re: /\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/g },
];
```

`scripts/pii-guard.mjs <dir>`: walks recursively, decodes every file as UTF-8 except a
known-binary extension allowlist (`.png .jpg .jpeg .webp .ico .woff .woff2`), applies the
patterns, prints `file:line:ruleId`, and exits 1 on any match **or on zero files scanned**.

`package.json` scripts: `dev: vite`, `build: vite build`, `preview: vite preview`,
`test: vitest run`, `test:watch: vitest`, `guard:pii: node scripts/pii-guard.mjs dist`.

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<SHA>              # v7.0.0
      - uses: actions/setup-node@<SHA>            # v7.0.0
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm run guard:pii                    # blocks deploy on PII
      - uses: actions/configure-pages@<SHA>       # v6.0.0
      - uses: actions/upload-pages-artifact@<SHA> # v5.0.0
        with: { path: ./dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@<SHA>          # v5.0.1
```

`<SHA>` placeholders MUST be resolved at apply time (`gh api repos/<owner>/<repo>/git/ref/tags/<tag>`);
never invent a hash. Repo setting required: Settings → Pages → Source = "GitHub Actions".

## Data Flow

    cv.js ──→ App.jsx ──props──→ Perfil / Formacion / Experiencia / Habilidades / Contacto
                 │                              ▲
    navigation.js┴→ Header ──useScrollSpy───────┘   (IntersectionObserver)
    vite build ──→ dist/ ──guard:pii──→ upload-pages-artifact ──→ deploy-pages

## File Changes

| File | Action | Description |
|---|---|---|
| `index.html`, `styles.css`, `script.js` | Delete/Replace | Root `index.html` becomes the Vite entry; tokens move to `src/styles/` |
| `package.json`, `vite.config.js` | Create | Scaffold, `base: '/pagina-web/'`, Vitest block |
| `src/**` | Create | Shell, 5 sections, `data/cv.js`, hooks, tests |
| `scripts/pii-*.mjs` | Create | Shared rules + fail-closed `dist/` guard |
| `.github/workflows/deploy.yml` | Create | Test → build → guard → Pages deploy |
| `openspec/config.yaml` | Modify | `strict_tdd: true`, `stack: vite-react`, `test_command: npm test`, `build_command: npm run build` |
| `Reporte.pdf` | Unchanged | Local source only; add to `.gitignore` so it is never pushed |

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Unit | `cv.js` carries no PII pattern | Apply `PII_PATTERNS` to `JSON.stringify(cv)` — RED first |
| Unit | Hooks, `Contacto` mailto href | Vitest + RTL with stubbed IntersectionObserver |
| Component | Each section renders its fixture props (headings, counts, a11y roles) | RTL `render` with fixtures, not real CV data |
| Integration | `App` renders 5 landmark sections and nav anchors matching section ids | RTL over `<App />` |
| Build guard | No PII pattern anywhere in `dist/`; unknown extensions are scanned, not skipped | `npm run guard:pii` in CI after build |

## Threat Matrix

| Boundary | Applicability | Design response | Planned RED tests |
|---|---|---|---|
| Documentation-like paths | **Applicable** — the guard classifies `dist/` files by extension | Fail-closed: scan everything text-decodable, skip only the binary allowlist, exit 1 when zero files scanned | Guard flags a planted pattern in `.txt`, `.json`, `.webmanifest`, `.svg`; guard exits 1 on an empty/missing dir |
| Git repository selection | N/A — no `git -C` or repo-selection logic authored |  |  |
| Commit state | N/A — no commit automation |  |  |
| Push state | N/A — deploy is `deploy-pages`, not a git push |  |  |
| PR commands | N/A — no PR automation |  |  |

## Migration / Rollout

Commit the vanilla site first (rollback point; repo has no commits). Then apply in the
proposal's `auto-chain` slices: scaffold+tests → shell → content → deploy. Expect a
transiently stale `index.html` from the Pages CDN (~10 min `max-age`) after a deploy —
documented CDN behavior, not a build defect; do not debug it.

## Open Questions

- [ ] Action commit SHAs are unresolved by design — apply phase must pin them.
- [ ] Node major for `setup-node` assumed `22` (LTS); confirm against the local toolchain.
- [ ] Vite hashed asset names are 8 chars; an all-digit hash would false-positive the
      `national-id` rule (~1e-6 per asset). Accepted; escape hatch is a filename-context skip.
