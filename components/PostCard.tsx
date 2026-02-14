import Image from 'next/image';
import Link from 'next/link';
import type { PostSummary } from '@/lib/posts';
import { formatDate } from '@/lib/posts';
import TagList from './TagList';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';

type PostCardProps = {
  post: PostSummary;
};

export default function PostCard({ post }: PostCardProps): JSX.Element {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {post.coverImage ? (
        <Link href={`/blog/${post.slug}`} className="mb-4 block overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={630}
            className="h-52 w-full object-cover"
            priority={false}
          />
        </Link>
      ) : null}

      <div className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        <span>{formatDate(post.date)}</span>
        <span className="mx-2">•</span>
        <span>{post.readingTimeText}</span>
      </div>

      <h2 className="text-xl font-semibold leading-snug">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>

      <p className="mt-2 text-slate-600 dark:text-slate-300">{post.excerpt}</p>

      <div className="mt-4">
        <TagList tags={post.tags} />
      </div>

      <div className="mt-auto flex items-center gap-2 pt-5">
        <LikeButton slug={post.slug} />
        <BookmarkButton slug={post.slug} />
      </div>
    </article>
  );
}
