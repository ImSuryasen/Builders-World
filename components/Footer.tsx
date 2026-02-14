import Link from 'next/link';

export default function Footer(): JSX.Element {
  return (
    <footer className="mt-16 border-t border-slate-200 py-8 dark:border-slate-800">
      <div className="container-base flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Builders World Blog</p>
        <div className="flex gap-4">
          <Link href="/rss.xml" className="hover:underline">
            RSS
          </Link>
          <Link href="/sitemap.xml" className="hover:underline">
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}
