import fs from 'fs';
import path from 'path';
import { getAllPosts } from '../lib/posts';

type SearchDocument = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  category: string;
  date: string;
};

const publicDir = path.join(process.cwd(), 'public');
const outputPath = path.join(publicDir, 'search-index.json');

function run(): void {
  fs.mkdirSync(publicDir, { recursive: true });

  const index: SearchDocument[] = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    category: post.category,
    date: post.date
  }));

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf8');
  console.log(`Generated search index: ${outputPath}`);
}

run();
