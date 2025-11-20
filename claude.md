# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Working Guidelines

**IMPORTANT**: When working in this repository, you MUST follow these rules:

1. **使用中文回复**: Always respond to the user in Chinese (Simplified Chinese).
2. **任务管理**: All tasks must be written to and tracked in `todo.md`.

## Project Overview

A web application displaying n8n automation workflows from n8n.io with categorization and search functionality.

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Search**: Fuse.js (client-side)
- **Data Scraping**: Playwright
- **Deployment**: Vercel

## Development Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run lint         # Lint code
npm run fetch-data   # Fetch workflow data from n8n.io
```

## Architecture

### Data Flow

```
n8n.io → scripts/fetch-workflows.ts → data/workflows.json → Next.js Pages
```

### Key Files

- `app/page.tsx` - Homepage with hero, search, featured workflows
- `app/workflows/page.tsx` - Workflow list with filters
- `app/workflows/[id]/page.tsx` - Workflow detail + JSON export
- `components/WorkflowCard.tsx` - Card component for grid display
- `components/SearchBar.tsx` - Client-side search component
- `lib/workflows.ts` - Data loading and filtering functions
- `lib/search.ts` - Fuse.js search configuration
- `types/workflow.ts` - TypeScript interfaces for Workflow data
- `scripts/fetch-workflows.ts` - Playwright script to scrape n8n.io

### Data Model

```typescript
interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: Record<string, Record<string, WorkflowConnection[][]>>;
  categories: string[];      // e.g., ["automation", "productivity"]
  integrations: string[];    // e.g., ["Slack", "Gmail"]
  difficulty?: "beginner" | "intermediate" | "advanced";
  metadata?: { views?: number; downloads?: number; author?: string; featured?: boolean };
}
```

## Key Implementation Details

### Search (lib/search.ts)

Uses Fuse.js for fuzzy search:
```typescript
const fuse = new Fuse(workflows, {
  keys: ['name', 'description', 'integrations', 'categories'],
  threshold: 0.3,
  ignoreLocation: true
});
```

### Responsive Grid

- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (lg): 3-4 columns

### SEO

- Static generation for all workflow pages
- Dynamic sitemap at `app/sitemap.ts`
- robots.txt at `app/robots.ts`
- Meta tags in `app/layout.tsx`

## Data Fetching

The scraper script (`scripts/fetch-workflows.ts`) uses Playwright to:
1. Navigate to n8n.io/workflows
2. Extract workflow data
3. Save to `data/workflows.json`

Currently uses mock data. To fetch real data, analyze n8n.io network requests for API endpoints.

## Deployment

Configured for Vercel with `vercel.json`. Push to GitHub and import to Vercel for automatic deployment.

Environment variables:
- `NEXT_PUBLIC_SITE_URL` - Site URL for sitemap (default: https://n8nworkflows.xyz)
