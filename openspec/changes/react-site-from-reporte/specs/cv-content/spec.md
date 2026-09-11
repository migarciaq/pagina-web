# cv-content Specification

## Purpose

Redacted CV data model and the five content sections (Perfil, Formacion,
Experiencia Laboral, Habilidades, Contacto) rendered from it.

## Requirements

### Requirement: Single CV Data Module

The system MUST define all CV content in one module (e.g. `src/data/cv.js`)
as the single source for name, email, formacion, experiencia laboral,
habilidades, and contacto.

#### Scenario: Sections read from the shared module

- GIVEN the CV data module exports name, email, formacion, experiencia,
  habilidades, and contacto
- WHEN any section component renders
- THEN it imports its content only from that module, not from inline literals

### Requirement: PII Redaction

The system MUST NOT include the cedula number, the exact home address, or
the exact birth date anywhere in the CV data module, any `src/` file, or
built `dist/` output.

#### Scenario: Forbidden strings absent from source

- GIVEN the CV data module and all files under `src/`
- WHEN a test scans their contents against the PII patterns defined in
  `scripts/pii-rules.mjs` (national ID digits, street-address prefixes,
  exact `dd/mm/yyyy`-style dates) — never literal values stored in the repo
- THEN no forbidden pattern matches

#### Scenario: Forbidden strings absent from build output

- GIVEN a production build exists under `dist/` (`npm run build`)
- WHEN a test scans every file under `dist/` for the same three strings
- THEN none of the three strings are found

### Requirement: Five CV Sections Rendered

The system MUST render exactly five sections — Perfil, Formacion,
Experiencia Laboral, Habilidades, Contacto — each populated from the CV data
module, in Spanish, and MUST NOT render publications, projects, teaching
experience, or language-table content.

#### Scenario: All sections present with content

- GIVEN the app is rendered
- WHEN the DOM is queried for each section's heading
- THEN Perfil, Formacion, Experiencia Laboral, Habilidades, and Contacto each
  render with non-empty content

#### Scenario: No out-of-scope content rendered

- GIVEN the rendered app
- WHEN the DOM is queried for publications, projects, teaching-experience, or
  language-table content
- THEN none of these appear

### Requirement: Contacto Uses a mailto Link

The Contacto section MUST expose the published email as a `mailto:` link and
MUST NOT include a submission form or third-party form service.

#### Scenario: Contact link targets the published email

- GIVEN the Contacto section is rendered
- WHEN its contact link's `href` is inspected
- THEN it equals `mailto:migarciaq@unal.edu.co`
