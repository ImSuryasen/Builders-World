import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Search | Builders World Blog',
  description: 'Client-side search over title, excerpt, tags, and categories.',
  path: '/search'
});

export default function SearchLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return <>{children}</>;
}
