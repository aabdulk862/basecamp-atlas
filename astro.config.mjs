import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({

  site: 'https://basecamp-atlas.netlify.app',
  output: 'static',
  prefetch: {
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': '/src' },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
