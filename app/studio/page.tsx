"use client";

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getFromStorage, setToStorage } from '@/lib/localStorage';

type StudioDraft = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string;
  coverImage: string;
  authorName: string;
  authorBio: string;
  body: string;
};

const STORAGE_KEY = 'studio-draft';
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const defaultDraft: StudioDraft = {
  title: '',
  slug: '',
  excerpt: '',
  date: new Date().toISOString().slice(0, 10),
  category: '',
  tags: '',
  coverImage: '',
  authorName: 'Suryasen',
  authorBio: '',
  body: '# Draft Title\n\nStart writing in Markdown...'
};

function toFrontmatterArray(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildMarkdown(draft: StudioDraft): string {
  const tags = toFrontmatterArray(draft.tags)
    .map((tag) => `  - "${tag}"`)
    .join('\n');

  return `---
title: "${draft.title}"
slug: "${draft.slug}"
excerpt: "${draft.excerpt}"
date: "${draft.date}"
coverImage: "${draft.coverImage || '/images/cover-placeholder.svg'}"
tags:
${tags || '  - "general"'}
category: "${draft.category}"
author:
  name: "${draft.authorName || 'Suryasen'}"
  bio: "${draft.authorBio}"
---

${draft.body}
`;
}

export default function StudioPage(): JSX.Element {
  const [draft, setDraft] = useState<StudioDraft>(defaultDraft);
  const [tab, setTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    setDraft(getFromStorage<StudioDraft>(STORAGE_KEY, defaultDraft));
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setToStorage(STORAGE_KEY, draft);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [draft]);

  const errors = useMemo(() => {
    const nextErrors: string[] = [];

    if (!draft.title.trim()) nextErrors.push('Title is required.');
    if (!draft.slug.trim()) nextErrors.push('Slug is required.');
    if (draft.slug && !slugPattern.test(draft.slug)) nextErrors.push('Slug must be URL-safe (lowercase letters, numbers, hyphens).');
    if (!draft.excerpt.trim()) nextErrors.push('Excerpt is required.');
    if (!draft.date.trim()) nextErrors.push('Date is required.');
    if (!draft.category.trim()) nextErrors.push('Category is required.');
    if (!draft.body.trim()) nextErrors.push('Body is required.');

    return nextErrors;
  }, [draft]);

  const markdownOutput = useMemo(() => buildMarkdown(draft), [draft]);

  const updateField = (field: keyof StudioDraft, value: string): void => {
    setDraft((previous) => ({ ...previous, [field]: value }));
  };

  const downloadMarkdown = (): void => {
    if (errors.length > 0) {
      return;
    }

    const blob = new Blob([markdownOutput], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${draft.slug || 'draft-post'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Studio</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Drafts are saved in your browser localStorage only. To publish: add the downloaded .md file to content/posts and rebuild.
      </p>

      {errors.length > 0 ? (
        <ul className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {errors.map((error) => (
            <li key={error}>• {error}</li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          Frontmatter validation passed.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Title" value={draft.title} onChange={(event) => updateField('title', event.target.value)} />
        <input className="rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Slug (my-post-slug)" value={draft.slug} onChange={(event) => updateField('slug', event.target.value)} />
        <input className="rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700 md:col-span-2" placeholder="Excerpt" value={draft.excerpt} onChange={(event) => updateField('excerpt', event.target.value)} />
        <input type="date" className="rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={draft.date} onChange={(event) => updateField('date', event.target.value)} />
        <input className="rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Category" value={draft.category} onChange={(event) => updateField('category', event.target.value)} />
        <input className="rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Tags (comma separated)" value={draft.tags} onChange={(event) => updateField('tags', event.target.value)} />
        <input className="rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Cover image (/images/cover.jpg)" value={draft.coverImage} onChange={(event) => updateField('coverImage', event.target.value)} />
        <input className="rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Author name" value={draft.authorName} onChange={(event) => updateField('authorName', event.target.value)} />
        <input className="rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700 md:col-span-2" placeholder="Author bio" value={draft.authorBio} onChange={(event) => updateField('authorBio', event.target.value)} />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('editor')}
          className={`rounded px-3 py-2 text-sm ${tab === 'editor' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'border border-slate-300 dark:border-slate-700'}`}
        >
          Editor
        </button>
        <button
          type="button"
          onClick={() => setTab('preview')}
          className={`rounded px-3 py-2 text-sm ${tab === 'preview' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'border border-slate-300 dark:border-slate-700'}`}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={downloadMarkdown}
          disabled={errors.length > 0}
          className="ml-auto rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download Markdown
        </button>
      </div>

      {tab === 'editor' ? (
        <textarea
          value={draft.body}
          onChange={(event) => updateField('body', event.target.value)}
          className="h-[420px] w-full rounded-lg border border-slate-300 bg-transparent p-4 font-mono text-sm dark:border-slate-700"
          aria-label="Markdown editor"
        />
      ) : (
        <div className="prose-content min-h-[420px] rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.body}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
