import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CheckoutPage from "../CheckoutPage";
import useCartStore from "../../store/cartStore";

vi.mock("../../services/orderService", () => ({
  orderService: { create: vi.fn(), createCheckoutSession: vi.fn() },
}));

import { orderService } from "../../services/orderService";

const product = { id: 1, name: "Ferrari F40", brand: "Ferrari", price: 250000 };

function seedCart() {
  useCartStore.setState({ items: [{ product, size: "Standard", quantity: 1 }] });
}

function renderCheckout() {
  return render(
    <MemoryRouter initialEntries={["/checkout"]}>
      <Routes>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<div>Cart page</div>} />
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/orders" element={<div>Orders page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillRequiredFields(user) {
  await user.type(screen.getByLabelText("Full name"), "Alex Driver");
  await user.type(screen.getByLabelText("Email"), "alex@example.com");
  await user.type(screen.getByLabelText("Phone"), "0400000000");
  await user.type(screen.getByLabelText("Address"), "1 Test Street");
  await user.type(screen.getByLabelText("City"), "Brisbane");
  await user.type(screen.getByLabelText("State"), "QLD");
  await user.type(screen.getByLabelText("Postcode"), "4000");
}

describe("CheckoutPage", () => {
  beforeEach(() => {
    localStorage.setItem("veloce_token", "jwt-token");
    seedCart();
  });

  afterEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [] });
    vi.unstubAllEnvs();
  });

  it("blocks submission and shows required-field errors when the form is empty", async () => {
    const user = userEvent.setup();
    renderCheckout();

    await user.click(screen.getByRole("button", { name: /confirm reservation/i }));

    expect(await screen.findByText("Complete the required client details.")).toBeInTheDocument();
    expect(orderService.create).not.toHaveBeenCalled();
  });

  it("submits the mapped shipping payload, clears the cart, and redirects to /orders", async () => {
    const user = userEvent.setup();
    orderService.create.mockResolvedValue({ data: { id: 42 } });

    renderCheckout();
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /confirm reservation/i }));

    expect(await screen.findByText("Orders page")).toBeInTheDocument();
    expect(orderService.create).toHaveBeenCalledWith({
      shippingName: "Alex Driver",
      shippingEmail: "alex@example.com",
      shippingPhone: "0400000000",
      shippingAddress: "1 Test Street",
      shippingCity: "Brisbane",
      shippingState: "QLD",
      shippingPincode: "4000",
      items: [{ carId: 1, variant: "Standard", quantity: 1 }],
    });
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("redirects to Stripe checkout when Stripe is enabled", async () => {
    vi.stubEnv("VITE_STRIPE_ENABLED", "true");
    const user = userEvent.setup();
    orderService.create.mockResolvedValue({ data: { id: 42 } });
    orderService.createCheckoutSession.mockResolvedValue({
      data: { checkoutUrl: "https://stripe.example/session/123" },
    });
    const assignSpy = vi.fn();
    vi.stubGlobal("location", { ...window.location, assign: assignSpy });

    renderCheckout();
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /confirm reservation/i }));

    await vi.waitFor(() => {
      expect(orderService.createCheckoutSession).toHaveBeenCalledWith(42);
    });
    expect(assignSpy).toHaveBeenCalledWith("https://stripe.example/session/123");
  });
});
