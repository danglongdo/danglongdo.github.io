import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { useTranslations } from '../../src/i18n/utils';

describe('ProjectCard Component', () => {
  const componentPath = join(process.cwd(), 'src/components/ProjectCard.astro');

  it('should exist on disk', () => {
    assert.equal(existsSync(componentPath), true);
  });

  it('QA happy scenario: renders card tags in monospace font (font-mono text-xs)', () => {
    const content = readFileSync(componentPath, 'utf-8');
    // Monospace font class on tech stack tags
    assert.match(content, /font-mono\s+text-xs/);
    assert.match(content, /techStack\.map/);
  });

  it('QA happy scenario: card links provide visible :focus-visible outline', () => {
    const content = readFileSync(componentPath, 'utf-8');
    assert.match(content, /focus-visible:outline-none/);
    assert.match(content, /focus-visible:ring-2/);
    assert.match(content, /focus-visible:ring-accent/);
  });

  it('QA happy scenario: card hover provides subtle 150ms border-color transition', () => {
    const content = readFileSync(componentPath, 'utf-8');
    assert.match(content, /transition-colors\s+duration-150/);
    assert.match(content, /hover:border-accent/);
  });

  it('QA failure scenario: project with missing tech stack array renders card gracefully without empty badge container', () => {
    const content = readFileSync(componentPath, 'utf-8');
    // Must verify array exists and has length before rendering badge wrapper container
    assert.match(content, /Array\.isArray\(techStack\)\s*&&\s*techStack\.length\s*>\s*0/);
  });

  it('uses useTranslations for UI strings ("Read Case Study", "Featured", "Role")', () => {
    const content = readFileSync(componentPath, 'utf-8');
    assert.match(content, /useTranslations/);
    assert.match(content, /t\('project\.readCaseStudy'\)/);
    assert.match(content, /t\('project\.featured'\)/);
    assert.match(content, /t\('project\.role'\)/);

    // Verify translations exist in dictionary for both locales
    const tEn = useTranslations('en');
    const tVi = useTranslations('vi');

    assert.equal(tEn('project.readCaseStudy'), 'Read Case Study');
    assert.equal(tVi('project.readCaseStudy'), 'Đọc bài phân tích');

    assert.equal(tEn('project.featured'), 'Featured Project');
    assert.equal(tVi('project.featured'), 'Dự án Tiêu biểu');

    assert.equal(tEn('project.role'), 'Role');
    assert.equal(tVi('project.role'), 'Vai trò');
  });

  it('displays category badge, title, problem statement, key architecture decision, and security notice', () => {
    const content = readFileSync(componentPath, 'utf-8');
    assert.match(content, /category/);
    assert.match(content, /problemStatement/);
    assert.match(content, /approach/);
    assert.match(content, /securityNotice/);
    assert.match(content, /project\.keyDecision/);
  });
});

describe('SelectedWork Component', () => {
  const componentPath = join(process.cwd(), 'src/components/SelectedWork.astro');

  it('should exist on disk', () => {
    assert.equal(existsSync(componentPath), true);
  });

  it('renders section header with localized title and supporting context', () => {
    const content = readFileSync(componentPath, 'utf-8');
    assert.match(content, /t\('section\.selectedWork'\)/);
    assert.match(content, /sectionDescription/);
    assert.match(content, /01\s*\/\s*Selected Work/);
  });

  it('configures responsive grid layout with gap-6 on mobile and gap-8 on desktop', () => {
    const content = readFileSync(componentPath, 'utf-8');
    assert.match(content, /grid-cols-1/);
    assert.match(content, /lg:grid-cols-12/);
    assert.match(content, /gap-6\s+md:gap-8/);
  });

  it('applies prominent editorial emphasis to featured flagship project (lg:col-span-12)', () => {
    const content = readFileSync(componentPath, 'utf-8');
    assert.match(content, /isPrimaryFeatured\s*\?\s*'lg:col-span-12'\s*:\s*'lg:col-span-6'/);
  });

  it('provides graceful empty state when no projects are available', () => {
    const content = readFileSync(componentPath, 'utf-8');
    assert.match(content, /sortedProjects\.length\s*>\s*0/);
    assert.match(content, /border-dashed/);
  });
});
