import { renderHook, act } from '@testing-library/react';
import {
  useTheme,
  THEME_STORAGE_KEY,
  __resetCachedSetting as resetCachedSetting,
} from './useTheme';

type ChangeListener = (event: MediaQueryListEvent) => void;

interface MockMedia {
  matches: boolean;
  addEventListener: (type: 'change', listener: ChangeListener) => void;
  removeEventListener: (type: 'change', listener: ChangeListener) => void;
}

const createMediaHarness = (initialDark: boolean) => {
  let dark = initialDark;
  const listeners = new Set<ChangeListener>();
  const media: MockMedia = {
    get matches() {
      return dark;
    },
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
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

const installMatchMedia = (harness: { media: MockMedia }) => {
  window.matchMedia = jest.fn(() => harness.media as unknown as MediaQueryList);
};

describe('useTheme Hook', () => {
  let mediaHarness: ReturnType<typeof createMediaHarness>;

  beforeEach(() => {
    resetCachedSetting();
    mediaHarness = createMediaHarness(false);
    installMatchMedia(mediaHarness);
    window.localStorage.clear();
  });

  it('defaults to system on first visit', () => {
    const { result } = renderHook(() => useTheme());

    // Assert
    expect(result.current.setting).toBe('system');
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('cycles system -> light -> dark -> system', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.cycleSetting();
    });
    expect(result.current.setting).toBe('light');

    act(() => {
      result.current.cycleSetting();
    });
    expect(result.current.setting).toBe('dark');

    act(() => {
      result.current.cycleSetting();
    });
    expect(result.current.setting).toBe('system');
  });

  it('persists explicit settings and a fresh hook instance reads them back', () => {
    const first = renderHook(() => useTheme());

    act(() => {
      first.result.current.setSetting('dark');
    });
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    // Act: simulate a reload by mounting a fresh hook instance.
    const second = renderHook(() => useTheme());

    // Assert
    expect(second.result.current.setting).toBe('dark');
    expect(second.result.current.resolvedTheme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('falls back to system when storage is unavailable', () => {
    // Arrange
    const getError = () => {
      throw new Error('blocked');
    };
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: getError,
    });

    try {
      // Act
      const { result } = renderHook(() => useTheme());

      // Assert
      expect(result.current.setting).toBe('system');
    } finally {
      if (descriptor) {
        Object.defineProperty(window, 'localStorage', descriptor);
      }
    }
  });

  it('does not surface an error when persisting fails', () => {
    const { result } = renderHook(() => useTheme());
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => null,
    });

    try {
      // Act
      act(() => {
        result.current.setSetting('dark');
      });

      // Assert
      expect(result.current.setting).toBe('dark');
      expect(document.documentElement.dataset.theme).toBe('dark');
    } finally {
      if (descriptor) {
        Object.defineProperty(window, 'localStorage', descriptor);
      }
    }
  });

  it('resolves system theme from matchMedia and reacts to OS changes', () => {
    // Arrange
    mediaHarness.setDark(true);
    document.documentElement.dataset.theme = 'light';

    // Act
    const { result } = renderHook(() => useTheme());
    expect(result.current.resolvedTheme).toBe('dark');

    act(() => {
      mediaHarness.setDark(false);
    });

    // Assert
    expect(result.current.resolvedTheme).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('ignores OS changes while an explicit theme is chosen', () => {
    // Arrange
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setSetting('light');
    });

    // Act
    act(() => {
      mediaHarness.setDark(true);
    });

    // Assert
    expect(result.current.setting).toBe('light');
    expect(result.current.resolvedTheme).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('writes the attribute through system mode when the OS flips', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.setting).toBe('system');
    expect(document.documentElement.dataset.theme).toBe('light');

    act(() => {
      mediaHarness.setDark(true);
    });

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
