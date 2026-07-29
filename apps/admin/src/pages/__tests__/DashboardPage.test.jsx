import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import DashboardPage from "../DashboardPage";

vi.mock("../../services/orderService", () => ({
  orderService: { getAll: vi.fn() },
}));
vi.mock("../../services/carService", () => ({
  carService: { getAll: vi.fn() },
}));

import { orderService } from "../../services/orderService";
import { carService } from "../../services/carService";

const now = new Date().toISOString();

const orders = [
  { id: 1, status: "DELIVERED", totalAmount: 250000, shippingName: "Buyer One", shippingEmail: "one@example.com", createdAt: now },
  { id: 2, status: "PROCESSING", totalAmount: 180000, shippingName: "Buyer Two", shippingEmail: "two@example.com", createdAt: now },
  { id: 3, status: "SHIPPED", totalAmount: 90000, shippingName: "Buyer One", shippingEmail: "one@example.com", createdAt: now },
];

function renderDashboard() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
    </QueryClientProvider>,
  );
}

describe("Admin DashboardPage", () => {
  it("renders real computed stats derived from orders/cars, not placeholders", async () => {
    orderService.getAll.mockResolvedValue({ data: orders });
    carService.getAll.mockResolvedValue({ data: { totalElements: 8 } });

    renderDashboard();

    // Revenue: sum of totalAmount
    expect(await screen.findByText("$520,000")).toBeInTheDocument();
    // Orders: orders.length
    expect(screen.getByText("3")).toBeInTheDocument();
    // Vehicles: totalElements from carService
    expect(screen.getByText("8")).toBeInTheDocument();
    // Customers: distinct shippingEmail count (one@example.com, two@example.com) — not "—"
    expect(screen.queryByText("—")).not.toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("does not render a fabricated month-over-month delta row", async () => {
    orderService.getAll.mockResolvedValue({ data: orders });
    carService.getAll.mockResolvedValue({ data: { totalElements: 8 } });

    renderDashboard();

    await screen.findByText("$520,000");
    expect(screen.queryByText(/vs last month/i)).not.toBeInTheDocument();
  });
});
