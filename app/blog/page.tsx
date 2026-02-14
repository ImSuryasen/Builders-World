import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import CategoryList from '@/components/CategoryList';
import { createMetadata } from '@/lib/seo';
import { getAllCategories, getAllPosts, paginatePosts, POSTS_PER_PAGE } from '@/lib/posts';

export const metadata = createMetadata({
  title: 'Blog | Builders World Blog',
  description: 'Browse all articles and engineering notes.',
  path: '/blog'
});

export default function BlogIndexPage(): JSX.Element {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const paginated = paginatePosts(posts, 1, POSTS_PER_PAGE);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">All published Markdown posts.</p>
      </section>

      <section id="categories" className="space-y-3">
        <h2 className="text-xl font-semibold">Categories</h2>
        <CategoryList categories={categories} />
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginated.items.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>

      <Pagination currentPage={1} totalPages={paginated.totalPages} basePath="/blog" />
    </div>
  );
}
