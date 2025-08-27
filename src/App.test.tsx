import React from "react";
import { MemoryRouter, RouteObject, createMemoryRouter, RouterProvider } from "react-router-dom";
import { render, screen, within } from "@testing-library/react";

// Detect runner (Vitest vs Jest) for mocking API compatibility
const isVitest = typeof vi !== "undefined";
const mockFn = isVitest ? vi.fn : (global as any).jest?.fn ?? (() => { throw new Error("No mock fn") });
const mockModule = (...args: any[]) => {
  if (isVitest) {
    // @ts-ignore
    return vi.mock.apply(vi, args);
  }
  // @ts-ignore
  return jest.mock.apply(jest, args);
};

// Mock modules used by App to avoid path alias resolution issues and to control render output.
// Mock DefaultLayout to render header prop and an Outlet to allow nested routes to render.
mockModule("@_layout/DefaultLayout", () => {
  const React = require("react");
  const { Outlet } = require("react-router-dom");
  const DefaultLayout = (props: { header?: React.ReactNode }) => (
    <div data-testid="default-layout">
      <div data-testid="header-slot">{props.header}</div>
      <Outlet />
    </div>
  );
  return { __esModule: true, default: DefaultLayout };
}, isVitest ? { virtual: true } : undefined);

// Mock Header to expose accessible elements we can assert against.
mockModule("@_layout/Header", () => {
  const React = require("react");
  type HeaderProps = {
    title: string;
    showBack?: boolean;
    backTo?: string;
    showClose?: boolean;
  };
  const Header = ({ title, showBack, backTo, showClose }: HeaderProps) => (
    <header aria-label="app header">
      <h1>{title}</h1>
      {showBack ? (
        <a href={backTo} aria-label="go back" role="link">Back</a>
      ) : null}
      {showClose ? (
        <button type="button" aria-label="close">Close</button>
      ) : null}
    </header>
  );
  return { __esModule: true, default: Header };
}, isVitest ? { virtual: true } : undefined);

// Mock DesignTest page so we can assert it renders.
mockModule("@_page/DesignTest", () => {
  const React = require("react");
  const DesignTest = () => <div data-testid="design-test">Design Test Page</div>;
  return { __esModule: true, default: DesignTest };
}, isVitest ? { virtual: true } : undefined);

// Import App AFTER mocks
import App from "./App";

describe("App routing and layout", () => {
  const renderWithRouter = (initialPath: string) => {
    // Use createMemoryRouter for precise route control in React Router v6.4+
    const routes: RouteObject[] = [
      { path: "*", element: <App /> },
    ];
    const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
    return render(<RouterProvider router={router} />);
  };

  test("renders DefaultLayout and Header on /style route", async () => {
    renderWithRouter("/style");

    const layout = await screen.findByTestId("default-layout");
    expect(layout).toBeInTheDocument();

    const headerSlot = within(layout).getByTestId("header-slot");
    expect(headerSlot).toBeInTheDocument();

    // Title should be present
    expect(within(headerSlot).getByRole("heading", { name: "스타일 테스트" })).toBeInTheDocument();

    // Back link should be present and point to "/"
    const backLink = within(headerSlot).getByRole("link", { name: /back/i });
    expect(backLink).toHaveAttribute("href", "/");

    // Close control should be present
    const closeBtn = within(headerSlot).getByRole("button", { name: /close/i });
    expect(closeBtn).toBeInTheDocument();

    // Nested route element (DesignTest) should render via Outlet
    expect(screen.getByTestId("design-test")).toBeInTheDocument();
    expect(screen.getByText(/Design Test Page/i)).toBeInTheDocument();
  });

  test("does not render layout for unknown route", () => {
    renderWithRouter("/unknown");
    // With no matching route, nothing should be rendered from App.
    expect(screen.queryByTestId("default-layout")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "스타일 테스트" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("design-test")).not.toBeInTheDocument();
  });

  test("header contains expected accessible structure", () => {
    renderWithRouter("/style");

    const header = screen.getByRole("banner", { hidden: true }) || screen.getByLabelText("app header");
    expect(header).toBeInTheDocument();

    // Ensure exactly one h1 with the title
    const headings = within(header).getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("스타일 테스트");
  });
});