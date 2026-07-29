import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "../LoginPage";
import useAuthStore from "../../store/authStore";

vi.mock("../../services/authService", () => ({
  authService: { login: vi.fn() },
}));

import { authService } from "../../services/authService";

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Dashboard Home</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Admin LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, token: null });
  });

  it("logs in and navigates to the dashboard when the account is an admin", async () => {
    const user = userEvent.setup();
    authService.login.mockResolvedValue({
      data: { token: "jwt-token", email: "alex@veloce.in", name: "Alex Admin", role: "ADMIN" },
    });

    renderLoginPage();
    await user.type(screen.getByLabelText("Email"), "alex@veloce.in");
    await user.type(screen.getByLabelText("Password"), "admin123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Dashboard Home")).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBe("jwt-token");
  });

  it("rejects a non-admin login without navigating away", async () => {
    const user = userEvent.setup();
    authService.login.mockResolvedValue({
      data: { token: "jwt-token", email: "buyer@example.com", name: "Buyer", role: "CUSTOMER" },
    });

    renderLoginPage();
    await user.type(screen.getByLabelText("Email"), "buyer@example.com");
    await user.type(screen.getByLabelText("Password"), "password1");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Access denied. Admin accounts only.")).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it("shows the server error message when login fails", async () => {
    const user = userEvent.setup();
    authService.login.mockRejectedValue({ response: { data: { error: "Invalid credentials" } } });

    renderLoginPage();
    await user.type(screen.getByLabelText("Email"), "alex@veloce.in");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });
});
