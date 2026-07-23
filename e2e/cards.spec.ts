import { test, expect } from "@playwright/test";

test.describe("Card Ordering", () => {
  test("shows card products on dashboard", async ({ page }) => {
    await page.goto("/dashboard/cards");
    await expect(page.getByText(/sapphire|obsidian|cyber|gold|holographic/i).first()).toBeVisible();
  });

  test("shows card order form", async ({ page }) => {
    await page.goto("/dashboard/orders/new");
    await page.waitForLoadState("networkidle");
    const select = page.locator("select").first();
    await expect(select).toBeVisible();
  });
});
