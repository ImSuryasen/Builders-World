import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Studio | Builders World Blog',
  description: 'Client-side markdown authoring studio for local drafts.',
  path: '/studio'
});

export default function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return <>{children}</>;
}
