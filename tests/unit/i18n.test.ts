import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '../../src/config/site';
import { defaultLang, languages, ui } from '../../src/i18n/ui';
import { getLangFromUrl, useTranslations, useTranslatedPath } from '../../src/i18n/utils';

describe('siteConfig', () => {
  it('contains candidate name "Đỗ Đăng Long"', () => {
    assert.equal(siteConfig.name, 'Đỗ Đăng Long');
  });

  it('contains GitHub profile "https://github.com/lombeo"', () => {
    assert.equal(siteConfig.links.github, 'https://github.com/lombeo');
  });

  it('contains LinkedIn profile link or placeholder', () => {
    assert.ok(siteConfig.links.linkedin);
    assert.match(siteConfig.links.linkedin, /linkedin\.com/);
  });

  it('contains contact email and mailto subject', () => {
    assert.ok(siteConfig.contact.email);
    assert.ok(siteConfig.contact.subject.includes('Đỗ Đăng Long'));
  });

  it('configures default locale as "en" with supported locales', () => {
    assert.equal(siteConfig.defaultLocale, 'en');
    assert.deepEqual([...siteConfig.locales], ['en', 'vi']);
  });
});

describe('useTranslations', () => {
  it('QA happy scenario: resolves "nav.projects" to "Dự án" in vi and "Projects" in en', () => {
    const tVi = useTranslations('vi');
    const tEn = useTranslations('en');

    assert.equal(tVi('nav.projects'), 'Dự án');
    assert.equal(tEn('nav.projects'), 'Projects');
  });

  it('resolves core navigation keys in both locales', () => {
    const tVi = useTranslations('vi');
    const tEn = useTranslations('en');

    assert.equal(tVi('nav.experience'), 'Kinh nghiệm');
    assert.equal(tEn('nav.experience'), 'Experience');

    assert.equal(tVi('nav.capabilities'), 'Năng lực');
    assert.equal(tEn('nav.capabilities'), 'Capabilities');

    assert.equal(tVi('nav.contact'), 'Liên hệ');
    assert.equal(tEn('nav.contact'), 'Contact');

    assert.equal(tVi('nav.resume'), 'Hồ sơ');
    assert.equal(tEn('nav.resume'), 'Resume');
  });

  it('resolves accessibility labels in both locales', () => {
    const tVi = useTranslations('vi');
    const tEn = useTranslations('en');

    assert.equal(tVi('a11y.skipToContent'), 'Chuyển đến nội dung chính');
    assert.equal(tEn('a11y.skipToContent'), 'Skip to content');

    assert.equal(tVi('a11y.languageSwitcher'), 'Chuyển đổi ngôn ngữ');
    assert.equal(tEn('a11y.languageSwitcher'), 'Switch language');
  });

  it('resolves section headers in both locales', () => {
    const tVi = useTranslations('vi');
    const tEn = useTranslations('en');

    assert.equal(tVi('section.selectedWork'), 'Dự án Tiêu biểu');
    assert.equal(tEn('section.selectedWork'), 'Selected Work');
  });

  it('QA failure scenario: returns fallback key string instead of throwing for untranslated key', () => {
    const tVi = useTranslations('vi');
    const tEn = useTranslations('en');

    // Should return key itself and never throw an exception
    assert.doesNotThrow(() => {
      const resultVi = tVi('invalid.key');
      assert.equal(resultVi, 'invalid.key');

      const resultEn = tEn('invalid.key');
      assert.equal(resultEn, 'invalid.key');
    });
  });

  it('handles empty string and unusual keys without throwing', () => {
    const t = useTranslations('en');
    assert.equal(t(''), '');
  });
});

describe('getLangFromUrl', () => {
  it('extracts "vi" from /vi URL path', () => {
    const url = new URL('https://longdd.dev/vi');
    assert.equal(getLangFromUrl(url), 'vi');
  });

  it('extracts "vi" from nested /vi/projects/slug URL path', () => {
    const url = new URL('https://longdd.dev/vi/projects/nal-ai-automation-erp');
    assert.equal(getLangFromUrl(url), 'vi');
  });

  it('defaults to "en" for root URL', () => {
    const url = new URL('https://longdd.dev/');
    assert.equal(getLangFromUrl(url), 'en');
  });

  it('defaults to "en" for non-prefixed paths', () => {
    const url = new URL('https://longdd.dev/projects/nal-ai-automation-erp');
    assert.equal(getLangFromUrl(url), 'en');
  });

  it('accepts string pathname input', () => {
    assert.equal(getLangFromUrl('/vi/experience'), 'vi');
    assert.equal(getLangFromUrl('/experience'), 'en');
  });
});

describe('useTranslatedPath', () => {
  it('generates root path for default locale (en)', () => {
    const translatePath = useTranslatedPath('en');
    assert.equal(translatePath('/'), '/');
    assert.equal(translatePath('/vi'), '/');
  });

  it('generates /vi prefix for vietnamese locale (vi)', () => {
    const translatePath = useTranslatedPath('vi');
    assert.equal(translatePath('/'), '/vi');
    assert.equal(translatePath('/vi'), '/vi');
  });

  it('translates deep paths accurately between locales', () => {
    const translateEn = useTranslatedPath('en');
    const translateVi = useTranslatedPath('vi');

    assert.equal(translateEn('/projects/nal-ai-automation-erp'), '/projects/nal-ai-automation-erp');
    assert.equal(translateVi('/projects/nal-ai-automation-erp'), '/vi/projects/nal-ai-automation-erp');

    // Strips existing prefix when switching to EN
    assert.equal(translateEn('/vi/projects/nal-ai-automation-erp'), '/projects/nal-ai-automation-erp');

    // Does not duplicate prefix when already in VI
    assert.equal(translateVi('/vi/projects/nal-ai-automation-erp'), '/vi/projects/nal-ai-automation-erp');
  });

  it('preserves query parameters and hash anchors', () => {
    const translateVi = useTranslatedPath('vi');
    assert.equal(translateVi('/projects?filter=ai#section'), '/vi/projects?filter=ai#section');

    const translateEn = useTranslatedPath('en');
    assert.equal(translateEn('/vi/projects?filter=ai#section'), '/projects?filter=ai#section');
  });

  it('allows overriding target locale via second parameter', () => {
    const translate = useTranslatedPath('en');
    assert.equal(translate('/', 'vi'), '/vi');
    assert.equal(translate('/projects', 'vi'), '/vi/projects');
  });
});
