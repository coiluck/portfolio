// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import mdastFigureCaption from './src/plugins/mdast-figure-caption';
import hastImageBase from './src/plugins/hast-image-base';

const base = '/portfolio';

export default defineConfig({
  site: 'https://coiluck.moe',
  base,
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  markdown: {
    processor: satteri({
      features: {
        directive: true,
      },
      mdastPlugins: [mdastFigureCaption(base)],
      hastPlugins: [hastImageBase(base)],
    }),
  },
  integrations: [mdx()]
});
