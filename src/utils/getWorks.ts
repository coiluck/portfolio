import { getCollection, getEntry, render } from 'astro:content';
import { type Work, type Post } from './type';

// 日付の新しい順
function byDateDesc(a: Work, b: Work): number {
  const dateA = new Date(a.data.date).getTime();
  const dateB = new Date(b.data.date).getTime();
  return dateB - dateA;
}

// 詳細記事がある作品のみ
export async function getSortedPosts(): Promise<{ work: Work; post: Post }[]> {
  const works: Work[] = await getCollection('works');

  const pairs = await Promise.all(works.map(async (work) => ({
    work,
    post: work.data.post && await getEntry(work.data.post),
  })));

  return pairs
    .filter((pair): pair is { work: Work; post: Post } => pair.post !== undefined)
    .sort((a, b) => byDateDesc(a.work, b.work));
}

// featured: true かつ詳細記事がある作品のみ
export async function getFeaturedWorks(): Promise<{ work: Work; post: Post }[]> {
  const pairs = await getSortedPosts();
  return pairs.filter(({ work }) => work.data.featured);
}

// 全作品を年ごとにまとめる（年・作品とも新しい順）
export async function getWorksByYear(): Promise<[number, Work[]][]> {
  const works: Work[] = (await getCollection('works')).sort(byDateDesc);

  const groups = new Map<number, Work[]>();
  for (const work of works) {
    const year = new Date(work.data.date).getUTCFullYear();
    groups.set(year, [...(groups.get(year) ?? []), work]);
  }
  return [...groups];
}

// 詳細記事の本文
export async function renderPost(post: Post) {
  return render(post);
}
