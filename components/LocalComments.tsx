"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { getFromStorage, setToStorage } from '@/lib/localStorage';

type LocalCommentsProps = {
  slug: string;
};

type Comment = {
  id: string;
  name: string;
  text: string;
  createdAt: string;
};

export default function LocalComments({ slug }: LocalCommentsProps): JSX.Element {
  const storageKey = useMemo(() => `comments:${slug}`, [slug]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    setComments(getFromStorage<Comment[]>(storageKey, []));
  }, [storageKey]);

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!name.trim() || !text.trim()) {
      return;
    }

    const nextComment: Comment = {
      id: crypto.randomUUID(),
      name: name.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    const nextComments = [nextComment, ...comments];
    setComments(nextComments);
    setToStorage(storageKey, nextComments);
    setText('');
  };

  return (
    <section className="mt-12 space-y-4" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-xl font-semibold">
        Comments (local only)
      </h2>

      <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="w-full rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700"
          required
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a comment"
          className="h-24 w-full rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700"
          required
        />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white dark:bg-white dark:text-slate-900">
          Post comment
        </button>
      </form>

      <ul className="space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm font-semibold">{comment.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(comment.createdAt).toLocaleString()}</p>
            <p className="mt-2 whitespace-pre-wrap">{comment.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
