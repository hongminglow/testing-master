/**
 * Pure utility functions for testing.
 * Used to showcase: basic unit testing, edge cases, error throwing.
 */

/** Format a number as currency */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (maxLength < 0) throw new Error("maxLength must be non-negative");
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

/** Validate an email address */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Slugify a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Calculate percentage */
export function percentage(part: number, total: number): number {
  if (total === 0) throw new Error("Total cannot be zero");
  return Math.round((part / total) * 10000) / 100;
}

/** Deep clone an object (JSON-safe) */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** Debounce a function (for timer mocking showcase) */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
