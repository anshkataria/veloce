import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "@playwright/test";

// Manual, human-facing capture script for the README's screenshot gallery.
// Run with `npm run screenshots` against a running `docker compose up --build`
// stack — it is excluded from the normal CI e2e run via the @screenshots tag.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, "../../../docs/screenshots");

const STOREFRONT_URL = process.env.SCREENSHOT_STOREFRONT_URL || "http://localhost:5173";
const ADMIN_URL = process.env.SCREENSHOT_ADMIN_URL || "http://localhost:5174";
const ADMIN_EMAIL = process.env.SCREENSHOT_ADMIN_EMAIL || "admin@veloce.in";
const ADMIN_PASSWORD = process.env.SCREENSHOT_ADMIN_PASSWORD || "admin123";

test.describe("@screenshots", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("storefront home", async ({ page }) => {
    await page.goto(STOREFRONT_URL);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: path.join(OUTPUT_DIR, "storefront-home.png") });
  });

  test("storefront product detail", async ({ page }) => {
    await page.goto(`${STOREFRONT_URL}/products`);
    await page.waitForLoadState("networkidle");
    await page.locator("a[href^='/products/']").first().click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: path.join(OUTPUT_DIR, "storefront-product-detail.png") });
  });

  test("storefront checkout", async ({ page }) => {
    await page.goto(`${STOREFRONT_URL}/products`);
    await page.waitForLoadState("networkidle");
    await page.locator("a[href^='/products/']").first().click();
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /begin reservation/i }).click();
    await page.waitForTimeout(700);
    await page.goto(`${STOREFRONT_URL}/cart`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /continue to reservation/i }).click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "storefront-checkout.png") });
  });

  test("admin dashboard, orders, and products", async ({ page }) => {
    // Orders keeps an open SSE connection (`/orders/events`), so
    // `networkidle` never resolves there — wait for a concrete heading instead.
    await page.goto(ADMIN_URL);
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard$/);
    await page.getByRole("heading", { name: "Dashboard" }).waitFor();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "admin-dashboard.png") });

    await page.goto(`${ADMIN_URL}/orders`);
    await page.getByRole("heading", { name: "Orders" }).waitFor();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "admin-orders.png") });

    await page.goto(`${ADMIN_URL}/products`);
    await page.getByRole("heading", { name: "Products" }).waitFor();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "admin-products.png") });
  });
});
