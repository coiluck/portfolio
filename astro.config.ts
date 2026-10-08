// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://coiluck.moe',
  base: '/portfolio',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  integrations: [mdx()]
});
