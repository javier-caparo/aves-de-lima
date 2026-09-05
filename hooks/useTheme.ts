'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

/**
 * Custom hook that owns the theme setting (light / dark / system),
 * persists explicit choices, resolves the effective theme, and keeps the
 * `data-theme`/`color-scheme` document attributes in sync. The initial
 * attribute is applied before first paint by the blocking script in
 * app/layout.tsx; this hook keeps it correct afterwards.
 */

export const THEME_STORAGE_KEY = 'theme-preference';

export type ThemeSetting = 'light' | 'dark' | 'system';

const THEME_SETTINGS: ThemeSetting[] = ['light', 'dark', 'system'];

// localStorage is unavailable on the server, so the persisted setting is
// served through a module-scope mirror plus useSyncExternalStore. This
// keeps SSR markup (which must stay 'system') in sync with hydration
// without a state-vs-storage mismatch.
let cachedSetting: ThemeSetting | null = null;
const listeners = new Set<() => void>();

const readStoredSetting = (): ThemeSetting => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system'
      ? stored
      : 'system';
  } catch {
    return 'system';
  }
};

const emitSettingChange = () => {
  listeners.forEach((listener) => listener());
};

const subscribeSetting = (onChange: () => void) => {
  listeners.add(onChange);

  const onStorage = (event: StorageEvent) => {
    if (event.storageArea && event.key === THEME_STORAGE_KEY) {
      cachedSetting = readStoredSetting();
      emitSettingChange();
    }
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
};

const getSettingSnapshot = (): ThemeSetting => {
  if (cachedSetting === null) {
    cachedSetting = readStoredSetting();
  }
  return cachedSetting;
};

const getServerSettingSnapshot = (): ThemeSetting => 'system';

const persistSetting = (setting: ThemeSetting) => {
  cachedSetting = setting;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, setting);
  } catch {
    // Storage unavailable (private mode etc.) — choice applies for this
    // session; a later visit falls back to the system preference.
  }
  emitSettingChange();
};

const subscribeSystemDark = (onChange: () => void) => {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const systemDarkSnapshot = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const getServerSystemDark = () => false;

// Test-only hook to reset the module-scope mirror between test suites.
export const __resetCachedSetting = () => {
  cachedSetting = null;
  listeners.clear();
};

export const useTheme = () => {
  const setting = useSyncExternalStore(
    subscribeSetting,
    getSettingSnapshot,
    getServerSettingSnapshot,
  );

  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    systemDarkSnapshot,
    getServerSystemDark,
  );

  const resolvedTheme =
    setting === 'dark' || (setting === 'system' && systemDark)
      ? 'dark'
      : 'light';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setSetting = useCallback((next: ThemeSetting) => {
    persistSetting(next);
  }, []);

  const cycleSetting = useCallback(() => {
    const currentIndex = THEME_SETTINGS.indexOf(setting);
    const next = THEME_SETTINGS[(currentIndex + 1) % THEME_SETTINGS.length];
    persistSetting(next);
  }, [setting]);

  return { setting, resolvedTheme, setSetting, cycleSetting };
};
