import { describe, expect, it, vi } from "vitest";

vi.mock("../api", () => ({
  default: { post: vi.fn(() => Promise.resolve({ data: { token: "jwt-token" } })) },
}));

import api from "../api";
import { authService } from "../authService";

describe("authService", () => {
  it("login posts credentials to /auth/login and returns the response unmodified", async () => {
    const credentials = { email: "alex@veloce.in", password: "admin123" };

    const response = await authService.login(credentials);

    expect(api.post).toHaveBeenCalledWith("/auth/login", credentials);
    expect(response.data).toEqual({ token: "jwt-token" });
  });
});
