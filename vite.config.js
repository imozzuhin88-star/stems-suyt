import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const pages = [
  'index.html',
  'index2..html',
  'shop.html',
  'cart.html',
  'library.html',
  'profile.html',
  'gaben-mode.html',
  'analytics.html',
  'social.html',
  'community.html',
  'community-created.html',
];

export default defineConfig({
  base: './',
  publicDir: false,
  build: {
    rolldownOptions: {
      input: pages.map(page => fileURLToPath(new URL(page, import.meta.url))),
    },
  },
});
