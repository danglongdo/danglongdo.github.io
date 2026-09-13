// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

/** @type {import('astro').AstroUserConfig} */
const config = {
  site: 'https://longdd.dev',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          vi: 'vi',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    routing: {
      prefixDefaultLocale: false,
      // @ts-ignore - backward-compat / spec alias for prefixDefaultLocale
      prefixDefault: false,
    },
  },
};

// Configuration assertion: portfolio must always use static output
if (config.output !== 'static') {
  throw new Error("Config assertion error: Astro output must be 'static' for static deployment.");
}

export default defineConfig(config);
