import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("form fields are visible", async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('select[name="subject"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test("submitting empty form shows validation errors", async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("#name-error")).toHaveText("Name is required.");
    await expect(page.locator("#email-error")).toHaveText("Email is required.");
    await expect(page.locator("#subject-error")).toHaveText("Please select a subject.");
    await expect(page.locator("#message-error")).toHaveText("Message is required.");

    await expect(page.locator('input[name="name"]')).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator('input[name="name"]')).toHaveAttribute("aria-describedby", "name-error");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("aria-describedby", "email-error");
    await expect(page.locator('select[name="subject"]')).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator('select[name="subject"]')).toHaveAttribute("aria-describedby", "subject-error");
    await expect(page.locator('textarea[name="message"]')).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator('textarea[name="message"]')).toHaveAttribute("aria-describedby", "message-error");

    await expect(page.locator('input[name="phone"]')).toHaveAttribute("aria-invalid", "false");
    await expect(page.locator('input[name="phone"]')).not.toHaveAttribute("aria-describedby", /.+/);
  });

  test("form is accessible with labels", async ({ page }) => {
    await expect(page.locator('label[for="name"]')).toBeVisible();
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="phone"]')).toBeVisible();
    await expect(page.locator('label[for="subject"]')).toBeVisible();
    await expect(page.locator('label[for="message"]')).toBeVisible();

    await expect(page.getByLabel("Name")).toHaveAttribute("name", "name");
    await expect(page.getByLabel("Email")).toHaveAttribute("name", "email");
    await expect(page.getByLabel("Phone")).toHaveAttribute("name", "phone");
    await expect(page.getByLabel("Subject")).toHaveAttribute("name", "subject");
    await expect(page.getByLabel("Message")).toHaveAttribute("name", "message");
  });
});

test.describe("Home evaluation lead form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home-evaluation");
  });

  test("uses home-evaluation field names", async ({ page }) => {
    await expect(page.getByLabel("Name")).toHaveAttribute("name", "name");
    await expect(page.getByLabel("Email")).toHaveAttribute("name", "email");
    await expect(page.getByLabel("Phone")).toHaveAttribute("name", "phone");
    await expect(page.getByLabel("Address Line")).toHaveAttribute("name", "addressLine");
    await expect(page.getByLabel("Unit/Suite")).toHaveAttribute("name", "unit");
    await expect(page.getByLabel("City")).toHaveAttribute("name", "city");
    await expect(page.getByLabel("Province/State")).toHaveAttribute("name", "province");
    await expect(page.getByLabel("Postal Code")).toHaveAttribute("name", "postalCode");
    await expect(page.getByLabel("Additional Notes")).toHaveAttribute("name", "notes");

    await expect(page.locator('input[name="firstName"]')).toHaveCount(0);
    await expect(page.locator('input[name="lastName"]')).toHaveCount(0);
  });

  test("submitting empty home-evaluation form validates name and email only", async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("#name-error")).toHaveText("Name is required.");
    await expect(page.locator("#email-error")).toHaveText("Email is required.");

    await expect(page.locator('input[name="name"]')).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator('input[name="name"]')).toHaveAttribute("aria-describedby", "name-error");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("aria-describedby", "email-error");

    await expect(page.locator('input[name="phone"]')).toHaveAttribute("aria-invalid", "false");
    await expect(page.locator('input[name="addressLine"]')).toHaveAttribute("aria-invalid", "false");
    await expect(page.locator('input[name="unit"]')).toHaveAttribute("aria-invalid", "false");
    await expect(page.locator('input[name="city"]')).toHaveAttribute("aria-invalid", "false");
    await expect(page.locator('input[name="province"]')).toHaveAttribute("aria-invalid", "false");
    await expect(page.locator('input[name="postalCode"]')).toHaveAttribute("aria-invalid", "false");
    await expect(page.locator('textarea[name="notes"]')).toHaveAttribute("aria-invalid", "false");
  });
});
