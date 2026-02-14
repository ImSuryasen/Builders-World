import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

function hrefFor(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}/page/${page}`;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps): JSX.Element {
  if (totalPages <= 1) {
    return <></>;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-8 flex flex-wrap items-center gap-2" aria-label="Pagination">
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={hrefFor(basePath, page)}
            className={`inline-flex min-w-10 items-center justify-center rounded border px-3 py-2 text-sm font-medium ${
              isActive
                ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </Link>
        );
      })}
    </nav>
  );
}
