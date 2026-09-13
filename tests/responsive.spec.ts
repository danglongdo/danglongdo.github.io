import { test, expect } from '@playwright/test';

test.describe('Responsive Viewports & Zero Horizontal Overflow Suite', () => {
  const testRoutes = [
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

  const viewports = [
    { name: 'Mobile (375px)', width: 375, height: 667 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Desktop (1440px)', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test.describe(`${vp.name}`, () => {
      for (const route of testRoutes) {
        test(`asserts zero horizontal overflow on route "${route}" at ${vp.width}px`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto(route);
          await page.waitForLoadState('domcontentloaded');

          const overflowData = await page.evaluate(() => {
            const scrollWidth = document.documentElement.scrollWidth;
            const innerWidth = window.innerWidth;
            const clientWidth = document.documentElement.clientWidth;

            const allElements = Array.from(document.querySelectorAll('body *'));
            const offendingElements: string[] = [];

            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > clientWidth + 1) {
                const tag = el.tagName.toLowerCase();
                const id = el.id ? `#${el.id}` : '';
                const classes = el.className && typeof el.className === 'string'
                  ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
                  : '';
                offendingElements.push(`${tag}${id}${classes} (right: ${Math.round(rect.right)}, max: ${clientWidth})`);
              }
            }

            return {
              scrollWidth,
              innerWidth,
              clientWidth,
              hasOverflow: scrollWidth > innerWidth,
              offendingElements: offendingElements.slice(0, 5),
            };
          });

          expect(
            overflowData.hasOverflow,
            `Route "${route}" overflowed horizontally at ${vp.width}px! scrollWidth=${overflowData.scrollWidth} > innerWidth=${overflowData.innerWidth}. Offending elements: ${overflowData.offendingElements.join(', ') || 'none detected'}`
          ).toBe(false);
          expect(overflowData.scrollWidth).toBeLessThanOrEqual(overflowData.innerWidth);
        });
      }
    });
  }

  test('asserts responsive navigation controls toggle correctly between mobile and desktop viewports', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const mobileToggle = page.locator('#mobile-menu-toggle');
    const desktopNav = page.locator('header nav[aria-label="Main Navigation"]');

    await expect(mobileToggle).toBeVisible();
    await expect(desktopNav).toBeHidden();

    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(desktopNav).toBeVisible();
    await expect(mobileToggle).toBeHidden();

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(desktopNav).toBeVisible();
    await expect(mobileToggle).toBeHidden();
  });

  test('QA failure scenario: detects simulated horizontal overflow element immediately', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.evaluate(() => {
      const badDiv = document.createElement('div');
      badDiv.id = 'intentional-overflow-defect';
      badDiv.style.width = '800px';
      badDiv.style.height = '10px';
      badDiv.style.position = 'absolute';
      badDiv.style.left = '0';
      badDiv.style.top = '0';
      document.body.appendChild(badDiv);
    });

    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(isOverflowing).toBe(true);
  });
});
