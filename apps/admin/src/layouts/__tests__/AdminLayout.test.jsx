import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import AdminLayout from "../AdminLayout";
import useAuthStore from "../../store/authStore";

function renderLayout(path = "/products") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<div>Dashboard content</div>} />
          <Route path="/products" element={<div>Products content</div>} />
        </Route>
        <Route path="/login" element={<div>Login screen</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminLayout", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { name: "Alex Admin", email: "alex@veloce.in", role: "ADMIN" },
      token: "jwt-token",
    });
  });

  it("shows a route-aware breadcrumb for the current page", () => {
    renderLayout("/products");
    expect(screen.getByText("Products content")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent("Products");
  });

  it("shows the real logged-in user's initial in the account menu, not a hardcoded one", async () => {
    const user = userEvent.setup();
    renderLayout("/dashboard");

    const accountButton = screen.getByRole("button", { name: "Account menu" });
    expect(accountButton).toHaveTextContent("A");

    await user.click(accountButton);
    expect(screen.getByText("Alex Admin")).toBeInTheDocument();
    expect(screen.getByText("alex@veloce.in")).toBeInTheDocument();
  });

  it("logs out and navigates to /login", async () => {
    const user = userEvent.setup();
    renderLayout("/dashboard");

    await user.click(screen.getByRole("button", { name: "Account menu" }));
    const logoutButtons = screen.getAllByRole("button", { name: /logout/i });
    await user.click(logoutButtons[logoutButtons.length - 1]);

    expect(await screen.findByText("Login screen")).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
