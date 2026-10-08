import { defineHastPlugin } from "satteri";

export default function hastImageBase(base: string) {
  const prefix = base.replace(/\/$/, "");

  return defineHastPlugin({
    name: "hast-image-base",
    element: {
      filter: ["img"],
      visit(node, ctx) {
        const src = node.properties.src;
        if (typeof src !== "string" || !src.startsWith("/") || src.startsWith("//")) return;

        ctx.setProperty(node, "src", `${prefix}${src}`);
      },
    },
  });
}
