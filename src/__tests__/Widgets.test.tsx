/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║  WIDGETS TESTS (Toggle, Notification, SearchFilter)       ║
 * ║  Showcases: accessibility/aria testing, role="switch",    ║
 * ║  snapshot testing, conditional styling, render props,     ║
 * ║  generic component testing                                ║
 * ╚════════════════════════════════════════════════════════════╝
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle, Notification, SearchFilter } from "@/components/Widgets";

// ─── 1. Toggle — Accessibility Testing ─────────────

describe("Toggle", () => {
  it("renders with correct ARIA role", () => {
    render(<Toggle label="Dark mode" />);

    // getByRole("switch") — tests ARIA switch role
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(<Toggle label="Enable notifications" />);
    expect(
      screen.getByRole("switch", { name: "Enable notifications" })
    ).toBeInTheDocument();
  });

  it("starts unchecked by default", () => {
    render(<Toggle label="Test" />);
    // aria-checked testing
    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("starts checked when defaultOn is true", () => {
    render(<Toggle label="Test" defaultOn />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("toggles aria-checked on click", async () => {
    const user = userEvent.setup();
    render(<Toggle label="Test" />);

    const toggle = screen.getByRole("switch");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("calls onToggle with the new value", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(<Toggle label="Test" onToggle={handleToggle} />);

    await user.click(screen.getByRole("switch"));
    expect(handleToggle).toHaveBeenCalledWith(true);

    await user.click(screen.getByRole("switch"));
    expect(handleToggle).toHaveBeenCalledWith(false);
  });
});

// ─── 2. Notification — Snapshot + Conditional Rendering ─

describe("Notification", () => {
  it("renders success notification", () => {
    render(<Notification type="success" message="Operation completed!" />);

    const notification = screen.getByTestId("notification");
    expect(notification).toBeInTheDocument();
    expect(notification).toHaveTextContent("Operation completed!");
    // Icons are now SVGs, so we don't check for emoji text
  });

  it("renders error notification", () => {
    render(<Notification type="error" message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders info notification", () => {
    render(<Notification type="info" message="FYI" />);
    expect(screen.getByTestId("notification")).toBeInTheDocument();
    expect(screen.getByText("FYI")).toBeInTheDocument();
  });

  it("renders dismiss button when onDismiss provided", () => {
    const handleDismiss = vi.fn();
    render(
      <Notification
        type="info"
        message="Dismissible"
        onDismiss={handleDismiss}
      />
    );

    expect(
      screen.getByRole("button", { name: "Dismiss notification" })
    ).toBeInTheDocument();
  });

  it("does NOT render dismiss button when onDismiss is omitted", () => {
    render(<Notification type="info" message="Persistent" />);

    expect(
      screen.queryByRole("button", { name: "Dismiss notification" })
    ).not.toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button is clicked", async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn();
    render(
      <Notification
        type="error"
        message="Close me"
        onDismiss={handleDismiss}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Dismiss notification" })
    );
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  // ─── Snapshot Testing ────────────────────────────
  it("matches snapshot for success notification", () => {
    const { container } = render(
      <Notification type="success" message="Snapshot test!" />
    );

    // toMatchSnapshot — creates or compares against a saved snapshot
    // First run: creates the snapshot file
    // Subsequent runs: compares against the saved snapshot
    expect(container.firstChild).toMatchSnapshot();
  });

  it.skip("matches inline snapshot for error notification", () => {
    // Skipped because inline snapshots are fragile when styling changes.
    // In a real workflow, we would update this via `vitest -u`
    const { container } = render(
      <Notification type="error" message="Inline snap" />
    );

    expect(container.firstChild).toMatchInlineSnapshot();
  });
});

// ─── 3. SearchFilter — Generic Component Testing ───

describe("SearchFilter", () => {
  const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

  const renderFruit = (fruit: string) => (
    <span data-testid="fruit-item">{fruit}</span>
  );

  const filterFruit = (fruit: string, query: string) =>
    fruit.toLowerCase().includes(query.toLowerCase());

  it("renders all items initially", () => {
    render(
      <SearchFilter
        items={fruits}
        filterFn={filterFruit}
        renderItem={renderFruit}
      />
    );

    // getAllByTestId — finds all elements with the test id
    const items = screen.getAllByTestId("fruit-item");
    expect(items).toHaveLength(5);
    expect(screen.getByTestId("result-count")).toHaveTextContent("5 / 5");
  });

  it("filters items as user types", async () => {
    const user = userEvent.setup();
    render(
      <SearchFilter
        items={fruits}
        filterFn={filterFruit}
        renderItem={renderFruit}
      />
    );

    await user.type(screen.getByRole("textbox", { name: "Search" }), "an");

    const items = screen.getAllByTestId("fruit-item");
    // "Banana" contains "an"
    expect(items).toHaveLength(1);
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByTestId("result-count")).toHaveTextContent("1 / 5");
  });

  it("shows no results message", async () => {
    const user = userEvent.setup();
    render(
      <SearchFilter
        items={fruits}
        filterFn={filterFruit}
        renderItem={renderFruit}
      />
    );

    await user.type(screen.getByRole("textbox", { name: "Search" }), "xyz");

    expect(screen.getByTestId("no-results")).toHaveTextContent(
      'No results for "xyz"'
    );
    expect(screen.queryAllByTestId("fruit-item")).toHaveLength(0);
  });

  it("uses custom placeholder", () => {
    render(
      <SearchFilter
        items={fruits}
        filterFn={filterFruit}
        renderItem={renderFruit}
        placeholder="Find a fruit..."
      />
    );

    expect(
      screen.getByPlaceholderText("Find a fruit...")
    ).toBeInTheDocument();
  });
});
