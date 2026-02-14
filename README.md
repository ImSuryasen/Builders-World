# Builders World Blog

A production-ready, SEO-first blogging website built with Next.js App Router + TypeScript + Tailwind CSS.

This project is intentionally backend-free:

- No database
- No external CMS
- No authentication/admin server
- No paid service or API token required
- Published content is versioned as Markdown files in this repo
- Per-visitor interactions (drafts, likes, bookmarks, comments, reading progress, theme) are persisted with browser `localStorage`

## Core Features

- Static-export compatible architecture (`next.config.js` uses `output: "export"`)
- Markdown publishing workflow via `content/posts/*.md`
- Public pages:
  - `/` Home
  - `/blog` Blog index
  - `/blog/page/[page]` Paginated listing
  - `/blog/[slug]` Post detail
  - `/category/[category]` Category filter
  - `/tag/[tag]` Tag filter
  - `/search` Client-side search
  - `/about` About page
  - `/studio` Local authoring studio
- SEO:
  - Metadata API (title/description/canonical)
  - OpenGraph + Twitter cards
  - BlogPosting JSON-LD on post pages
  - Build-time generated `rss.xml`, `sitemap.xml`, `robots.txt`
- UX:
  - Responsive layout
  - Dark mode toggle
  - Reading time and readable markdown styles
  - Code blocks with syntax highlighting
  - Accessible navigation and skip link

## Tech Stack

- Next.js 14 (App Router)
- React + TypeScript (strict mode)
- Tailwind CSS
- Markdown pipeline: `gray-matter`, `remark`, `remark-gfm`, `remark-rehype`, `rehype-stringify`, `rehype-prism-plus`
- Utility: `reading-time`

## Folder Structure

- `app/` - Routes and page layouts
- `components/` - UI components and localStorage-powered widgets
- `content/posts/` - Published Markdown posts
- `lib/posts.ts` - Build-time post loader/parser/pagination/tags/categories
- `lib/seo.ts` - Canonical + metadata helpers
- `lib/localStorage.ts` - Safe browser storage helpers
- `scripts/` - Build-time generators for search index and SEO files
- `public/` - Static assets and generated files
- `.github/workflows/deploy.yml` - GitHub Pages deployment via Actions

## Local Development

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+

### Start locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run dev server:

   ```bash
   npm run dev
   ```

3. Open:

   - http://localhost:3000

## Build and Export

Build command:

```bash
npm run build
```

Build flow:

1. `prebuild` runs generation scripts:
   - `public/search-index.json`
   - `public/rss.xml`
   - `public/sitemap.xml`
   - `public/robots.txt`
2. Next.js creates static export in `out/`

Preview static output:

```bash
npx serve out -l 4173
```

## Publishing Posts (Markdown-first)

Add a file under `content/posts/<slug>.md`.

### Required frontmatter schema

```md
---
title: "My Post"
slug: "my-post"
excerpt: "Short summary"
date: "2026-02-14"
updated: "2026-02-14"
coverImage: "/images/cover-placeholder.svg"
tags:
  - "nextjs"
  - "seo"
category: "Engineering"
author:
  name: "Suryasen"
  bio: "Builder, writer, and engineer"
---

# Post body
```

Then run:

```bash
npm run build
```

## Studio Workflow (`/studio`)

`/studio` is a client-only drafting page that does **not** publish directly.

Features:

- Frontmatter fields with validation (required fields + slug pattern)
- Markdown editor + preview tab
- Auto-save drafts to localStorage (debounced)
- Download generated `.md` file with frontmatter

Publish from Studio:

1. Draft in `/studio`
2. Click **Download Markdown**
3. Move file to `content/posts/`
4. Rebuild and redeploy

## Search, RSS, Sitemap, Robots

Generated at build time from repository Markdown content:

- Search index: `public/search-index.json`
- RSS feed: `public/rss.xml`
- Sitemap: `public/sitemap.xml`
- Robots: `public/robots.txt`

This keeps search/SEO fully static and host-agnostic.

## GitHub Pages Deployment

Deployment is configured via `.github/workflows/deploy.yml`.

### One-time setup

1. Push repository to GitHub (default branch: `main`)
2. Open repository **Settings → Pages**
3. Set **Build and deployment → Source** to **GitHub Actions**

### Automatic deployment

Every push to `main` triggers:

1. dependency install
2. static build (`next build`)
3. artifact upload (`out/`)
4. deploy to GitHub Pages

### Expected site URL

- Project pages: `https://<username>.github.io/<repo>/`
- User/organization pages: `https://<username>.github.io/`

## Base Path and Canonical URL

This project supports GitHub Pages path prefixes.

- `NEXT_PUBLIC_BASE_PATH` (example: `/my-repo`)
- `NEXT_PUBLIC_SITE_URL` (example: `https://myuser.github.io`)

In CI, base path is set automatically to repository name.

## Scripts

- `npm run dev` - Start local development server
- `npm run generate:all` - Regenerate search + SEO static files
- `npm run build` - Generate assets and build static export
- `npm run export` - Alias to build (export mode already enabled)
- `npm run lint` - Run lint checks

## Notes

- Comments/likes/bookmarks/reading progress are browser-local only.
- No cross-device sync without adding a backend.
- If you change domain/base path, rebuild so canonical URLs, RSS, and sitemap reflect the new values.
