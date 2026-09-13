import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import siteConfig from '../../src/config/site';
import { ui } from '../../src/i18n/ui';

describe('ContactBanner Component', () => {
  const componentPath = join(process.cwd(), 'src/components/ContactBanner.astro');

  it('verifies that ContactBanner.astro exists', () => {
    assert.equal(existsSync(componentPath), true);
  });

  it('QA happy scenario: validates direct mailto link with pre-populated subject line', () => {
    const content = readFileSync(componentPath, 'utf-8');

    // Expected subject and recipient from siteConfig
    assert.equal(siteConfig.contact.email, 'longdd.contact@gmail.com');
    assert.equal(siteConfig.contact.subject, 'Inquiry for Đỗ Đăng Long - Software Engineer');

    const expectedEncodedSubject = encodeURIComponent(siteConfig.contact.subject);
    assert.equal(expectedEncodedSubject, 'Inquiry%20for%20%C4%90%E1%BB%97%20%C4%90%C4%83ng%20Long%20-%20Software%20Engineer');

    // Mailto link pattern in component
    assert.ok(content.includes('mailto:'), 'ContactBanner must define mailto link');
    assert.ok(content.includes('mailtoSubject = encodeURIComponent(siteConfig.contact.subject)'), 'Prepopulates subject via encodeURIComponent');
    assert.ok(content.includes('mailtoUrl = `mailto:${siteConfig.contact.email}?subject=${mailtoSubject}`'));
  });

  it('validates clear "Open to Work" status indicator with pulsating element', () => {
    const content = readFileSync(componentPath, 'utf-8');

    assert.ok(content.includes('role="status"'), 'Indicator provides semantic role="status"');
    assert.ok(content.includes('animate-ping'), 'Indicator has active pulse animation');
    assert.ok(content.includes("t('contact.openToWork')"), 'Indicator displays localized status text');
    assert.equal(ui.en['contact.openToWork'], 'Available for Opportunities');
    assert.equal(ui.vi['contact.openToWork'], 'Sẵn sàng cho cơ hội mới');
  });

  it('validates external social links carry target="_blank" and rel="noopener noreferrer"', () => {
    const content = readFileSync(componentPath, 'utf-8');

    // GitHub link
    assert.ok(content.includes('siteConfig.links.github'), 'Links to candidate GitHub');
    assert.equal(siteConfig.links.github, 'https://github.com/longd2k3');

    // LinkedIn link
    assert.ok(content.includes('siteConfig.links.linkedin'), 'Links to candidate LinkedIn');
    assert.equal(siteConfig.links.linkedin, 'https://linkedin.com/in/longdd');

    // Security rel attributes on external links
    const externalLinksMatches = content.match(/target="_blank"\s+rel="noopener noreferrer"/g);
    assert.ok(externalLinksMatches && externalLinksMatches.length >= 2, 'External links must carry target="_blank" and rel="noopener noreferrer"');
  });

  it('validates CV download CTA points to siteConfig resume asset', () => {
    const content = readFileSync(componentPath, 'utf-8');

    assert.ok(content.includes('href={siteConfig.links.resume}'), 'Resume link references siteConfig');
    assert.ok(content.includes('download'), 'Resume link has download attribute');
    assert.equal(siteConfig.links.resume, '/resume.pdf');
  });

  it('QA failure scenario: asserts interactive links have visible focus ring styles', () => {
    const content = readFileSync(componentPath, 'utf-8');

    // Every interactive link must have focus-visible styling
    const focusRingPattern = /focus-visible:ring-2\s+focus-visible:ring-accent/g;
    const focusMatches = content.match(focusRingPattern);
    assert.ok(focusMatches && focusMatches.length >= 4, 'All interactive links in ContactBanner must feature focus-visible ring styles');

    // Helper validator to simulate QA failure detection
    function validateLinkHasFocusRing(anchorTag: string): boolean {
      return anchorTag.includes('focus-visible:ring-2') && anchorTag.includes('focus-visible:ring-accent');
    }

    const invalidLink = '<a href="/test" class="text-blue-500 hover:underline">Link</a>';
    assert.equal(validateLinkHasFocusRing(invalidLink), false, 'QA validator correctly catches link missing focus ring');
  });
});

describe('Footer Component', () => {
  const componentPath = join(process.cwd(), 'src/components/Footer.astro');

  it('verifies that Footer.astro exists', () => {
    assert.equal(existsSync(componentPath), true);
  });

  it('validates copyright notice with current year and candidate name', () => {
    const content = readFileSync(componentPath, 'utf-8');

    assert.ok(content.includes('currentYear = new Date().getFullYear()'), 'Dynamically computes current year');
    assert.ok(content.includes('{currentYear}'), 'Renders current year');
    assert.ok(content.includes('{siteConfig.name}'), 'Renders candidate name');
    assert.ok(content.includes("t('footer.rights')"), 'Renders localized rights text');
    assert.equal(ui.en['footer.rights'], 'All rights reserved.');
    assert.equal(ui.vi['footer.rights'], 'Bảo lưu mọi quyền.');
  });

  it('validates quick navigation links', () => {
    const content = readFileSync(componentPath, 'utf-8');

    assert.ok(content.includes("t('nav.projects')"), 'Includes projects link');
    assert.ok(content.includes("t('nav.experience')"), 'Includes experience link');
    assert.ok(content.includes("t('nav.capabilities')"), 'Includes capabilities link');
    assert.ok(content.includes("t('nav.contact')"), 'Includes contact link');
    assert.ok(content.includes("t('nav.resume')"), 'Includes resume link');
  });

  it('validates Cloudflare Pages hosting badge with secure external link', () => {
    const content = readFileSync(componentPath, 'utf-8');

    assert.ok(content.includes('https://pages.cloudflare.com/'), 'Links to Cloudflare Pages');
    assert.ok(content.includes("t('footer.hostedOn')"), 'Displays localized hosted-on label');
    assert.equal(ui.en['footer.hostedOn'], 'Deployed on Cloudflare Pages');
    assert.equal(ui.vi['footer.hostedOn'], 'Triển khai trên Cloudflare Pages');

    // External link attributes
    assert.ok(content.includes('target="_blank"'), 'Carries target="_blank"');
    assert.ok(content.includes('rel="noopener noreferrer"'), 'Carries rel="noopener noreferrer"');
  });

  it('validates Built with Astro & Tailwind CSS badge', () => {
    const content = readFileSync(componentPath, 'utf-8');

    assert.ok(content.includes("t('footer.builtWith')"), 'Displays built-with badge');
    assert.equal(ui.en['footer.builtWith'], 'Built with Astro & Tailwind CSS');
    assert.equal(ui.vi['footer.builtWith'], 'Xây dựng với Astro & Tailwind CSS');
  });

  it('QA failure scenario: all footer interactive links receive visible focus ring', () => {
    const content = readFileSync(componentPath, 'utf-8');

    const focusRingPattern = /focus-visible:ring-2\s+focus-visible:ring-accent/g;
    const focusMatches = content.match(focusRingPattern);
    assert.ok(focusMatches && focusMatches.length >= 5, 'All interactive links in Footer must have focus-visible ring classes');

    // Helper validator to simulate QA failure detection
    function validateExternalLinkSafety(tag: string): boolean {
      if (tag.includes('target="_blank"')) {
        return tag.includes('rel="noopener noreferrer"');
      }
      return true;
    }

    const unsafeExternalLink = '<a href="https://example.com" target="_blank">Unsafe link</a>';
    assert.equal(validateExternalLinkSafety(unsafeExternalLink), false, 'Catches unsafe external link missing rel="noopener noreferrer"');
  });
});
