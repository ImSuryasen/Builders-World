import fs from 'fs';
import path from 'path';
import { absoluteUrl } from '../lib/seo';

const publicDir = path.join(process.cwd(), 'public');
const outputPath = path.join(publicDir, 'robots.txt');

function run(): void {
  fs.mkdirSync(publicDir, { recursive: true });

  const content = `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}`;
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Generated robots.txt: ${outputPath}`);
}

run();
