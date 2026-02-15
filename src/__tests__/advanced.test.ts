/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║  ADVANCED PATTERNS                                         ║
 * ║  Showcases: timer mocking (vi.useFakeTimers), spying,     ║
 * ║  test.each (parameterized tests), test.todo, test.skip,   ║
 * ║  vi.mock module mocking, custom matchers concept           ║
 * ╚════════════════════════════════════════════════════════════╝
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce, slugify, isValidEmail } from "@/utils/helpers";

// ─── 1. Timer Mocking ─────────────────────────────

describe("debounce (timer mocking)", () => {
  beforeEach(() => {
    // vi.useFakeTimers — replaces setTimeout/setInterval with fakes
    // You control when time passes!
    vi.useFakeTimers();
  });

  afterEach(() => {
    // vi.useRealTimers — restores real timers
    vi.useRealTimers();
  });

  it("does not call function immediately", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();

    // Function should NOT have been called yet
    expect(fn).not.toHaveBeenCalled();
  });

  it("calls function after delay", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();

    // vi.advanceTimersByTime — fast-forwards time
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("resets timer on subsequent calls", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    vi.advanceTimersByTime(200); // 200ms passed
    debounced(); // Reset! Timer restarts
    vi.advanceTimersByTime(200); // Only 200ms since reset

    expect(fn).not.toHaveBeenCalled(); // Still waiting!

    vi.advanceTimersByTime(100); // Now 300ms since last call
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passes arguments to the debounced function", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("hello", 42);
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith("hello", 42);
  });

  it("vi.runAllTimers — runs all pending timers", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 1000);

    debounced();

    // vi.runAllTimers — fast-forwards until all timers execute
    vi.runAllTimers();

    expect(fn).toHaveBeenCalled();
  });
});

// ─── 2. Parameterized Tests (test.each / it.each) ──

describe("parameterized tests with test.each", () => {
  // it.each — runs the same test with different data
  // Great for testing multiple inputs/outputs without duplication

  it.each([
    { input: "hello world", expected: "hello-world" },
    { input: "Testing 1 2 3", expected: "testing-1-2-3" },
    { input: "UPPERCASE", expected: "uppercase" },
    { input: "special!@#chars", expected: "specialchars" },
    { input: "  spaces  ", expected: "spaces" },
  ])('slugify("$input") → "$expected"', ({ input, expected }) => {
    expect(slugify(input)).toBe(expected);
  });

  // Table-style parameterized test
  it.each([
    ["user@test.com", true],
    ["admin@company.org", true],
    ["invalid", false],
    ["@no-user.com", false],
    ["missing@domain", false],
  ])("isValidEmail(%s) → %s", (email, expected) => {
    expect(isValidEmail(email as string)).toBe(expected);
  });
});

// ─── 3. Spying on Methods ─────────────────────────

describe("spying", () => {
  it("vi.spyOn tracks method calls", () => {
    const calculator = {
      add: (a: number, b: number) => a + b,
      multiply: (a: number, b: number) => a * b,
    };

    // vi.spyOn — watches a method without changing its behavior
    const spy = vi.spyOn(calculator, "add");

    const result = calculator.add(2, 3);

    expect(result).toBe(5); // Original behavior preserved
    expect(spy).toHaveBeenCalledWith(2, 3);
    expect(spy).toHaveReturnedWith(5);
  });

  it("spyOn with mockReturnValue", () => {
    const obj = {
      getPrice: () => 100,
    };

    // mockReturnValue — overrides the return value
    vi.spyOn(obj, "getPrice").mockReturnValue(999);

    expect(obj.getPrice()).toBe(999);
  });

  it("spyOn console.warn", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    console.warn("This is a test warning");

    expect(spy).toHaveBeenCalledWith("This is a test warning");
    spy.mockRestore();
  });
});

// ─── 4. test.todo & test.skip ──────────────────────

describe("test lifecycle markers", () => {
  // test.todo — marks a test as "to be implemented"
  // Shows up as "todo" in test results
  it.todo("implement WebSocket connection testing");
  it.todo("implement localStorage persistence testing");

  // test.skip — skips a test without deleting it
  // Shows up as "skipped" in test results
  it.skip("this test is temporarily skipped", () => {
    expect(true).toBe(false); // Would fail, but it's skipped!
  });
});

// ─── 5. Mock Return Values & Implementations ──────

describe("mock return patterns", () => {
  it("mockReturnValueOnce — returns value only once", () => {
    const fn = vi.fn();

    fn.mockReturnValueOnce("first");
    fn.mockReturnValueOnce("second");
    fn.mockReturnValue("default"); // fallback for subsequent calls

    expect(fn()).toBe("first");
    expect(fn()).toBe("second");
    expect(fn()).toBe("default");
    expect(fn()).toBe("default");
  });

  it("mockImplementation — custom implementation", () => {
    const fn = vi.fn().mockImplementation((a: number, b: number) => a * b);

    expect(fn(3, 4)).toBe(12);
    expect(fn(5, 6)).toBe(30);
  });

  it("mockResolvedValue — async mock", async () => {
    const fetchData = vi.fn().mockResolvedValue({ id: 1, name: "Test" });

    const result = await fetchData();
    expect(result).toEqual({ id: 1, name: "Test" });
  });

  it("mockRejectedValue — async error mock", async () => {
    const fetchData = vi.fn().mockRejectedValue(new Error("404"));

    // rejects — asserts that a promise rejects
    await expect(fetchData()).rejects.toThrow("404");
  });

  it("mock.calls — inspect all calls", () => {
    const fn = vi.fn();

    fn("a", 1);
    fn("b", 2);
    fn("c", 3);

    // mock.calls — array of all arguments for each call
    expect(fn.mock.calls).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    // mock.results — array of all return values
    expect(fn.mock.results).toHaveLength(3);

    // mock.lastCall — the arguments of the most recent call
    expect(fn.mock.lastCall).toEqual(["c", 3]);
  });
});
