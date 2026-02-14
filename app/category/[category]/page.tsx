import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostCard from '@/components/PostCard';
import { createMetadata } from '@/lib/seo';
import { getAllCategories, getPostsByCategory, slugifyTerm } from '@/lib/posts';

type Params = {
  params: {
    category: string;
  };
};

export function generateStaticParams(): Array<{ category: string }> {
  return getAllCategories().map((category) => ({ category: slugifyTerm(category) }));
}

export function generateMetadata({ params }: Params): Metadata {
  return createMetadata({
    title: `Category: ${params.category} | Builders World Blog`,
    description: `Posts in category ${params.category}.`,
    path: `/category/${params.category}`
  });
}

export default function CategoryPage({ params }: Params): JSX.Element {
  const posts = getPostsByCategory(params.category);

  if (!posts.length) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Category: {posts[0].category}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
