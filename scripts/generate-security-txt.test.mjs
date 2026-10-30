// The gate has to be shown failing, not asserted to fail. The CLI cases run
// the real script against a throwaway publish directory the way Netlify's
// build command would; problemWith is the exact check the script runs on
// its own output before it will let a build succeed, exercised directly
// against the three ways RFC 9116 marks a security.txt as stale or
// malformed.
import { execFile } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { promisify } from "node:util";
import { problemWith } from "./generate-security-txt.mjs";

const run = promisify(execFile);
const SCRIPT = join(import.meta.dirname, "generate-security-txt.mjs");

const VALID = [
  "Contact: mailto:security@nethworks.net",
  `Expires: ${new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().replace(/\.\d{3}Z$/, "Z")}`,
  "Preferred-Languages: en",
  "Canonical: https://nethworks.net/.well-known/security.txt",
].join("\n");

const roots = [];
after(() => {
  for (const r of roots) rmSync(r, { recursive: true, force: true });
});

function publishDir() {
  const root = mkdtempSync(join(tmpdir(), "security-txt-"));
  roots.push(root);
  return root;
}

async function fails(dir) {
  try {
    await run("node", [SCRIPT, dir]);
  } catch (err) {
    assert.notEqual(err.code, 0);
    return err.stderr ?? "";
  }
  throw new Error("expected the gate to fail, and it passed");
}

describe("generate-security-txt (CLI)", () => {
  it("writes a well-known security.txt with the required fields", async () => {
    const dir = publishDir();
    await run("node", [SCRIPT, dir]);
    const file = join(dir, ".well-known/security.txt");
    assert.equal(existsSync(file), true);
    const text = readFileSync(file, "utf8");
    assert.match(text, /Contact: mailto:security@nethworks\.net/);
    assert.match(text, /Preferred-Languages: en/);
    assert.match(text, /Canonical: https:\/\/nethworks\.net\/\.well-known\/security\.txt/);
    assert.equal(problemWith(text), null);
  });

  it("dates Expires six months out from the build clock", async () => {
    const dir = publishDir();
    const before = Date.now();
    await run("node", [SCRIPT, dir]);
    const after_ = Date.now();
    const text = readFileSync(join(dir, ".well-known/security.txt"), "utf8");
    const match = text.match(/^Expires: (.+)$/m);
    assert.ok(match);
    assert.match(match[1], /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    const expires = new Date(match[1]).getTime();

    // Expires is truncated to whole seconds, so allow a one second margin
    // against millisecond truncation on the lower bound.
    const sixMonthsFromBefore = new Date(before - 1000);
    sixMonthsFromBefore.setUTCMonth(sixMonthsFromBefore.getUTCMonth() + 6);
    const sixMonthsFromAfter = new Date(after_);
    sixMonthsFromAfter.setUTCMonth(sixMonthsFromAfter.getUTCMonth() + 6);
    assert.ok(expires >= sixMonthsFromBefore.getTime());
    assert.ok(expires <= sixMonthsFromAfter.getTime());
  });

  it("is idempotent: a second run over its own output changes nothing but the date it was asked for", async () => {
    const dir = publishDir();
    await run("node", [SCRIPT, dir]);
    const first = readFileSync(join(dir, ".well-known/security.txt"), "utf8");
    await run("node", [SCRIPT, dir]);
    const second = readFileSync(join(dir, ".well-known/security.txt"), "utf8");
    assert.equal(second.replace(/^Expires:.*$/m, ""), first.replace(/^Expires:.*$/m, ""));
  });

  it("FAILS when the publish directory does not exist", async () => {
    const stderr = await fails(join(tmpdir(), "security-txt-missing-" + Date.now()));
    assert.match(stderr, /publish directory not found/);
  });
});

describe("problemWith (the built-file gate)", () => {
  it("accepts a valid file", () => {
    assert.equal(problemWith(VALID), null);
  });

  it("FAILS a file with no Contact line", () => {
    const text = VALID.replace(/^Contact:.*$/m, "");
    assert.match(problemWith(text), /Contact/);
  });

  it("FAILS a file whose Contact is not a mailto: address", () => {
    const text = VALID.replace("Contact: mailto:security@nethworks.net", "Contact: https://example.com/contact");
    assert.match(problemWith(text), /Contact/);
  });

  it("FAILS a file with no Expires line", () => {
    const text = VALID.replace(/^Expires:.*$/m, "");
    assert.match(problemWith(text), /Expires/);
  });

  it("FAILS a file whose Expires is in the past", () => {
    const past = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().replace(/\.\d{3}Z$/, "Z");
    const text = VALID.replace(/^Expires:.*$/m, `Expires: ${past}`);
    assert.match(problemWith(text), /past/);
  });

  it("FAILS a file whose Expires is more than a year out", () => {
    const farFuture = new Date(Date.now() + 1000 * 60 * 60 * 24 * 400).toISOString().replace(/\.\d{3}Z$/, "Z");
    const text = VALID.replace(/^Expires:.*$/m, `Expires: ${farFuture}`);
    assert.match(problemWith(text), /more than a year/);
  });
});
