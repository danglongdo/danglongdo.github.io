import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Helper to extract frontmatter from a markdown file
function parseFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const lines = match[1].split(/\r?\n/);
  const result: Record<string, any> = {};
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      // Unquote strings
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      result[key] = value;
    }
  }
  return result;
}

export function checkSlugParity(enSlugs: string[], viSlugs: string[]): {
  missingInVi: string[];
  missingInEn: string[];
  isMatch: boolean;
} {
  const missingInVi = enSlugs.filter((s) => !viSlugs.includes(s));
  const missingInEn = viSlugs.filter((s) => !enSlugs.includes(s));
  return {
    missingInVi,
    missingInEn,
    isMatch: missingInVi.length === 0 && missingInEn.length === 0,
  };
}

describe('Content Collections Bilingual Parity', () => {
  const projectsDir = path.resolve(process.cwd(), 'src/content/projects');
  const experienceDir = path.resolve(process.cwd(), 'src/content/experience');

  it('verifies exact 1:1 slug parity for project case studies between en and vi', () => {
    const enProjectFiles = fs.readdirSync(path.join(projectsDir, 'en')).filter((f) => f.endsWith('.md'));
    const viProjectFiles = fs.readdirSync(path.join(projectsDir, 'vi')).filter((f) => f.endsWith('.md'));

    const enSlugs = enProjectFiles.map((file) => {
      const content = fs.readFileSync(path.join(projectsDir, 'en', file), 'utf-8');
      const fm = parseFrontmatter(content);
      return fm.slug || file.replace(/\.md$/, '');
    });

    const viSlugs = viProjectFiles.map((file) => {
      const content = fs.readFileSync(path.join(projectsDir, 'vi', file), 'utf-8');
      const fm = parseFrontmatter(content);
      return fm.slug || file.replace(/\.md$/, '');
    });

    const parity = checkSlugParity(enSlugs, viSlugs);

    assert.equal(parity.missingInVi.length, 0, `Missing VI counterparts for: ${parity.missingInVi.join(', ')}`);
    assert.equal(parity.missingInEn.length, 0, `Missing EN counterparts for: ${parity.missingInEn.join(', ')}`);
    assert.equal(parity.isMatch, true);
    assert.ok(enSlugs.includes('codelearn-community-content'));
    assert.ok(viSlugs.includes('codelearn-community-content'));
  });

  it('verifies exact 1:1 file parity for career experience entries between en and vi', () => {
    const enExpFiles = fs.readdirSync(path.join(experienceDir, 'en')).filter((f) => f.endsWith('.md')).sort();
    const viExpFiles = fs.readdirSync(path.join(experienceDir, 'vi')).filter((f) => f.endsWith('.md')).sort();

    assert.deepEqual(enExpFiles, viExpFiles, 'Experience files in EN and VI should have identical filenames');
    assert.deepEqual(enExpFiles, ['1-nal-vietnam.md', '2-sep490-slms.md', '3-fpt-is.md']);
  });

  it('QA failure scenario: checkSlugParity reports missing locale counterpart when slugs are mismatched', () => {
    const mockEnSlugs = ['codelearn-community-content', 'extra-en-project'];
    const mockViSlugs = ['codelearn-community-content'];

    const parity = checkSlugParity(mockEnSlugs, mockViSlugs);

    assert.equal(parity.isMatch, false);
    assert.deepEqual(parity.missingInVi, ['extra-en-project']);
    assert.deepEqual(parity.missingInEn, []);
  });
});
