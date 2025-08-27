/**
 * Tests for DefaultLayout
 * Testing library/framework: React Testing Library with Jest (jsdom environment).
 * If this repository uses Vitest, these tests are compatible with Vitest too (replace jest with vi).
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock only the Outlet from react-router-dom to control fallback rendering
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet-fallback">OUTLET</div>,
  };
});

import DefaultLayout from './DefaultLayout';

function getInnerContainer(base: HTMLElement) {
  // The inner container is the div with CSS variables on the style attribute
  return base.querySelector('div[style*="--mobile-w"]') as HTMLDivElement | null;
}

describe('DefaultLayout', () => {
  const Header = <div data-testid="header">HEADER</div>;
  const BottomNav = <div data-testid="bottom-nav">BOTTOM</div>;
  const Child = <div data-testid="child">CHILD</div>;

  test('renders children when provided and not Outlet', () => {
    render(<DefaultLayout header={Header} bottomNav={BottomNav}>{Child}</DefaultLayout>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('outlet-fallback')).not.toBeInTheDocument();
  });

  test('falls back to Outlet when children are not provided', () => {
    render(<DefaultLayout header={Header} bottomNav={BottomNav} />);
    expect(screen.getByTestId('outlet-fallback')).toBeInTheDocument();
  });

  test('applies CSS variables on inner container', () => {
    const { container } = render(<DefaultLayout>{Child}</DefaultLayout>);
    const inner = getInnerContainer(container)!;
    expect(inner).toBeInTheDocument();
    // Validate a couple of CSS variables explicitly
    expect(inner.style.getPropertyValue('--mobile-w')).toBe('390px');
    expect(inner.style.getPropertyValue('--mobile-h')).toBe('844px');
    expect(inner.style.getPropertyValue('--header-h')).toBe('44px');
    expect(inner.style.getPropertyValue('--nav-h')).toBe('64px');
    expect(inner.style.getPropertyValue('--side')).toBe('24px');
  });

  test('default padding adds side padding and no debug frame by default', () => {
    const { container } = render(<DefaultLayout>{Child}</DefaultLayout>);
    const inner = getInnerContainer(container)!;
    const className = inner.className;
    expect(className).toContain('px-[var(--side)]');
    expect(className).not.toContain('px-0');
    expect(className).not.toContain('rounded-2xl');
    expect(className).not.toContain('shadow-[');
  });

  test('noPadding removes side padding', () => {
    const { container } = render(<DefaultLayout noPadding>{Child}</DefaultLayout>);
    const inner = getInnerContainer(container)!;
    expect(inner.className).toContain('px-0');
    expect(inner.className).not.toContain('px-[var(--side)]');
  });

  test('debugFrame adds rounded and shadow classes', () => {
    const { container } = render(<DefaultLayout debugFrame>{Child}</DefaultLayout>);
    const inner = getInnerContainer(container)!;
    expect(inner.className).toContain('rounded-2xl');
    expect(inner.className).toMatch(/shadow-\[/);
  });

  test('header fixed: renders fixed header wrapper and adds top padding to main', () => {
    render(<DefaultLayout header={Header} headerFixed>{Child}</DefaultLayout>);
    const headerEl = screen.getByTestId('header');
    const headerWrapper = headerEl.parentElement!;
    expect(headerWrapper.className).toContain('fixed');
    expect(headerWrapper.style.height).toContain('calc('); // height calc with safe area
    const main = screen.getByRole('main');
    expect(main.className).toContain('pt-[calc(var(--header-h)+env(safe-area-inset-top,0px))]');
  });

  test('header not fixed: renders non-fixed header wrapper and no top padding on main', () => {
    render(<DefaultLayout header={Header} headerFixed={false}>{Child}</DefaultLayout>);
    const headerEl = screen.getByTestId('header');
    const headerWrapper = headerEl.parentElement!;
    expect(headerWrapper.className).toContain('w-full');
    expect(headerWrapper.className).not.toContain('fixed');
    const main = screen.getByRole('main');
    expect(main.className).not.toContain('pt-[calc(var(--header-h)+env(safe-area-inset-top,0px))]');
  });

  test('no header: does not render header and no top padding on main', () => {
    render(<DefaultLayout>{Child}</DefaultLayout>);
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
    const main = screen.getByRole('main');
    expect(main.className).not.toContain('pt-[calc(var(--header-h)+env(safe-area-inset-top,0px))]');
  });

  test('bottom nav fixed: renders bottomNav and adds bottom padding to main', () => {
    render(<DefaultLayout bottomNav={BottomNav} navFixed hasBottomNav>{Child}</DefaultLayout>);
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
    const main = screen.getByRole('main');
    expect(main.className).toContain('pb-[calc(var(--nav-h)+env(safe-area-inset-bottom,0px))]');
  });

  test('bottom nav not fixed: renders container with height and no extra main bottom padding', () => {
    render(<DefaultLayout bottomNav={BottomNav} navFixed={false} hasBottomNav>{Child}</DefaultLayout>);
    const bottom = screen.getByTestId('bottom-nav');
    const container = bottom.parentElement!;
    expect(container.className).toContain('w-full');
    expect(container.className).toContain('h-[64px]');
    expect(container.className).toContain('border-t');
    expect(container.style.paddingBottom).toContain('env(');
    const main = screen.getByRole('main');
    expect(main.className).not.toContain('pb-[calc(var(--nav-h)+env(safe-area-inset-bottom,0px))]');
  });

  test('no bottom nav when hasBottomNav=false: main has no bottom padding', () => {
    render(<DefaultLayout bottomNav={BottomNav} hasBottomNav={false}>{Child}</DefaultLayout>);
    expect(screen.queryByTestId('bottom-nav')).not.toBeInTheDocument();
    const main = screen.getByRole('main');
    expect(main.className).not.toContain('pb-[calc(var(--nav-h)+env(safe-area-inset-bottom,0px))]');
  });

  test('no bottom nav when bottomNav prop missing: main has no bottom padding', () => {
    render(<DefaultLayout hasBottomNav>{Child}</DefaultLayout>);
    const main = screen.getByRole('main');
    expect(main.className).not.toContain('pb-[calc(var(--nav-h)+env(safe-area-inset-bottom,0px))]');
  });
});