import { test, expect } from "@playwright/test";

test("customer can register through the storefront", async ({ page }) => {
  await page.route("**/api/v1/auth/register", (route) => route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ token: "test-token", email: "grad@example.com", name: "Grad User", role: "CUSTOMER" }),
  }));
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Grad User");
  await page.getByLabel("Email").fill("grad@example.com");
  await page.getByLabel("Password", { exact: true }).fill("strongpass1");
  await page.getByLabel("Confirm password").fill("strongpass1");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("veloce_token"))).toBe("test-token");
});
