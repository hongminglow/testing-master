import { useState } from "react";
import { CheckCircle2, AlertCircle, Info, X, Search, Filter } from "lucide-react";

interface ToggleProps {
  defaultOn?: boolean;
  onToggle?: (isOn: boolean) => void;
  label: string;
}

/**
 * A toggle switch component.
 * Used to showcase: accessibility testing, role/aria testing.
 */
export function Toggle({ defaultOn = false, onToggle, label }: ToggleProps) {
  const [isOn, setIsOn] = useState(defaultOn);

  const toggle = () => {
    const next = !isOn;
    setIsOn(next);
    onToggle?.(next);
  };

  return (
    <button
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      onClick={toggle}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-card)] ${
        isOn ? "bg-[var(--accent-green)] shadow-[0_0_12px_var(--accent-green-soft)]" : "bg-[var(--bg-input)] border border-[var(--border)]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          isOn ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ─────────────── Notification ─────────────── */

export type NotificationType = "success" | "error" | "info";

interface NotificationProps {
  type: NotificationType;
  message: string;
  onDismiss?: () => void;
}

/**
 * A dismissible notification banner.
 * Used to showcase: conditional styling, snapshot testing, event callbacks.
 */
export function Notification({ type, message, onDismiss }: NotificationProps) {
  const styles: Record<NotificationType, string> = {
    success: "border-[var(--accent-green-border)] bg-[var(--accent-green-soft)] text-[var(--accent-green)]",
    error: "border-[var(--accent-red-border)] bg-[var(--accent-red-soft)] text-[var(--accent-red)]",
    info: "border-[var(--border-accent)] bg-[var(--accent-soft)] text-[var(--accent)]",
  };

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[type];

  return (
    <div
      role="status"
      data-testid="notification"
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-sm backdrop-blur-sm animate-fade-in ${styles[type]}`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="text-inherit opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-0.5 rounded-md hover:bg-black/5"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/* ─────────────── Search Filter ─────────────── */

interface SearchFilterProps<T> {
  items: T[];
  filterFn: (item: T, query: string) => boolean;
  renderItem: (item: T) => React.ReactNode;
  placeholder?: string;
}

/**
 * A searchable/filterable list.
 * Used to showcase: generics testing, render props pattern, input debounce.
 */
export function SearchFilter<T>({
  items,
  filterFn,
  renderItem,
  placeholder = "Search...",
}: SearchFilterProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? items.filter((item) => filterFn(item, query))
    : items;

  return (
    <div className="space-y-4">
      <div className="relative group">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-sm"
        />
        <div className="absolute right-3 top-2.5 pointer-events-none">
            <span className="text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border)] rounded px-1.5 py-0.5">CMD+K</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
        <span>Results</span>
        <span data-testid="result-count" className="font-mono bg-[var(--bg-elevated)] px-2 py-0.5 rounded text-[var(--text-secondary)]">
          {filtered.length} / {items.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div data-testid="no-results" className="flex flex-col items-center justify-center py-8 text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-xl bg-[var(--bg-surface)]">
            <Filter className="w-6 h-6 opacity-30 mb-2" />
          <p className="text-sm">No results for "{query}"</p>
        </div>
      ) : (
        <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {filtered.map((item, i) => (
            <li key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
