/**
 * DefaultLayout tests
 * Library: @testing-library/react
 * Runner: Jest or Vitest (globals). If Vitest without globals, import { describe, it, expect } from 'vitest'.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from './DefaultLayout';

const PT_CLASS = 'pt-[calc(var(--header-h)+env(safe-area-inset-top,0px))]';
const PB_CLASS = 'pb-[calc(var(--nav-h)+env(safe-area-inset-bottom,0px))]';

function getContainers(container: HTMLElement) {
  const outer = container.firstElementChild as HTMLElement; // outer wrapper
  const inner = outer?.firstElementChild as HTMLElement;    // inner layout container with CSS vars
  return { outer, inner };
}

describe('DefaultLayout', () => {
  it('renders children when provided and omits header/bottom paddings by default', () => {
    const { container } = render(
      <DefaultLayout>
        <div data-testid="child">Child Content</div>
      </DefaultLayout>
    );

    expect(screen.getByTestId('child')).toBeTruthy();
    const main = screen.getByRole('main');
    expect(main.className.includes(PT_CLASS)).toBe(false);
    expect(main.className.includes(PB_CLASS)).toBe(false);
  });

  it('renders Outlet content when no children are provided', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route index element={<div data-testid="outlet-content">Outlet Child</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('outlet-content')).toBeTruthy();

    const main = screen.getByRole('main');
    expect(main.className.includes(PT_CLASS)).toBe(false);
    expect(main.className.includes(PB_CLASS)).toBe(false);
  });

  it('renders a fixed header by default and applies top padding to main', () => {
    const header = <div data-testid="header">Header</div>;
    const { container } = render(<DefaultLayout header={header} />);

    const headerWrapper = screen.getByTestId('header').parentElement as HTMLElement;
    expect(headerWrapper).toBeTruthy();
    expect(headerWrapper.className.includes('fixed')).toBe(true);
    // Should set height using CSS calc with safe-area
    expect((headerWrapper as HTMLElement).style.height.includes('var(--header-h)')).toBe(true);

    const main = screen.getByRole('main');
    expect(main.className.includes(PT_CLASS)).toBe(true);
  });

  it('renders a non-fixed header when headerFixed=false and removes top padding from main', () => {
    const header = <div data-testid="header">Header</div>;
    const { container } = render(<DefaultLayout header={header} headerFixed={false} />);

    const headerWrapper = screen.getByTestId('header').parentElement as HTMLElement;
    expect(headerWrapper).toBeTruthy();
    expect(headerWrapper.className.includes('fixed')).toBe(false);
    expect(headerWrapper.className.includes('w-full')).toBe(true);
    expect(headerWrapper.style.height.includes('var(--header-h)')).toBe(true);

    const main = screen.getByRole('main');
    expect(main.className.includes(PT_CLASS)).toBe(false);
  });

  it('renders fixed bottom nav by default and applies bottom padding to main', () => {
    const bottom = <div data-testid="bottom">Bottom</div>;
    const { container } = render(<DefaultLayout bottomNav={bottom} />);

    const main = screen.getByRole('main');
    expect(main.className.includes(PB_CLASS)).toBe(true);

    // When fixed, bottomNav is rendered directly (no wrapper with h-[64px])
    const bottomEl = screen.getByTestId('bottom');
    const parent = bottomEl.parentElement as HTMLElement;
    expect(parent).toBeTruthy();
    expect(parent.className.includes('h-[64px]')).toBe(false);
  });

  it('renders non-fixed bottom nav wrapper when navFixed=false and removes main bottom padding', () => {
    const bottom = <div data-testid="bottom">Bottom</div>;
    const { container } = render(<DefaultLayout bottomNav={bottom} navFixed={false} />);

    const main = screen.getByRole('main');
    expect(main.className.includes(PB_CLASS)).toBe(false);

    const bottomWrapper = screen.getByTestId('bottom').parentElement as HTMLElement;
    expect(bottomWrapper).toBeTruthy();
    expect(bottomWrapper.className.includes('h-[64px]')).toBe(true);
    expect(bottomWrapper.className.includes('border-t')).toBe(true);
    expect(bottomWrapper.style.paddingBottom.includes('env(safe-area-inset-bottom')).toBe(true);
  });

  it('does not render bottom nav when hasBottomNav=false (even if bottomNav provided)', () => {
    const bottom = <div data-testid="bottom">Bottom</div>;
    const { container } = render(<DefaultLayout bottomNav={bottom} hasBottomNav={false} />);

    expect(screen.queryByTestId('bottom')).toBeNull();
    const main = screen.getByRole('main');
    expect(main.className.includes(PB_CLASS)).toBe(false);
  });

  it('applies px-0 when noPadding=true and default side padding when false', () => {
    // default (noPadding=false)
    const { container: c1 } = render(<DefaultLayout><div /></DefaultLayout>);
    const { inner: i1 } = getContainers(c1 as unknown as HTMLElement);
    expect(i1.className.includes('px-[var(--side)]')).toBe(true);
    expect(i1.className.includes('px-0')).toBe(false);

    // noPadding=true
    const { container: c2 } = render(<DefaultLayout noPadding><div /></DefaultLayout>);
    const { inner: i2 } = getContainers(c2 as unknown as HTMLElement);
    expect(i2.className.includes('px-0')).toBe(true);
    expect(i2.className.includes('px-[var(--side)]')).toBe(false);
  });

  it('applies debug frame classes when debugFrame=true', () => {
    const { container } = render(<DefaultLayout debugFrame><div /></DefaultLayout>);
    const { inner } = getContainers(container as unknown as HTMLElement);
    expect(inner.className.includes('rounded-2xl')).toBe(true);
    // Shadow class string contains special chars; check substring
    expect(inner.className.includes('shadow-')).toBe(true);
  });

  it('sets expected CSS custom properties on the inner layout container', () => {
    const { container } = render(<DefaultLayout><div /></DefaultLayout>);
    const { inner } = getContainers(container as unknown as HTMLElement);

    // CSS custom properties should be present with expected values
    expect(inner.style.getPropertyValue('--mobile-w').trim()).toBe('390px');
    expect(inner.style.getPropertyValue('--mobile-h').trim()).toBe('844px');
    expect(inner.style.getPropertyValue('--header-h').trim()).toBe('44px');
    expect(inner.style.getPropertyValue('--nav-h').trim()).toBe('64px');
    expect(inner.style.getPropertyValue('--side').trim()).toBe('24px');
  });

  it('applies both top and bottom paddings when fixed header and fixed bottom nav are present', () => {
    const header = <div data-testid="header">Header</div>;
    const bottom = <div data-testid="bottom">Bottom</div>;
    const { container } = render(<DefaultLayout header={header} bottomNav={bottom} />);

    const main = screen.getByRole('main');
    expect(main.className.includes(PT_CLASS)).toBe(true);
    expect(main.className.includes(PB_CLASS)).toBe(true);
  });

  it('does not apply paddings when header/bottomNav are absent regardless of fixed flags', () => {
    const { container } = render(<DefaultLayout headerFixed={false} navFixed={false}><div /></DefaultLayout>);
    const main = screen.getByRole('main');
    expect(main.className.includes(PT_CLASS)).toBe(false);
    expect(main.className.includes(PB_CLASS)).toBe(false);
  });
});