import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const workspaceRoot = process.cwd();
const restrictedFiles = [
  "src/app/actions/contact.ts",
  "src/app/actions/contact.test.ts",
  "src/app/actions/lead.ts",
  "src/app/actions/lead-service.ts",
  "src/app/actions/lead.test.ts",
  "src/lib/email/env.ts",
  "src/lib/email/mailer.ts",
  "src/lib/email/mailer.test.ts",
  "src/lib/email/static-regression.test.ts",
  "src/lib/email/templates.ts",
  "src/lib/email/templates.test.ts",
  "src/lib/email/types.ts",
];

test("email implementation and tests do not contain disabled-test or unsafe TypeScript escape hatches", async () => {
  const forbiddenTokens = [
    ["test", "only"].join("."),
    ["test", "skip"].join("."),
    ["@ts", "ignore"].join("-"),
    ["@ts", "expect", "error"].join("-"),
    ["as", "any"].join(" "),
  ];

  for (const relativePath of restrictedFiles) {
    const source = await readFile(join(workspaceRoot, relativePath), "utf8");

    for (const token of forbiddenTokens) {
      assert.equal(
        source.includes(token),
        false,
        `${relativePath} must not contain ${token}`
      );
    }
  }
});

test("Resend construction stays isolated to the shared mailer transport", async () => {
  const constructorToken = ["new", "Resend"].join(" ");

  for (const relativePath of restrictedFiles) {
    const source = await readFile(join(workspaceRoot, relativePath), "utf8");
    const occurrences = source.split(constructorToken).length - 1;

    assert.equal(
      occurrences,
      relativePath === "src/lib/email/mailer.ts" ? 1 : 0,
      `${relativePath} must not construct Resend directly`
    );
  }
});
