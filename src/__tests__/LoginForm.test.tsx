/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║  LOGIN FORM TESTS                                          ║
 * ║  Showcases: form interactions, async testing,              ║
 * ║  waitFor, findBy* queries, validation errors,              ║
 * ║  typing into inputs, mocking async callbacks               ║
 * ╚════════════════════════════════════════════════════════════╝
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/LoginForm";

describe("LoginForm", () => {
  // Helper: create a mock submit handler
  const mockSubmit = vi.fn();

  // ─── beforeEach — runs before every test ──────────
  beforeEach(() => {
    // Reset mock between tests to avoid cross-test contamination
    mockSubmit.mockReset();
  });

  // ─── 1. Initial Rendering ─────────────────────────

  describe("initial render", () => {
    it("renders the form with all fields", () => {
      render(<LoginForm onSubmit={mockSubmit} />);

      // getByLabelText — finds inputs by their associated <label>
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Sign In" }),
      ).toBeInTheDocument();
    });

    it("renders inputs with correct types", () => {
      render(<LoginForm onSubmit={mockSubmit} />);

      // toHaveAttribute — checks HTML attribute value
      expect(screen.getByLabelText("Email Address")).toHaveAttribute(
        "type",
        "email",
      );
      expect(screen.getByLabelText("Password")).toHaveAttribute(
        "type",
        "password",
      );
    });

    it("has correct placeholder text", () => {
      render(<LoginForm onSubmit={mockSubmit} />);

      // getByPlaceholderText — finds by placeholder attribute
      expect(
        screen.getByPlaceholderText("you@example.com"),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    });
  });

  // ─── 2. Form Interaction ──────────────────────────

  describe("form interaction", () => {
    it("allows typing in email field", async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockSubmit} />);

      const emailInput = screen.getByLabelText("Email Address");

      // user.type — simulates typing characters one by one
      await user.type(emailInput, "test@example.com");

      // toHaveValue — checks input's current value
      expect(emailInput).toHaveValue("test@example.com");
    });

    it("allows typing in password field", async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText("Password"), "secret123");
      expect(screen.getByLabelText("Password")).toHaveValue("secret123");
    });

    it("allows clearing and retyping", async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockSubmit} />);

      const emailInput = screen.getByLabelText("Email Address");
      await user.type(emailInput, "wrong@test.com");

      // user.clear — clears the input field
      await user.clear(emailInput);
      expect(emailInput).toHaveValue("");

      await user.type(emailInput, "correct@test.com");
      expect(emailInput).toHaveValue("correct@test.com");
    });
  });

  // ─── 3. Validation Errors ────────────────────────

  describe("validation", () => {
    it("shows error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockSubmit} />);

      await user.click(screen.getByRole("button", { name: "Sign In" }));

      // getAllByRole — finds all matching elements (expects at least 1)
      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThanOrEqual(2);

      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();

      // Submit should NOT have been called
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("shows error for invalid email format", async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText("Email Address"), "not-an-email");
      await user.type(screen.getByLabelText("Password"), "password123");
      await user.click(screen.getByRole("button", { name: "Sign In" }));

      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("shows error for short password", async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockSubmit} />);

      await user.type(
        screen.getByLabelText("Email Address"),
        "test@example.com",
      );
      await user.type(screen.getByLabelText("Password"), "abc");
      await user.click(screen.getByRole("button", { name: "Sign In" }));

      expect(
        screen.getByText("Password must be at least 6 characters"),
      ).toBeInTheDocument();
    });

    it("sets aria-invalid on fields with errors", async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockSubmit} />);

      await user.click(screen.getByRole("button", { name: "Sign In" }));

      // aria-invalid is set to "true" on invalid fields
      expect(screen.getByLabelText("Email Address")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });
  });

  // ─── 4. Async Submission ─────────────────────────

  describe("async submission", () => {
    it("submits with valid data", async () => {
      const user = userEvent.setup();
      // mockResolvedValue — makes mock return a resolved promise
      mockSubmit.mockResolvedValue(undefined);
      render(<LoginForm onSubmit={mockSubmit} />);

      await user.type(
        screen.getByLabelText("Email Address"),
        "test@example.com",
      );
      await user.type(screen.getByLabelText("Password"), "password123");
      await user.click(screen.getByRole("button", { name: "Sign In" }));

      // waitFor — retries until the assertion passes or times out
      // Perfect for async state changes!
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });
    });

    it("shows success message after successful login", async () => {
      const user = userEvent.setup();
      mockSubmit.mockResolvedValue(undefined);
      render(<LoginForm onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText("Email Address"), "user@test.com");
      await user.type(screen.getByLabelText("Password"), "pass123456");
      await user.click(screen.getByRole("button", { name: "Sign In" }));

      // findByTestId — combines getByTestId + waitFor (async query)
      // Use findBy* when the element appears after an async operation
      const success = await screen.findByTestId("success-message");
      expect(success).toHaveTextContent("Login successful");
    });

    it("shows error when submission fails", async () => {
      const user = userEvent.setup();
      // mockRejectedValue — makes mock return a rejected promise
      mockSubmit.mockRejectedValue(new Error("Network error"));
      render(<LoginForm onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText("Email Address"), "user@test.com");
      await user.type(screen.getByLabelText("Password"), "pass123456");
      await user.click(screen.getByRole("button", { name: "Sign In" }));

      await waitFor(() => {
        expect(
          screen.getByText("Login failed. Please try again."),
        ).toBeInTheDocument();
      });
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      // Create a promise that we control manually
      let resolveSubmit!: () => void;
      mockSubmit.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          }),
      );

      render(<LoginForm onSubmit={mockSubmit} />);
      await user.type(screen.getByLabelText("Email Address"), "user@test.com");
      await user.type(screen.getByLabelText("Password"), "pass123456");
      await user.click(screen.getByRole("button", { name: "Sign In" }));

      // While submitting, button shows loading text
      await waitFor(() => {
        expect(screen.getByText("Signing in...")).toBeInTheDocument();
      });

      // Resolve the promise to complete the submission
      resolveSubmit();

      await waitFor(() => {
        expect(screen.getByTestId("success-message")).toBeInTheDocument();
      });
    });
  });
});
