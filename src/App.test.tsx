import React from 'react';
import { describe, it, expect } from 'vitest'; // falls back to Jest globals if transformed; runner should alias or ignore
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

// SUT
import App from './App';

// Mock layout and page components to observe props without depending on their internal rendering.
vi.mock('@_layout/DefaultLayout', () => {
  const DefaultLayout = ({ header, children }: any) => (
    <div data-testid="default-layout">
      <div data-testid="default-layout-header">{header}</div>
      <div data-testid="default-layout-outlet">{children}</div>
    </div>
  );
  return { default: DefaultLayout };
});

vi.mock('@_layout/Header', () => {
  const Header = (props: any) => {
    // Expose props for assertions
    return (
      <div data-testid="header"
           data-title={props?.title}
           data-show-back={String(!!props?.showBack)}
           data-back-to={props?.backTo ?? ''}
           data-show-close={String(!!props?.showClose)}>
        Header
      </div>
    );
  };
  return { default: Header };
});

vi.mock('@_page/DesignTest', () => {
  const DesignTest = () => <div data-testid="design-test">DesignTest Page</div>;
  return { default: DesignTest };
});

function renderWithRouter(initialEntries: string[] = ['/style']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {/* The App itself defines its own <Routes>, so a plain MemoryRouter is sufficient */}
      <App />
    </MemoryRouter>
  );
}

describe('App routing and layout', () => {
  it('renders DefaultLayout and Header with expected props', () => {
    renderWithRouter(['/style']);

    // Default layout exists
    expect(screen.getByTestId('default-layout')).toBeInTheDocument();

    // Header exists and has correct props
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute('data-title', '스타일 테스트');
    expect(header).toHaveAttribute('data-show-back', 'true');
    expect(header).toHaveAttribute('data-back-to', '/');
    expect(header).toHaveAttribute('data-show-close', 'true');
  });

  it('navigating to /style renders DesignTest inside layout', () => {
    renderWithRouter(['/style']);

    // DesignTest is rendered as the nested route element
    expect(screen.getByTestId('design-test')).toBeInTheDocument();

    // It should be within the layout outlet area
    expect(screen.getByTestId('default-layout-outlet')).toContainElement(
      screen.getByTestId('design-test')
    );
  });

  it('unknown route does not render DesignTest', () => {
    renderWithRouter(['/unknown']);

    expect(screen.queryByTestId('design-test')).toBeNull();
    // Still mounts the layout route element (since App defines <Route element=...>)
    expect(screen.getByTestId('default-layout')).toBeInTheDocument();
  });

  it('header back/close flags are truthy booleans', () => {
    renderWithRouter(['/style']);
    const header = screen.getByTestId('header');
    expect(header.getAttribute('data-show-back')).toBe('true');
    expect(header.getAttribute('data-show-close')).toBe('true');
  });
});