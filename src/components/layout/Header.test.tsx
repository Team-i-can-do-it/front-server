import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Note: We only mock useNavigate; other exports (if needed) will fall back to actual.
const navigateMock = vi.fn ? vi.fn() : jest.fn();

const actualRRD = jest ? jest.requireActual?.('react-router-dom') : undefined;

jest?.mock?.('react-router-dom', () => {
  const actual = actualRRD ?? {};
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Fallback for Vitest environment
// @ts-ignore
if (typeof vi !== 'undefined' && vi?.mock) {
  // @ts-ignore
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<any>('react-router-dom');
    return {
      ...actual,
      useNavigate: () => navigateMock,
    };
  });
}

// Import after mocks
import Header from './Header';

// Utilities to mock history.state getter safely across JSDOM/Jest/Vitest
function mockHistoryState(value: any) {
  // In jsdom, history.state is a getter; spy on getter to control value.
  const spy = (jest && jest.spyOn)
    ? jest.spyOn(window.history, 'state', 'get').mockReturnValue(value)
    // @ts-ignore Vitest spy
    : vi.spyOn(window.history, 'state', 'get').mockReturnValue(value);
  return spy;
}

describe('Header component', () => {
  beforeEach(() => {
    navigateMock.mockReset?.();
  });

  it('renders header with proper aria-label', () => {
    render(<Header />);
    expect(screen.getByLabelText('헤더')).toBeInTheDocument();
  });

  it('renders title when provided and truncates via class', () => {
    render(<Header title="My Page Title" />);
    const titleEl = screen.getByText('My Page Title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveClass('truncate');
  });

  it('does not render title when not provided', () => {
    render(<Header />);
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('shows back button by default and hides close button by default', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: '뒤로가기 버튼' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '닫기 버튼' })).toBeNull();
  });

  it('hides back button when showBack is false', () => {
    render(<Header showBack={false} />);
    expect(screen.queryByRole('button', { name: '뒤로가기 버튼' })).toBeNull();
  });

  it('shows close button when showClose is true', () => {
    render(<Header showClose />);
    expect(screen.getByRole('button', { name: '닫기 버튼' })).toBeInTheDocument();
  });

  it('back button navigates -1 when history idx > 0', () => {
    const spy = mockHistoryState({ idx: 1 });
    render(<Header backTo="/fallback" />);
    const backBtn = screen.getByRole('button', { name: '뒤로가기 버튼' });
    fireEvent.click(backBtn);
    expect(navigateMock).toHaveBeenCalledWith(-1);
    spy.mockRestore();
  });

  it('back button navigates to backTo with replace when no history (idx <= 0)', () => {
    const spy = mockHistoryState({ idx: 0 });
    render(<Header backTo="/home" />);
    fireEvent.click(screen.getByRole('button', { name: '뒤로가기 버튼' }));
    expect(navigateMock).toHaveBeenCalledWith('/home', { replace: true });
    spy.mockRestore();
  });

  it('back button uses provided backTo when history not available', () => {
    const spy = mockHistoryState(null);
    render(<Header backTo="/custom" />);
    fireEvent.click(screen.getByRole('button', { name: '뒤로가기 버튼' }));
    expect(navigateMock).toHaveBeenCalledWith('/custom', { replace: true });
    spy.mockRestore();
  });

  it('close button navigates to /home with replace', () => {
    render(<Header showClose />);
    fireEvent.click(screen.getByRole('button', { name: '닫기 버튼' }));
    expect(navigateMock).toHaveBeenCalledWith('/home', { replace: true });
  });

  it('renders back and close icons with correct alt text when visible', () => {
    render(<Header showClose />);
    expect(screen.getByAltText('뒤로가기 버튼')).toBeInTheDocument();
    expect(screen.getByAltText('닫기 버튼')).toBeInTheDocument();
  });

  it('is robust when title is empty string', () => {
    render(<Header title="" />);
    expect(screen.queryByRole('heading')).toBeNull();
  });
});