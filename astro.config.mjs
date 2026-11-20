import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://markcacay.pages.dev',
  build: { inlineStylesheets: 'always' }, // small CSS: inlining removes render-blocking requests
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
