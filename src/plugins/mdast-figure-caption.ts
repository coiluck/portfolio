/*
```markdown
:::fig{src="/img.png" alt="alt"}
キャプション
:::
```

で

```html
<figure>
  <img src="/portfolio/img.png" alt="alt" loading="lazy" decoding="async">
  <figcaption>キャプション</figcaption>
</figure>
```

にする（元サイトの mdast-figure-caption から、画像サイズの取得を除いて移植）
raw HTML になり hast-image-base を通らないので、base はここでつける
*/

import { defineMdastPlugin } from "satteri";
import { escapeHtml } from "../utils/escapeHtml";

const VALID_NAME_ARRAY = ["figure", "fig", "image", "img"];

interface Figure {
  src: string;
  alt: string | null;
  caption: string;
}

export default function mdastFigureCaption(base: string) {
  const prefix = base.replace(/\/$/, "");

  return defineMdastPlugin({
    name: "mdastFigureCaption",
    containerDirective(node, ctx) {
      if (!VALID_NAME_ARRAY.includes(node.name)) return;

      const { src = "", alt = "" } = node.attributes ?? {};
      if (!src) {
        return;
      }

      const caption = ctx.textContent(node).trim();
      const fullSrc = src.startsWith("/") && !src.startsWith("//") ? `${prefix}${src}` : src;
      return { rawHtml: createFigureHtml({ src: fullSrc, alt, caption }) };
    },
  });
}

function createFigureHtml({ src, alt, caption }: Figure): string {
  const figcaption = caption
    ? `<figcaption>${escapeHtml(caption)}</figcaption>`
    : "";
  return `<figure>
  <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">
  ${figcaption}
</figure>`;
}
