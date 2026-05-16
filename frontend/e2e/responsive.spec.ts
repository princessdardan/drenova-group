import { test, expect, type Page } from "@playwright/test";

test.describe("Mobile responsive behavior", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const mobileMenu = (page: Page) => page.locator("#mobile-menu");

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
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(mobileMenu(page)).toHaveAttribute("aria-hidden", "true");
  });

  test("mobile menu opens and closes with the close button", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.locator('button[aria-label="Open menu"]');
    const menu = mobileMenu(page);

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toHaveAttribute("aria-hidden", "false");
    await expect(menu.getByRole("link", { name: "Buy" })).toBeVisible();

    await page.locator('button[aria-label="Close menu"]').click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveAttribute("aria-hidden", "true");
  });

  test("Escape closes the mobile menu", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.locator('button[aria-label="Open menu"]');
    const menu = mobileMenu(page);

    await menuButton.click();
    await expect(menu).toHaveAttribute("aria-hidden", "false");

    await page.keyboard.press("Escape");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveAttribute("aria-hidden", "true");
  });

  test("clicking a mobile link navigates and closes the menu", async ({ page }) => {
    await page.goto("/");
    const menu = mobileMenu(page);

    await page.locator('button[aria-label="Open menu"]').click();
    await expect(menu).toHaveAttribute("aria-hidden", "false");

    await menu.getByRole("link", { name: "Buy" }).click();
    await expect(page).toHaveURL(/\/buy$/);
    await expect(menu).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator('button[aria-label="Open menu"]')).toHaveAttribute("aria-expanded", "false");
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
