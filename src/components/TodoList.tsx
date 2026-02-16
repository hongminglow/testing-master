import { useState, useEffect } from "react";
import {
    Trash2,
    Plus,
    Square,
    CheckSquare, Filter,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Mail,
    User as UserIcon
} from "lucide-react";

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
      className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--test-primary)] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[var(--accent-cyan)]" />
          Todo List
        </h3>
        <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded">
          {todos.length} items
        </span>
      </div>

      {/* Add form */}
      <div className="flex gap-2 mb-4 group focus-within:ring-1 ring-[var(--accent)] rounded-lg transition-shadow">
        <input
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          aria-label="New todo"
          className="flex-1 px-3 py-2.5 rounded-l-lg bg-[var(--bg-input)] border-y border-l border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:bg-[var(--bg-elevated)] transition-colors"
        />
        <button
          onClick={addTodo}
          disabled={!input.trim()}
          className="px-4 py-2 rounded-r-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)]">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-all cursor-pointer ${
              filter === f
                ? "bg-[var(--bg-elevated)] text-[var(--accent-cyan)] shadow-sm border border-[var(--border)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="min-h-[160px]">
        {filteredTodos.length === 0 ? (
          <div
            data-testid="empty-message"
            className="flex flex-col items-center justify-center h-40 text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-xl bg-[var(--bg-surface)]"
          >
            <Filter className="w-8 h-8 opacity-20 mb-2" />
            <p className="text-sm">
              {todos.length === 0
                ? "No tasks yet. Add one above!"
                : `No ${filter} tasks.`}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                data-testid={`todo-item-${todo.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors group animate-fade-in"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={`Mark "${todo.text}" as ${
                    todo.completed ? "incomplete" : "complete"
                  }`}
                  role="checkbox"
                  aria-checked={todo.completed}
                  className={`shrink-0 transition-colors focus:outline-none ${
                    todo.completed
                      ? "text-[var(--accent-cyan)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {todo.completed ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <span
                  className={`flex-1 text-sm transition-all ${
                    todo.completed
                      ? "line-through text-[var(--text-muted)] decoration-2 decoration-[var(--border)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete "${todo.text}"`}
                  className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red-soft)] p-1.5 rounded-md transition-all cursor-pointer focus:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {todos.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between items-center text-xs text-[var(--text-muted)] font-mono">
          <span>
            <span
              data-testid="active-count"
              className="text-[var(--text-primary)] font-semibold"
            >
              {activeCount}
            </span>{" "}
            pending
          </span>
          <span>{((todos.length - activeCount) / todos.length * 100).toFixed(0)}% done</span>
        </div>
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
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [fetchUsers]);

  if (loading) {
    return (
      <div
        data-testid="loading-spinner"
        className="p-8 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex flex-col items-center justify-center min-h-[200px]"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--accent-cyan)] blur-xl opacity-20 rounded-full"></div>
          <Loader2 className="w-8 h-8 text-[var(--accent-cyan)] animate-spin relative z-10" />
        </div>
        <p className="mt-4 text-sm font-medium text-[var(--text-secondary)] animate-pulse">
          Fetching users...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-testid="error-message"
        role="alert"
        className="p-6 rounded-xl border border-[var(--accent-red-border)] bg-[var(--accent-red-soft)] text-center min-h-[200px] flex flex-col items-center justify-center"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--accent-red-soft)] border border-[var(--accent-red-border)] flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6 text-[var(--accent-red)]" />
        </div>
        <p className="text-[var(--accent-red)] font-medium mb-1">
          Failed to load users
        </p>
        <p className="text-xs text-[var(--text-muted)]">{error}</p>
      </div>
    );
  }

  return (
    <div
      data-testid="user-list"
      className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm min-h-[200px]"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <UserIcon className="w-5 h-5 text-[var(--accent-cyan)]" />
        Users{" "}
        <span className="text-xs text-[var(--text-muted)] font-normal ml-auto">
          {users.length} results
        </span>
      </h3>
      <ul className="space-y-2.5">
        {users.map((user, i) => (
          <li
            key={user.id}
            className={`flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] hover:border-[var(--accent-cyan)] transition-all group animate-fade-in delay-${
              i + 1
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[var(--accent-cyan-soft)] flex items-center justify-center text-[var(--accent-cyan)] font-bold text-xs shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                {user.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--text-muted)]">
                <Mail className="w-3 h-3" />
                {user.email}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
