import { test, expect } from "@playwright/test";

test.describe("Authentication — Task 070", () => {
  test.describe("Login page", () => {
    test("renders with all form elements", async ({ page }) => {
      await page.goto("/auth/login");
      await expect(page).toHaveTitle(/sign.?in/i);
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
      await expect(page.getByRole("link", { name: /create account|register/i })).toBeVisible();
    });

    test("validates empty form submission", async ({ page }) => {
      await page.goto("/auth/login");
      await page.getByRole("button", { name: /sign in/i }).click();
      await expect(page.getByText(/invalid email/i)).toBeVisible();
    });

    test("validates invalid email format", async ({ page }) => {
      await page.goto("/auth/login");
      await page.getByLabel(/email/i).fill("not-an-email");
      await page.getByLabel(/password/i).fill("StrongPass1");
      await page.getByRole("button", { name: /sign in/i }).click();
      await expect(page.getByText(/invalid email/i)).toBeVisible();
    });

    test("has link to forgot password", async ({ page }) => {
      await page.goto("/auth/login");
      await expect(page.getByRole("link", { name: /forgot|reset password/i })).toBeVisible();
    });
  });

  test.describe("Registration page", () => {
    test("renders with all form elements", async ({ page }) => {
      await page.goto("/auth/register");
      await expect(page).toHaveTitle(/create.?account|register/i);
      await expect(page.getByLabel(/name/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /create account|sign up/i })).toBeVisible();
    });

    test("validates empty form", async ({ page }) => {
      await page.goto("/auth/register");
      await page.getByRole("button", { name: /create account|sign up/i }).click();
      await expect(page.getByText(/invalid email|required/i)).toBeVisible();
    });

    test("has link to login", async ({ page }) => {
      await page.goto("/auth/register");
      await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
    });
  });

  test.describe("Forgot password page", () => {
    test("renders email input and submit button", async ({ page }) => {
      await page.goto("/auth/forgot-password");
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /send|reset/i })).toBeVisible();
    });

    test("validates email", async ({ page }) => {
      await page.goto("/auth/forgot-password");
      await page.getByRole("button", { name: /send|reset/i }).click();
      await expect(page.getByText(/invalid email/i)).toBeVisible();
    });
  });
});
