import { useState } from "react";
import { Counter } from "@/components/Counter";
import { LoginForm } from "@/components/LoginForm";
import { TodoList, UserList } from "@/components/TodoList";
import { Toggle, Notification, SearchFilter } from "@/components/Widgets";
import {
  FlaskConical,
  Layers,
  Terminal,
  CheckCircle2,
  Clock,
  BookOpen,
  Github,
  Zap,
  Hash,
  FileText,
  ListChecks,
  Puzzle,
  Anchor,
  Rocket,
  Play,
  BarChart3,
  Monitor,
} from "lucide-react";

const APP_VERSION = "2.1.0";

export default function App() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const logAction = (msg: string) => {
    setLastAction(`${new Date().toLocaleTimeString()} - ${msg}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* ─── NAVIGATION ─── */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-page)]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Back to top"
          >
            <div className="bg-[var(--accent)] p-2 rounded-xl shadow-lg shadow-sky-500/20">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Testing<span className="text-[var(--accent)]">Master</span>
            </span>
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mr-4">
              <a
                href="#core"
                className="px-4 py-2 rounded-lg hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-all cursor-pointer active:scale-95"
              >
                Core Concepts
              </a>
              <a
                href="#lists"
                className="px-4 py-2 rounded-lg hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-all cursor-pointer active:scale-95"
              >
                Lists & Data
              </a>
              <a
                href="#widgets"
                className="px-4 py-2 rounded-lg hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-all cursor-pointer active:scale-95"
              >
                Widgets
              </a>
            </div>
            <a
              href="https://github.com/hongminglow/testing-master"
              target="_blank"
              rel="noreferrer"
              className="p-2 hover:bg-[var(--bg-card)] rounded-lg text-[var(--text-secondary)] transition-colors border border-[var(--border-subtle)]"
            >
              <Github className="w-5 h-5" />
            </a>
            <span className="badge badge-blue px-3 py-1">V{APP_VERSION}</span>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <header className="hero-mesh pt-24 pb-32 border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl space-y-8">
            <div className="flex flex-wrap gap-3">
              <span className="badge badge-blue">
                <BeakerIcon className="w-3 h-3 mr-1.5" />
                Vitest 4.0.18
              </span>
              <span className="badge badge-green">
                <CheckCircle2 className="w-3 h-3 mr-1.5" />
                React 19 Ready
              </span>
              <span className="badge badge-purple">
                <Terminal className="w-3 h-3 mr-1.5" />
                120+ Coverage
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Master Frontend <br />
              <span className="heading-gradient uppercase">
                Testing Quality
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              The ultimate playground for{" "}
              <span className="text-white font-semibold">
                React Testing Library
              </span>{" "}
              and <span className="text-white font-semibold">Vitest</span>.
              Explore every matcher, mock strategy, and async pattern in action.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-3.5 bg-[var(--accent)] text-black font-bold rounded-[var(--radius-button)] shadow-xl shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Explore Test Suites
              </button>
              <div className="flex -space-x-3 items-center ml-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[var(--bg-page)] bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[10px] font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <span className="pl-6 text-sm text-[var(--text-muted)] italic font-medium">
                  Join 500+ testers
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="mx-auto max-w-7xl px-6 py-24 flex flex-col gap-12">
        {/* SECTION: UNIT TESTING BASICS */}
        <section id="core" className="flex flex-col gap-10 scroll-mt-28">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--brand-yellow-soft)] text-[var(--brand-yellow)]">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Core Components
              </h2>
            </div>
            <p className="text-[var(--text-secondary)] max-w-2xl ml-11">
              Foundational testing patterns: Props, state reconciliation, and
              form validation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TestCard
              id="Counter.test.tsx"
              title="State & Props"
              icon={<Layers />}
              path="src/components/Counter.tsx"
              accent="yellow"
            >
              <Counter
                onCountChange={(c) => logAction(`Counter changed to ${c}`)}
              />
            </TestCard>

            <TestCard
              id="LoginForm.test.tsx"
              title="Async Submission"
              icon={<Play />}
              path="src/components/LoginForm.tsx"
              accent="blue"
            >
              <LoginForm
                onSubmit={(data) => {
                  logAction(`Submitted login: ${data.email}`);
                  return new Promise((r) => setTimeout(r, 1000));
                }}
              />
            </TestCard>
          </div>
        </section>

        <div className="hr-divider !my-0" />

        {/* SECTION: LISTS & COLLECTIONS */}
        <section id="lists" className="flex flex-col gap-10 scroll-mt-28">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--brand-green-soft)] text-[var(--brand-green)]">
                <ListChecks className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Lists & Data
              </h2>
            </div>
            <p className="text-[var(--text-secondary)] max-w-2xl ml-11">
              Complex scenarios: DOM manipulation, list filtering, and MSW
              mocking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TestCard
              id="TodoList.test.tsx"
              title="List Rendering"
              icon={<ListChecks />}
              path="src/components/TodoList.tsx"
              accent="green"
            >
              <TodoList />
            </TestCard>

            <TestCard
              id="UserList.test.tsx"
              title="Mocking Requests"
              icon={<Monitor />}
              path="src/components/TodoList.tsx"
              accent="purple"
            >
              <UserList
                fetchUsers={async () => {
                  await new Promise((r) => setTimeout(r, 1500));
                  return [
                    {
                      id: 1,
                      name: "Alice Johnson",
                      email: "alice@example.com",
                    },
                    { id: 2, name: "Bob Smith", email: "bob@example.com" },
                    {
                      id: 3,
                      name: "Charlie Brown",
                      email: "charlie@example.com",
                    },
                  ];
                }}
              />
            </TestCard>
          </div>
        </section>

        <div className="hr-divider !my-0" />

        {/* SECTION: WIDGETS & UI ELEMENTS */}
        <section id="widgets" className="flex flex-col gap-10 scroll-mt-28">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--brand-red-soft)] text-[var(--brand-red)]">
                <Puzzle className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Interactive Widgets
              </h2>
            </div>
            <p className="text-[var(--text-secondary)] max-w-2xl ml-11">
              Advanced logic: Timeouts, global states, and conditional
              rendering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-6">
              <TestCard
                title="Toggle"
                id="Widgets.test.tsx"
                icon={<Anchor />}
                path="src/components/Widgets.tsx"
              >
                <Toggle
                  label="Dark Mode"
                  onToggle={(on) => logAction(`Toggle: ${on}`)}
                />
              </TestCard>
              <TestCard
                title="Notification"
                id="Widgets.test.tsx"
                icon={<CheckCircle2 />}
                path="src/components/Widgets.tsx"
              >
                <Notification
                  type="success"
                  message="All 120+ tests passed!"
                  onDismiss={() => logAction("Notice dismissed")}
                />
              </TestCard>
            </div>

            <div className="lg:col-span-2">
              <TestCard
                title="Search & Filter"
                id="Widgets.test.tsx"
                icon={<BarChart3 />}
                path="src/components/Widgets.tsx"
              >
                <SearchFilter
                  items={[
                    "React",
                    "Vitest",
                    "Testing Library",
                    "TypeScript",
                    "Tailwind CSS",
                    "Vite",
                  ]}
                  renderItem={(item) => (
                    <div className="p-3 bg-[var(--bg-surface)] rounded-lg text-sm border border-[var(--border-subtle)] hover:border-[var(--border)] transition-colors">
                      {item}
                    </div>
                  )}
                  filterFn={(item, q) =>
                    item.toLowerCase().includes(q.toLowerCase())
                  }
                  placeholder="Search tech stack..."
                />
              </TestCard>
            </div>
          </div>
        </section>

        {/* SECTION: FOOTER / QUICK REF */}
        <footer className="mt-12 glass-card p-10 flex flex-col gap-8 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Quick Reference</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Common commands and shortcuts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Command
              label="Run Tests"
              cmd="npm test"
              icon={<Play className="w-4 h-4 text-emerald-400" />}
            />
            <Command
              label="Build App"
              cmd="npm run build"
              icon={<BarChart3 className="w-4 h-4 text-sky-400" />}
            />
            <Command
              label="Watch Mode"
              cmd="npx vitest"
              icon={<Clock className="w-4 h-4 text-purple-400" />}
            />
            <Command
              label="Coverage"
              cmd="npm run test:coverage"
              icon={<BentoIcon className="w-4 h-4 text-amber-400" />}
            />
          </div>

          <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-[var(--text-dim)] uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span>© 2026 TestingMaster Lab</span>
              <span className="w-1 h-1 bg-[var(--text-dim)] rounded-full" />
              <span>Built with React 19 & Vitest</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>System Status: Optimal</span>
            </div>
          </div>
        </footer>
      </main>

      {/* ─── STATUS BAR ─── */}
      <div className="fixed bottom-6 right-6 z-50">
        {lastAction && (
          <div className="animate-in slide-in-from-bottom-4 flex items-center gap-3 bg-black/90 text-white px-5 py-3 rounded-2xl border border-[var(--border-strong)] shadow-2xl backdrop-blur-xl">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-ping" />
            <span className="text-sm font-medium">{lastAction}</span>
            <button
              onClick={() => setLastAction(null)}
              className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <Hash className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BeakerIcon({ className }: { className?: string }) {
  return <FlaskConical className={className} />;
}

function BentoIcon({ className }: { className?: string }) {
  return <Layers className={className} />;
}

function TestCard({
  title,
  id,
  icon,
  path,
  children,
  accent = "blue",
}: {
  title: string;
  id: string;
  icon: React.ReactNode;
  path: string;
  children: React.ReactNode;
  accent?: "blue" | "green" | "yellow" | "purple";
}) {
  const accentColors = {
    blue: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    green: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    yellow: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    purple: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  }[accent];

  return (
    <div className="glass-card overflow-hidden group">
      <div className="px-8 py-6 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
        <div className="flex items-center gap-4">
          <div
            className={`p-2.5 rounded-xl transition-all group-hover:scale-110 shadow-lg ${accentColors}`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none">{title}</h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <FileText className="w-3 h-3 text-[var(--text-dim)]" />
              <code className="text-[10px] text-[var(--text-muted)] font-mono tracking-tight uppercase">
                {id}
              </code>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <BookOpen className="w-4 h-4 text-[var(--text-dim)] cursor-help" />
        </div>
      </div>
      <div className="p-8">
        <div className="mb-4 flex items-center gap-2">
          <code className="text-[11px] px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-dim)] border border-[var(--border-subtle)]">
            {path}
          </code>
        </div>
        {children}
      </div>
    </div>
  );
}

function Command({
  label,
  cmd,
  icon,
}: {
  label: string;
  cmd: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border)] transition-all group">
      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <code className="text-sm font-mono text-[var(--accent)] bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-subtle)] group-hover:border-[var(--border-accent)] transition-all">
        {cmd}
      </code>
    </div>
  );
}
