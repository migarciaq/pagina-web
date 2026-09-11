#!/usr/bin/env node
// Fail-closed PII scanner. Walks a directory recursively, decodes every
// file as UTF-8 except a known-binary extension allowlist, and applies the
// shared regex patterns from `pii-rules.mjs`. Exits 1 on any match OR when
// zero files were scanned (an empty/missing target directory must not be
// treated as "clean" — see design.md "PII guard target" decision).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { PII_PATTERNS, isNationalIdCodeContextFalsePositive } from './pii-rules.mjs';

const BINARY_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
]);

export function listFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

export function scanFile(filePath) {
  if (BINARY_EXTENSIONS.has(extname(filePath).toLowerCase())) {
    return [];
  }

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings = [];

  lines.forEach((line, index) => {
    for (const { id, re } of PII_PATTERNS) {
      re.lastIndex = 0;
      let match;
      let hasRealMatch = false;

      while ((match = re.exec(line))) {
        if (id === 'national-id' && isNationalIdCodeContextFalsePositive(line, match.index, match[0].length)) {
          continue;
        }

        hasRealMatch = true;
        break;
      }

      if (hasRealMatch) {
        findings.push({ file: filePath, line: index + 1, ruleId: id });
      }
    }
  });

  return findings;
}

export function scanDirectory(dir) {
  let files;

  try {
    statSync(dir);
    files = listFiles(dir);
  } catch {
    files = [];
  }

  const findings = files.flatMap((filePath) => scanFile(filePath));

  return { findings, filesScanned: files.length };
}

function main(targetDir) {
  const { findings, filesScanned } = scanDirectory(targetDir);

  if (filesScanned === 0) {
    console.error(`pii-guard: zero files scanned under "${targetDir}" — failing closed`);
    process.exit(1);
  }

  if (findings.length > 0) {
    for (const finding of findings) {
      console.error(`${finding.file}:${finding.line}:${finding.ruleId}`);
    }
    process.exit(1);
  }

  console.log(`pii-guard: ${filesScanned} file(s) scanned, no PII patterns found`);
  process.exit(0);
}

const isMainModule = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const targetDir = process.argv[2];

  if (!targetDir) {
    console.error('pii-guard: usage: node scripts/pii-guard.mjs <dir>');
    process.exit(1);
  }

  main(targetDir);
}
