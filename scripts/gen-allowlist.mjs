#!/usr/bin/env node
// Extracts every TypedDocumentNode JSON literal from generated.ts,
// calls print() on it (same as graphql-request does), and hashes the result.
import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { print } from 'graphql';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');
const generatedFile = join(root, 'src/lib/graphql/generated.ts');
const outFile = join(root, 'src/lib/graphql/allowlist.ts');

const src = readFileSync(generatedFile, 'utf8');

// Match every `= { "kind": "Document", ... } as unknown as DocumentNode<...>`
const docRe = /=\s*(\{"kind":"Document".*?\})\s*as unknown as DocumentNode/gs;

const sha256 = (str) => createHash('sha256').update(str).digest('hex');

const hashes = new Set();
for (const [, json] of src.matchAll(docRe)) {
	const doc = JSON.parse(json);
	hashes.add(sha256(print(doc)));
}

if (hashes.size === 0) throw new Error('No DocumentNode literals found in generated.ts');

const sorted = [...hashes].sort();
writeFileSync(
	outFile,
	`// AUTO-GENERATED — do not edit manually.\nexport const GRAPHQL_ALLOWLIST = new Set([\n${sorted.map((h) => `\t'${h}',`).join('\n')}\n]) as ReadonlySet<string>;\n`,
	'utf8'
);
console.log(`[gen-allowlist] wrote ${hashes.size} query hashes → ${outFile}`);
