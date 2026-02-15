/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║  COUNTER COMPONENT TESTS                                   ║
 * ║  Showcases: render, screen queries, user interaction,     ║
 * ║  getByRole, getByText, getByTestId, queryBy vs getBy,     ║
 * ║  fireEvent vs userEvent, callback mocking (vi.fn)         ║
 * ╚════════════════════════════════════════════════════════════╝
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "@/components/Counter";

// ─── 1. Basic Rendering ───────────────────────────────

describe("Counter", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Counter />);

      // getByText — finds element by its text content
      expect(screen.getByText("Counter")).toBeInTheDocument();

      // getByTestId — finds element by data-testid attribute
      expect(screen.getByTestId("count-display")).toHaveTextContent("0");
    });

    it("renders with custom initial count", () => {
      render(<Counter initialCount={10} />);

      // toHaveTextContent — checks text content of an element
      expect(screen.getByTestId("count-display")).toHaveTextContent("10");
    });

    it("renders with custom label", () => {
      render(<Counter label="My Counter" />);
      expect(screen.getByText("My Counter")).toBeInTheDocument();
    });

    it("does NOT show reset button when count is 0", () => {
      render(<Counter />);

      // queryByTestId — returns null instead of throwing when not found
      // Use queryBy* when you want to assert something is NOT there
      expect(screen.queryByTestId("reset-button")).not.toBeInTheDocument();
    });
  });

  // ─── 2. User Interactions ──────────────────────────

  describe("user interactions", () => {
    it("increments the count when + is clicked", async () => {
      // userEvent.setup() creates a user instance for realistic events
      const user = userEvent.setup();
      render(<Counter />);

      // getByRole — finds element by its ARIA role (recommended approach!)
      const incrementBtn = screen.getByRole("button", { name: "Increment" });
      await user.click(incrementBtn);

      expect(screen.getByTestId("count-display")).toHaveTextContent("1");
    });

    it("decrements the count when − is clicked", async () => {
      const user = userEvent.setup();
      render(<Counter initialCount={5} />);

      const decrementBtn = screen.getByRole("button", { name: "Decrement" });
      await user.click(decrementBtn);

      expect(screen.getByTestId("count-display")).toHaveTextContent("4");
    });

    it("increments by custom step", async () => {
      const user = userEvent.setup();
      render(<Counter step={5} />);

      await user.click(screen.getByRole("button", { name: "Increment" }));
      expect(screen.getByTestId("count-display")).toHaveTextContent("5");

      await user.click(screen.getByRole("button", { name: "Increment" }));
      expect(screen.getByTestId("count-display")).toHaveTextContent("10");
    });

    it("shows and uses reset button after incrementing", async () => {
      const user = userEvent.setup();
      render(<Counter />);

      // Before clicking: no reset button
      expect(screen.queryByTestId("reset-button")).not.toBeInTheDocument();

      // Click increment
      await user.click(screen.getByRole("button", { name: "Increment" }));

      // After clicking: reset button appears (conditional rendering!)
      const resetBtn = screen.getByTestId("reset-button");
      expect(resetBtn).toBeInTheDocument();

      // Click reset
      await user.click(resetBtn);
      expect(screen.getByTestId("count-display")).toHaveTextContent("0");
      expect(screen.queryByTestId("reset-button")).not.toBeInTheDocument();
    });
  });

  // ─── 3. Callback / Mock Testing ───────────────────

  describe("callbacks", () => {
    it("calls onCountChange when count changes", async () => {
      const user = userEvent.setup();
      // vi.fn() creates a mock function that tracks calls
      const handleChange = vi.fn();
      render(<Counter onCountChange={handleChange} />);

      await user.click(screen.getByRole("button", { name: "Increment" }));

      // toHaveBeenCalled — asserts the mock was called at least once
      expect(handleChange).toHaveBeenCalled();

      // toHaveBeenCalledWith — asserts the mock was called with specific args
      expect(handleChange).toHaveBeenCalledWith(1);

      // toHaveBeenCalledTimes — asserts exact number of calls
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("tracks multiple callback invocations", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Counter onCountChange={handleChange} />);

      await user.click(screen.getByRole("button", { name: "Increment" }));
      await user.click(screen.getByRole("button", { name: "Increment" }));
      await user.click(screen.getByRole("button", { name: "Increment" }));

      expect(handleChange).toHaveBeenCalledTimes(3);

      // Check the sequence of calls
      expect(handleChange.mock.calls).toEqual([[1], [2], [3]]);
    });
  });

  // ─── 4. Disabled State & Conditional Rendering ────

  describe("max value", () => {
    it("disables increment at max", async () => {
      const user = userEvent.setup();
      render(<Counter initialCount={9} max={10} />);

      await user.click(screen.getByRole("button", { name: "Increment" }));

      // toBeDisabled — checks if element has disabled attribute
      expect(screen.getByRole("button", { name: "Increment" })).toBeDisabled();

      // Shows alert message
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Maximum value reached!"
      );
    });

    it("does not show alert below max", () => {
      render(<Counter initialCount={5} max={10} />);
      // queryByRole — returns null when not found (no throw)
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
