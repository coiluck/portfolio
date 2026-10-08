// base（/portfolio）をつけたパスを返す。path は / から書く
export const withBase = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
