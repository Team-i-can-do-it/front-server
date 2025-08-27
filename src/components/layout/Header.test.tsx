/**
 * Testing library/framework: React Testing Library with Jest/Vitest-style APIs.
 *
 * This suite validates:
 * - Conditional rendering of back/close buttons and title
 * - Back behavior depending on window.history.state.idx
 * - Navigation targets for backTo prop and close action
 * - Accessibility labels and alt text
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import type { To } from 'react-router-dom';
import Header from './Header';

// Mock SVG imports to avoid bundler-specific loaders in test environment
jest.mock('@_icons/icon-back.svg', () => 'icon-back.svg');
jest.mock('@_icons/icon-close.svg', () => 'icon-close.svg');

// Mock react-router-dom useNavigate
const navigateMock = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('Header', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    // Reset history state to a neutral baseline
    // Use replaceState to avoid adding entries and to control state.idx explicitly
    window.history.replaceState({}, '', window.location.pathname);
  });

  it('renders with defaults: shows back button, hides close button, no title', () => {
    render(<Header />);
    // Back button visible
    expect(screen.getByRole('button', { name: '뒤로가기 버튼' })).toBeInTheDocument();
    // Close button not rendered
    expect(screen.queryByRole('button', { name: '닫기 버튼' })).not.toBeInTheDocument();
    // No title by default
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    // Header landmark is present
    expect(screen.getByRole('banner', { name: '헤더' })).toBeInTheDocument();
  });

  it('renders provided title centered', () => {
    render(<Header title="My Page" />);
    expect(screen.getByRole('heading', { name: 'My Page' })).toBeInTheDocument();
  });

  it('does not render back button when showBack=false', () => {
    render(<Header showBack={false} />);
    expect(screen.queryByRole('button', { name: '뒤로가기 버튼' })).not.toBeInTheDocument();
  });

  it('renders close button when showClose=true', () => {
    render(<Header showClose />);
    expect(screen.getByRole('button', { name: '닫기 버튼' })).toBeInTheDocument();
  });

  it('back button navigates -1 when history.state.idx > 0', () => {
    // Simulate having a back stack by setting a state with idx > 0
    window.history.pushState({ idx: 1 }, '', '/prev');
    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: '뒤로가기 버튼' }));
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it('back button navigates to default backTo="/home" with replace when idx <= 0 or undefined', () => {
    // Explicitly set idx=0
    window.history.replaceState({ idx: 0 }, '', window.location.pathname);
    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: '뒤로가기 버튼' }));
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/home', { replace: true });
  });

  it('back button navigates to provided backTo with replace when no history', () => {
    const customBackTo: To = '/dashboard';
    // Ensure no idx present
    window.history.replaceState({}, '', window.location.pathname);
    render(<Header backTo={customBackTo} />);
    fireEvent.click(screen.getByRole('button', { name: '뒤로가기 버튼' }));
    expect(navigateMock).toHaveBeenCalledWith(customBackTo, { replace: true });
  });

  it('close button navigates to "/home" with replace', () => {
    render(<Header showClose />);
    fireEvent.click(screen.getByRole('button', { name: '닫기 버튼' }));
    expect(navigateMock).toHaveBeenCalledWith('/home', { replace: true });
  });

  it('back and close buttons have correct alt text on images', () => {
    render(<Header showClose title="Alt test" />);
    // img elements with alt attributes
    expect(screen.getByAltText('뒤로가기 버튼')).toBeInTheDocument();
    expect(screen.getByAltText('닫기 버튼')).toBeInTheDocument();
  });

  it('handles non-numeric/invalid idx safely by treating as 0', () => {
    // Simulate an unexpected state shape
    window.history.replaceState({ idx: 'not-a-number' }, '', window.location.pathname);
    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: '뒤로가기 버튼' }));
    // Because idx is truthy as a string but comparison is with > 0, JS coerces 'not-a-number' to NaN.
    // NaN > 0 is false, so it should navigate to backTo with replace.
    expect(navigateMock).toHaveBeenCalledWith('/home', { replace: true });
  });

  it('does not crash if history.state is null/undefined', () => {
    // JSDOM may set state to null by default; ensure no error and correct navigation
    window.history.replaceState(null as unknown as object, '', window.location.pathname);
    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: '뒤로가기 버튼' }));
    expect(navigateMock).toHaveBeenCalledWith('/home', { replace: true });
  });
});