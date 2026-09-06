import { test, expect } from '@playwright/test';

test.describe('bird-media-display', () => {
  test('card image container renders the full 2:3 photo without cropping', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.group').first();
    const img = card.getByRole('img');
    const box = await img.boundingBox();
    if (!box) {
      throw new Error('card image not rendered');
    }
    expect(box.height / box.width).toBeCloseTo(1.5, 1);
  });

  test('card image box clips the zoom inside itself (overflow-hidden intact)', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.group').first();
    await expect(card).toHaveClass(/overflow-hidden/);
    const img = card.getByRole('img');
    const before = await img.boundingBox();
    if (!before) {
      throw new Error('card image not rendered');
    }
    await card.hover();
    const after = await img.boundingBox();
    if (!after) {
      throw new Error('card image not rendered');
    }
    expect(after.height).toBeGreaterThan(before.height * 1.005);
    const cardBox = await card.boundingBox();
    if (!cardBox) {
      throw new Error('card not rendered');
    }
    expect(cardBox.height).toBeGreaterThan(before.height);
  });

  test('modal shows the complete photo at its natural ratio and stays scrollable', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('heading', { name: 'Turtupilín' }).click();

    const modalContent = page.locator('.shadow-xl');
    const img = modalContent.getByRole('img', { name: 'Turtupilín' });
    const box = await img.boundingBox();
    if (!box) {
      throw new Error('modal image not rendered');
    }
    expect(box.height / box.width).toBeCloseTo(1.5, 1);

    const region = page.locator('div.overflow-y-auto');
    await expect(region).toBeVisible();
    const scrollState = await region.evaluate((el) => ({
      scrollable: el.scrollHeight > el.clientHeight,
      scrollTop: el.scrollTop,
      maxScrollable: el.scrollHeight - el.clientHeight,
    }));
    await region.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    const scrolled = await region.evaluate((el) => el.scrollTop);
    expect(scrollState.scrollable).toBe(true);
    expect(scrolled).toBeGreaterThan(0);
  });

  test.describe('mobile reference viewport', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('portrait card renders without distortion at 390px', async ({ page }) => {
      await page.goto('/');
      const img = page.getByRole('img', { name: 'Turtupilín' });
      const box = await img.boundingBox();
      if (!box) {
        throw new Error('card image not rendered');
      }
      expect(box.height / box.width).toBeCloseTo(1.5, 1);
    });
  });
});
