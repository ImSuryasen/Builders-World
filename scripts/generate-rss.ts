import fs from 'fs';
import path from 'path';
import { getAllPosts } from '../lib/posts';
import { absoluteUrl, siteConfig } from '../lib/seo';

const publicDir = path.join(process.cwd(), 'public');
const outputPath = path.join(publicDir, 'rss.xml');

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function run(): void {
  fs.mkdirSync(publicDir, { recursive: true });

  const items = getAllPosts()
    .map((post) => {
      const link = absoluteUrl(`/blog/${post.slug}`);
      return `<item>\n<title>${escapeXml(post.title)}</title>\n<link>${link}</link>\n<guid>${link}</guid>\n<description>${escapeXml(post.excerpt)}</description>\n<pubDate>${new Date(post.date).toUTCString()}</pubDate>\n</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n<title>${escapeXml(siteConfig.name)}</title>\n<link>${absoluteUrl('/')}</link>\n<description>${escapeXml(siteConfig.description)}</description>\n${items}\n</channel>\n</rss>`;

  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`Generated RSS: ${outputPath}`);
}

run();
