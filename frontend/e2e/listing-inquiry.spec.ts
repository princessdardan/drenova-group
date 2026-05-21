import { test, expect, type Page } from "@playwright/test";

const listingInquiryFixturePath = "/listings/e2e-lead-capture-fixture";
const suppressedAddressFixturePath = "/listings/e2e-suppressed-address-fixture";
const safeSubmissionEndpoint = "**/api/e2e/listing-inquiry-submissions";

async function expectFixturePage(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response?.status(), `${path} must be a deterministic e2e listing fixture`).toBe(200);
}

test.describe("Listing inquiry lead capture", () => {
  test("detail page exposes sidebar inquiry fields", async ({ page }) => {
    await expectFixturePage(page, listingInquiryFixturePath);

    const inquiry = page.locator("#listing-inquiry");
    await expect(inquiry).toBeVisible();
    await expect(inquiry.getByRole("heading", { name: /request information/i })).toBeVisible();
    await expect(inquiry.getByLabel("Name")).toHaveAttribute("name", "name");
    await expect(inquiry.getByLabel("Email")).toHaveAttribute("name", "email");
    await expect(inquiry.getByLabel("Phone")).toHaveAttribute("name", "phone");
    await expect(inquiry.getByLabel(/I agree to be contacted/i)).toHaveAttribute("name", "privacyMarketingConsent");
    await expect(inquiry.locator('#privacyMarketingConsent-label a[href="/privacy"]')).toBeVisible();
  });

  test("successful inquiry submission uses the e2e-safe seam instead of real email", async ({ page }) => {
    let interceptedSafeSubmission = false;

    await page.route(safeSubmissionEndpoint, async (route) => {
      interceptedSafeSubmission = true;
      const payload = route.request().postData() ?? "";

      expect(payload).toContain("Test Lead");
      expect(payload).toContain("lead@example.test");
      expect(payload).toContain("555-0100");
      expect(payload).toContain("privacyMarketingConsent");
      expect(payload).toContain("e2e-lead-capture-fixture");
      expect(payload).not.toMatch(/address/i);
      expect(payload).not.toMatch(/postal/i);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await expectFixturePage(page, listingInquiryFixturePath);

    const inquiry = page.locator("#listing-inquiry");
    await inquiry.getByLabel("Name").fill("Test Lead");
    await inquiry.getByLabel("Email").fill("lead@example.test");
    await inquiry.getByLabel("Phone").fill("555-0100");
    await inquiry.getByLabel(/I agree to be contacted/i).check();
    await inquiry.getByRole("button", { name: /request information|submit inquiry/i }).click();

    await expect(page.getByText(/thank you|inquiry received/i)).toBeVisible();
    expect(interceptedSafeSubmission).toBe(true);
  });

  test("suppressed address details are neither displayed nor submitted", async ({ page }) => {
    let submittedPayload = "";

    await page.route(safeSubmissionEndpoint, async (route) => {
      submittedPayload = route.request().postData() ?? "";
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await expectFixturePage(page, suppressedAddressFixturePath);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/address withheld|location available upon request/i);
    expect(bodyText).not.toMatch(/postal code/i);
    await expect(page.locator('input[name*="address" i], textarea[name*="address" i]')).toHaveCount(0);
    await expect(page.locator('input[name*="postal" i], textarea[name*="postal" i]')).toHaveCount(0);

    const inquiry = page.locator("#listing-inquiry");
    await inquiry.getByLabel("Name").fill("Suppressed Listing Lead");
    await inquiry.getByLabel("Email").fill("suppressed@example.test");
    await inquiry.getByLabel("Phone").fill("555-0101");
    await inquiry.getByLabel(/I agree to be contacted/i).check();
    await inquiry.getByRole("button", { name: /request information|submit inquiry/i }).click();

    await expect(page.getByText(/thank you|inquiry received/i)).toBeVisible();
    expect(submittedPayload).not.toMatch(/address/i);
    expect(submittedPayload).not.toMatch(/postal/i);
  });
});

test.describe("Listing inquiry lead capture on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile listing CTA targets the local inquiry form", async ({ page }) => {
    await expectFixturePage(page, listingInquiryFixturePath);

    const mobileCta = page.getByRole("link", { name: "Request Info" }).last();
    await expect(mobileCta).toHaveAttribute("href", "#listing-inquiry");
    await mobileCta.click();

    await expect(page).toHaveURL(/#listing-inquiry$/);
    await expect(page.locator("#listing-inquiry").getByLabel("Name")).toBeVisible();
  });
});

test.describe("Listing inquiry lead capture on laptop", () => {
  test.use({ viewport: { width: 1366, height: 768 } });

  test("submit button is reachable without scrolling to page bottom", async ({ page }) => {
    await expectFixturePage(page, listingInquiryFixturePath);

    const submitButton = page
      .locator("#listing-inquiry")
      .getByRole("button", { name: /request information|submit inquiry/i });

    const sidebar = page.locator(".sticky.top-28");
    await sidebar.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });
});
