import { test, expect } from '@playwright/test';

test.describe('Main Gallery user flow (proposal §6.2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('lands on the gallery grid with all bird cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Turtupilín' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cuculí' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Huerequeque' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Turtupilín' })).toBeVisible();
  });

  test('hover on a card elevates it', async ({ page }) => {
    const image = page.getByRole('img', { name: 'Turtupilín' });
    const before = await image.evaluate((el) => getComputedStyle(el).scale);
    await image.hover();
    const after = await image.evaluate((el) => getComputedStyle(el).scale);
    expect(after).not.toBe(before);
  });

  test('search narrows the grid to matching birds', async ({ page }) => {
    await page.getByPlaceholder('Search birds...').fill('Cuculí');
    await expect(page.getByRole('heading', { name: 'Cuculí' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Turtupilín' })).toBeHidden();
  });

  test('habitat filter narrows the grid', async ({ page }) => {
    await page.getByRole('button', { name: 'Coastal' }).click();
    await expect(page.getByRole('heading', { name: 'Huerequeque' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Turtupilín' })).toBeHidden();
  });

  test('empty results show the empty state and Clear Filters restores the grid', async ({ page }) => {
    await page.getByPlaceholder('Search birds...').fill('xyz-not-a-bird');
    await expect(
      page.getByText('No birds found matching your criteria')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Clear Filters' }).click();
    await expect(page.getByRole('heading', { name: 'Turtupilín' })).toBeVisible();
  });

  test('clicking a card opens the detail modal and closing returns to the grid', async ({ page }) => {
    await page.getByRole('heading', { name: 'Turtupilín' }).click();

    await expect(page.getByText('Habitat: Urban')).toBeVisible();
    await expect(
      page.getByText("A striking small bird frequently seen in Lima's parks")
    ).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('Habitat: Urban')).toBeHidden();
  });
});
