import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/**
 * A Todo list component with add/toggle/delete/filter functionality.
 * Used to showcase: list rendering, dynamic additions, filtering, state management.
 */
export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div
      data-testid="todo-container"
      className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Todo List
      </h3>

      {/* Add form */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          aria-label="New todo"
          className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
        <button
          onClick={addTodo}
          disabled={!input.trim()}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg bg-[var(--bg-input)]">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-colors cursor-pointer ${
              filter === f
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredTodos.length === 0 ? (
        <p data-testid="empty-message" className="text-sm text-[var(--text-muted)] text-center py-6">
          {todos.length === 0
            ? "No tasks yet. Add one above!"
            : `No ${filter} tasks.`}
        </p>
      ) : (
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              data-testid={`todo-item-${todo.id}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] group"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`}
                className="w-4 h-4 rounded accent-[var(--accent-green)] cursor-pointer"
              />
              <span
                className={`flex-1 text-sm ${
                  todo.completed
                    ? "line-through text-[var(--text-muted)]"
                    : "text-[var(--text-primary)]"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete "${todo.text}"`}
                className="opacity-0 group-hover:opacity-100 text-[var(--accent-red)] text-xs font-medium hover:underline transition-opacity cursor-pointer"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      {todos.length > 0 && (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          <span data-testid="active-count">{activeCount}</span> task
          {activeCount !== 1 ? "s" : ""} remaining
        </p>
      )}
    </div>
  );
}

/* ─────────────── Async Data Component ─────────────── */

export interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  fetchUsers: () => Promise<User[]>;
}

/**
 * Fetches and displays a list of users.
 * Used to showcase: async data fetching, loading states,
 * error handling, mocking API calls.
 */
export function UserList({ fetchUsers }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUsers();
        if (!cancelled) setUsers(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [fetchUsers]);

  if (loading) {
    return (
      <div data-testid="loading-spinner" className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full mx-auto" />
        <p className="mt-3 text-sm text-[var(--text-secondary)]">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="error-message" role="alert" className="p-6 rounded-xl border border-[rgba(248,81,73,0.3)] bg-[var(--accent-red-soft)] text-center">
        <p className="text-[var(--accent-red)] font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div data-testid="user-list" className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Users ({users.length})
      </h3>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border)]"
          >
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
