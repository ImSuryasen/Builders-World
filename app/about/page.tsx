import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'About | Builders World Blog',
  description: 'About this static Markdown-first blog.',
  path: '/about'
});

export default function AboutPage(): JSX.Element {
  return (
    <article className="prose-content mx-auto max-w-3xl">
      <h1>About</h1>
      <p>
        Builders World Blog is a static-first publishing platform powered by Next.js App Router and Markdown content in the
        repository.
      </p>
      <p>
        There is no backend, no CMS, and no database. Drafting happens in the local Studio, and publishing is done by adding
        Markdown files under <strong>content/posts</strong>.
      </p>
    </article>
  );
}
