import type { APIContext } from 'astro';
import { getSortedPosts, getInternships } from '../utils/getWorks';
import { withBase } from '../utils/path';

export async function GET(context: APIContext) {
  if (!context.site) throw new Error('site is not configured in astro.config.ts');

  const posts = await getSortedPosts();
  const internships = await getInternships();

  const paths = [
    '/',
    ...posts.map((post) => `/works/${post.id}/`),
    ...internships.map((internship) => `/internships/${internship.id}/`),
  ];

  const urls = paths
    .map((path) => `<url><loc>${new URL(withBase(path), context.site).href}</loc></url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    }
  );
}
