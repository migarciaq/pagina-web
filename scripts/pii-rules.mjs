// PII detection patterns for the `pii-guard.mjs` scanner and the
// `cv.pii.test.js` unit test.
//
// These are REGEX PATTERNS ONLY — never literal forbidden values. A literal
// cedula/address/date checked into a public repo would itself be the leak
// (see design.md "Guard rule form" decision).
//
// Known false-positive escape hatch (documented per tasks.md 0.3):
// Vite content-hashed asset filenames are 8 hex-like characters
// (e.g. `index-a1b2c3d4.js`). An all-digit hash segment could match the
// `national-id` rule (~1e-6 probability per asset). This is NOT fixed by
// loosening the regex — that would reopen the real leak vector. Instead,
// callers that flag a match inside a filename-shaped token (a path segment
// immediately followed by a `.` + known asset extension, e.g. `.js`, `.css`,
// `.map`) MAY treat it as a false positive and skip it, but every other
// match anywhere else in file contents MUST still fail closed.
export const PII_PATTERNS = [
  { id: 'national-id', re: /\b\d{7,11}\b/g },
  { id: 'professional-card', re: /\b\d{5,7}-\d{6,8}\b/g },
  {
    id: 'street-address',
    re: /\b(?:calle|cll|carrera|cra|kr|diagonal|transversal|avenida|av)\.?\s*\d+/gi,
  },
  { id: 'exact-date', re: /\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/g },
];
