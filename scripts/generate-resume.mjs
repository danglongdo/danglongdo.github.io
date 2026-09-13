#!/usr/bin/env node

/**
 * scripts/generate-resume.mjs
 *
 * Standalone zero-dependency ATS-friendly PDF resume generator for Đỗ Đăng Long.
 * Produces a valid, standard PDF-1.4 binary file at public/resume.pdf compliant
 * with Applicant Tracking Systems (single-column layout, standard headings, clear
 * hierarchy, and standard typography).
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const outputDir = resolve(rootDir, 'public');
const outputPath = resolve(outputDir, 'resume.pdf');

// Candidate & resume data
const resumeData = {
  name: 'Đỗ Đăng Long',
  asciiName: 'DO DANG LONG',
  title: '.NET Full-Stack & Enterprise AI Automation Engineer',
  contact: {
    location: 'Da Nang / Hanoi, Vietnam',
    email: 'longdd.contact@gmail.com',
    github: 'https://github.com/lombeo',
    linkedin: 'https://linkedin.com/in/longdd',
    portfolio: 'https://longdd.dev',
  },
  summary: [
    'Results-driven Full-Stack & Enterprise AI Automation Engineer specializing in ASP.NET Core 8, distributed architectures,',
    'high-throughput Redis caching, and multi-agent workflow systems. Proven engineering impact delivering robust, scalable',
    'production platforms across NAL Vietnam, CodeLearn (FPT Information System), and large-scale enterprise systems.',
  ],
  skills: [
    {
      category: 'Languages & Core',
      items: 'C#, .NET 8, ASP.NET Core, TypeScript, JavaScript, SQL, Python, Go, Node.js, Bun',
    },
    {
      category: 'Backend & Architecture',
      items: 'Clean Architecture, Domain-Driven Design (DDD), EF Core 7, SignalR, RESTful APIs, Microservices',
    },
    {
      category: 'Databases & Caching',
      items: 'PostgreSQL, Redis (Distributed Cache-Aside, Pub/Sub Invalidation), Supabase',
    },
    {
      category: 'Frontend Engineering',
      items: 'React, Next.js, Vue 3, Refine, Tailwind CSS, Astro, Optimistic UI',
    },
    {
      category: 'Enterprise AI & Automation',
      items: 'AI Agents, Multi-Agent Workflows, Mattermost Chatbots, Tool Calling, Supabase Edge Functions',
    },
    {
      category: 'DevOps & Testing',
      items: 'Docker, Git, GitHub Actions, CI/CD, Linux, Playwright, Vitest, Unit Testing',
    },
  ],
  experience: [
    {
      company: 'NAL Vietnam',
      location: 'Da Nang, Vietnam',
      role: 'Full-Stack & Enterprise AI Automation Engineer',
      period: '2025 - Present',
      bullets: [
        'Designed and deployed conversational multi-agent automation systems on Mattermost, streamlining cross-departmental operations including recruiting assistance, company policy inquiries, employee feedback dispatching, and automated meeting scheduling.',
        'Engineered data-dense enterprise ERP operations dashboards using Refine, React, and TypeScript with secure row-level security (RLS) policies on Supabase and PostgreSQL.',
        'Built high-throughput serverless background task orchestrators with Supabase Edge Functions, reducing manual operational overhead across enterprise teams.',
      ],
    },
    {
      company: 'SEP490 Capstone (FPT University)',
      location: 'Hanoi, Vietnam',
      role: 'Backend Lead & System Architect',
      period: '2024 - 2025',
      bullets: [
        'Led backend engineering and system architecture contributing 340+ commits (~80% of backend codebase) for the Site Leveling Management System (SLMS) using ASP.NET Core 8, EF Core 7, and PostgreSQL.',
        'Architected distributed pessimistic plan edit locking mechanism with client heartbeat renewals and automated background cleanup workers, eliminating multi-user edit race conditions during concurrent planning.',
        'Integrated SignalR real-time event broadcasting and Redis distributed cache-aside pattern for excavation plan calculations, accelerating responsive updates across distributed client sessions.',
        'Collaborated with Vue 3 frontend engineers, authoring type-safe REST APIs, automated Swagger schemas, and integration test suites.',
      ],
    },
    {
      company: 'FPT Information System (FIS)',
      location: 'Hanoi, Vietnam',
      role: 'Full-Stack Software Engineer Intern',
      period: 'Mar 2024 - Jan 2025',
      bullets: [
        'Developed core community and content modules for CodeLearn.io platform using ASP.NET Core Clean Architecture and Next.js.',
        'Built high-traffic Discussion Forum Q&A with recursive comment trees, optimistic UI updates, and XSS sanitization pipelines in PostgreSQL and Next.js.',
        'Engineered technical editorial blog engine with revision statuses, automated SEO slug generation, and Incremental Static Regeneration (ISR).',
        'Configured Redis distributed caching (95% hit ratio) and Redis Pub/Sub invalidation channels across distributed service replicas to guarantee cache consistency.',
      ],
    },
  ],
  education: {
    institution: 'FPT University',
    location: 'Hanoi, Vietnam',
    degree: 'Bachelor of Software Engineering',
    period: '2021 - 2025',
    details: 'Focus: Distributed Systems, Software Architecture, Database Systems, Cloud Computing, Algorithms.',
  },
};

/**
 * Text width estimator for Helvetica font.
 */
function estimateTextWidth(text, fontSize, isBold = false) {
  let width = 0;
  const factor = isBold ? 1.06 : 1.0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch >= 'A' && ch <= 'Z') {
      width += fontSize * 0.67 * factor;
    } else if (ch >= 'a' && ch <= 'z') {
      width += fontSize * 0.49 * factor;
    } else if (ch >= '0' && ch <= '9') {
      width += fontSize * 0.54 * factor;
    } else if (ch === ' ' || ch === '|' || ch === '-' || ch === '.' || ch === ':') {
      width += fontSize * 0.32 * factor;
    } else {
      width += fontSize * 0.50 * factor;
    }
  }
  return width;
}

/**
 * Wrap text cleanly to fit within maxWidth.
 */
function wrapText(text, maxWidth, fontSize, isBold = false) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = estimateTextWidth(testLine, fontSize, isBold);
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Escape text for PDF literal strings in parentheses.
 */
function escapePdfText(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Convert Unicode string to UTF-16BE hex format for PDF Info / metadata.
 */
function toPdfUtf16Hex(str) {
  let hex = 'FEFF';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    hex += code.toString(16).padStart(4, '0').toUpperCase();
  }
  return `<${hex}>`;
}

/**
 * Build the complete PDF document.
 */
function buildPdf() {
  const pageWidth = 612; // Standard US Letter (8.5 x 11 in)
  const pageHeight = 792;
  const leftMargin = 38;
  const rightMargin = 38;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 536 pt

  const streamOps = [];

  // Color constants (matching portfolio editorial tokens)
  const COLOR_INK = '0.09 0.10 0.11'; // #17191C
  const COLOR_ACCENT = '0.14 0.34 0.84'; // #2457D6 (Cobalt)
  const COLOR_MUTED = '0.36 0.40 0.44'; // #5C6570
  const COLOR_BORDER = '0.85 0.87 0.88'; // #D9DDE1

  function setFill(color) {
    streamOps.push(`${color} rg`);
  }

  function setStroke(color) {
    streamOps.push(`${color} RG`);
  }

  function drawText(font, size, color, x, y, text) {
    setFill(color);
    streamOps.push(`BT /${font} ${size} Tf 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escapePdfText(text)}) Tj ET`);
  }

  function drawLine(x1, y1, x2, y2, lineWidth = 0.5, color = COLOR_BORDER) {
    setStroke(color);
    streamOps.push(`${lineWidth} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  }

  function drawSectionHeader(title, y) {
    drawText('F1', 10, COLOR_ACCENT, leftMargin, y, title);
    drawLine(leftMargin, y - 3.5, leftMargin + contentWidth, y - 3.5, 0.6, COLOR_BORDER);
    return y - 14;
  }

  let y = pageHeight - 34; // Start at y = 758

  // 1. CANDIDATE HEADER
  drawText('F1', 19, COLOR_INK, leftMargin, y, resumeData.asciiName);
  drawText('F1', 9.5, COLOR_MUTED, leftMargin + 172, y + 1, `(${resumeData.name})`);
  y -= 15;

  drawText('F1', 10.5, COLOR_ACCENT, leftMargin, y, resumeData.title);
  y -= 13;

  const contactLine1 = `${resumeData.contact.location}  |  ${resumeData.contact.email}  |  Portfolio: ${resumeData.contact.portfolio}`;
  drawText('F2', 8.5, COLOR_MUTED, leftMargin, y, contactLine1);
  y -= 11.5;

  const contactLine2 = `GitHub: ${resumeData.contact.github}  |  LinkedIn: ${resumeData.contact.linkedin}`;
  drawText('F2', 8.5, COLOR_MUTED, leftMargin, y, contactLine2);
  y -= 8;

  drawLine(leftMargin, y, leftMargin + contentWidth, y, 0.75, COLOR_ACCENT);
  y -= 13;

  // 2. PROFESSIONAL SUMMARY
  y = drawSectionHeader('PROFESSIONAL SUMMARY', y);
  for (const line of resumeData.summary) {
    drawText('F2', 8.25, COLOR_INK, leftMargin, y, line);
    y -= 10.5;
  }
  y -= 4;

  // 3. TECHNICAL SKILLS
  y = drawSectionHeader('TECHNICAL SKILLS', y);
  for (const skill of resumeData.skills) {
    const categoryLabel = `${skill.category}: `;
    drawText('F1', 8.25, COLOR_INK, leftMargin, y, categoryLabel);
    const labelWidth = estimateTextWidth(categoryLabel, 8.25, true);
    drawText('F2', 8.25, COLOR_MUTED, leftMargin + labelWidth, y, skill.items);
    y -= 11;
  }
  y -= 4;

  // 4. PROFESSIONAL EXPERIENCE
  y = drawSectionHeader('PROFESSIONAL EXPERIENCE', y);

  for (const exp of resumeData.experience) {
    // Company and Location
    drawText('F1', 9, COLOR_INK, leftMargin, y, exp.company);
    const locWidth = estimateTextWidth(exp.location, 8, false);
    drawText('F3', 8, COLOR_MUTED, leftMargin + contentWidth - locWidth, y, exp.location);
    y -= 10.5;

    // Role and Date Range
    drawText('F1', 8.25, COLOR_ACCENT, leftMargin, y, exp.role);
    const periodWidth = estimateTextWidth(exp.period, 8, true);
    drawText('F1', 8, COLOR_MUTED, leftMargin + contentWidth - periodWidth, y, exp.period);
    y -= 10;

    // Bullets with clean word wrapping
    for (const bullet of exp.bullets) {
      const wrapped = wrapText(bullet, contentWidth - 14, 8, false);
      for (let i = 0; i < wrapped.length; i++) {
        if (i === 0) {
          drawText('F1', 8, COLOR_ACCENT, leftMargin + 2, y, '-');
          drawText('F2', 8, COLOR_INK, leftMargin + 12, y, wrapped[i]);
        } else {
          drawText('F2', 8, COLOR_INK, leftMargin + 12, y, wrapped[i]);
        }
        y -= 9.5;
      }
    }
    y -= 4;
  }

  // 5. EDUCATION
  y = drawSectionHeader('EDUCATION', y);
  drawText('F1', 9, COLOR_INK, leftMargin, y, resumeData.education.institution);
  const eduLocWidth = estimateTextWidth(resumeData.education.location, 8, false);
  drawText('F3', 8, COLOR_MUTED, leftMargin + contentWidth - eduLocWidth, y, resumeData.education.location);
  y -= 10.5;

  drawText('F1', 8.25, COLOR_ACCENT, leftMargin, y, resumeData.education.degree);
  const eduPeriodWidth = estimateTextWidth(resumeData.education.period, 8, true);
  drawText('F1', 8, COLOR_MUTED, leftMargin + contentWidth - eduPeriodWidth, y, resumeData.education.period);
  y -= 10;

  drawText('F2', 8, COLOR_MUTED, leftMargin + 12, y, resumeData.education.details);

  const streamContent = Buffer.from(streamOps.join('\n') + '\n', 'latin1');

  // Interactive link annotations
  const annotations = [
    {
      x1: leftMargin + estimateTextWidth('Email: ', 8.5) + estimateTextWidth(`${resumeData.contact.location}  |  `, 8.5),
      y1: pageHeight - 34 - 15 - 13 - 1,
      x2: leftMargin + estimateTextWidth('Email: ', 8.5) + estimateTextWidth(`${resumeData.contact.location}  |  `, 8.5) + estimateTextWidth(resumeData.contact.email, 8.5),
      y2: pageHeight - 34 - 15 - 13 + 9,
      uri: `mailto:${resumeData.contact.email}`,
    },
    {
      x1: leftMargin + estimateTextWidth('GitHub: ', 8.5),
      y1: pageHeight - 34 - 15 - 13 - 11.5 - 1,
      x2: leftMargin + estimateTextWidth('GitHub: ', 8.5) + estimateTextWidth(resumeData.contact.github, 8.5),
      y2: pageHeight - 34 - 15 - 13 - 11.5 + 9,
      uri: resumeData.contact.github,
    },
    {
      x1: leftMargin + estimateTextWidth(`GitHub: ${resumeData.contact.github}  |  LinkedIn: `, 8.5),
      y1: pageHeight - 34 - 15 - 13 - 11.5 - 1,
      x2: leftMargin + estimateTextWidth(`GitHub: ${resumeData.contact.github}  |  LinkedIn: `, 8.5) + estimateTextWidth(resumeData.contact.linkedin, 8.5),
      y2: pageHeight - 34 - 15 - 13 - 11.5 + 9,
      uri: resumeData.contact.linkedin,
    },
    {
      x1: leftMargin + estimateTextWidth(`${resumeData.contact.location}  |  ${resumeData.contact.email}  |  Portfolio: `, 8.5),
      y1: pageHeight - 34 - 15 - 13 - 1,
      x2: leftMargin + estimateTextWidth(`${resumeData.contact.location}  |  ${resumeData.contact.email}  |  Portfolio: `, 8.5) + estimateTextWidth(resumeData.contact.portfolio, 8.5),
      y2: pageHeight - 34 - 15 - 13 + 9,
      uri: resumeData.contact.portfolio,
    },
  ];

  // Assemble PDF Objects
  const objects = [];

  function addObject(body) {
    const id = objects.length + 1;
    objects.push({ id, body: Buffer.isBuffer(body) ? body : Buffer.from(body, 'latin1') });
    return id;
  }

  // Object 1: Catalog
  const catalogId = addObject(`<<\n  /Type /Catalog\n  /Pages 2 0 R\n>>`);

  // Object 2: Pages tree
  const pagesId = addObject(`<<\n  /Type /Pages\n  /Kids [3 0 R]\n  /Count 1\n>>`);

  // Annotation objects
  const annotIds = [];
  for (const ann of annotations) {
    const annId = addObject(`<<\n  /Type /Annot\n  /Subtype /Link\n  /Rect [${ann.x1.toFixed(1)} ${ann.y1.toFixed(1)} ${ann.x2.toFixed(1)} ${ann.y2.toFixed(1)}]\n  /Border [0 0 0]\n  /A <<\n    /Type /Action\n    /S /URI\n    /URI (${ann.uri})\n  >>\n>>`);
    annotIds.push(annId);
  }

  // Object 3: Page
  const annotsRef = annotIds.map(id => `${id} 0 R`).join(' ');
  const pageId = addObject(`<<\n  /Type /Page\n  /Parent 2 0 R\n  /MediaBox [0 0 ${pageWidth} ${pageHeight}]\n  /Contents 4 0 R\n  /Resources <<\n    /Font <<\n      /F1 5 0 R\n      /F2 6 0 R\n      /F3 7 0 R\n    >>\n    /ProcSet [/PDF /Text]\n  >>\n  /Annots [${annotsRef}]\n>>`);

  // Object 4: Contents Stream
  const streamObjectBody = Buffer.concat([
    Buffer.from(`<<\n  /Length ${streamContent.length}\n>>\nstream\n`, 'latin1'),
    streamContent,
    Buffer.from(`\nendstream`, 'latin1'),
  ]);
  const streamId = addObject(streamObjectBody);

  // Object 5: Font F1 (Helvetica-Bold)
  const f1Id = addObject(`<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica-Bold\n  /Encoding /WinAnsiEncoding\n>>`);

  // Object 6: Font F2 (Helvetica Regular)
  const f2Id = addObject(`<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica\n  /Encoding /WinAnsiEncoding\n>>`);

  // Object 7: Font F3 (Helvetica-Oblique)
  const f3Id = addObject(`<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica-Oblique\n  /Encoding /WinAnsiEncoding\n>>`);

  // Object 8: Info metadata with UTF-16BE hex strings
  const now = new Date();
  const dateStr = `D:${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}${String(now.getUTCHours()).padStart(2, '0')}${String(now.getUTCMinutes()).padStart(2, '0')}${String(now.getUTCSeconds()).padStart(2, '0')}Z`;

  const infoId = addObject(`<<\n  /Title ${toPdfUtf16Hex(`Resume - ${resumeData.name} (${resumeData.title})`)}\n  /Author ${toPdfUtf16Hex(resumeData.name)}\n  /Subject ${toPdfUtf16Hex('ATS-Friendly Developer Resume')}\n  /Keywords (C#, .NET 8, ASP.NET Core, PostgreSQL, Redis, SignalR, React, Next.js, Supabase, AI Agents)\n  /Creator (Portfolio Resume Generator)\n  /Producer (Node.js ATS-Compliant PDF 1.4 Generator)\n  /CreationDate (${dateStr})\n  /ModDate (${dateStr})\n>>`);

  // Construct PDF Binary Buffer with exact byte offsets
  const chunks = [];
  const header = Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'latin1');
  chunks.push(header);

  let byteOffset = header.length;
  const offsets = [];

  for (const obj of objects) {
    offsets.push(byteOffset);
    const objHead = Buffer.from(`${obj.id} 0 obj\n`, 'latin1');
    const objTail = Buffer.from('\nendobj\n', 'latin1');
    chunks.push(objHead, obj.body, objTail);
    byteOffset += objHead.length + obj.body.length + objTail.length;
  }

  // Cross-reference table
  const startXref = byteOffset;
  let xrefStr = `xref\n0 ${objects.length + 1}\n`;
  xrefStr += '0000000000 65535 f \n';
  for (let i = 0; i < objects.length; i++) {
    xrefStr += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  const trailerStr = `trailer\n<<\n  /Size ${objects.length + 1}\n  /Root ${catalogId} 0 R\n  /Info ${infoId} 0 R\n>>\nstartxref\n${startXref}\n%%EOF\n`;

  chunks.push(Buffer.from(xrefStr + trailerStr, 'latin1'));

  // UTF-8 metadata comment at the end to guarantee plain string searches find candidate name
  const commentTag = Buffer.from(`\n% [Candidate: ${resumeData.name}]\n% [Role: ${resumeData.title}]\n`, 'utf8');
  chunks.push(commentTag);

  return Buffer.concat(chunks);
}

// Ensure output directory exists and write PDF
mkdirSync(outputDir, { recursive: true });
const pdfBuffer = buildPdf();
writeFileSync(outputPath, pdfBuffer);

const fileSizeKb = (pdfBuffer.length / 1024).toFixed(2);
console.log(`[generate-resume] Successfully generated valid ATS-compliant resume at ${outputPath} (${fileSizeKb} KB)`);
