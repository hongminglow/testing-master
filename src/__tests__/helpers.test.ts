/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║  UTILITY FUNCTION TESTS                                    ║
 * ║  Showcases: describe/it/expect, matchers, edge cases,     ║
 * ║  error throwing, grouping with nested describe             ║
 * ╚════════════════════════════════════════════════════════════╝
 */
import { describe, it, expect } from "vitest";
import {
    formatCurrency,
    truncate,
    isValidEmail,
    slugify,
    percentage,
    deepClone,
} from "@/utils/helpers";

// ─── 1. Basic Matchers ─────────────────────────────────
// toBe, toEqual, toContain, toBeTruthy, toBeFalsy, etc.

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    // toBe — strict equality (===) for primitives
    expect(formatCurrency(1000)).toBe("$1,000.00");
  });

  it("formats with decimals", () => {
    expect(formatCurrency(19.99)).toBe("$19.99");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative numbers", () => {
    // toContain — checks if string contains substring
    expect(formatCurrency(-42.5)).toContain("42.50");
  });

  it("formats other currencies", () => {
    const result = formatCurrency(1000, "EUR");
    // toMatch — regex matching
    expect(result).toMatch(/1,000/);
  });
});

// ─── 2. String Matchers ────────────────────────────────

describe("truncate", () => {
  it("returns original text if shorter than max", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates and adds ellipsis", () => {
    expect(truncate("Hello World", 5)).toBe("Hello…");
    // toHaveLength — checks .length property
    expect(truncate("Hello World", 5)).toHaveLength(6); // 5 chars + ellipsis
  });

  it("handles exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(truncate("", 5)).toBe("");
  });

  // ─── Error Throwing ──────────────────────────
  it("throws on negative maxLength", () => {
    // toThrow — asserts that a function throws an error
    expect(() => truncate("Hello", -1)).toThrow("maxLength must be non-negative");
  });

  it("throws with specific error message", () => {
    // toThrowError — same as toThrow but more explicit
    expect(() => truncate("test", -5)).toThrowError(/non-negative/);
  });
});

// ─── 3. Boolean / Truthy / Falsy Matchers ──────────────

describe("isValidEmail", () => {
  it("returns true for valid emails", () => {
    // toBeTruthy — passes if value is truthy
    expect(isValidEmail("user@example.com")).toBeTruthy();
    // toBe(true) — strict boolean check
    expect(isValidEmail("test@mail.co")).toBe(true);
  });

  it("returns false for invalid emails", () => {
    // toBeFalsy — passes if value is falsy
    expect(isValidEmail("not-an-email")).toBeFalsy();
    expect(isValidEmail("@missing.com")).toBeFalsy();
    expect(isValidEmail("no@domain")).toBeFalsy();
    expect(isValidEmail("")).toBeFalsy();
  });
});

// ─── 4. Object / Array Matchers ────────────────────────

describe("deepClone", () => {
  it("creates a deep copy of objects", () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);

    // toEqual — deep equality (recursively checks nested objects)
    expect(cloned).toEqual(original);
    // not.toBe — ensures they are different references
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
  });

  it("clones arrays", () => {
    const original = [1, [2, 3], { a: 4 }];
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    // toHaveLength — works on arrays too
    expect(cloned).toHaveLength(3);
  });

  it("handles null and primitives", () => {
    expect(deepClone(null)).toBeNull();
    expect(deepClone(42)).toBe(42);
    expect(deepClone("hello")).toBe("hello");
  });
});

// ─── 5. Number Matchers ────────────────────────────────

describe("percentage", () => {
  it("calculates basic percentages", () => {
    expect(percentage(50, 100)).toBe(50);
    expect(percentage(1, 3)).toBeCloseTo(33.33, 1);
  });

  it("handles 100%", () => {
    // toBeGreaterThanOrEqual / toBeLessThanOrEqual
    expect(percentage(100, 100)).toBeGreaterThanOrEqual(100);
    expect(percentage(100, 100)).toBeLessThanOrEqual(100);
  });

  it("handles percentages over 100", () => {
    // toBeGreaterThan
    expect(percentage(150, 100)).toBeGreaterThan(100);
  });

  it("throws when total is zero", () => {
    expect(() => percentage(10, 0)).toThrow("Total cannot be zero");
  });
});

// ─── 6. Nested Describe + Slugify ──────────────────────

describe("slugify", () => {
  describe("basic transformations", () => {
    it("lowercases and replaces spaces", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("removes special characters", () => {
      expect(slugify("Hello, World!")).toBe("hello-world");
    });

    it("trims whitespace", () => {
      expect(slugify("  Hello  ")).toBe("hello");
    });
  });

  describe("edge cases", () => {
    it("handles empty string", () => {
      expect(slugify("")).toBe("");
    });

    it("handles multiple spaces", () => {
      expect(slugify("a   b   c")).toBe("a-b-c");
    });

    it("handles underscores", () => {
      expect(slugify("hello_world")).toBe("hello-world");
    });

    // ─── Intentional FAILING test for showcase ──────────
    // Uncomment the line below to see a failing test in action:
    // it("DEMO FAIL: this test intentionally fails", () => {
    //   expect(slugify("Hello")).toBe("WRONG VALUE");
    // });
  });
});
