import { describe, expect, it } from 'vitest';
import { PII_PATTERNS } from '../../scripts/pii-rules.mjs';
import { cv } from './cv.js';

describe('cv data module — PII redaction', () => {
  it('contains no PII pattern matches anywhere in its serialized content', () => {
    const serialized = JSON.stringify(cv);

    const matchedRuleIds = PII_PATTERNS.filter(({ re }) => {
      re.lastIndex = 0;
      return re.test(serialized);
    }).map(({ id }) => id);

    expect(matchedRuleIds).toEqual([]);
  });
});
