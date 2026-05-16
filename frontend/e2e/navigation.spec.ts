import { test, expect } from "@playwright/test";

const pages = [
  { path: "/", name: "Home" },
  { path: "/buy", name: "Buy" },
  { path: "/sell", name: "Sell" },
  { path: "/listings", name: "Listings" },
  { path: "/about", name: "About" },
  { path: "/team", name: "Team" },
  { path: "/contact", name: "Contact" },
  { path: "/privacy", name: "Privacy" },
  { path: "/terms", name: "Terms" },
];

const headerLinks = [
  { href: "/buy", name: "Buy" },
  { href: "/sell", name: "Sell" },
  { href: "/listings", name: "Listings" },
  { href: "/contact", name: "Contact" },
];

test.describe("Page smoke tests", () => {
  for (const { path, name } of pages) {
    test(`${name} page (${path}) loads successfully`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    });

    test(`${name} page (${path}) has a visible h1`, async ({ page }) => {
      await page.goto(path);
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();
    });
  }
});

test.describe("Header navigation (desktop)", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("navigation links are present in the header", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator('nav[aria-label="Main"]');
    await expect(nav).toBeVisible();

    const links = nav.locator("a");
    await expect(links).toHaveCount(headerLinks.length);

    for (const { href, name } of headerLinks) {
      await expect(nav.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });
});
