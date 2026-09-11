# pages-deployment Specification

## Purpose

Vite base path configuration, static build output, and GitHub Actions
deployment to GitHub Pages for repo `migarciaq/pagina-web` at
`https://migarciaq.github.io/pagina-web/`.

## Requirements

### Requirement: Vite Base Path Matches the Pages Subpath

`vite.config.js` MUST set `base: '/pagina-web/'` to match the GitHub Pages
project-page URL for repo `migarciaq/pagina-web`.

#### Scenario: Built asset paths use the configured base

- GIVEN `vite.config.js` sets `base: '/pagina-web/'`
- WHEN `npm run build` produces `dist/index.html`
- THEN every asset URL (script/style `src`/`href`) is prefixed with
  `/pagina-web/`, not root-relative (`/assets/...`) or relative-only

### Requirement: GitHub Actions Deploy Workflow

The repo MUST include `.github/workflows/deploy.yml` that builds and deploys
`dist/` to GitHub Pages on push to the default branch, using
`actions/checkout`, `actions/setup-node`, `npm ci`, `npm run build`,
`actions/configure-pages`, `actions/upload-pages-artifact` (path `./dist`),
and `actions/deploy-pages`, each pinned by commit SHA.

#### Scenario: Workflow declares required permissions and concurrency

- GIVEN `.github/workflows/deploy.yml`
- WHEN its YAML is parsed
- THEN it declares `permissions: {contents: read, pages: write, id-token:
  write}` and top-level `concurrency: {group: pages, cancel-in-progress:
  true}`

#### Scenario: Workflow deploys the build artifact

- GIVEN a push to the default branch triggers the workflow
- WHEN the build step completes successfully
- THEN `upload-pages-artifact` uploads `./dist` and `deploy-pages` publishes
  it to the `github-pages` environment

### Requirement: Repository Pages Source is GitHub Actions

Repo settings MUST have Settings → Pages → Build and deployment → Source set
to "GitHub Actions" (not "Deploy from a branch") for the workflow to publish.

#### Scenario: Pages source verified before first deploy

- GIVEN repo `migarciaq/pagina-web` exists
- WHEN Settings → Pages → Build and deployment is inspected
- THEN Source reads "GitHub Actions"
