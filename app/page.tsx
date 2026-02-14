import Link from 'next/link';
import PostCard from '@/components/PostCard';
import CategoryList from '@/components/CategoryList';
import { createMetadata } from '@/lib/seo';
import { getAllCategories, getAllPosts } from '@/lib/posts';

export const metadata = createMetadata({
  title: 'Home | Builders World Blog',
  description: 'Modern engineering articles, tutorials, and product notes.',
  path: '/'
});

export default function HomePage(): JSX.Element {
  const posts = getAllPosts();
  const latest = posts.slice(0, 3);
  const categories = getAllCategories();

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">SEO-first static blog</p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Build once. Publish everywhere.</h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          A production-ready blog built with Next.js App Router, Markdown content, and no backend dependencies.
        </p>
        <Link href="/blog" className="inline-flex rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white dark:bg-white dark:text-slate-900">
          Explore posts
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Latest posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <CategoryList categories={categories} />
      </section>
    </div>
  );
}
