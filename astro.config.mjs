// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// Build static HTML — deploy pe Cloudflare Pages via wrangler pages deploy
export default defineConfig({
  site: 'https://gettingsentinel.com',
  output: 'server',

  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    }
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap()],
});