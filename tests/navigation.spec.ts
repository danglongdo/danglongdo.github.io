import { test, expect } from '@playwright/test';

test.describe('Header & Responsive Navigation Suite', () => {
  test('renders header with brand mark, nav links, CV button, and language switcher on desktop', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Brand mark
    const brandLink = header.locator('a[aria-label*="Đỗ Đăng Long"]');
    await expect(brandLink).toBeVisible();
    await expect(brandLink).toHaveAttribute('href', '/');

    // Desktop nav links
    const desktopNav = header.locator('nav[aria-label="Main Navigation"]');
    await expect(desktopNav).toBeVisible();
    await expect(desktopNav.locator('a[href="#projects"]')).toBeVisible();
    await expect(desktopNav.locator('a[href="#experience"]')).toBeVisible();
    await expect(desktopNav.locator('a[href="#capabilities"]')).toBeVisible();
    await expect(desktopNav.locator('a[href="#contact"]')).toBeVisible();

    // Resume button
    const resumeLink = header.locator('a[href="/resume.pdf"]');
    await expect(resumeLink.first()).toBeVisible();
    await expect(resumeLink.first()).toHaveAttribute('target', '_blank');

    // Language switcher
    const langPicker = header.locator('nav[aria-label="Switch language"]');
    await expect(langPicker.first()).toBeVisible();
  });

  test('QA happy scenario: toggles language between English (/) and Vietnamese (/vi)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // Start on root English page
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Click VI switcher button
    const viButton = page.locator('header a[data-lang-switch="vi"]').first();
    await expect(viButton).toBeVisible();
    await viButton.click();

    // Should navigate to /vi
    await expect(page).toHaveURL(/\/vi\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');

    // Check Vietnamese navigation text
    const viDesktopNav = page.locator('header nav[aria-label="Main Navigation"]');
    await expect(viDesktopNav.locator('a[href="#projects"]')).toContainText('Dự án');
    await expect(viDesktopNav.locator('a[href="#experience"]')).toContainText('Kinh nghiệm');

    // Click EN switcher button to return
    const enButton = page.locator('header a[data-lang-switch="en"]').first();
    await expect(enButton).toBeVisible();
    await enButton.click();

    // Should navigate back to /
    await expect(page).toHaveURL(/^https?:\/\/[^/]+\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  const projectSlugs = [
    'nal-ai-automation-erp',
    'sep490-construction-slms',
    'codelearn-community-content',
  ];

  for (const slug of projectSlugs) {
    test(`toggles language bidirectionally on case study route /projects/${slug}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      const enUrl = `/projects/${slug}`;
      await page.goto(enUrl);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    const viButton = page.locator('header a[data-lang-switch="vi"]').first();
    await expect(viButton).toBeVisible();
    await viButton.click();

    await expect(page).toHaveURL(new RegExp(`/vi/projects/${slug}/?$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');

    const enButton = page.locator('header a[data-lang-switch="en"]').first();
    await expect(enButton).toBeVisible();
    await enButton.click();

    await expect(page).toHaveURL(new RegExp(`/projects/${slug}/?$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });
  }

  test('QA failure scenario: mobile drawer opens with keyboard trapping and closes on Escape key', async ({
    page,
  }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const toggleBtn = page.locator('#mobile-menu-toggle');
    const closeBtn = page.locator('#mobile-menu-close');
    const drawer = page.locator('#mobile-menu-drawer');
    const backdrop = page.locator('#mobile-menu-backdrop');

    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');

    // Open mobile drawer
    await toggleBtn.click();

    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(drawer).toHaveAttribute('aria-hidden', 'false');
    await expect(backdrop).toHaveClass(/opacity-100/);

    // Wait for focus to enter the drawer (e.g. closeBtn)
    await expect(closeBtn).toBeFocused();

    // Verify keyboard trapping inside drawer
    await page.keyboard.press('Tab');
    const activeInside = await drawer.evaluate((node) => node.contains(document.activeElement));
    expect(activeInside).toBe(true);

    // Press Escape key -> should close drawer
    await page.keyboard.press('Escape');

    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
    await expect(toggleBtn).toBeFocused();
  });

  test('mobile drawer closes on close button click and on backdrop click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const toggleBtn = page.locator('#mobile-menu-toggle');
    const closeBtn = page.locator('#mobile-menu-close');
    const backdrop = page.locator('#mobile-menu-backdrop');

    // Test 1: Close via close button
    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    await closeBtn.click();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    // Test 2: Close via backdrop click
    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    await backdrop.click({ position: { x: 10, y: 10 } });
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('crawls all pages and asserts all internal <a> links return HTTP 200', async ({ page, request }) => {
    const allPages = [
      '/',
      '/vi',
      '/projects/nal-ai-automation-erp',
      '/projects/sep490-construction-slms',
      '/projects/codelearn-community-content',
      '/vi/projects/nal-ai-automation-erp',
      '/vi/projects/sep490-construction-slms',
      '/vi/projects/codelearn-community-content',
    ];

    const discoveredInternalUrls = new Set<string>();
    const anchorChecks: { pageUrl: string; hash: string }[] = [];

    for (const pageUrl of allPages) {
      await page.goto(pageUrl);
      await expect(page.locator('main#main-content')).toBeVisible();

      // Collect all href attributes on the page
      const hrefs = await page.locator('a[href]').evaluateAll((links) =>
        links.map((link) => link.getAttribute('href')).filter((h): h is string => Boolean(h))
      );

      for (const href of hrefs) {
        if (href.startsWith('#')) {
          anchorChecks.push({ pageUrl, hash: href.slice(1) });
        } else if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
          continue;
        } else if (href.startsWith('http://') || href.startsWith('https://')) {
          continue;
        } else {
          const [pathOnly, hashPart] = href.split('#');
          if (pathOnly) {
            discoveredInternalUrls.add(pathOnly);
          }
          if (hashPart) {
            const targetPage = pathOnly || pageUrl;
            anchorChecks.push({ pageUrl: targetPage, hash: hashPart });
          }
        }
      }
    }

    expect(discoveredInternalUrls.size).toBeGreaterThan(0);

    for (const urlPath of discoveredInternalUrls) {
      const response = await request.get(urlPath);
      expect(
        response.status(),
        `Expected HTTP 200 for internal link "${urlPath}", but received status ${response.status()}`
      ).toBe(200);
    }

    for (const { pageUrl, hash } of anchorChecks) {
      await page.goto(pageUrl);
      const targetElement = page.locator(`#${hash}`);
      const count = await targetElement.count();
      expect(count, `Expected element with id="${hash}" on page "${pageUrl}" to exist`).toBeGreaterThan(0);
    }
  });
});
