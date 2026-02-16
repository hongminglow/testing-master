/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║  TODO LIST + USER LIST TESTS                               ║
 * ║  Showcases: list rendering, keyboard events,              ║
 * ║  within(), async data fetching, mocking API calls,        ║
 * ║  loading/error states, act() considerations               ║
 * ╚════════════════════════════════════════════════════════════╝
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList, UserList, type User } from "@/components/TodoList";

describe("TodoList", () => {
  // ─── 1. Empty State ──────────────────────────────

  describe("empty state", () => {
    it("shows empty message initially", () => {
      render(<TodoList />);
      expect(screen.getByTestId("empty-message")).toHaveTextContent(
        "No tasks yet"
      );
    });

    it("has a disabled Add button when input is empty", () => {
      render(<TodoList />);
      expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
    });
  });

  // ─── 2. Adding Todos ────────────────────────────

  describe("adding todos", () => {
    it("adds a todo when clicking Add", async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByLabelText("New todo");
      await user.type(input, "Write tests");
      await user.click(screen.getByRole("button", { name: "Add" }));

      // The todo text should appear in the list
      expect(screen.getByText("Write tests")).toBeInTheDocument();
      // Input should be cleared
      expect(input).toHaveValue("");
      // Empty message should be gone
      expect(screen.queryByTestId("empty-message")).not.toBeInTheDocument();
    });

    it("adds a todo when pressing Enter", async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      // user.type with {enter} — simulates keyboard events
      await user.type(screen.getByLabelText("New todo"), "Learn Vitest{enter}");
      expect(screen.getByText("Learn Vitest")).toBeInTheDocument();
    });

    it("does not add empty todos", async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      await user.type(screen.getByLabelText("New todo"), "   ");
      await user.click(screen.getByRole("button", { name: "Add" }));

      // Should still show empty message
      expect(screen.getByTestId("empty-message")).toBeInTheDocument();
    });

    it("shows correct active count", async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      await user.type(screen.getByLabelText("New todo"), "Task 1{enter}");
      await user.type(screen.getByLabelText("New todo"), "Task 2{enter}");
      await user.type(screen.getByLabelText("New todo"), "Task 3{enter}");

      expect(screen.getByTestId("active-count")).toHaveTextContent("3");
    });
  });

  // ─── 3. Toggling Todos ──────────────────────────

  describe("toggling todos", () => {
    it("can toggle a todo complete/incomplete", async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      await user.type(screen.getByLabelText("New todo"), "Buy milk{enter}");

      // getByRole("checkbox") — finds checkbox inputs
      const checkbox = screen.getByRole("checkbox", {
        name: /mark "buy milk"/i,
      });

      // Initially unchecked
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      // toBeChecked — asserts checkbox is checked
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  // ─── 4. Deleting Todos ──────────────────────────

  describe("deleting todos", () => {
    it("removes a todo when delete is clicked", async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      await user.type(screen.getByLabelText("New todo"), "Delete me{enter}");
      expect(screen.getByText("Delete me")).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /delete "delete me"/i })
      );

      // queryByText — returns null if not found (unlike getByText which throws)
      expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
    });
  });

  // ─── 5. Filtering ───────────────────────────────

  describe("filtering", () => {
    const setupWithTodos = async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      // Add 3 todos
      await user.type(screen.getByLabelText("New todo"), "Active 1{enter}");
      await user.type(screen.getByLabelText("New todo"), "Active 2{enter}");
      await user.type(screen.getByLabelText("New todo"), "Done task{enter}");

      // Complete the third one
      await user.click(
        screen.getByRole("checkbox", { name: /mark "done task"/i })
      );

      return user;
    };

    it("shows all todos by default", async () => {
      await setupWithTodos();
      expect(screen.getByText("Active 1")).toBeInTheDocument();
      expect(screen.getByText("Active 2")).toBeInTheDocument();
      expect(screen.getByText("Done task")).toBeInTheDocument();
    });

    it("filters to active only", async () => {
      const user = await setupWithTodos();
      await user.click(screen.getByRole("button", { name: "active" }));

      expect(screen.getByText("Active 1")).toBeInTheDocument();
      expect(screen.getByText("Active 2")).toBeInTheDocument();
      expect(screen.queryByText("Done task")).not.toBeInTheDocument();
    });

    it("filters to completed only", async () => {
      const user = await setupWithTodos();
      await user.click(screen.getByRole("button", { name: "completed" }));

      expect(screen.queryByText("Active 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Active 2")).not.toBeInTheDocument();
      expect(screen.getByText("Done task")).toBeInTheDocument();
    });
  });
});

// ─── 6. Async Data Fetching (UserList) ─────────────

describe("UserList", () => {
  const mockUsers: User[] = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com" },
  ];

  describe("loading state", () => {
    it("shows loading spinner while fetching", () => {
      // Create a fetch that never resolves (stays loading)
      const fetchUsers = vi.fn(
        () => new Promise<User[]>(() => { /* intentionally never resolves */ })
      );
      render(<UserList fetchUsers={fetchUsers} />);

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      expect(screen.getByText("Fetching users...")).toBeInTheDocument();
    });
  });

  describe("success state", () => {
    it("renders users after successful fetch", async () => {
      // mockResolvedValue — makes the function return a resolved promise
      const fetchUsers = vi.fn().mockResolvedValue(mockUsers);
      render(<UserList fetchUsers={fetchUsers} />);

      // findByTestId — waits for the element to appear (async!)
      const userList = await screen.findByTestId("user-list");
      expect(userList).toBeInTheDocument();

      // within() — scopes queries to a specific container element
      const listScope = within(userList);
      expect(listScope.getByText("Alice Johnson")).toBeInTheDocument();
      expect(listScope.getByText("Bob Smith")).toBeInTheDocument();
      expect(listScope.getByText("Charlie Brown")).toBeInTheDocument();

      // Check the count in the heading
      expect(listScope.getByText(/3 results/)).toBeInTheDocument();
    });

    it("calls fetchUsers on mount", async () => {
      const fetchUsers = vi.fn().mockResolvedValue(mockUsers);
      render(<UserList fetchUsers={fetchUsers} />);

      await screen.findByTestId("user-list");
      expect(fetchUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe("error state", () => {
    it("shows error message when fetch fails", async () => {
      const fetchUsers = vi
        .fn()
        .mockRejectedValue(new Error("Network failure"));
      render(<UserList fetchUsers={fetchUsers} />);

      // findByTestId waits for the async operation to complete
      const errorEl = await screen.findByTestId("error-message");
      expect(errorEl).toHaveTextContent("Network failure");
    });

    it("shows error element with alert role", async () => {
      const fetchUsers = vi.fn().mockRejectedValue(new Error("Timeout"));
      render(<UserList fetchUsers={fetchUsers} />);

      // findByRole — async version of getByRole
      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();
    });

    it("no longer shows loading after error", async () => {
      const fetchUsers = vi.fn().mockRejectedValue(new Error("Fail"));
      render(<UserList fetchUsers={fetchUsers} />);

      await screen.findByTestId("error-message");

      // Loading spinner should be gone
      expect(
        screen.queryByTestId("loading-spinner")
      ).not.toBeInTheDocument();
    });
  });
});
