# Tasks: React CV Site from Reporte.pdf

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~900-1100 total (Phase 0+1 ~210, Phase 2 ~280, Phase 3 ~380-400, Phase 4 ~80) |
| 400-line budget risk | High (whole change); Low-Medium per sliced PR |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (baseline+scaffold+tests) → PR 2 (shell) → PR 3 (content) → PR 4 (deploy) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main (assumed — solo repo, sequential rollback points; not explicitly chosen by user, revisit if collaborators join) |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Baseline commit + Vite/Vitest scaffold + PII-guard RED tests | PR 1 | `npm test -- pii` | `npm run build && npm run guard:pii` on empty scaffold | `git revert` PR 1 commit(s); restores vanilla site |
| 2 | App shell: header, nav, skip-link, scroll hooks | PR 2 | `npm test -- App Header SkipLink` | `npm run dev`, manual scroll/keyboard check | Revert PR 2; shell removed, PR 1 scaffold intact |
| 3 | CV data module + 5 sections | PR 3 | `npm test -- Perfil Formacion Experiencia Habilidades Contacto cv.pii` | `npm run build && npm run guard:pii` | Revert PR 3; shell (PR 2) still renders empty sections |
| 4 | GitHub Actions deploy workflow | PR 4 | N/A — no unit test for CI YAML | Push to `main`, inspect Actions run + live Pages URL | Revert PR 4 or set Pages Source to "None" |

## Phase 0: Open Items & Baseline (part of PR 1)

- [x] 0.1 Resolve exact commit SHAs via `gh api repos/<owner>/<repo>/git/ref/tags/<tag>` for `actions/checkout`, `actions/setup-node`, `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`; note them for Phase 4.
- [x] 0.2 Confirm local Node major (`node --version`) against design's assumed `22` LTS; record the value to use in `setup-node`.
- [x] 0.3 Document the hashed-asset PII false-positive escape hatch (filename-context skip) as a header comment in `scripts/pii-rules.mjs`.
- [x] 0.4 Create `.gitignore` (`Reporte.pdf`, `node_modules/`, `dist/`).
- [x] 0.5 Baseline commit: `git add index.html styles.css script.js .gitignore` and commit — rollback point before scaffold replaces these files.

## Phase 1: Scaffold + Test Harness (PR 1 — scaffold+tests slice)

- [x] 1.1 Scaffold `package.json`, `vite.config.js` (`base: '/pagina-web/'`, `test` block, `environment: 'jsdom'`, `setupFiles: './src/test/setup.js'`, `include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.mjs']`).
- [x] 1.2 Add devDependencies: `vite`, `@vitejs/plugin-react`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
- [x] 1.3 Create `src/test/setup.js` (jest-dom matchers, `IntersectionObserver`/`matchMedia` stubs).
- [x] 1.4 Update `openspec/config.yaml`: `strict_tdd: true`, `stack: vite-react`, `test_command: npm test`, `build_command: npm run build`.
- [x] 1.5 RED: create `scripts/pii-rules.mjs` (regex patterns only, no literal PII) and `src/data/cv.pii.test.js` asserting `JSON.stringify(cv)` matches no `PII_PATTERNS` — fails, `src/data/cv.js` does not exist yet.
- [x] 1.6 RED: create `scripts/pii-guard.test.mjs` — guard flags a planted pattern in fixture `.txt`/`.json`/`.webmanifest`/`.svg`; guard exits 1 on an empty/missing directory.
- [x] 1.7 GREEN: implement `scripts/pii-guard.mjs` (recursive walk, UTF-8 decode except binary allowlist `.png .jpg .jpeg .webp .ico .woff .woff2`, exit 1 on match or zero files scanned) until 1.6 passes.
- [x] 1.8 Add `package.json` scripts: `dev`, `build`, `preview`, `test: vitest run`, `test:watch: vitest`, `guard:pii: node scripts/pii-guard.mjs dist`.
- [x] 1.9 Run `npm test`; confirm 1.5 fails (no `cv.js`) and 1.6 passes — RED state recorded before Phase 2/3 GREEN work.

## Phase 2: Site Shell (PR 2 — shell slice)

- [x] 2.1 RED: `src/App.test.jsx` asserting 5 landmark sections and nav anchors matching section ids — fails, no `App.jsx`.
- [x] 2.2 RED: `SkipLink.test.jsx` (focus moves to main on activation), `Header.test.jsx` (sticky class on scroll, mobile menu toggle, focus-visible).
- [x] 2.3 GREEN: `src/data/navigation.js` (section id/label pairs, no PII).
- [x] 2.4 GREEN: `src/components/layout/SkipLink.jsx`, `Header.jsx`, `Footer.jsx`.
- [x] 2.5 GREEN: `src/hooks/useScrollSpy.js`, `useScrollReveal.js` (IntersectionObserver, cleanup on unmount).
- [x] 2.6 GREEN: `src/App.jsx`, `src/main.jsx`, `src/App.module.css`; port `src/styles/tokens.css`, `src/styles/global.css` from `styles.css`.
- [x] 2.7 REFACTOR: extract shared shell rules into CSS Modules; verify 2.1-2.2 pass.

## Phase 3: CV Content (PR 3 — content slice)

- [x] 3.1 GREEN: populate `src/data/cv.js` with real redacted CV fields (no cedula/address/exact birth date); run `npm test -- cv.pii` to confirm 1.5 now passes.
- [x] 3.2 RED: fixture-based `Perfil.test.jsx`, `Formacion.test.jsx`, `ExperienciaLaboral.test.jsx`, `Habilidades.test.jsx`, `Contacto.test.jsx` (headings, counts, a11y roles, `mailto:migarciaq@unal.edu.co` href) — fail, section components absent.
- [x] 3.3 GREEN: `src/components/sections/*.jsx`, `src/components/ui/Section.jsx`, `Card.jsx`, `Tag.jsx`, `TimelineItem.jsx`.
- [x] 3.4 Wire sections into `App.jsx` via props from `cv.js`; verify 3.2 and `App.test.jsx` (2.1) pass.
- [x] 3.5 RED then GREEN by construction: `App.test.jsx` asserts no publications/projects/teaching/language-table content renders.

## Phase 4: Pages Deployment (PR 4 — deploy slice)

- [ ] 4.1 Create `.github/workflows/deploy.yml`: `build`/`deploy` jobs, actions pinned by SHAs from 0.1, `node-version` from 0.2, `permissions: {contents: read, pages: write, id-token: write}`, `concurrency: {group: pages, cancel-in-progress: true}`, steps `checkout`→`setup-node`→`npm ci`→`npm test`→`npm run build`→`npm run guard:pii`→`configure-pages`→`upload-pages-artifact`(`path: ./dist`)→`deploy-pages`.
- [ ] 4.2 Run `npm run build`; verify `dist/index.html` asset URLs are prefixed `/pagina-web/`.
- [ ] 4.3 Confirm repo Settings → Pages → Build and deployment → Source = "GitHub Actions" (manual; document in PR description).
- [ ] 4.4 Push to `main`; verify workflow run passes tests, `guard:pii` exits 0, Pages deploy succeeds; open the live URL and confirm all 5 sections render with real data and no PII strings.
