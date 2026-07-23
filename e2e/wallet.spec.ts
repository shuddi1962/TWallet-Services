import { test, expect } from "@playwright/test";

test.describe("Wallet Connection — Task 071", () => {
  test.describe("Dashboard wallet page", () => {
    test("renders wallet connection section", async ({ page }) => {
      await page.goto("/dashboard/wallet");
      await expect(page.getByRole("heading", { name: /wallet/i })).toBeVisible();
    });

    test("shows wallet stats cards", async ({ page }) => {
      await page.goto("/dashboard/wallet");
      const cards = page.locator("[class*='rounded-']").filter({ hasText: /balance|connected|network/i });
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe("WalletConnect modal", () => {
    test("wallet connect button is present", async ({ page }) => {
      await page.goto("/dashboard/wallet");
      const btn = page.getByRole("button", { name: /connect|wallet/i }).first();
      await expect(btn).toBeVisible();
    });
  });
});
