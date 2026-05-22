import { isReservedRootSlug } from "./routes";
import { describe, it } from "node:test";
import assert from "node:assert";

describe("isReservedRootSlug", () => {
  it("returns true for reserved slugs", () => {
    assert.strictEqual(isReservedRootSlug("about"), true);
    assert.strictEqual(isReservedRootSlug("api"), true);
    assert.strictEqual(isReservedRootSlug("buy"), true);
    assert.strictEqual(isReservedRootSlug("contact"), true);
    assert.strictEqual(isReservedRootSlug("favicon.ico"), true);
  });

  it("returns false for non-reserved slugs", () => {
    assert.strictEqual(isReservedRootSlug("custom-page"), false);
    assert.strictEqual(isReservedRootSlug("hello-world"), false);
    assert.strictEqual(isReservedRootSlug(""), false);
  });
});
