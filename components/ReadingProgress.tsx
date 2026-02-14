"use client";

import { useEffect, useState } from 'react';
import { getFromStorage, setToStorage } from '@/lib/localStorage';

type ReadingProgressProps = {
  slug: string;
};

export default function ReadingProgress({ slug }: ReadingProgressProps): JSX.Element {
  const [progress, setProgress] = useState(0);
  const key = `reading-progress:${slug}`;

  useEffect(() => {
    setProgress(getFromStorage<number>(key, 0));

    const onScroll = (): void => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const next = docHeight <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
      setProgress(next);
      setToStorage<number>(key, next);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [key]);

  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-slate-200/70 dark:bg-slate-800/70" aria-hidden="true">
      <div className="h-full bg-blue-600 transition-[width] duration-150 dark:bg-blue-400" style={{ width: `${progress}%` }} />
    </div>
  );
}
