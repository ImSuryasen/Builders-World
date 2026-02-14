import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import { createMetadata } from '@/lib/seo';
import { getAllPosts, paginatePosts, POSTS_PER_PAGE } from '@/lib/posts';

type Params = {
  params: {
    page: string;
  };
};

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ page: string }>> {
  const posts = getAllPosts();
  const { totalPages } = paginatePosts(posts, 1, POSTS_PER_PAGE);

  return Array.from({ length: Math.max(totalPages, 1) }, (_, index) => ({
    page: `${index + 1}`
  }));
}

export function generateMetadata({ params }: Params): Metadata {
  return createMetadata({
    title: `Blog Page ${params.page} | Builders World Blog`,
    description: `Paginated blog page ${params.page}.`,
    path: `/blog/page/${params.page}`
  });
}

export default function BlogPaginationPage({ params }: Params): JSX.Element {
  const pageNumber = Number(params.page);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const posts = getAllPosts();
  const paginated = paginatePosts(posts, pageNumber, POSTS_PER_PAGE);

  if (paginated.currentPage !== pageNumber) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Blog - Page {pageNumber}</h1>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginated.items.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
      <Pagination currentPage={paginated.currentPage} totalPages={paginated.totalPages} basePath="/blog" />
    </div>
  );
}
