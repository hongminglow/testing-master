# 🧪 TestingMaster

A comprehensive showcase of **Vitest** + **React Testing Library** for React applications. This project demonstrates every major testing pattern, syntax, and strategy you need to master frontend testing — from basic matchers to advanced mocking.

> **Stack:** React 19 · TypeScript · Vitest · React Testing Library · Tailwind CSS · Vite

---

## 📊 At a Glance

| Metric          | Count |
| --------------- | ----- |
| **Test Suites** | 7     |
| **Test Cases**  | 120+  |
| **Components**  | 6     |
| **Utilities**   | 7     |
| **Custom Hooks**| 2     |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (watch mode)
npm test

# Run tests once (CI mode)
npm run test:run

# Open Vitest UI dashboard
npm run test:ui

# Run with coverage
npm run test:coverage
```

---

## 📁 Project Structure

```
testing-master/
├── src/
│   ├── __tests__/                  # All test files
│   │   ├── helpers.test.ts         # Pure function tests — basic matchers
│   │   ├── Counter.test.tsx        # Component rendering & interaction
│   │   ├── LoginForm.test.tsx      # Form testing & async submission
│   │   ├── TodoList.test.tsx       # List operations & async fetching
│   │   ├── Widgets.test.tsx        # Accessibility, snapshots & generics
│   │   ├── hooks.test.ts           # Custom hook testing (renderHook)
│   │   └── advanced.test.ts        # Timers, parameterized tests, spying
│   ├── components/                 # Test target components
│   │   ├── Counter.tsx             # Counter with props, callbacks, max
│   │   ├── LoginForm.tsx           # Form with validation, async submit
│   │   ├── TodoList.tsx            # TodoList + UserList (async fetch)
│   │   └── Widgets.tsx             # Toggle, Notification, SearchFilter
│   ├── hooks/
│   │   └── useToggle.ts            # useToggle + useLocalStorage hooks
│   ├── utils/
│   │   └── helpers.ts              # Pure utility functions
│   ├── test/
│   │   └── setup.ts                # Test setup (jest-dom matchers)
│   ├── App.tsx                     # Showcase dashboard UI
│   ├── main.tsx                    # App entry point
│   └── index.css                   # Global styles (dark theme)
├── vite.config.ts                  # Vite + Vitest configuration
├── tsconfig.app.json               # TypeScript config
└── package.json
```

---

## 🧬 Testing Library: Vitest + React Testing Library

### Why Vitest?

**Vitest** is the most popular test runner for Vite projects. It's essentially a drop-in replacement for Jest that:

- ⚡ Shares Vite's config, transforms, and plugins (zero extra config)
- 🔥 Uses Vite's dev server for blazing-fast HMR in watch mode
- 🧩 Has Jest-compatible API (`describe`, `it`, `expect`, `vi.fn()`)
- 📊 Built-in coverage, UI dashboard, and TypeScript support

### Why React Testing Library?

Tests should simulate **how users interact** with your app, not implementation details:

- Queries by **role**, **label**, and **text** — not CSS classes or component state
- Encourages **accessibility-first** testing
- Works with any React renderer

---

## 📖 Test Suites — Complete Syntax Guide

### 1️⃣ `helpers.test.ts` — Basic Matchers & Pure Functions

> Tests pure utility functions showcasing every fundamental matcher.

#### Matchers Covered

```ts
// ── Equality ──────────────────────────
expect(value).toBe(expected)           // Strict equality (===) for primitives
expect(value).toEqual(expected)        // Deep equality for objects/arrays
expect(value).not.toBe(other)          // Negation — ensures values differ

// ── Truthiness ────────────────────────
expect(value).toBeTruthy()             // Passes if value is truthy
expect(value).toBeFalsy()              // Passes if value is falsy
expect(value).toBeNull()               // Passes if value is null
expect(value).toBeUndefined()          // Passes if value is undefined
expect(value).toBeDefined()            // Passes if value is NOT undefined

// ── Numbers ───────────────────────────
expect(num).toBeGreaterThan(3)         // > 3
expect(num).toBeGreaterThanOrEqual(3)  // >= 3
expect(num).toBeLessThan(5)            // < 5
expect(num).toBeLessThanOrEqual(5)     // <= 5
expect(0.1 + 0.2).toBeCloseTo(0.3)    // Floating point comparison

// ── Strings ───────────────────────────
expect(str).toContain("substring")     // String contains
expect(str).toMatch(/regex/)           // Regex matching
expect(str).toHaveLength(5)            // .length check

// ── Arrays ────────────────────────────
expect(arr).toContain(item)            // Array includes item
expect(arr).toHaveLength(3)            // Array length
expect(arr).toEqual([1, 2, 3])         // Deep array comparison

// ── Errors ────────────────────────────
expect(() => fn()).toThrow()           // Function throws any error
expect(() => fn()).toThrow("message")  // Throws with specific message
expect(() => fn()).toThrowError(/re/)  // Throws matching regex
```

#### Test Organization

```ts
describe("outer group", () => {
  describe("inner group", () => {
    it("does something specific", () => {
      expect(true).toBe(true);
    });
  });
});
```

---

### 2️⃣ `Counter.test.tsx` — Component Rendering & User Interaction

> Renders the Counter component and tests clicks, props, callbacks, and conditional rendering.

#### Key Concepts

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── render() — Mount a component into jsdom ──
render(<Counter initialCount={5} />);

// ── screen queries — Find elements ──
screen.getByText("Counter")              // By visible text
screen.getByRole("button", { name: "Increment" })  // By ARIA role + name
screen.getByTestId("count-display")      // By data-testid attribute

// ── queryBy* — Returns null instead of throwing ──
screen.queryByTestId("reset-button")     // null if not found (great for "not exists" assertions)

// ── getBy* vs queryBy* ──
// getBy*   → throws if not found (use when element SHOULD exist)
// queryBy* → returns null (use when element MIGHT NOT exist)

// ── userEvent — Realistic user interactions ──
const user = userEvent.setup();
await user.click(button);               // Click a button

// ── vi.fn() — Mock functions ──
const handleChange = vi.fn();
render(<Counter onCountChange={handleChange} />);
await user.click(incrementBtn);

expect(handleChange).toHaveBeenCalled();
expect(handleChange).toHaveBeenCalledWith(1);
expect(handleChange).toHaveBeenCalledTimes(1);

// ── DOM Matchers (jest-dom) ──
expect(element).toBeInTheDocument();     // Element exists in DOM
expect(element).toHaveTextContent("5");  // Text content check
expect(button).toBeDisabled();           // disabled attribute
expect(element).toBeVisible();           // CSS visibility
```

---

### 3️⃣ `LoginForm.test.tsx` — Forms, Async & Validation

> Tests form typing, validation errors, async submission, loading states.

#### Key Concepts

```tsx
// ── Finding form elements ──
screen.getByLabelText("Email")           // By <label> association
screen.getByPlaceholderText("you@...")    // By placeholder attribute
screen.getAllByRole("alert")             // All matching elements

// ── Typing into inputs ──
const user = userEvent.setup();
await user.type(input, "test@example.com");
await user.clear(input);                 // Clear input field

// ── toHaveValue — Check input values ──
expect(input).toHaveValue("test@example.com");

// ── toHaveAttribute — Check HTML attributes ──
expect(input).toHaveAttribute("type", "email");
expect(input).toHaveAttribute("aria-invalid", "true");

// ── Async Testing with waitFor ──
await waitFor(() => {
  expect(screen.getByText("Success")).toBeInTheDocument();
});

// ── findBy* — Async queries (getBy + waitFor) ──
const success = await screen.findByTestId("success-message");
const alert = await screen.findByRole("alert");

// ── Mock async callbacks ──
const mockSubmit = vi.fn();
mockSubmit.mockResolvedValue(undefined);   // Simulate success
mockSubmit.mockRejectedValue(new Error()); // Simulate failure

// ── Controlled async with mockImplementation ──
let resolve!: () => void;
mockSubmit.mockImplementation(
  () => new Promise<void>(r => { resolve = r; })
);
// ... trigger submit ...
// ... test loading state ...
resolve(); // Complete the promise manually
```

---

### 4️⃣ `TodoList.test.tsx` — Lists, Keyboard Events & API Mocking

> Tests adding/toggling/deleting/filtering todos and async data loading.

#### Key Concepts

```tsx
// ── Keyboard events ──
await user.type(input, "Learn Vitest{enter}");  // {enter} simulates Enter key

// ── Checkbox testing ──
const checkbox = screen.getByRole("checkbox", { name: /mark "buy milk"/i });
expect(checkbox).not.toBeChecked();
await user.click(checkbox);
expect(checkbox).toBeChecked();

// ── within() — Scope queries to a container ──
import { within } from "@testing-library/react";
const userList = await screen.findByTestId("user-list");
const scoped = within(userList);
scoped.getByText("Alice Johnson");       // Only searches inside userList

// ── Mocking async data fetching ──
const fetchUsers = vi.fn().mockResolvedValue(mockUsers);
render(<UserList fetchUsers={fetchUsers} />);

// Wait for loading to finish
const list = await screen.findByTestId("user-list");

// Verify the mock was called
expect(fetchUsers).toHaveBeenCalledTimes(1);

// ── Never-resolving promises (test loading state) ──
const fetchUsers = vi.fn(
  () => new Promise<User[]>(() => { /* never resolves */ })
);
expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
```

---

### 5️⃣ `Widgets.test.tsx` — Accessibility, Snapshots & Generics

> Tests ARIA roles, snapshot matching, and generic component testing.

#### Key Concepts

```tsx
// ── ARIA Role Testing ──
screen.getByRole("switch")                // <button role="switch">
screen.getByRole("switch", { name: "Dark mode" })

// ── ARIA Attribute Testing ──
expect(toggle).toHaveAttribute("aria-checked", "true");
expect(toggle).toHaveAttribute("aria-checked", "false");

// ── Snapshot Testing ──
const { container } = render(<Notification type="success" message="OK" />);

// toMatchSnapshot — saves to __snapshots__/ folder
expect(container.firstChild).toMatchSnapshot();

// toMatchInlineSnapshot — stores snapshot IN the test file
expect(container.firstChild).toMatchInlineSnapshot(`
  <div class="notification success">OK</div>
`);

// ── getAllByTestId — Multiple elements ──
const items = screen.getAllByTestId("fruit-item");
expect(items).toHaveLength(5);

// queryAllByTestId — Returns empty array (doesn't throw)
expect(screen.queryAllByTestId("missing")).toHaveLength(0);
```

---

### 6️⃣ `hooks.test.ts` — Custom Hook Testing

> Tests `useToggle` and `useLocalStorage` hooks in isolation.

#### Key Concepts

```tsx
import { renderHook, act } from "@testing-library/react";

// ── renderHook — Test hooks without a component ──
const { result } = renderHook(() => useToggle());
expect(result.current.value).toBe(false);

// ── act() — Wrap state-updating calls ──
act(() => {
  result.current.toggle();
});
expect(result.current.value).toBe(true);

// ── vi.spyOn — Spy on existing methods ──
vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);
vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});

// ── Verify spy was called ──
expect(localStorage.setItem).toHaveBeenCalledWith("key", '"value"');

// ── vi.restoreAllMocks — Undo all spies ──
afterEach(() => {
  vi.restoreAllMocks();
});

// ── Lifecycle hooks ──
beforeEach(() => { /* runs before each test */ });
afterEach(() => { /* runs after each test */ });
beforeAll(() => { /* runs once before all tests */ });
afterAll(() => { /* runs once after all tests */ });
```

---

### 7️⃣ `advanced.test.ts` — Timers, Parameterized & Advanced Mocking

> Showcases vi.useFakeTimers, test.each, spying, and mock return patterns.

#### Key Concepts

```tsx
// ── Fake Timers ──────────────────────────
vi.useFakeTimers();                        // Replace real timers
vi.advanceTimersByTime(300);               // Fast-forward 300ms
vi.runAllTimers();                         // Run all pending timers
vi.useRealTimers();                        // Restore real timers

// ── Parameterized Tests (it.each) ────────
it.each([
  { input: "hello world", expected: "hello-world" },
  { input: "UPPERCASE", expected: "uppercase" },
])('slugify("$input") → "$expected"', ({ input, expected }) => {
  expect(slugify(input)).toBe(expected);
});

// Table-style syntax:
it.each([
  ["user@test.com", true],
  ["invalid", false],
])("isValidEmail(%s) → %s", (email, expected) => {
  expect(isValidEmail(email)).toBe(expected);
});

// ── vi.spyOn — Non-destructive watching ──
const spy = vi.spyOn(calculator, "add");
calculator.add(2, 3);
expect(spy).toHaveBeenCalledWith(2, 3);
expect(spy).toHaveReturnedWith(5);

// ── Mock return patterns ──
fn.mockReturnValue("default");             // Always returns "default"
fn.mockReturnValueOnce("first");           // Returns "first" once, then fallback
fn.mockImplementation((a, b) => a * b);    // Custom implementation
fn.mockResolvedValue(data);                // Returns Promise.resolve(data)
fn.mockRejectedValue(error);               // Returns Promise.reject(error)

// ── Inspecting mock calls ──
fn.mock.calls                              // [[arg1, arg2], [arg1, arg2], ...]
fn.mock.results                            // [{ type: "return", value: ... }, ...]
fn.mock.lastCall                           // Most recent call arguments

// ── test.todo & test.skip ──
it.todo("implement WebSocket testing");    // Placeholder (shows in results)
it.skip("temporarily disabled", () => {}); // Skipped (shown but not run)
```

---

## 🔍 Query Priority Guide

React Testing Library recommends this priority for finding elements:

| Priority | Query               | When to Use                                    |
| -------- | ------------------- | ---------------------------------------------- |
| 1️⃣      | `getByRole`         | **Always try first** — mirrors user experience |
| 2️⃣      | `getByLabelText`    | Form inputs with `<label>`                     |
| 3️⃣      | `getByPlaceholderText` | Inputs with placeholder                     |
| 4️⃣      | `getByText`         | Non-interactive elements                       |
| 5️⃣      | `getByDisplayValue` | Current value of inputs                        |
| 6️⃣      | `getByAltText`      | Images with alt text                           |
| 7️⃣      | `getByTitle`        | Elements with title attribute                  |
| 8️⃣      | `getByTestId`       | **Last resort** — use `data-testid`            |

### Query Variants

| Variant    | No Match | 1 Match | 1+ Match | Async? |
| ---------- | -------- | ------- | -------- | ------ |
| `getBy`    | throw    | return  | throw    | No     |
| `queryBy`  | `null`   | return  | throw    | No     |
| `findBy`   | throw    | return  | throw    | Yes ✅ |
| `getAllBy`  | throw    | array   | array    | No     |
| `queryAllBy`| `[]`    | array   | array    | No     |
| `findAllBy`| throw    | array   | array    | Yes ✅ |

---

## ⚙️ Configuration Reference

### `vite.config.ts` — Key Options

```ts
test: {
  globals: true,       // Use describe/it/expect without imports
  environment: "jsdom", // Simulate browser environment
  setupFiles: ["./src/test/setup.ts"], // Run before each test file
  css: true,           // Process CSS imports in tests
  include: ["src/**/*.{test,spec}.{ts,tsx}"], // Test file patterns
}
```

### `src/test/setup.ts` — Setup File

```ts
import "@testing-library/jest-dom/vitest";  // Adds DOM matchers
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());  // Clean up after each test
```

---

## 🎯 What This Project Demonstrates

| Category               | Concepts                                                                  |
| ---------------------- | ------------------------------------------------------------------------- |
| **Basic Matchers**     | toBe, toEqual, toContain, toMatch, toThrow, toBeCloseTo, toHaveLength    |
| **DOM Matchers**       | toBeInTheDocument, toHaveTextContent, toBeDisabled, toBeChecked           |
| **Queries**            | getBy*, queryBy*, findBy*, getAllBy*, within()                            |
| **User Events**        | click, type, clear, keyboard {enter}                                     |
| **Async Testing**      | waitFor, findBy*, mockResolvedValue, mockRejectedValue                   |
| **Mock Functions**     | vi.fn(), toHaveBeenCalledWith, mock.calls, mockImplementation            |
| **Spying**             | vi.spyOn, mockReturnValue, toHaveReturnedWith                            |
| **Fake Timers**        | vi.useFakeTimers, advanceTimersByTime, runAllTimers                      |
| **Hooks Testing**      | renderHook, act()                                                        |
| **Snapshots**          | toMatchSnapshot, toMatchInlineSnapshot                                   |
| **Accessibility**      | getByRole, aria-checked, aria-label, role="switch"                       |
| **Parameterized**      | it.each with object and table syntax                                     |
| **Lifecycle**          | beforeEach, afterEach, beforeAll, afterAll                               |
| **Test Markers**       | it.todo, it.skip                                                         |
| **Browser API Mocks**  | localStorage spy, console.warn spy                                       |

---

## 📝 License

MIT
