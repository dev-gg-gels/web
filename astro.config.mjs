// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://gg-gels.no',
  output: 'server',

  i18n: {
    defaultLocale: 'nb',
    locales: ['nb', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'nb',
        locales: {
          nb: 'nb-NO',
          en: 'en-GB',
        },
      },
    }),
  ],

  vite: {
    // @ts-ignore — Vite version mismatch between @tailwindcss/vite and astro peer deps
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});