/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║  CUSTOM HOOKS TESTS                                        ║
 * ║  Showcases: renderHook, act(), testing hooks in isolation,║
 * ║  mocking localStorage, cleanup                             ║
 * ╚════════════════════════════════════════════════════════════╝
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToggle, useLocalStorage } from "@/hooks/useToggle";

// ─── 1. useToggle Hook ─────────────────────────────

describe("useToggle", () => {
  it("starts with false by default", () => {
    // renderHook — renders a hook in isolation (no component needed!)
    const { result } = renderHook(() => useToggle());

    // result.current — the current return value of the hook
    expect(result.current.value).toBe(false);
  });

  it("starts with the provided initial value", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.value).toBe(true);
  });

  it("toggles the value", () => {
    const { result } = renderHook(() => useToggle());

    // act() — wraps state updates to ensure React processes them
    // REQUIRED when calling functions that trigger state changes
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(false);
  });

  it("can set on explicitly", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current.setOn();
    });
    expect(result.current.value).toBe(true);

    // Calling setOn again should still be true
    act(() => {
      result.current.setOn();
    });
    expect(result.current.value).toBe(true);
  });

  it("can set off explicitly", () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current.setOff();
    });
    expect(result.current.value).toBe(false);
  });
});

// ─── 2. useLocalStorage Hook ───────────────────────

describe("useLocalStorage", () => {
  // Mock localStorage before each test
  beforeEach(() => {
    // vi.spyOn — creates a spy on an existing method
    // This lets us track calls AND control the behavior
    const store: Record<string, string> = {};

    vi.spyOn(Storage.prototype, "getItem").mockImplementation(
      (key: string) => store[key] ?? null
    );
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(
      (key: string, value: string) => {
        store[key] = value;
      }
    );
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(
      (key: string) => {
        delete store[key];
      }
    );
  });

  // afterEach — runs after every test (reset mocks)
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial value when localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default")
    );
    expect(result.current[0]).toBe("default");
  });

  it("stores value in localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default")
    );

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("updated")
    );
  });

  it("stores complex objects", () => {
    const { result } = renderHook(() =>
      useLocalStorage("user", { name: "Alice", age: 25 })
    );

    act(() => {
      result.current[1]({ name: "Bob", age: 30 });
    });

    expect(result.current[0]).toEqual({ name: "Bob", age: 30 });
  });

  it("supports updater function pattern", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("removes value from localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage("removable", "value")
    );

    act(() => {
      result.current[2](); // removeValue
    });

    expect(result.current[0]).toBe("value"); // falls back to initial
    expect(localStorage.removeItem).toHaveBeenCalledWith("removable");
  });
});
