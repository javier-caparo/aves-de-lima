import { render, screen, act } from '@testing-library/react';
import GlobalHeader from './GlobalHeader';
import { THEME_STORAGE_KEY } from '../hooks/useTheme';

type ChangeListener = (event: MediaQueryListEvent) => void;

const createMediaHarness = (initialDark: boolean) => {
  let dark = initialDark;
  const listeners = new Set<ChangeListener>();
  const media = {
    get matches() {
      return dark;
    },
    addEventListener: (_type: 'change', listener: ChangeListener) =>
      listeners.add(listener),
    removeEventListener: (_type: 'change', listener: ChangeListener) =>
      listeners.delete(listener),
  };
  return {
    media,
    setDark: (next: boolean) => {
      dark = next;
      listeners.forEach((listener) => {
        listener({ matches: dark, media } as unknown as MediaQueryListEvent);
      });
    },
  };
};

describe('GlobalHeader theme toggle', () => {
  let mediaHarness: ReturnType<typeof createMediaHarness>;

  beforeEach(() => {
    mediaHarness = createMediaHarness(false);
    window.matchMedia = jest.fn(
      () => mediaHarness.media as unknown as MediaQueryList,
    );
    window.localStorage.clear();
  });

  it('exposes an accessible name naming the target setting', () => {
    // Arrange: system setting with light OS
    render(<GlobalHeader />);

    // Act: pressing targets light
    const toggle = screen.getByRole('button', { name: 'Switch to light theme' });

    // Assert: after the press the target becomes dark + attr flips
    act(() => {
      toggle.click();
    });

    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('toggles to dark and persists the choice', () => {
    // Arrange: explicit light -> next target is dark
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    render(<GlobalHeader />);

    // Act
    act(() => {
      screen.getByRole('button', { name: 'Switch to dark theme' }).click();
    });

    // Assert
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('resolves to dark on first visit with a dark OS preference', () => {
    // Arrange
    mediaHarness.setDark(true);

    // Act
    render(<GlobalHeader />);

    // Assert
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
