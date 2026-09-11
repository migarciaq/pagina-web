// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { scanDirectory } from './pii-guard.mjs';

const guardScript = fileURLToPath(new URL('./pii-guard.mjs', import.meta.url));

describe('pii-guard.mjs — scanDirectory', () => {
  let dir;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'pii-guard-test-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('flags a planted national-id pattern in a .txt file', () => {
    writeFileSync(join(dir, 'sample.txt'), 'contact code: 123456789\n');

    const { findings, filesScanned } = scanDirectory(dir);

    expect(filesScanned).toBe(1);
    expect(findings).toEqual([
      { file: join(dir, 'sample.txt'), line: 1, ruleId: 'national-id' },
    ]);
  });

  it('flags a planted street-address pattern in a .json file', () => {
    writeFileSync(join(dir, 'sample.json'), '{"nota": "Av. 4521"}\n');

    const { findings } = scanDirectory(dir);

    expect(findings.map((finding) => finding.ruleId)).toContain('street-address');
  });

  it('flags a planted exact-date pattern in a .webmanifest file', () => {
    writeFileSync(join(dir, 'sample.webmanifest'), '{"issued": "01/01/2000"}\n');

    const { findings } = scanDirectory(dir);

    expect(findings.map((finding) => finding.ruleId)).toContain('exact-date');
  });

  it('flags a planted professional-card pattern in a .svg file', () => {
    writeFileSync(join(dir, 'sample.svg'), '<svg><!-- 12345-6789012 --></svg>\n');

    const { findings } = scanDirectory(dir);

    expect(findings.map((finding) => finding.ruleId)).toContain('professional-card');
  });

  it('skips binary allowlist extensions without decoding them as PII', () => {
    writeFileSync(
      join(dir, 'photo.png'),
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39]),
    );

    const { findings, filesScanned } = scanDirectory(dir);

    expect(filesScanned).toBe(1);
    expect(findings).toEqual([]);
  });

  it('reports zero files scanned for an empty directory', () => {
    const { findings, filesScanned } = scanDirectory(dir);

    expect(filesScanned).toBe(0);
    expect(findings).toEqual([]);
  });

  it('reports zero files scanned for a missing directory', () => {
    const { findings, filesScanned } = scanDirectory(join(dir, 'does-not-exist'));

    expect(filesScanned).toBe(0);
    expect(findings).toEqual([]);
  });
});

describe('pii-guard.mjs — CLI exit codes', () => {
  let dir;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'pii-guard-cli-test-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('exits 1 and prints file:line:ruleId when a match is found', () => {
    writeFileSync(join(dir, 'leak.txt'), 'id: 987654321\n');

    const result = spawnSync('node', [guardScript, dir], { encoding: 'utf-8' });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('national-id');
  });

  it('exits 1 on an empty directory', () => {
    const result = spawnSync('node', [guardScript, dir], { encoding: 'utf-8' });

    expect(result.status).toBe(1);
  });

  it('exits 1 on a missing directory', () => {
    const result = spawnSync('node', [guardScript, join(dir, 'nope')], { encoding: 'utf-8' });

    expect(result.status).toBe(1);
  });

  it('exits 0 when files are clean', () => {
    writeFileSync(join(dir, 'clean.txt'), 'hello world\n');

    const result = spawnSync('node', [guardScript, dir], { encoding: 'utf-8' });

    expect(result.status).toBe(0);
  });
});
