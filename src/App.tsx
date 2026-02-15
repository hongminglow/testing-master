import { useState } from "react";
import { Counter } from "@/components/Counter";
import { LoginForm } from "@/components/LoginForm";
import { TodoList, UserList, type User } from "@/components/TodoList";
import { Toggle, Notification, SearchFilter } from "@/components/Widgets";
import {
    FlaskConical,
    TestTubes,
    Layers,
    Terminal,
    CheckCircle2, Clock,
    BookOpen,
    Github
} from "lucide-react";
import "./index.css";

// Mock data for UserList demo
const mockFetchUsers = async (): Promise<User[]> => {
  await new Promise((r) => setTimeout(r, 800));
  return [
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com" },
  ];
};

const techItems = [
  "React",
  "Vitest",
  "Testing Library",
  "TypeScript",
  "Tailwind CSS",
  "Vite",
];

// Test file metadata for the showcase
const testFiles = [
  {
    name: "helpers.test.ts",
    desc: "Basic Matchers & Pure Functions",
    concepts: [
      "toBe",
      "toEqual",
      "toContain",
      "toThrow",
      "toHaveLength",
      "toBeTruthy",
      "toBeCloseTo",
      "nested describe",
    ],
    icon: "⚡",
  },
  {
    name: "Counter.test.tsx",
    desc: "Component Rendering & Interactions",
    concepts: [
      "render",
      "screen.getByRole",
      "getByTestId",
      "queryBy*",
      "userEvent.click",
      "vi.fn()",
      "toBeDisabled",
      "toHaveTextContent",
    ],
    icon: "🔢",
  },
  {
    name: "LoginForm.test.tsx",
    desc: "Forms, Async & Validation",
    concepts: [
      "getByLabelText",
      "user.type",
      "user.clear",
      "waitFor",
      "findBy*",
      "mockResolvedValue",
      "mockRejectedValue",
      "toHaveAttribute",
    ],
    icon: "📝",
  },
  {
    name: "TodoList.test.tsx",
    desc: "Lists, Keyboard Events & API Mocking",
    concepts: [
      "keyboard {enter}",
      "within()",
      "async fetch",
      "loading states",
      "error states",
      "toBeChecked",
      "queryByText",
      "getAllByTestId",
    ],
    icon: "📋",
  },
  {
    name: "Widgets.test.tsx",
    desc: "Accessibility, Snapshots & Generics",
    concepts: [
      "role='switch'",
      "aria-checked",
      "toMatchSnapshot",
      "toMatchInlineSnapshot",
      "render props testing",
      "getAllByTestId",
    ],
    icon: "🧩",
  },
  {
    name: "hooks.test.ts",
    desc: "Custom Hooks & Browser API Mocking",
    concepts: [
      "renderHook",
      "act()",
      "vi.spyOn",
      "localStorage mock",
      "vi.restoreAllMocks",
      "beforeEach/afterEach",
    ],
    icon: "🪝",
  },
  {
    name: "advanced.test.ts",
    desc: "Timers, Parameterized & Advanced Mocking",
    concepts: [
      "vi.useFakeTimers",
      "advanceTimersByTime",
      "it.each",
      "test.todo",
      "test.skip",
      "mockReturnValueOnce",
      "mockImplementation",
      "mock.calls",
    ],
    icon: "🚀",
  },
];

function App() {
  const [dismissedNotif, setDismissedNotif] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* HERO */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-sidebar)]">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--accent-green-soft)] border border-[rgba(63,185,80,0.2)]">
              <FlaskConical className="w-7 h-7 text-[var(--accent-green)]" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3">
            Testing<span className="text-[var(--accent-green)]">Master</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            A comprehensive showcase of{" "}
            <strong className="text-[var(--text-primary)]">Vitest</strong> +{" "}
            <strong className="text-[var(--text-primary)]">
              React Testing Library
            </strong>{" "}
            — every syntax, matcher, and pattern you need to master React
            testing.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2 text-[var(--accent-green)]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">7 Test Suites</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <TestTubes className="w-4 h-4" />
              <span className="font-semibold">60+ Test Cases</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--accent-purple)]">
              <Layers className="w-4 h-4" />
              <span className="font-semibold">6 Components</span>
            </div>
          </div>

          {/* Run command */}
          <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <Terminal className="w-4 h-4 text-[var(--accent-green)]" />
            <code className="text-sm font-mono text-[var(--text-primary)]">
              npm test
            </code>
            <span className="text-xs text-[var(--text-muted)]">
              │ watch mode
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-14">
        {/* TEST FILES OVERVIEW */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Test Suites
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testFiles.map((file) => (
              <div
                key={file.name}
                className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-accent)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{file.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] font-mono">
                      {file.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {file.desc}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {file.concepts.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium text-[var(--accent-green)] bg-[var(--accent-green-soft)] border border-[rgba(63,185,80,0.15)]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE COMPONENTS */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-5 h-5 text-[var(--accent-purple)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Live Components{" "}
              <span className="text-sm font-normal text-[var(--text-muted)]">
                (these are the components being tested)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Counter */}
            <div>
              <p className="text-xs font-mono text-[var(--text-muted)] mb-2">
                {"<Counter />"} — src/components/Counter.tsx
              </p>
              <Counter label="Click Counter" max={10} />
            </div>

            {/* Login Form */}
            <div>
              <p className="text-xs font-mono text-[var(--text-muted)] mb-2">
                {"<LoginForm />"} — src/components/LoginForm.tsx
              </p>
              <LoginForm
                onSubmit={async (data) => {
                  await new Promise((r) => setTimeout(r, 1000));
                  console.log("Login:", data);
                }}
              />
            </div>

            {/* Todo List */}
            <div>
              <p className="text-xs font-mono text-[var(--text-muted)] mb-2">
                {"<TodoList />"} — src/components/TodoList.tsx
              </p>
              <TodoList />
            </div>

            {/* User List (async) */}
            <div>
              <p className="text-xs font-mono text-[var(--text-muted)] mb-2">
                {"<UserList />"} — src/components/TodoList.tsx
              </p>
              <UserList fetchUsers={mockFetchUsers} />
            </div>

            {/* Toggle */}
            <div>
              <p className="text-xs font-mono text-[var(--text-muted)] mb-2">
                {"<Toggle />"} — src/components/Widgets.tsx
              </p>
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-4">
                <Toggle
                  label="Dark mode"
                  defaultOn
                  onToggle={(v) => console.log("Toggle:", v)}
                />
                <span className="text-sm text-[var(--text-secondary)]">
                  Dark Mode
                </span>
              </div>
            </div>

            {/* Notification */}
            <div>
              <p className="text-xs font-mono text-[var(--text-muted)] mb-2">
                {"<Notification />"} — src/components/Widgets.tsx
              </p>
              <div className="space-y-2">
                <Notification
                  type="success"
                  message="All 60+ tests passed!"
                  onDismiss={
                    dismissedNotif ? undefined : () => setDismissedNotif(true)
                  }
                />
                <Notification type="error" message="1 snapshot outdated" />
                <Notification
                  type="info"
                  message="Run npm test to start watching"
                />
              </div>
            </div>

            {/* Search Filter */}
            <div className="lg:col-span-2">
              <p className="text-xs font-mono text-[var(--text-muted)] mb-2">
                {"<SearchFilter />"} — src/components/Widgets.tsx
              </p>
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                <SearchFilter
                  items={techItems}
                  filterFn={(item, q) =>
                    item.toLowerCase().includes(q.toLowerCase())
                  }
                  renderItem={(item) => (
                    <div className="px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-sm text-[var(--text-primary)]">
                      {item}
                    </div>
                  )}
                  placeholder="Search tech stack..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* QUICK REFERENCE */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-5 h-5 text-[var(--accent-yellow)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Quick Reference — Commands
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                cmd: "npm test",
                desc: "Start Vitest in watch mode",
                icon: <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)]" />,
              },
              {
                cmd: "npm run test:run",
                desc: "Single run (CI mode)",
                icon: <Terminal className="w-4 h-4 text-[var(--accent)]" />,
              },
              {
                cmd: "npm run test:ui",
                desc: "Open Vitest UI dashboard",
                icon: <Layers className="w-4 h-4 text-[var(--accent-purple)]" />,
              },
              {
                cmd: "npm run test:coverage",
                desc: "Run with coverage report",
                icon: <Clock className="w-4 h-4 text-[var(--accent-yellow)]" />,
              },
            ].map((item) => (
              <div
                key={item.cmd}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  {item.icon}
                  <code className="text-xs font-mono font-semibold text-[var(--text-primary)]">
                    {item.cmd}
                  </code>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-sidebar)] py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <p>
            Built with{" "}
            <span className="text-[var(--accent-green)]">Vitest</span> +{" "}
            <span className="text-[var(--accent)]">
              React Testing Library
            </span>{" "}
            + <span className="text-[var(--accent-purple)]">TypeScript</span>
          </p>
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            <span>testing-master</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
