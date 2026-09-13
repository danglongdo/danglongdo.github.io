// @ts-check
import { defineConfig } from 'astro/config';

/** @type {import('astro').AstroUserConfig} */
const config = {
  output: 'static',
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
