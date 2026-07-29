import { test, expect } from "@playwright/test";

const CAR = {
  id: 1,
  name: "Ferrari F40",
  brand: "Ferrari",
  category: "SUPERCARS",
  price: 250000,
  originalPrice: null,
  stock: 3,
  inStock: true,
  variants: "Standard",
  imageUrl: "https://example.com/f40.jpg",
};

const ORDER = {
  id: 42,
  status: "PROCESSING",
  totalAmount: 250000,
  createdAt: new Date().toISOString(),
  items: [{ car: CAR, variant: "Standard", quantity: 1, priceAtPurchase: 250000 }],
};

test("customer can register, add a car to cart, and complete checkout", async ({ page }) => {
  // The storefront's route-transition animation briefly remounts the incoming
  // page while the outgoing one exits, which can otherwise wipe form fields
  // typed immediately after a client-side navigation. Waiting past the
  // transition avoids racing it.

  await page.route("**/api/v1/auth/register", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "test-token", email: "grad@example.com", name: "Grad User", role: "CUSTOMER" }),
    }),
  );
  await page.route("**/api/v1/cars/1/related", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) }),
  );
  await page.route("**/api/v1/cars/1", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(CAR) }),
  );
  await page.route("**/api/v1/orders", (route) => {
    if (route.request().method() === "POST") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(ORDER) });
    }
    return route.continue();
  });
  await page.route("**/api/v1/orders/my", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([ORDER]) }),
  );

  // Register
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Grad User");
  await page.getByLabel("Email").fill("grad@example.com");
  await page.getByLabel("Password", { exact: true }).fill("strongpass1");
  await page.getByLabel("Confirm password").fill("strongpass1");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/$/);

  // Browse to the product and reserve it
  await page.goto("/products/1");
  await page.getByRole("button", { name: /begin reservation/i }).click();
  await expect(page.getByRole("button", { name: /reservation started/i })).toBeVisible();

  // Go to cart and continue to checkout
  await page.goto("/cart");
  await expect(page.getByRole("link", { name: "F40", exact: true })).toBeVisible();
  await page.getByRole("button", { name: /continue to reservation/i }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await page.waitForTimeout(700);

  // Fill shipping details and submit
  await page.getByLabel("Full name").fill("Grad User");
  await page.getByLabel("Email").fill("grad@example.com");
  await page.getByLabel("Phone").fill("0400000000");
  await page.getByLabel("Address").fill("1 Test Street");
  await page.getByLabel("City").fill("Brisbane");
  await page.getByLabel("State").fill("QLD");
  await page.getByLabel("Postcode").fill("4000");
  await page.getByRole("button", { name: /confirm reservation/i }).click();

  // Order confirmation
  await expect(page).toHaveURL(/\/orders$/);
  await expect(page.getByText("ORD-42")).toBeVisible();
});
