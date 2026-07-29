import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import ProductsPage from "../ProductsPage";

vi.mock("../../services/carService", () => ({
  carService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { carService } from "../../services/carService";

function renderProductsPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ProductsPage />
    </QueryClientProvider>,
  );
}

const car = {
  id: 1,
  name: "F40",
  brand: "Ferrari",
  category: "SUPERCARS",
  price: 250000,
  stock: 3,
  inStock: true,
};

describe("Admin ProductsPage", () => {
  it("renders the total vehicle count from the server and shows pagination when there are multiple pages", async () => {
    carService.getAll.mockResolvedValue({
      data: { content: [car], totalElements: 45, totalPages: 3 },
    });

    renderProductsPage();

    expect(await screen.findByText("45 total vehicles in the collection.")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    expect(carService.getAll).toHaveBeenCalledWith({ page: 0, size: 20 });
  });

  it("does not render pagination controls for a single page of results", async () => {
    carService.getAll.mockResolvedValue({
      data: { content: [car], totalElements: 1, totalPages: 1 },
    });

    renderProductsPage();

    await screen.findByText("1 total vehicles in the collection.");
    expect(screen.queryByText(/^Page \d+ of \d+$/)).not.toBeInTheDocument();
  });

  it("submits a create-car mutation with the right payload shape", async () => {
    const user = userEvent.setup();
    carService.getAll.mockResolvedValue({
      data: { content: [], totalElements: 0, totalPages: 0 },
    });
    carService.create.mockResolvedValue({ data: car });

    renderProductsPage();

    await user.click(await screen.findByRole("button", { name: /add car/i }));
    await user.type(screen.getByLabelText("Car Name"), "F40");
    await user.type(screen.getByLabelText("Brand"), "Ferrari");
    await user.type(screen.getByLabelText("Price (USD)"), "250000");
    const addCarButtons = screen.getAllByRole("button", { name: /add car/i });
    await user.click(addCarButtons[addCarButtons.length - 1]);

    expect(carService.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "F40", brand: "Ferrari", price: 250000 }),
    );
  });

  it("deletes a car after confirming", async () => {
    const user = userEvent.setup();
    carService.getAll.mockResolvedValue({
      data: { content: [car], totalElements: 1, totalPages: 1 },
    });
    carService.delete.mockResolvedValue({});

    renderProductsPage();

    await user.click(await screen.findByRole("button", { name: "Delete F40" }));
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(carService.delete).toHaveBeenCalledWith(1);
  });
});
