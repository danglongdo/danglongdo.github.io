import { test, expect } from '@playwright/test';

test.describe('Accessibility, Keyboard Navigation & Touch Target Suite', () => {
  const allRoutes = [
    '/',
    '/vi',
    '/projects/nal-ai-automation-erp',
    '/projects/sep490-construction-slms',
    '/projects/codelearn-community-content',
    '/vi/projects/nal-ai-automation-erp',
    '/vi/projects/sep490-construction-slms',
    '/vi/projects/codelearn-community-content',
    '/404',
    '/vi/404',
  ];

  test('QA happy scenario: verifies semantic landmarks and unique H1 on all pages', async ({ page }) => {
    for (const route of allRoutes) {
      await page.goto(route);

      await expect(page.locator('header').first(), `Route "${route}" missing <header>`).toBeAttached();
      await expect(page.locator('main#main-content'), `Route "${route}" missing <main id="main-content">`).toBeAttached();
      await expect(page.locator('footer').first(), `Route "${route}" missing <footer>`).toBeAttached();

      const h1Count = await page.locator('h1').count();
      expect(h1Count, `Route "${route}" must have exactly 1 <h1> element, found ${h1Count}`).toBe(1);
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text?.trim().length, `Route "${route}" <h1> must not be empty`).toBeGreaterThan(0);
    }
  });

  test('verifies skip-to-content keyboard interaction in English and Vietnamese', async ({ page }) => {
    await page.goto('/');
    const enSkipLink = page.locator('a[href="#main-content"]');
    await expect(enSkipLink).toBeAttached();
    await expect(enSkipLink).toContainText('Skip to content');
    await expect(enSkipLink).toHaveClass(/sr-only/);

    await page.keyboard.press('Tab');
    await expect(enSkipLink).toBeFocused();
    await expect(enSkipLink).toHaveClass(/focus:not-sr-only/);

    await page.keyboard.press('Enter');
    const activeId = await page.evaluate(() => document.activeElement?.id);
    expect(['main-content', '']).toContain(activeId);

    await page.goto('/vi');
    const viSkipLink = page.locator('a[href="#main-content"]');
    await expect(viSkipLink).toBeAttached();
    await expect(viSkipLink).toContainText('Chuyển đến nội dung chính');

    await page.keyboard.press('Tab');
    await expect(viSkipLink).toBeFocused();
  });

  test('verifies keyboard focus outlines and visible ring indicators on interactive elements', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');

      const focusState = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;

        const style = window.getComputedStyle(el);
        const hasOutline =
          (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) ||
          style.boxShadow.includes('rgb') ||
          style.boxShadow.includes('rgba');

        return {
          tagName: el.tagName.toLowerCase(),
          id: el.id,
          hasOutline,
          outlineStyle: style.outlineStyle,
          boxShadow: style.boxShadow,
        };
      });

      if (focusState) {
        expect(
          focusState.hasOutline,
          `Focused element <${focusState.tagName} id="${focusState.id}"> must have a visible focus indicator (outline or box-shadow ring)`
        ).toBe(true);
      }
    }
  });

  test('verifies mobile interactive touch targets satisfy >= 44x44px requirement', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const toggleBtn = page.locator('#mobile-menu-toggle');
    await expect(toggleBtn).toBeVisible();
    const toggleBox = await toggleBtn.boundingBox();
    expect(toggleBox).not.toBeNull();
    if (toggleBox) {
      expect(toggleBox.width, 'Mobile menu toggle width must be >= 44px').toBeGreaterThanOrEqual(44);
      expect(toggleBox.height, 'Mobile menu toggle height must be >= 44px').toBeGreaterThanOrEqual(44);
    }

    const langSwitchers = page.locator('header > div:first-child .md\\:hidden a[data-lang-switch]');
    const langCount = await langSwitchers.count();
    expect(langCount).toBe(2);

    for (let i = 0; i < langCount; i++) {
      const btn = langSwitchers.nth(i);
      await expect(btn).toBeVisible();
      const box = await btn.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width, `Language switcher button ${i} width must be >= 44px on mobile`).toBeGreaterThanOrEqual(44);
        expect(box.height, `Language switcher button ${i} height must be >= 44px on mobile`).toBeGreaterThanOrEqual(44);
      }
    }

    await toggleBtn.click();
    const closeBtn = page.locator('#mobile-menu-close');
    await expect(closeBtn).toBeVisible();
    const closeBox = await closeBtn.boundingBox();
    expect(closeBox).not.toBeNull();
    if (closeBox) {
      expect(closeBox.width, 'Drawer close button width must be >= 44px').toBeGreaterThanOrEqual(44);
      expect(closeBox.height, 'Drawer close button height must be >= 44px').toBeGreaterThanOrEqual(44);
    }

    const drawerLinks = page.locator('#mobile-menu-drawer nav a');
    const drawerLinkCount = await drawerLinks.count();
    expect(drawerLinkCount).toBeGreaterThan(0);

    for (let i = 0; i < drawerLinkCount; i++) {
      const link = drawerLinks.nth(i);
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height, `Drawer nav link ${i} height must be >= 44px`).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('verifies all images have valid alt attributes or decorative aria-hidden flags', async ({ page }) => {
    for (const route of allRoutes) {
      await page.goto(route);

      const images = page.locator('img');
      const imgCount = await images.count();
      for (let i = 0; i < imgCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        const ariaHidden = await img.getAttribute('aria-hidden');

        const isAccessible = alt !== null || role === 'presentation' || ariaHidden === 'true';
        expect(isAccessible, `Image on route "${route}" must have alt text or aria-hidden="true"`).toBe(true);
      }

      const svgs = page.locator('svg');
      const svgCount = await svgs.count();
      for (let i = 0; i < svgCount; i++) {
        const svg = svgs.nth(i);
        const ariaHidden = await svg.getAttribute('aria-hidden');
        const ariaLabel = await svg.getAttribute('aria-label');
        const role = await svg.getAttribute('role');

        const isCompliant =
          ariaHidden === 'true' ||
          Boolean(ariaLabel) ||
          role === 'img' ||
          (await svg.locator('title').count()) > 0;

        expect(
          isCompliant,
          `SVG on route "${route}" must have aria-hidden="true", aria-label, role="img", or <title>`
        ).toBe(true);
      }
    }
  });

  test('QA failure scenario: detects simulated inaccessible button lacking accessible name and focus outline', async ({
    page,
  }) => {
    await page.goto('/');

    const auditResult = await page.evaluate(() => {
      const badButton = document.createElement('button');
      badButton.id = 'inaccessible-test-button';
      badButton.style.outline = 'none';
      badButton.style.boxShadow = 'none';
      badButton.style.width = '20px';
      badButton.style.height = '20px';
      document.body.appendChild(badButton);

      const hasAccessibleName = Boolean(
        badButton.getAttribute('aria-label') ||
        badButton.textContent?.trim() ||
        badButton.getAttribute('title')
      );

      const style = window.getComputedStyle(badButton);
      const hasFocusOutline =
        (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) ||
        style.boxShadow.includes('rgb');

      const isTouchTargetSufficient =
        badButton.getBoundingClientRect().width >= 44 &&
        badButton.getBoundingClientRect().height >= 44;

      return {
        hasAccessibleName,
        hasFocusOutline,
        isTouchTargetSufficient,
      };
    });

    expect(auditResult.hasAccessibleName).toBe(false);
    expect(auditResult.hasFocusOutline).toBe(false);
    expect(auditResult.isTouchTargetSufficient).toBe(false);
  });
});
