"use client";

import { useEffect, useState } from 'react';
import { getFromStorage, setToStorage } from '@/lib/localStorage';

type LikeButtonProps = {
  slug: string;
};

type LikeMap = Record<string, boolean>;

const STORAGE_KEY = 'likes';

export default function LikeButton({ slug }: LikeButtonProps): JSX.Element {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const likes = getFromStorage<LikeMap>(STORAGE_KEY, {});
    setLiked(Boolean(likes[slug]));
  }, [slug]);

  const toggle = (): void => {
    const likes = getFromStorage<LikeMap>(STORAGE_KEY, {});
    const nextValue = !likes[slug];
    likes[slug] = nextValue;
    setToStorage(STORAGE_KEY, likes);
    setLiked(nextValue);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
      aria-pressed={liked}
      aria-label={liked ? 'Unlike this post' : 'Like this post'}
    >
      {liked ? '♥ Liked' : '♡ Like'}
    </button>
  );
}
