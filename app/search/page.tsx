"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type SearchDocument = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  category: string;
  date: string;
};

export default function SearchPage(): JSX.Element {
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

  useEffect(() => {
    fetch(`${basePath}/search-index.json`)
      .then((response) => response.json() as Promise<SearchDocument[]>)
      .then(setDocuments)
      .catch(() => setDocuments([]));
  }, [basePath]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return documents;
    }

    return documents.filter((document) => {
      const haystack = [document.title, document.excerpt, document.category, ...document.tags].join(' ').toLowerCase();
      return haystack.includes(normalized);
    });
  }, [documents, query]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search</h1>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search title, excerpt, tags, category..."
        className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 dark:border-slate-700"
        aria-label="Search posts"
      />

      <ul className="space-y-4">
        {results.map((result) => (
          <li key={result.slug} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <Link href={`/blog/${result.slug}`} className="text-lg font-semibold hover:underline">
              {result.title}
            </Link>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{result.excerpt}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {result.category} • {result.tags.join(', ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
