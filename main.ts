// Copies POST.json — the address of the X post this entry hands in —
// from the repository root into the output directory.
//
// The runner sets MAKEFUN_BOT_DIR to the repository root and
// MAKEFUN_OUTPUT_DIR to the output directory. When either is missing,
// the current directory and /output are used instead.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "POST.json");

if (!existsSync(source)) {
  throw new Error(`POST.json not found in ${botDir}`);
}

const parsed = JSON.parse(readFileSync(source, "utf8"));
if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  throw new Error("POST.json must hold a JSON object");
}
if (typeof parsed.url !== "string" || parsed.url.length === 0) {
  throw new Error("POST.json must hold a url string");
}

mkdirSync(outDir, { recursive: true });
const destination = join(outDir, "POST.json");
copyFileSync(source, destination);

// Make sure the copy landed intact: the bytes out must match the bytes in.
if (!readFileSync(destination).equals(readFileSync(source))) {
  throw new Error(`copy to ${destination} does not match ${source}`);
}
