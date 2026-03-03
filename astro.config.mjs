// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

// Build static HTML — deploy pe Cloudflare Pages via wrangler pages deploy
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),

  vite: {
    plugins: [tailwindcss()],
  },
});