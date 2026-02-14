import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TagList from '@/components/TagList';
import ReadingProgress from '@/components/ReadingProgress';
import LikeButton from '@/components/LikeButton';
import BookmarkButton from '@/components/BookmarkButton';
import LocalComments from '@/components/LocalComments';
import { formatDate, getAllPostSlugs, getPostBySlug, slugifyTerm } from '@/lib/posts';
import { absoluteUrl, createMetadata } from '@/lib/seo';

type Params = {
  params: {
    slug: string;
  };
};

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return createMetadata({
      title: 'Post not found | Builders World Blog',
      description: 'The requested post could not be found.',
      path: '/blog'
    });
  }

  return createMetadata({
    title: `${post.title} | Builders World Blog`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [...post.tags, post.category],
    image: post.coverImage
  });
}

export default async function PostDetailPage({ params }: Params): Promise<JSX.Element> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      '@type': 'Person',
      name: post.author.name
    },
    image: post.coverImage ? absoluteUrl(post.coverImage) : undefined,
    description: post.excerpt,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`)
  };

  return (
    <article className="mx-auto max-w-3xl">
      <ReadingProgress slug={post.slug} />
      <header className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <Link href={`/category/${slugifyTerm(post.category)}`} className="hover:underline">
            {post.category}
          </Link>
          <span className="mx-2">•</span>
          {formatDate(post.date)}
          <span className="mx-2">•</span>
          {post.readingTimeText}
        </p>
        <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">{post.excerpt}</p>
        {post.coverImage ? (
          <Image src={post.coverImage} alt={post.title} width={1200} height={630} className="rounded-xl" priority />
        ) : null}
        <div className="flex items-center gap-2">
          <LikeButton slug={post.slug} />
          <BookmarkButton slug={post.slug} />
        </div>
        <TagList tags={post.tags} />
      </header>

      <section className="mt-8">
        <MarkdownRenderer html={post.contentHtml} />
      </section>

      <section className="mt-10 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-lg font-semibold">About the author</h2>
        <p className="mt-1 font-medium">{post.author.name}</p>
        {post.author.bio ? <p className="mt-1 text-slate-600 dark:text-slate-300">{post.author.bio}</p> : null}
      </section>

      <LocalComments slug={post.slug} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
