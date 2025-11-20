// n8n 工作流相关类型定义

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
}

export interface WorkflowConnection {
  node: string;
  type: string;
  index: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: Record<string, Record<string, WorkflowConnection[][]>>;
  tags?: string[];
  categories: string[];
  integrations: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  createdAt?: string;
  updatedAt?: string;
  metadata?: {
    views?: number;
    downloads?: number;
    author?: string;
    featured?: boolean;
  };
}

export interface WorkflowCategory {
  slug: string;
  name: string;
  description?: string;
  count: number;
}

export interface WorkflowIntegration {
  name: string;
  icon?: string;
  count: number;
}

export interface WorkflowFilters {
  search?: string;
  categories?: string[];
  integrations?: string[];
  difficulty?: string[];
  tags?: string[];
}

export interface PaginatedWorkflows {
  workflows: Workflow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
