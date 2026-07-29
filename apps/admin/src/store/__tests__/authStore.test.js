import { beforeEach, describe, expect, it } from "vitest";
import useAuthStore from "../authStore";

describe("authStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null });
  });

  it("login sets user/token state and persists the token to localStorage", () => {
    const user = { name: "Alex Admin", email: "alex@veloce.in", role: "ADMIN" };
    useAuthStore.getState().login(user, "jwt-token");

    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().token).toBe("jwt-token");
    expect(localStorage.getItem("veloce_admin_token")).toBe("jwt-token");
  });

  it("logout clears user/token state and removes the token from localStorage", () => {
    useAuthStore.getState().login({ name: "Alex Admin", email: "alex@veloce.in", role: "ADMIN" }, "jwt-token");

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
    expect(localStorage.getItem("veloce_admin_token")).toBeNull();
  });

  it("isAdmin returns true only for the ADMIN role", () => {
    const { isAdmin } = useAuthStore.getState();
    expect(isAdmin({ role: "ADMIN" })).toBe(true);
    expect(isAdmin({ role: "CUSTOMER" })).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });
});
