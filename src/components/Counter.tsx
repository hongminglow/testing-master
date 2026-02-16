import { useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";

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

  const isMax = max !== undefined && count >= max;

  return (
    <div
      data-testid="counter-container"
      className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </h3>
        {count !== 0 && (
          <button
            onClick={() => update(0)}
            data-testid="reset-button"
            className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-[var(--accent-soft)]"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => update(count - step)}
          aria-label="Decrement"
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>

        <span
          data-testid="count-display"
          className={`text-3xl font-bold tabular-nums min-w-[60px] text-center transition-colors ${
            isMax ? "text-[var(--accent-red)]" : "text-[var(--text-primary)]"
          }`}
        >
          {count}
        </span>

        <button
          onClick={() => update(count + step)}
          aria-label="Increment"
          disabled={isMax}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-primary)] disabled:hover:bg-[var(--bg-elevated)]"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isMax && (
        <p
          role="alert"
          className="mt-3 text-xs font-medium text-[var(--accent-red)] bg-[var(--accent-red-soft)] px-3 py-1.5 rounded-md inline-block border border-[var(--accent-red-border)] animate-fade-in"
        >
          Maximum value reached!
        </p>
      )}
    </div>
  );
}
