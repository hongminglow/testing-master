import { useState } from "react";

interface CounterProps {
  initialCount?: number;
  step?: number;
  label?: string;
  onCountChange?: (count: number) => void;
  max?: number;
}

/**
 * A counter component with increment/decrement/reset functionality.
 * Used to showcase: rendering with props, user interaction testing,
 * callback testing, conditional rendering.
 */
export function Counter({
  initialCount = 0,
  step = 1,
  label = "Counter",
  onCountChange,
  max,
}: CounterProps) {
  const [count, setCount] = useState(initialCount);

  const update = (newCount: number) => {
    if (max !== undefined && newCount > max) return;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  return (
    <div
      data-testid="counter-container"
      className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]"
    >
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
        {label}
      </h3>

      <div className="flex items-center gap-4">
        <button
          onClick={() => update(count - step)}
          aria-label="Decrement"
          className="w-10 h-10 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] font-bold hover:border-[var(--accent)] transition-colors cursor-pointer"
        >
          −
        </button>

        <span
          data-testid="count-display"
          className="text-3xl font-bold text-[var(--text-primary)] tabular-nums min-w-[60px] text-center"
        >
          {count}
        </span>

        <button
          onClick={() => update(count + step)}
          aria-label="Increment"
          disabled={max !== undefined && count >= max}
          className="w-10 h-10 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] font-bold hover:border-[var(--accent)] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      {count !== 0 && (
        <button
          onClick={() => update(0)}
          data-testid="reset-button"
          className="mt-3 text-xs text-[var(--accent)] hover:underline cursor-pointer"
        >
          Reset
        </button>
      )}

      {max !== undefined && count >= max && (
        <p
          role="alert"
          className="mt-2 text-xs text-[var(--accent-red)]"
        >
          Maximum value reached!
        </p>
      )}
    </div>
  );
}
