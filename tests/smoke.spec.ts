import { test, expect } from '@playwright/test';

test.describe('Smoke Test Suite', () => {
  test('should load the homepage with HTTP 200 and display candidate name', async ({ page }) => {
    const response = await page.goto('/');

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Đỗ Đăng Long/);
    await expect(page.locator('h1')).toContainText('Đỗ Đăng Long');
  });

  test('should render semantic landmarks and skip-to-content link in English on root', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toContainText('Skip to content');

    await expect(page.locator('header')).toBeAttached();
    await expect(page.locator('main#main-content')).toBeAttached();
    await expect(page.locator('footer')).toBeAttached();
  });

  test('should render semantic landmarks and localized skip-to-content link in Vietnamese on /vi', async ({ page }) => {
    await page.goto('/vi');

    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toContainText('Chuyển đến nội dung chính');

    await expect(page.locator('header')).toBeAttached();
    await expect(page.locator('main#main-content')).toBeAttached();
    await expect(page.locator('footer')).toBeAttached();
  });
});
