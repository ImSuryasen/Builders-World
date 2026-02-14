import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrism from 'rehype-prism-plus';
import readingTime from 'reading-time';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export const POSTS_PER_PAGE = 6;

export type Author = {
  name: string;
  bio?: string;
};

export type PostFrontmatter = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  updated?: string;
  coverImage?: string;
  tags: string[];
  category: string;
  author: Author;
};

export type PostSummary = PostFrontmatter & {
  readingTimeText: string;
};

export type Post = PostSummary & {
  content: string;
  contentHtml: string;
};

function ensurePostsDir(): void {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}

function normalizeString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid or missing '${field}' in post frontmatter.`);
  }

  return value.trim();
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseFrontmatter(data: Record<string, unknown>, filename: string): PostFrontmatter {
  const title = normalizeString(data.title, 'title');
  const excerpt = normalizeString(data.excerpt, 'excerpt');
  const date = normalizeString(data.date, 'date');
  const category = normalizeString(data.category, 'category');
  const slug = typeof data.slug === 'string' && data.slug.trim() ? data.slug.trim() : filename.replace(/\.md$/, '');

  const authorData = (data.author ?? {}) as Record<string, unknown>;
  const authorName = normalizeString(authorData.name ?? 'Suryasen', 'author.name');
  const authorBio = typeof authorData.bio === 'string' ? authorData.bio.trim() : undefined;

  const updated = typeof data.updated === 'string' ? data.updated.trim() : undefined;
  const coverImage = typeof data.coverImage === 'string' ? data.coverImage.trim() : undefined;

  return {
    title,
    slug,
    excerpt,
    date,
    updated,
    coverImage,
    tags: normalizeTags(data.tags),
    category,
    author: {
      name: authorName,
      bio: authorBio
    }
  };
}

export function slugifyTerm(term: string): string {
  return term
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function parseMarkdownFile(filePath: string): { frontmatter: PostFrontmatter; content: string } {
  const file = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(file);
  const frontmatter = parseFrontmatter(data as Record<string, unknown>, path.basename(filePath));

  return { frontmatter, content };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(markdown);

  return processed.toString();
}

export function getAllPostSlugs(): string[] {
  ensurePostsDir();

  return fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const { frontmatter } = parseMarkdownFile(path.join(POSTS_DIR, name));
      return frontmatter.slug;
    });
}

export function getAllPosts(): PostSummary[] {
  ensurePostsDir();

  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const { frontmatter, content } = parseMarkdownFile(path.join(POSTS_DIR, name));
      const stats = readingTime(content);

      return {
        ...frontmatter,
        readingTimeText: stats.text
      } satisfies PostSummary;
    })
    .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensurePostsDir();

  const fileNames = fs.readdirSync(POSTS_DIR).filter((name) => name.endsWith('.md'));

  for (const fileName of fileNames) {
    const fullPath = path.join(POSTS_DIR, fileName);
    const { frontmatter, content } = parseMarkdownFile(fullPath);

    if (frontmatter.slug === slug) {
      return {
        ...frontmatter,
        content,
        contentHtml: await markdownToHtml(content),
        readingTimeText: readingTime(content).text
      };
    }
  }

  return null;
}

export function getPostsByCategory(categorySegment: string): PostSummary[] {
  return getAllPosts().filter((post) => slugifyTerm(post.category) === categorySegment);
}

export function getPostsByTag(tagSegment: string): PostSummary[] {
  return getAllPosts().filter((post) => post.tags.some((tag) => slugifyTerm(tag) === tagSegment));
}

export function getAllCategories(): string[] {
  return [...new Set(getAllPosts().map((post) => post.category))].sort((a, b) => a.localeCompare(b));
}

export function getAllTags(): string[] {
  return [...new Set(getAllPosts().flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b));
}

export function paginatePosts(posts: PostSummary[], page: number, pageSize: number = POSTS_PER_PAGE): {
  items: PostSummary[];
  totalPages: number;
  currentPage: number;
} {
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: posts.slice(start, start + pageSize),
    totalPages,
    currentPage
  };
}
