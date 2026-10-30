/**
 * RFC 9116 security.txt, generated into the published output's
 * /.well-known/ at Netlify build time.
 *
 * Expires has to be a real date in the future, so a hand-typed one rots into
 * an invalid file with no failing gate the day it lapses. This script dates
 * it from the build clock instead - six months out. Expires is set only at
 * build time: the deployed file goes stale if the site is not redeployed
 * within six months of that build. No scheduled job re-runs this - a stale
 * file just sits there until the next real deploy.
 *
 * It generates the FILE rather than rewriting a line of a committed one, on
 * purpose: a skipped build then ships no file at all, which reads as
 * "nothing published", instead of an expired one, which reads as an
 * abandoned contact.
 *
 * Contact is an email address (Neth Works LLC's security@nethworks.net), not
 * a page or a postal address - no comment here may add one.
 *
 * Run: node scripts/generate-security-txt.mjs <publish-dir>   (netlify build does)
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * The RFC 9116 shape this file must never ship broken: a Contact line, and
 * an Expires that is parseable, in the future, and not more than a year out
 * (a year is this script's own ceiling, not RFC 9116's - a longer-lived file
 * would stop being "generated fresh every build" in anything but name).
 * Exported so the test can exercise every failure directly, without needing
 * a real published directory to exist.
 */
export function problemWith(text) {
  if (!/^Contact: mailto:\S+@\S+$/m.test(text)) return "missing a Contact: mailto: line";
  const match = text.match(/^Expires: (.+)$/m);
  if (!match) return "missing an Expires line";
  const expires = new Date(match[1]);
  if (Number.isNaN(expires.getTime())) return `Expires is not a valid date: ${match[1]}`;
  const now = Date.now();
  if (expires.getTime() <= now) return `Expires is in the past: ${match[1]}`;
  if (expires.getTime() - now > ONE_YEAR_MS) return `Expires is more than a year out: ${match[1]}`;
  return null;
}

const CONTACT_EMAIL = "security@nethworks.net";
const CANONICAL_URL = "https://nethworks.net/.well-known/security.txt";
const EXPIRES_MONTHS = 6;

function expiresAt(from) {
  const d = new Date(from);
  d.setUTCMonth(d.getUTCMonth() + EXPIRES_MONTHS);
  return d;
}

// Only the test imports this module without running it as a CLI; everything
// below is a side effect and must stay out of that import.
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Usage: node scripts/generate-security-txt.mjs <publish-dir>");
    process.exit(1);
  }
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    console.error(`security.txt gate FAILED - publish directory not found: ${dir}`);
    process.exit(1);
  }

  const expires = expiresAt(Date.now());

  const wellKnownDir = join(dir, ".well-known");
  mkdirSync(wellKnownDir, { recursive: true });

  const outFile = join(wellKnownDir, "security.txt");
  const lines = [
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}`,
    "Preferred-Languages: en",
    `Canonical: ${CANONICAL_URL}`,
    "",
  ];

  writeFileSync(outFile, lines.join("\n"), "utf8");

  // Show the gate holding, not assume it: re-read what will ship and refuse
  // to go on if the written file is missing Contact or carries an Expires
  // that is already in the past or more than a year out - the two ways
  // RFC 9116 marks a security.txt as stale or malformed.
  const problem = problemWith(readFileSync(outFile, "utf8"));
  if (problem) {
    console.error(`security.txt gate FAILED - ${problem}`);
    process.exit(1);
  }

  console.log(`security.txt generated - expires ${expires.toISOString()}.`);
}
