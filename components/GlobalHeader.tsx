'use client';

import { useTheme, type ThemeSetting } from '../hooks/useTheme';

const TARGET_LABELS: Record<ThemeSetting, string> = {
  light: 'Switch to light theme',
  dark: 'Switch to dark theme',
  system: 'Switch to system theme',
};

const NEXT_SETTING: Record<ThemeSetting, ThemeSetting> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

export default function GlobalHeader() {
  const { setting, cycleSetting } = useTheme();
  const target = NEXT_SETTING[setting];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Birds of Lima</h1>
        </div>

        <button
          type="button"
          onClick={cycleSetting}
          aria-label={TARGET_LABELS[target]}
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {target === 'dark' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
          {target === 'light' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
          {target === 'system' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
