import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ogallo.netlify.app',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  vite: { build: { chunkSizeWarningLimit: 650 } },
});
