// Vitest setup file — runs before every test file
// This imports custom matchers from @testing-library/jest-dom
// e.g. toBeInTheDocument(), toBeVisible(), toHaveTextContent(), etc.
import "@testing-library/jest-dom/vitest";

// Clean up after each test to prevent state leaking between tests
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
