# site-shell Specification

## Purpose

App shell and interaction behavior — sticky header, anchor nav, scroll-spy
and reveal, skip-link, focus-visible, responsive grids — plus the project's
automated test infrastructure.

## Requirements

### Requirement: Single-Page Anchor Navigation

The system MUST provide anchor-based navigation to each of the five sections
without a client-side router.

#### Scenario: Nav link scrolls to its section

- GIVEN the header nav renders one link per section
- WHEN a user activates a nav link
- THEN the viewport scrolls to the matching section's anchor (`#id`)

### Requirement: Sticky Header and Mobile Nav

The header MUST remain visible while scrolling and MUST collapse into a
keyboard- and screen-reader-accessible menu below a defined breakpoint.

#### Scenario: Header stays fixed on scroll

- GIVEN the page is scrolled past the hero section
- WHEN scroll position changes
- THEN the header remains rendered at the top of the viewport

### Requirement: Accessibility Baseline

The system MUST provide a skip-link to the main content region and MUST
apply a visible focus style to interactive elements reached via keyboard.

#### Scenario: Skip-link moves focus to main content

- GIVEN the page has loaded
- WHEN a keyboard user activates the first focusable element (the skip-link)
- THEN focus moves to the main content region

### Requirement: Test Suite Configured

The system MUST run automated tests via Vitest with `@testing-library/react`
and `jsdom`, invoked by `npm test`.

#### Scenario: Test command executes and reports results

- GIVEN Vitest, `@testing-library/react`, and `jsdom` are installed and
  configured (`vite.config.js` `test` block, `environment: 'jsdom'`)
- WHEN `npm test` runs
- THEN Vitest executes every test file under `src/` and reports pass/fail
  per test
