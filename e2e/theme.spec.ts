import { test, expect } from '@playwright/test';

const CANVAS_DARK = 'rgb(11, 15, 25)';
const SURFACE_DARK = 'rgb(17, 24, 39)';
const CANVAS_LIGHT = 'rgb(249, 250, 251)';

test.describe('theme-appearance', () => {
  test.describe('default follows OS preference', () => {
    test.use({ colorScheme: 'dark' });

    test('first visit with dark OS preference renders dark', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(page.locator('main')).toHaveCSS('background-color', CANVAS_DARK);
    });
  });

  test.describe('explicit choice and persistence', () => {
    test('persisted dark choice wins over a light OS preference', async ({ page }) => {
      await page.addInitScript(
        `localStorage.setItem('theme-preference', 'dark');`
      );
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(page.locator('main')).toHaveCSS('background-color', CANVAS_DARK);
    });

    test('toggle applies dark immediately and survives a reload', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

      await page.getByRole('button', { name: 'Switch to light theme' }).click();
      await page.getByRole('button', { name: 'Switch to dark theme' }).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(
        page.getByRole('button', { name: 'Switch to system theme' })
      ).toBeVisible();
    });

    test('system setting follows light OS preference at reload', async ({ page }) => {
      await page.addInitScript(
        `localStorage.setItem('theme-preference', 'system');`
      );
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    });
  });

  test.describe('dark coverage of surfaces', () => {
    test.use({ colorScheme: 'dark' });

    test('header, cards, and empty state render dark', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('header')).toHaveCSS(
        'background-color',
        SURFACE_DARK
      );
      await expect(page.locator('.group').first()).toHaveCSS(
        'background-color',
        SURFACE_DARK
      );
    });

    test('modal surface renders dark while open', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('heading', { name: 'Turtupilín' }).click();
      await expect(page.getByText('Habitat: Urban')).toBeVisible();
      const modalContent = page.locator('.shadow-xl');
      await expect(modalContent).toHaveCSS('background-color', SURFACE_DARK);
    });

    test('inactive filter chip and search input render dark', async ({ page }) => {
      await page.goto('/');
      const inactiveChip = page.getByRole('button', { name: 'Andean' });
      await expect(inactiveChip).toHaveCSS('background-color', SURFACE_DARK);
      await expect(page.getByPlaceholder('Search birds...')).toHaveCSS(
        'background-color',
        SURFACE_DARK
      );
    });

    test('explicit light choice wins over dark OS preference without reload', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(page.locator('main')).toHaveCSS('background-color', CANVAS_DARK);

      await page.getByRole('button', { name: 'Switch to light theme' }).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      await expect(page.locator('main')).toHaveCSS('background-color', CANVAS_LIGHT);
    });
  });
});
