#!/usr/bin/env node
/**
 * Point the portfolio's SEO files at the live site.
 *
 * Usage (from the repo root):
 *   node scripts/set-site-url.mjs https://your-service.onrender.com
 *
 * Replaces https://example.com in index.html, sitemap.xml and robots.txt.
 * Always writes the page URL with a trailing slash.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const PLACEHOLDER = "https://example.com";
const FILES = ["index.html", "sitemap.xml", "robots.txt"];
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

const input = process.argv[2];
if (!input) {
  fail("Provide your live URL, e.g. node scripts/set-site-url.mjs https://my-site.onrender.com");
}

let siteUrl;
try {
  siteUrl = new URL(input);
} catch {
  fail(`"${input}" is not a valid URL. Include https://, e.g. https://my-site.onrender.com`);
}

if (!["http:", "https:"].includes(siteUrl.protocol)) {
  fail("Use an http:// or https:// URL.");
}

if (siteUrl.search || siteUrl.hash) {
  fail("Use the site's base URL only — no query string or #anchor.");
}

const origin = siteUrl.origin;
const pageUrl = `${origin}/`;
const cleanPath = siteUrl.pathname.replace(/\/+$/, "");

if (cleanPath) {
  fail(
    `Use the site root, not a subpath. The site is published at the domain root.\n` +
      `  Received: ${input}\n` +
      `  Use:      ${origin}`
  );
}

let changed = 0;
for (const file of FILES) {
  const filePath = path.join(ROOT, file);
  let contents;

  try {
    contents = await readFile(filePath, "utf8");
  } catch {
    fail(`Could not read ${file}. Run this script from the portfolio repository.`);
  }

  if (!contents.includes(PLACEHOLDER)) {
    console.log(`• ${file} — no placeholder left, skipped`);
    continue;
  }

  contents = contents.replaceAll(PLACEHOLDER, origin);
  await writeFile(filePath, contents, "utf8");
  changed += 1;
  console.log(`✓ ${file} — updated`);
}

if (changed === 0) {
  console.log("\nNothing to change. The SEO files already use a live URL.\n");
} else {
  console.log(`\nDone. Page URL: ${pageUrl}`);
  console.log("Commit and push the change so Render redeploys.\n");
}
