import Link from 'next/link';
import { slugifyTerm } from '@/lib/posts';

type TagListProps = {
  tags: string[];
};

export default function TagList({ tags }: TagListProps): JSX.Element {
  if (!tags.length) {
    return <></>;
  }

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tag/${slugifyTerm(tag)}`}
            className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
