import { test, expect } from "@playwright/test";

test.describe("Mobile responsive behavior", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("no horizontal overflow on mobile", async ({ page }) => {
    await page.goto("/");

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasOverflow).toBe(false);
  });

  test("menu button is visible on mobile", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible();
  });

  test("hero section has appropriate min-height", async ({ page }) => {
    await page.goto("/");

    const heroSection = page.locator("section").first();
    const box = await heroSection.boundingBox();
    expect(box).not.toBeNull();
    // Hero should be at least 50% of viewport height
    expect(box!.height).toBeGreaterThanOrEqual(844 * 0.5);
  });
});
