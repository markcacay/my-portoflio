import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://markcacay.pages.dev',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
