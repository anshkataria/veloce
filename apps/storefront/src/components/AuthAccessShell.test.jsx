import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuthField } from "./AuthAccessShell";

describe("AuthField", () => {
  it("toggles password visibility accessibly", async () => {
    const user = userEvent.setup();
    render(<AuthField label="Password" name="password" type="password" value="secret123" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
  });

  it("connects validation errors to the input", () => {
    render(<AuthField label="Email" name="email" value="bad" onChange={vi.fn()} error="Use a valid email" />);
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription("Use a valid email");
  });
});
