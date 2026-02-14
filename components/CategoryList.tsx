import Link from 'next/link';
import { slugifyTerm } from '@/lib/posts';

type CategoryListProps = {
  categories: string[];
};

export default function CategoryList({ categories }: CategoryListProps): JSX.Element {
  if (!categories.length) {
    return <></>;
  }

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Categories">
      {categories.map((category) => (
        <li key={category}>
          <Link
            href={`/category/${slugifyTerm(category)}`}
            className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {category}
          </Link>
        </li>
      ))}
    </ul>
  );
}
