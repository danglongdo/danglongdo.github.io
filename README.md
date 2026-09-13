# Đỗ Đăng Long — Developer Portfolio

[![Astro](https://img.shields.io/badge/Astro-5.4-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Free_Tier-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_Tested-45BA4B?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

Personal developer portfolio for **Đỗ Đăng Long**, positioning as a **.NET Full-Stack Engineer with Enterprise AI Automation experience**.

Engineered with **Astro 5 (Static Mode)**, **Tailwind CSS**, and **TypeScript**, deployed at zero hosting cost on **Cloudflare Pages Free Tier**.

---

## Key Features

- **Bilingual Interface (EN / VI)**: Native Astro internationalization with 1:1 structural parity (English default at `/`, Vietnamese at `/vi`).
- **Evidence-Led Editorial Design**: Custom typography and warm monochrome palette with cobalt accents (`#2457D6`). No generic templates, fake terminal bootloaders, or heavy animations.
- **Flagship Technical Case Studies**:
  - **NAL Vietnam Enterprise AI Automation & ERP**: Mattermost AI operational agents, Refine/React ERP, and Supabase Edge Functions.
  - **SEP490 Site Leveling Management System (SLMS)**: ASP.NET Core 8 modular monolith, EF Core 7, PostgreSQL, Redis distributed caching & Pub/Sub, SignalR, and pessimistic distributed edit locking.
  - **FIS CodeLearn Community & Content Modules**: Discussion forum, localized blog publishing engine, and corporate partner showcase with Redis cache invalidation.
- **Zero-Dependency PDF Resume Generation**: Custom standalone PDF-1.4 generator (`scripts/generate-resume.mjs`) automatically building ATS-compliant `public/resume.pdf` during prebuild without headless browser bloat.
- **Enterprise Security & Non-Disclosure Compliance**: Zero exposure of confidential internal code, employee data, or unredacted credentials.
- **Automated Verification**: End-to-end testing with Playwright (routing, accessibility, responsive viewports, security redaction) and comprehensive unit tests with Bun.

---

## Tech Stack & Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | [Astro 5.4](https://astro.build) | `output: 'static'` — 100% pre-rendered HTML, zero client runtime JS |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com) | Custom design tokens (`canvas`, `surface`, `ink`, `muted`, `accent`) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) | Strict mode (`astro/tsconfigs/strict`) with path aliases (`@/*`) |
| **Runtime & Tests** | [Bun](https://bun.sh) / [Node.js 22](https://nodejs.org) | Rapid package installation, native unit test runner, Node 22 LTS |
| **E2E Testing** | [Playwright](https://playwright.dev) | Headless browser testing for WCAG 2.2 AA, responsive viewports |
| **Hosting** | [Cloudflare Pages](https://pages.cloudflare.com) | Global CDN edge network, 0 VND hosting cost, unlimited bandwidth |

---

## Project Structure

```text
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated CI/CD pipeline (Lint, Test, Build, Verify)
├── public/
│   ├── favicon.svg               # Vector monogram brand mark
│   └── resume.pdf                # Pre-built ATS resume document
├── scripts/
│   └── generate-resume.mjs       # Zero-dependency PDF-1.4 binary compiler
├── src/
│   ├── components/               # Header, Footer, ProjectCard, Timeline, etc.
│   ├── config/
│   │   └── site.ts               # Central site configuration & links
│   ├── content/                  # Bilingual Markdown Content Collections
│   │   ├── experience/           # Career timeline entries (EN & VI)
│   │   └── projects/             # Flagship case study write-ups (EN & VI)
│   ├── i18n/                     # UI dictionaries and locale routing utilities
│   ├── layouts/                  # BaseLayout.astro, CaseStudyLayout.astro
│   ├── pages/                    # File-based routes (/, /vi, /projects/[slug], 404)
│   └── styles/
│       └── global.css            # Tailwind directives and CSS variables
├── tests/
│   ├── unit/                     # Bun unit tests (i18n, resume, components)
│   └── *.spec.ts                 # Playwright E2E test suites
├── astro.config.mjs              # Astro configuration (static output, i18n)
├── package.json                  # Scripts & dependencies
├── playwright.config.ts          # Playwright test harness configuration
├── tsconfig.json                 # TypeScript strict compiler options
└── wrangler.toml                 # Cloudflare Pages deployment configuration
```

---

## Local Development

### Prerequisites

- **Bun** >= 1.2 (recommended) or **Node.js** >= 22.0.0
- **Git**

### Installation

Clone the repository and install dependencies:

```bash
# Using Bun (preferred)
bun install

# Or using npm
npm install
```

### Development Server

Start the local Astro development server:

```bash
bun run dev
# or: npm run dev
```

Open your browser at `http://localhost:4321`.

### Generating the Resume PDF

The ATS resume PDF can be compiled independently at any time:

```bash
bun run generate:resume
# or: npm run generate:resume
```

This writes a compliant PDF-1.4 file directly to `public/resume.pdf`.

---

## Testing & Quality Assurance

### Run Unit Tests

Execute the fast unit test suite (i18n routing, content schema parity, resume generation):

```bash
bun test
# or: bun run test:unit
```

### Run End-to-End Tests

Execute Playwright browser tests against the Astro preview build:

```bash
# 1. Install Playwright browsers (first run only)
bun x playwright install chromium

# 2. Run E2E tests
bun run test:e2e
```

### TypeScript Type Checking

```bash
bun x tsc --noEmit
```

---

## Production Build

Compile the static production site:

```bash
bun run build
# or: npm run build
```

The compiled static assets will be output to the `dist/` directory.

To preview the production build locally:

```bash
bun run preview
# or: npm run preview
```

---

## Cloudflare Pages Free Deployment Guide (0 VND)

This portfolio is configured for **Cloudflare Pages Free Tier**, providing zero-cost global hosting, unlimited bandwidth, automatic SSL certificates, and preview deployments.

### Method 1: Direct GitHub Git Integration (Recommended — 0 VND)

Connecting your GitHub repository directly to Cloudflare Pages provides automated zero-maintenance deployments on every `git push`.

#### Step 1: Log in to Cloudflare
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** in the left sidebar.
3. Click **Create application** > **Pages** tab > **Connect to Git**.

#### Step 2: Connect GitHub Repository
1. Authorize Cloudflare Pages to access your GitHub account.
2. Select the `portfolio` repository from your repository list.
3. Click **Begin setup**.

#### Step 3: Configure Build & Deployment Settings
Fill in the deployment configuration fields exactly as specified:

| Setting | Value | Explanation |
| :--- | :--- | :--- |
| **Project name** | `portfolio` | Generates default domain `https://portfolio.pages.dev` |
| **Production branch** | `main` | Deploys live production site from `main` branch |
| **Framework preset** | `Astro` | Pre-populates recommended defaults |
| **Build command** | `npm run build` | Runs prebuild (resume PDF generator) + `astro build` |
| **Build output directory** | `dist` | Directory containing compiled static HTML/CSS/assets |
| **Root directory** | `/` | Repository root |

#### Step 4: Configure Environment Variables
Under **Environment variables (advanced)**, specify the Node.js version:

- Variable name: `NODE_VERSION`
- Value: `22` (or modern LTS)

#### Step 5: Deploy
Click **Save and Deploy**. Cloudflare Pages will:
1. Clone the repository into a clean container.
2. Install dependencies with npm/bun.
3. Execute `npm run build` (triggering `scripts/generate-resume.mjs` and static compilation).
4. Publish the contents of `dist/` across Cloudflare's global edge network.

Future `git push origin main` commits automatically trigger new production builds. Pull Requests automatically generate immutable preview environments with dedicated URLs.

---

### Method 2: GitHub Actions CI/CD Pipeline (Automated Alternative)

The repository includes a ready-to-run GitHub Actions workflow in `.github/workflows/deploy.yml`.

The workflow performs automated verification on every push and pull request:
1. Checks out repository.
2. Sets up Node.js 22 and Bun.
3. Runs TypeScript type checking (`tsc --noEmit`).
4. Runs Bun unit test suite (`bun test`).
5. Runs Playwright E2E tests (`bun run test:e2e`).
6. Builds static site (`bun run build`).
7. Validates existence of critical output files (`dist/index.html`, `dist/vi/index.html`, `dist/resume.pdf`).
8. Uploads build artifact.
9. *(Optional)* Deploys to Cloudflare Pages via `cloudflare/wrangler-action` if secrets are configured.

To enable direct deployment via GitHub Actions:
1. Go to GitHub Repository **Settings** > **Secrets and variables** > **Actions**.
2. Add secrets:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API Token with `Cloudflare Pages:Edit` permissions.
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found on Cloudflare Dashboard URL or Workers/Pages overview).

---

### Method 3: Local Cloudflare Pages Emulation with Wrangler

You can emulate the Cloudflare Pages environment locally using `wrangler`:

```bash
# 1. Build the production site
bun run build

# 2. Start Cloudflare Pages local emulator
bun x wrangler pages dev dist
```

`wrangler` will read `wrangler.toml` and serve the static files from `dist/` at `http://localhost:8788`.

#### Wrangler Misconfiguration Verification (QA Failure Scenario)
If an invalid build directory (such as `build/`) is specified in `wrangler.toml` (`pages_build_output_dir = "build"`), running `wrangler pages dev` or `wrangler pages deploy` immediately detects that the directory does not exist, guarding against broken deployments before assets reach production.

---

## Custom Domain Setup (`.id.vn` / `.name.vn` < 100,000 VND)

To connect an affordable custom Vietnamese personal domain (such as `dandanglong.id.vn` or `dandanglong.name.vn`):

1. **Register Domain**: Register at an accredited VNNIC registrar (TND, PA Vietnam, INET, Mắt Bão) for ~30,000–60,000 VND (or free 0 VND for ages 18–23 under national digital youth incentives per Decision 826/QĐ-BTTTT and Circular 48/2025/TT-BKHCN).
2. **Add Domain to Cloudflare**: Delegate nameservers to your free Cloudflare account for Anycast DNS, DDoS mitigation, and edge caching.
3. **Link to Pages & Configure DNS**:
   - In Cloudflare Dashboard, navigate to **Workers & Pages** > `portfolio` > **Custom domains**.
   - Add both `dandanglong.id.vn` and `www.dandanglong.id.vn` (CNAME pointing to `<project>.pages.dev` with orange cloud proxied).
   - Set SSL/TLS encryption to **Full (strict)** with **Always Use HTTPS** enabled.
4. **Fallback Strategy**: Retain `<project>.pages.dev` (e.g. `longdd.pages.dev`) as a permanent zero-cost backup link.

> 📖 **Comprehensive Step-by-Step Guide**: See [`docs/domain-setup-guide.md`](docs/domain-setup-guide.md) for the complete Vietnamese walkthrough including VNNIC regulations, pricing comparison tables, anti-promotional TLD renewal traps (`.xyz`/`.site`), eKYC steps, and troubleshooting.

---

## License

MIT © [Đỗ Đăng Long](https://github.com/lombeo)
