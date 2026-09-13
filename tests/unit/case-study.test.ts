import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('Case Study Template and Routes', () => {
  const layoutPath = join(process.cwd(), 'src/layouts/CaseStudyLayout.astro');
  const enRoutePath = join(process.cwd(), 'src/pages/projects/[slug].astro');
  const viRoutePath = join(process.cwd(), 'src/pages/vi/projects/[slug].astro');

  it('required template and dynamic route source files exist on disk', () => {
    assert.equal(existsSync(layoutPath), true);
    assert.equal(existsSync(enRoutePath), true);
    assert.equal(existsSync(viRoutePath), true);
  });

  it('dynamic routes use getStaticPaths with filtered locale query', () => {
    const enContent = readFileSync(enRoutePath, 'utf-8');
    const viContent = readFileSync(viRoutePath, 'utf-8');

    assert.match(enContent, /export\s+async\s+function\s+getStaticPaths/);
    assert.match(enContent, /data\.locale\s*===\s*'en'/);
    assert.match(enContent, /params:\s*\{\s*slug:\s*project\.data\.slug\s*\}/);

    assert.match(viContent, /export\s+async\s+function\s+getStaticPaths/);
    assert.match(viContent, /data\.locale\s*===\s*'vi'/);
    assert.match(viContent, /params:\s*\{\s*slug:\s*project\.data\.slug\s*\}/);
  });

  it('QA happy scenario: all 3 English project case studies are generated at build time', () => {
    const slugs = ['nal-ai-automation-erp', 'sep490-construction-slms', 'codelearn-community-content'];

    for (const slug of slugs) {
      const htmlPath = join(process.cwd(), `dist/projects/${slug}/index.html`);
      assert.equal(existsSync(htmlPath), true, `Expected dist/projects/${slug}/index.html to exist`);

      const html = readFileSync(htmlPath, 'utf-8');
      assert.match(html, /Back to Projects/);
      assert.match(html, /role="note"/i); // NDA notice or metadata
      assert.match(html, /<pre/); // Markdown code / architecture block
    }
  });

  it('QA happy scenario: all 3 Vietnamese project case studies are generated at build time', () => {
    const slugs = ['nal-ai-automation-erp', 'sep490-construction-slms', 'codelearn-community-content'];

    for (const slug of slugs) {
      const htmlPath = join(process.cwd(), `dist/vi/projects/${slug}/index.html`);
      assert.equal(existsSync(htmlPath), true, `Expected dist/vi/projects/${slug}/index.html to exist`);

      const html = readFileSync(htmlPath, 'utf-8');
      assert.match(html, /Quay lại dự án/);
      assert.match(html, /<pre/); // Markdown code / architecture block
    }
  });

  it('QA security policy: no rendered HTML contains links to sep490-backend', () => {
    const enSlms = join(process.cwd(), 'dist/projects/sep490-construction-slms/index.html');
    const viSlms = join(process.cwd(), 'dist/vi/projects/sep490-construction-slms/index.html');

    if (existsSync(enSlms)) {
      const html = readFileSync(enSlms, 'utf-8');
      assert.equal(html.includes('github.com/lombeo/sep490-backend'), false);
    }

    if (existsSync(viSlms)) {
      const html = readFileSync(viSlms, 'utf-8');
      assert.equal(html.includes('github.com/lombeo/sep490-backend'), false);
    }
  });

  it('CaseStudyLayout includes next/previous project pagination', () => {
    const layoutContent = readFileSync(layoutPath, 'utf-8');
    assert.match(layoutContent, /project\.prevProject/);
    assert.match(layoutContent, /project\.nextProject/);
    assert.match(layoutContent, /translatePath\(`\/projects\/\$\{prev\.data\.slug\}`\)/);
  });

  it('CaseStudyLayout formats structural takeaways and prose typography styling', () => {
    const layoutContent = readFileSync(layoutPath, 'utf-8');
    assert.match(layoutContent, /case-study-content/);
    assert.match(layoutContent, /project\.takeaways/);
    assert.match(layoutContent, /project\.challenge/);
    assert.match(layoutContent, /project\.ownership/);
    assert.match(layoutContent, /project\.approach/);
    assert.match(layoutContent, /project\.solution/);
    assert.match(layoutContent, /project\.outcome/);
    assert.match(layoutContent, /project\.reflection/);
  });

  it('CaseStudyLayout integrates dedicated visual architecture diagram components', () => {
    const layoutContent = readFileSync(layoutPath, 'utf-8');
    assert.match(layoutContent, /NalArchitectureDiagram/);
    assert.match(layoutContent, /SlmsArchitectureDiagram/);
    assert.match(layoutContent, /CodelearnArchitectureDiagram/);
    assert.match(layoutContent, /architecture-diagram-heading/);
  });
});
