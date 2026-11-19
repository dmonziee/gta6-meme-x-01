// gta6-meme-x-01 entry. The post on X is the entry itself: the house reads
// the post's first picture and its text straight from X and hands them to
// the judge. This program does the one mechanical job the gate needs —
// it hands the house the post's address by copying POST.json from the
// repository root into the output directory, where the gate reads it.
//
// Node 22, standard library only. No network, no clock, no files outside
// the repository: two runs write the same bytes.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(repoDir, 'POST.json');
const target = join(outDir, 'POST.json');

if (!existsSync(source)) {
  console.error(`no POST.json in ${repoDir}: the post's address is missing`);
  process.exit(1);
}

// POST.json must name a post: a JSON object carrying a url string. A
// malformed file, or one with no url, is refused by the gate, so fail
// loudly here instead of handing the house a bad address.
let address: unknown;
try {
  address = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`POST.json in ${repoDir} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof address !== 'object' || address === null ||
    typeof (address as { url?: unknown }).url !== 'string') {
  console.error(`POST.json in ${repoDir} holds no url string`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
