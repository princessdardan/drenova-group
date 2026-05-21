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

const marketingLeadPages = [
  { path: "/", name: "Home", source: "homepage" },
  { path: "/buy", name: "Buy", source: "buy" },
  { path: "/sell", name: "Sell", source: "sell" },
  { path: "/about", name: "About", source: "about" },
  { path: "/team", name: "Team", source: "team" },
  { path: "/buyers-guide", name: "Buyer guide", source: "buyers-guide" },
  { path: "/sellers-guide", name: "Seller guide", source: "sellers-guide" },
];

const contactFormPages = [
  { path: "/contact", name: "Contact" },
  { path: "/home-evaluation", name: "Home evaluation" },
];

const routesWithoutGenericLeadCapture = [
  { path: "/listings", name: "Listings" },
  { path: "/privacy", name: "Privacy" },
  { path: "/terms", name: "Terms" },
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

  test("header is transparent initially and solid on scroll for non-listing routes", async ({ page }) => {
    await page.goto("/buy");
    const header = page.locator("header").first();

    await expect(header).toHaveClass(/text-white/);
    await expect(header).not.toHaveClass(/glass-nav/);

    await page.evaluate(() => window.scrollTo(0, 100));

    await expect(header).toHaveClass(/glass-nav/);
    await expect(header).not.toHaveClass(/text-white/);
  });

  test("header is always solid for listing routes", async ({ page }) => {
    await page.goto("/listings");
    const header = page.locator("header").first();

    await expect(header).toHaveClass(/glass-nav/);
    await expect(header).not.toHaveClass(/text-white/);

    await page.evaluate(() => window.scrollTo(0, 100));

    await expect(header).toHaveClass(/glass-nav/);
  });
});

test.describe("Lead capture anchors", () => {
  for (const { path, name, source } of marketingLeadPages) {
    test(`${name} marketing page exposes a local #contact lead capture target`, async ({ page }) => {
      await page.goto(path);

      const contactTarget = page.locator("#contact");
      await expect(contactTarget).toHaveCount(1);
      await expect(contactTarget).toBeVisible();
      await expect(contactTarget.locator('input[name="name"], input[name="firstName"]')).toBeVisible();
      await expect(contactTarget.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('form:has(input[name="email"])')).toHaveCount(1);
      await expect(contactTarget.locator('input[name="source"]')).toHaveValue(source);
    });

    test(`${name} marketing page has at least one CTA pointing to #contact`, async ({ page }) => {
      await page.goto(path);

      const contactCtas = page.locator('a[href="#contact"]');
      await expect(contactCtas.first()).toBeVisible();
      expect(await contactCtas.count()).toBeGreaterThan(0);
    });
  }

  for (const { path, name } of contactFormPages) {
    test(`${name} page exposes a local #contact form target`, async ({ page }) => {
      await page.goto(`${path}#contact`);

      const contactTarget = page.locator("#contact");
      await expect(page).toHaveURL(/#contact$/);
      await expect(contactTarget).toHaveCount(1);
      await expect(contactTarget).toBeVisible();
      await expect(contactTarget.locator('input[name="name"]')).toBeVisible();
      await expect(contactTarget.locator('input[name="email"]')).toBeVisible();
      await expect(contactTarget.locator('input[name="privacyMarketingConsent"]')).toBeVisible();
    });
  }

  for (const { path, name } of routesWithoutGenericLeadCapture) {
    test(`${name} route (${path}) does not expose a generic lead-capture form`, async ({ page }) => {
      await page.goto(path);

      await expect(page.locator("#contact")).toHaveCount(0);
      await expect(page.locator('form:has(input[name="email"]):has(input[name="name"])')).toHaveCount(0);
      await expect(page.locator('form:has(input[name="email"]):has(input[name="firstName"])')).toHaveCount(0);
      await expect(page.getByRole("button", { name: /send message|submit inquiry|request information/i })).toHaveCount(0);
    });
  }
});
