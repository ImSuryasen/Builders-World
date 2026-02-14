import fs from 'fs';
import path from 'path';
import {
  getAllCategories,
  getAllPosts,
  getAllTags,
  paginatePosts,
  slugifyTerm,
  POSTS_PER_PAGE
} from '../lib/posts';
import { absoluteUrl } from '../lib/seo';

const publicDir = path.join(process.cwd(), 'public');
const outputPath = path.join(publicDir, 'sitemap.xml');

function run(): void {
  fs.mkdirSync(publicDir, { recursive: true });

  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();
  const { totalPages } = paginatePosts(posts, 1, POSTS_PER_PAGE);

  const staticRoutes = ['/', '/blog', '/search', '/about', '/studio'];
  const pagedRoutes = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => `/blog/page/${index + 2}`);
  const postRoutes = posts.map((post) => `/blog/${post.slug}`);
  const categoryRoutes = categories.map((category) => `/category/${slugifyTerm(category)}`);
  const tagRoutes = tags.map((tag) => `/tag/${slugifyTerm(tag)}`);

  const urls = [...staticRoutes, ...pagedRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((route) => `  <url><loc>${absoluteUrl(route)}</loc></url>`)
    .join('\n')}\n</urlset>`;

  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`Generated sitemap: ${outputPath}`);
}

run();
