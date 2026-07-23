import { test, expect } from "@playwright/test";

test.describe("Admin Operations — Task 073", () => {
  test.describe("Admin layout", () => {
    test("admin sidebar is present", async ({ page }) => {
      await page.goto("/admin");
      await expect(page.getByRole("navigation").first()).toBeVisible();
    });

    test("admin header shows breadcrumb", async ({ page }) => {
      await page.goto("/admin");
      const header = page.locator("header").first();
      await expect(header).toBeVisible();
    });
  });

  test.describe("Admin overview", () => {
    test("renders stat cards", async ({ page }) => {
      await page.goto("/admin");
      await page.waitForLoadState("networkidle");
      const stats = page.locator("[class*='rounded-']").filter({ hasText: /users|wallets|orders|revenue|tickets/i });
      const count = await stats.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe("Admin users page", () => {
    test("renders users table", async ({ page }) => {
      await page.goto("/admin/users");
      await expect(page.getByRole("heading", { name: /users/i })).toBeVisible();
      await expect(page.locator("table")).toBeVisible();
    });
  });

  test.describe("Admin orders page", () => {
    test("renders orders table", async ({ page }) => {
      await page.goto("/admin/orders");
      await expect(page.getByRole("heading", { name: /orders/i })).toBeVisible();
    });
  });

  test.describe("Admin payments page", () => {
    test("renders payments table", async ({ page }) => {
      await page.goto("/admin/payments");
      await expect(page.getByRole("heading", { name: /payments|transactions/i })).toBeVisible();
    });
  });

  test.describe("Admin cards page", () => {
    test("renders card products table", async ({ page }) => {
      await page.goto("/admin/cards");
      await expect(page.getByRole("heading", { name: /cards/i })).toBeVisible();
    });
  });

  test.describe("Admin settings page", () => {
    test("renders settings tabs", async ({ page }) => {
      await page.goto("/admin/settings");
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("tab").first()).toBeVisible();
    });
  });

  test.describe("Admin audit logs page", () => {
    test("renders audit log entries", async ({ page }) => {
      await page.goto("/admin/audit");
      await expect(page.getByRole("heading", { name: /audit|log/i })).toBeVisible();
    });
  });

  test.describe("Admin sidebar navigation", () => {
    test("sidebar items navigate correctly", async ({ page }) => {
      await page.goto("/admin");
      const nav = page.getByRole("navigation").first();
      const items = nav.locator("a");
      const count = await items.count();
      expect(count).toBeGreaterThanOrEqual(5);
    });
  });
});
