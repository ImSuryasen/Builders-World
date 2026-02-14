import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/blog#categories', label: 'Categories' },
  { href: '/search', label: 'Search' },
  { href: '/about', label: 'About' },
  { href: '/studio', label: 'Studio' }
];

export default function Navbar(): JSX.Element {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container-base flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold text-slate-900 dark:text-white">
          Builders World
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-2 md:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
