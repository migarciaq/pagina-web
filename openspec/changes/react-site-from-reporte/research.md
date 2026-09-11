# Research: react-site-from-reporte

Contract: `gentle-ai.sdd-research/v1`. Outcome: `done`.

## Executive Summary

Vite's official static-deploy guide (vite.dev) specifies the exact GitHub
Actions workflow: `checkout` -> `setup-node` -> `npm ci` -> `npm run build`
-> `configure-pages` -> `upload-pages-artifact` (path `./dist`) ->
`deploy-pages`, gated by `permissions: {contents: read, pages: write,
id-token: write}` and a `concurrency: {group: pages, cancel-in-progress:
true}` block. Cross-checked against each action's own GitHub Releases page,
current major versions are `configure-pages@v6`, `upload-pages-artifact@v5`,
`deploy-pages@v5` (also `checkout@v7`, `setup-node@v7`). For a project page
(`<user>.github.io/<repo>/`), `vite.config.js` needs `base: '/<repo>/'`;
repo setting must be Settings -> Pages -> Source -> "GitHub Actions". Known
non-routing gotchas: base/trailing-slash mismatches cause 404s on hashed
assets, and GitHub Pages' CDN (~10 min `max-age`) can transiently serve a
stale `index.html` pointing at superseded hashed bundles. Vite does not ship
a test runner but the Vite team builds and recommends Vitest as its official
companion; minimal setup is `vitest` + `@testing-library/react` + `jsdom`.

## Sources

| ID | Class | Title | Publisher | URL | Accessed | Excerpt |
|----|-------|-------|-----------|-----|----------|---------|
| S1 | documentation | Deploying a Static Site | Vite (vite.dev) | https://vite.dev/guide/static-deploy | 2026-09-11 | Official workflow YAML with `permissions`, `concurrency`, `configure-pages`/`upload-pages-artifact`/`deploy-pages` steps; base-path guidance for user vs. project pages |
| S2 | documentation | Releases | GitHub `actions/deploy-pages` | https://github.com/actions/deploy-pages/releases | 2026-09-11 | v5.0.1 is the current major line |
| S3 | documentation | Releases | GitHub `actions/upload-pages-artifact` | https://github.com/actions/upload-pages-artifact/releases | 2026-09-11 | Latest major v5.0.0 |
| S4 | documentation | Releases | GitHub `actions/configure-pages` | https://github.com/actions/configure-pages/releases | 2026-09-11 | Latest major v6.0.0 |
| S5 | documentation | Why Vitest | Vitest (vitest.dev) | https://vitest.dev/guide/why | 2026-09-11 | Vite-team-endorsed unit test runner, single config pipeline with build/dev |
| S6 | open-web | Vite unable to resolve relative paths when deploying to GitHub Pages (Issue #12243) | GitHub `vitejs/vite` | https://github.com/vitejs/vite/issues/12243 | 2026-09-11 | Root-relative asset paths break when `base` isn't the deploy subpath |
| S7 | open-web | Vite Build Path Issues: How to Fix Asset Loading Errors After Deployment | PaulYu's Blog | https://paulyu.me/articles/88 | 2026-09-11 | Mismatch between `base` config and actual deploy path/trailing slash causes post-deploy 404s |
| S8 | open-web | GitHub Pages: How to Detect Stale Content and Force Updates Despite Aggressive Cache Headers | javascriptroom.com | https://www.javascriptroom.com/blog/determining-a-page-is-outdated-on-github-pages/ | 2026-09-11 | GitHub Pages CDN sets `Cache-Control: max-age=600`; stale `index.html` can reference removed hashed assets |

## Claims

1. **[S1]** Workflow order: `actions/checkout` -> `actions/setup-node` (npm cache) -> `npm ci` -> `npm run build` -> `actions/configure-pages` -> `actions/upload-pages-artifact` (uploading `./dist`) -> `actions/deploy-pages`, in a job with `environment: {name: github-pages, url: ${{steps.deployment.outputs.page_url}}}`.
2. **[S1]** Required `permissions:` block: `contents: read`, `pages: write`, `id-token: write`. Required top-level `concurrency: {group: pages, cancel-in-progress: true}`.
3. **[S1]** Project page at `https://<user>.github.io/<repo>/` needs `base: '/<repo>/'` in `vite.config.js`. User/org page or custom domain: `base: '/'` (Vite default).
4. **[S1]** Required repo setting: Settings -> Pages -> Build and deployment -> Source -> "GitHub Actions" (not "Deploy from a branch").
5. **[S2][S3][S4]** Current verified major versions: `actions/deploy-pages@v5` (v5.0.1), `actions/upload-pages-artifact@v5` (v5.0.0), `actions/configure-pages@v6` (v6.0.0). Pin by commit SHA with a version comment (Vite's own pattern), not a bare `@v5` tag.
6. **[S6][S7]** Non-routing gotcha: asset 404s after deploy come from `base` not matching the actual GitHub Pages subpath, or root-relative asset URLs (`/assets/...`) instead of import-based/base-relative references. Vite appends a trailing slash to `base` internally — configured value and deployed path segment must match exactly.
7. **[S8]** GitHub Pages CDN applies ~`max-age=600` (~10 min); since Vite content-hashes JS/CSS but not `index.html`, a briefly stale cached `index.html` can reference hashed bundles removed by a later deploy — transient, self-resolving, not a build bug.
8. **[S5]** Vite has no bundled test runner; the Vite team builds and documents Vitest as the official companion specifically to avoid a separate Jest+Babel config pipeline.
9. **[S5]** Minimal real-test setup for a small React+Vite app: `npm i -D vitest @testing-library/react @testing-library/user-event jsdom`; add a `test` block to `vite.config.js` (`environment: 'jsdom'`, `globals: true`, `setupFiles: './src/setupTests.ts'`); add `"test": "vitest"` to `package.json` scripts.

## Gaps

- S1's YAML was read via WebFetch summarization; version numbers were independently cross-checked against S2-S4, but exact commit SHAs were not byte-verified against the live page source.
- No official GitHub Pages documentation on CDN cache-control behavior was directly fetched; S8 is the only source for the caching gotcha.
- Package manager (npm vs. other) for this project was not verified in this phase — out of scope for research.

## Risks

- Action version tags drift over time; pin by SHA with a version comment in tasks/design.
- If the project ever migrates to a custom domain or user/org page, `base` must revert to `/`.
- The stale-`index.html` caching behavior is expected CDN behavior, not a defect — document it in design to avoid a false "cache bug" investigation later.

## Product Choices (non-authoritative, carried from exploration)

See `exploration.md` — PII handling resolved: redact sensitive fields
(cedula, exact home address, exact birth date omitted; name, email,
formacion, and experiencia laboral published).

## Readiness

`done`. Ready for `sdd-propose`.
