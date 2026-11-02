import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://ogallo.netlify.app',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [{ name: 'local-refraction-review', hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev') injectRoute({ pattern: '/lab/refraction', entrypoint: fileURLToPath(new URL('./src/reviews/refraction.astro', import.meta.url)) });
    },
  } }],
  vite: { build: { chunkSizeWarningLimit: 650 } },
});
