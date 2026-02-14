import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostCard from '@/components/PostCard';
import { createMetadata } from '@/lib/seo';
import { getAllTags, getPostsByTag, slugifyTerm } from '@/lib/posts';

type Params = {
  params: {
    tag: string;
  };
};

export function generateStaticParams(): Array<{ tag: string }> {
  return getAllTags().map((tag) => ({ tag: slugifyTerm(tag) }));
}

export function generateMetadata({ params }: Params): Metadata {
  return createMetadata({
    title: `Tag: ${params.tag} | Builders World Blog`,
    description: `Posts tagged with ${params.tag}.`,
    path: `/tag/${params.tag}`
  });
}

export default function TagPage({ params }: Params): JSX.Element {
  const posts = getPostsByTag(params.tag);

  if (!posts.length) {
    notFound();
  }

  const tag = posts.find((post) => post.tags.some((item) => slugifyTerm(item) === params.tag))?.tags.find(
    (item) => slugifyTerm(item) === params.tag
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tag: {tag ?? params.tag}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
