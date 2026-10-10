import { getCollection, render } from 'astro:content';
import { type Work, type Post, type Internship } from './type';

// 日付の新しい順
function byDateDesc(a: Work, b: Work): number {
  const dateA = new Date(a.data.date).getTime();
  const dateB = new Date(b.data.date).getTime();
  return dateB - dateA;
}

// 詳細記事（order の小さい順）
export async function getSortedPosts(): Promise<Post[]> {
  const posts: Post[] = await getCollection('posts');
  return posts.sort((a, b) => a.data.order - b.data.order);
}

// 全作品を年ごとにまとめる
export async function getWorksByYear(): Promise<[number, Work[]][]> {
  const works: Work[] = (await getCollection('works')).sort(byDateDesc);

  const groups = new Map<number, Work[]>();
  for (const work of works) {
    const year = new Date(work.data.date).getUTCFullYear();
    groups.set(year, [...(groups.get(year) ?? []), work]);
  }
  return [...groups];
}

// インターン経験
export async function getInternships(): Promise<Internship[]> {
  const internships: Internship[] = await getCollection('internships');
  return internships.sort((a, b) => a.data.start.getTime() - b.data.start.getTime());
}

// 詳細記事の本文
export async function renderPost(post: Post) {
  return render(post);
}

// インターン経験の本文
export async function renderInternship(internship: Internship) {
  return render(internship);
}
