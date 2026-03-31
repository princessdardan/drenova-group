import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("form fields are visible", async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test("submitting empty form shows validation errors", async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    // Client-side validation should show error messages
    const errorMessages = page.locator("text=is required");
    expect(await errorMessages.count()).toBeGreaterThanOrEqual(1);
  });

  test("form is accessible with labels", async ({ page }) => {
    await expect(page.locator('label[for="name"]')).toBeVisible();
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="message"]')).toBeVisible();
  });
});
