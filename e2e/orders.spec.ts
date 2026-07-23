import { test, expect } from "@playwright/test";

test.describe("Card Ordering — Task 072", () => {
  test.describe("Order listing page", () => {
    test("renders orders page", async ({ page }) => {
      await page.goto("/dashboard/orders");
      await expect(page.getByRole("heading", { name: /order/i })).toBeVisible();
    });
  });

  test.describe("New order page", () => {
    test("renders order creation form", async ({ page }) => {
      await page.goto("/dashboard/orders/new");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("form, [role='form'], select").first()).toBeVisible();
    });

    test("requires product selection", async ({ page }) => {
      await page.goto("/dashboard/orders/new");
      const submitBtn = page.getByRole("button", { name: /submit|create|place order/i });
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await expect(page.getByText(/required/i).first()).toBeVisible();
      }
    });
  });
});
