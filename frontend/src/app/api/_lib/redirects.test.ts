import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { getRequestOrigin, getSafeRedirectUrl } from "./redirects";

function createRequest(url = "http://127.0.0.1:3000/api/draft/enable") {
  return new NextRequest(url, {
    headers: {
      host: "127.0.0.1:3000",
    },
  });
}

test("getRequestOrigin preserves forwarded deployment origin", () => {
  const request = new NextRequest("http://internal.example/api/draft/enable", {
    headers: {
      host: "internal.example",
      "x-forwarded-host": "www.drenova.ca",
      "x-forwarded-proto": "https",
    },
  });

  assert.equal(getRequestOrigin(request), "https://www.drenova.ca");
});

test("getSafeRedirectUrl preserves same-origin root-relative paths", () => {
  const request = createRequest();

  assert.equal(
    getSafeRedirectUrl(request, "/about?from=preview#team").toString(),
    "http://127.0.0.1:3000/about?from=preview#team",
  );
});

test("getSafeRedirectUrl rejects external and ambiguous redirect paths", () => {
  const request = createRequest();
  const unsafePaths = [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/%5Cevil.example",
    "/%5cevil.example",
    "/about\u0000",
  ];

  for (const path of unsafePaths) {
    assert.equal(getSafeRedirectUrl(request, path).toString(), "http://127.0.0.1:3000/");
  }
});
