import { defineCollection } from 'astro:content';
import { z } from 'astro/zod'
import { file, glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/posts"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    order: z.number(), // トップの Posts での並び順（小さいほど先）
    thumbnailSrc: z.string().optional(),
    workLink: z.string().optional(),
    repositoryLink: z.string().optional(),
  }),
});

const works = defineCollection({
  loader: file("./src/content/works/works.yaml"),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    link: z.string().optional(),
  }),
});

const internships = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/internships"
  }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    duration: z.number().int().positive().optional(), // 参加日数。省略時は start〜end の日数
  }).refine((data) => data.start <= data.end, {
    message: 'end は start 以降の日付にしてください',
    path: ['end'],
  }),
});

export const collections = { posts, works, internships };
