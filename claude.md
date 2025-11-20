# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Working Guidelines

**IMPORTANT**: When working in this repository, you MUST follow these rules:

1. **使用中文回复**: Always respond to the user in Chinese (Simplified Chinese).
2. **任务管理**: All tasks must be written to and tracked in `todo.md`.

## Project Overview

A web application displaying ~6,000 n8n automation workflows with categorization and search functionality.

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Search**: Fuse.js (client-side fuzzy search)
- **Deployment**: Vercel

## Development Commands

```bash
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Build for production (generates ~6000 static pages)
npm run lint         # Lint code
npm run fetch-data   # Fetch workflow data (currently uses local data)
```

## Architecture

### Data Structure

The project uses a split data architecture for performance:

```
data/
├── workflows-meta.json     # Metadata for all workflows (11.8MB) - used for lists/search
└── workflows/              # Individual workflow JSON files - used for detail pages
    ├── 10666.json
    ├── 10665.json
    └── ... (5971 files)
```

This allows:
- Fast list page loading (only metadata)
- On-demand loading of full workflow definitions (detail pages)

### Data Flow

```
元数据 (workflows-meta.json) → 列表页/搜索
完整工作流 (workflows/*.json) → 详情页 JSON 导出
```

### Key Files

**Pages:**
- `app/page.tsx` - Homepage with hero, search, featured/recent workflows
- `app/workflows/page.tsx` - Workflow list with category/integration filters
- `app/workflows/[id]/page.tsx` - Workflow detail with JSON export and author info

**Components:**
- `components/WorkflowCard.tsx` - Card displaying workflow with node count, author, categories
- `components/SearchBar.tsx` - Client-side search with navigation

**Data Layer:**
- `lib/workflows.ts` - Data loading functions (`getAllWorkflows`, `getWorkflowDetail`, etc.)
- `lib/search.ts` - Fuse.js search configuration
- `types/workflow.ts` - TypeScript interfaces

### Data Model

```typescript
// Metadata (for lists)
interface WorkflowMeta {
  id: string;
  name: string;
  description: string;
  categories: string[];        // e.g., ["AI", "Marketing"]
  tags: string[];              // Node types: ["n8n-nodes-base.gmail", ...]
  author: string;
  authorUsername: string;
  authorAvatar?: string;
  urlN8n: string;              // Link to n8n.io
  nodeTypes: Record<string, { count: number }>;
}

// Full workflow (for detail page)
interface WorkflowDetail extends WorkflowMeta {
  workflow: {
    nodes: WorkflowNode[];
    connections: Record<string, Record<string, WorkflowConnection[][]>>;
  };
}
```

## Key Implementation Details

### Loading Data

```typescript
// List pages - use metadata only
const workflows = await getAllWorkflows();

// Detail page - load full workflow definition
const workflowDetail = await getWorkflowDetail(id);
```

### Search Configuration (lib/search.ts)

```typescript
const fuseOptions = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "description", weight: 0.3 },
    { name: "tags", weight: 0.2 },
    { name: "categories", weight: 0.1 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
};
```

### External Images

Configured in `next.config.ts` for author avatars from gravatar.com.

### SEO

- Static generation for all workflow pages via `generateStaticParams`
- Dynamic sitemap at `app/sitemap.ts`
- robots.txt at `app/robots.ts`

## Deployment

Configured for Vercel with `vercel.json`.

**Note**: Production build generates static pages for all ~6000 workflows, which takes significant time.

Environment variables:
- `NEXT_PUBLIC_SITE_URL` - Site URL for sitemap (default: https://n8nworkflows.xyz)
