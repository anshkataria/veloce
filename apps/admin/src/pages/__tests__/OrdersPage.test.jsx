import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OrdersPage from "../OrdersPage";

vi.mock("../../services/orderService", () => ({
  orderService: { getAll: vi.fn(), updateStatus: vi.fn() },
}));

import { orderService } from "../../services/orderService";

const orders = [
  { id: 1, status: "DELIVERED", totalAmount: 250000, shippingName: "Buyer One", shippingEmail: "one@example.com", items: [{}], createdAt: new Date().toISOString() },
  { id: 2, status: "PROCESSING", totalAmount: 90000, shippingName: "Buyer Two", shippingEmail: "two@example.com", items: [{}, {}], createdAt: new Date().toISOString() },
];

function renderOrdersPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <OrdersPage />
    </QueryClientProvider>,
  );
}

describe("Admin OrdersPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("no SSE in tests"))));
  });

  it("renders order rows with status badges", async () => {
    orderService.getAll.mockResolvedValue({ data: orders });

    renderOrdersPage();

    expect(await screen.findByText("ORD-1")).toBeInTheDocument();
    expect(screen.getByText("ORD-2")).toBeInTheDocument();
    expect(screen.getByText("DELIVERED")).toBeInTheDocument();
    expect(screen.getByText("PROCESSING")).toBeInTheDocument();
  });

  it("shows an empty state when there are no orders", async () => {
    orderService.getAll.mockResolvedValue({ data: [] });

    renderOrdersPage();

    expect(await screen.findByText("No orders found")).toBeInTheDocument();
  });
});
