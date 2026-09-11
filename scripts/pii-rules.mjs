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

// Known false-positive escape hatches for the `national-id` rule, discovered
// scanning the real production `dist/` bundle (React + Vite CSS/JS output)
// during Phase 4 (deploy workflow). Both are narrow and context-bound; every
// other match anywhere else MUST still fail closed.
//
// 1. CSS hex colors: an all-digit hex value, e.g. `#00000012`, matches
//    `\d{7,11}` even though it is a color, not an identity number. Exempt
//    ONLY when the match is immediately preceded by `#` and its length is
//    exactly 6 or 8 (the two non-alpha CSS hex-color lengths long enough to
//    fall inside the national-id range).
//
// 2. Minified JS numeric literals: production bundles inline large integer
//    constants directly into expressions (e.g. React's own lane/priority
//    bitmasks: `case 1073741823:`, `e&3932160`, `_t=4194304;`, `return
//    67108864;`). These are never string values — a leaked identity number
//    in this codebase's data model (`src/data/cv.js`) only ever exists as a
//    *string* field (see design.md's `cv.js` interface), so it always
//    reaches the bundle wrapped in quotes or rendered as bare text between
//    HTML tags. A bare numeric literal is therefore exempt ONLY when it
//    touches (no whitespace) a code-operator character on at least one side
//    — with the other side being either another such operator or the
//    `case `/`return ` keyword — and NEVER when either side is a quote
//    (`'`, `"`, backtick) or an HTML angle bracket (`<`, `>`), which would
//    also bound literal rendered text content. Plain whitespace on both
//    sides (natural prose) is never exempt either.
const HEX_COLOR_LENGTHS = new Set([6, 8]);
const CODE_OPERATOR_CHARS = new Set([...'&|^~=(),;:+-*!?}']);
const KEYWORD_RE = /(?:^|[^a-zA-Z])(?:case|return) $/;

export function isNationalIdCodeContextFalsePositive(line, index, length) {
  const before = index > 0 ? line[index - 1] : '';
  const after = index + length < line.length ? line[index + length] : '';

  if (before === '#' && HEX_COLOR_LENGTHS.has(length)) {
    return true;
  }

  const beforeIsOperator = CODE_OPERATOR_CHARS.has(before);
  const afterIsOperator = CODE_OPERATOR_CHARS.has(after);
  const beforeIsKeyword = KEYWORD_RE.test(line.slice(0, index));

  return (beforeIsOperator || beforeIsKeyword) && afterIsOperator;
}
