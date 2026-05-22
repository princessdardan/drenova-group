import assert from "node:assert/strict";
import test from "node:test";
import { safeHref } from "./safe-href";

test("safeHref preserves safe CMS links", () => {
  assert.equal(safeHref("/about", "#contact"), "/about");
  assert.equal(safeHref("#contact", "/"), "#contact");
  assert.equal(safeHref("https://example.com/path", "/"), "https://example.com/path");
  assert.equal(safeHref("mailto:info@example.com", "/"), "mailto:info@example.com");
  assert.equal(safeHref("tel:+14165550199", "/"), "tel:+14165550199");
});

test("safeHref rejects unsafe CMS links", () => {
  assert.equal(safeHref("javascript:alert(1)", "#contact"), "#contact");
  assert.equal(safeHref("data:text/html,<script>alert(1)</script>", "/"), "/");
  assert.equal(safeHref("//evil.example", "/"), "/");
  assert.equal(safeHref("http://insecure.example", "/"), "/");
});
