import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import App from "./App";

describe("admin route protection", () => {
  beforeEach(() => { localStorage.clear(); window.history.pushState({}, "", "/dashboard"); });

  it("redirects unauthenticated users to login", async () => {
    render(<App />);
    expect(await screen.findByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });
});
