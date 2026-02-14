import type { Metadata } from 'next';

type MetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://example.com';
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

export const siteConfig = {
  name: 'Builders World Blog',
  description: 'A modern static blog powered by Next.js and Markdown content.',
  siteUrl,
  basePath,
  author: 'Suryasen'
};

export function withBasePath(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const hasFileExtension = /\/[^/]+\.[a-z0-9]+$/i.test(normalizedPath);
  const withSlash = hasFileExtension || normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`;

  if (!basePath) {
    return withSlash;
  }

  return `${basePath}${withSlash}`;
}

export function absoluteUrl(pathname: string): string {
  return `${siteUrl}${withBasePath(pathname)}`;
}

export function createMetadata(options: MetadataOptions): Metadata {
  const canonical = absoluteUrl(options.path ?? '/');
  const image = options.image ? (options.image.startsWith('http') ? options.image : absoluteUrl(options.image)) : undefined;

  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    alternates: {
      canonical
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url: canonical,
      siteName: siteConfig.name,
      type: 'article',
      images: image ? [{ url: image }] : undefined
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: options.title,
      description: options.description,
      images: image ? [image] : undefined
    }
  };
}
