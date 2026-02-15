import { useState } from "react";

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
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer ${
        isOn ? "bg-[var(--accent-green)]" : "bg-[var(--text-muted)]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
          isOn ? "translate-x-5" : "translate-x-0"
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
    success: "border-[rgba(63,185,80,0.3)] bg-[var(--accent-green-soft)] text-[var(--accent-green)]",
    error: "border-[rgba(248,81,73,0.3)] bg-[var(--accent-red-soft)] text-[var(--accent-red)]",
    info: "border-[rgba(88,166,255,0.3)] bg-[var(--accent-soft)] text-[var(--accent)]",
  };

  const icons: Record<NotificationType, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div
      role="status"
      data-testid="notification"
      className={`flex items-center justify-between p-4 rounded-xl border ${styles[type]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icons[type]}</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="text-inherit opacity-60 hover:opacity-100 transition-opacity cursor-pointer text-lg"
        >
          ×
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
    <div className="space-y-3">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
      />

      <p data-testid="result-count" className="text-xs text-[var(--text-muted)]">
        {filtered.length} of {items.length} items
      </p>

      {filtered.length === 0 ? (
        <p data-testid="no-results" className="text-sm text-[var(--text-muted)] text-center py-4">
          No results found for "{query}"
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((item, i) => (
            <li key={i}>{renderItem(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
