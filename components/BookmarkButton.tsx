"use client";

import { useEffect, useState } from 'react';
import { getFromStorage, setToStorage } from '@/lib/localStorage';

type BookmarkButtonProps = {
  slug: string;
};

const STORAGE_KEY = 'bookmarks';

export default function BookmarkButton({ slug }: BookmarkButtonProps): JSX.Element {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = getFromStorage<string[]>(STORAGE_KEY, []);
    setBookmarked(bookmarks.includes(slug));
  }, [slug]);

  const toggle = (): void => {
    const bookmarks = getFromStorage<string[]>(STORAGE_KEY, []);
    const next = bookmarks.includes(slug) ? bookmarks.filter((item) => item !== slug) : [...bookmarks, slug];
    setToStorage(STORAGE_KEY, next);
    setBookmarked(next.includes(slug));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
      aria-pressed={bookmarked}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
    </button>
  );
}
