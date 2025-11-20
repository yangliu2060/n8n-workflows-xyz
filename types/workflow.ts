// n8n 工作流相关类型定义

// 节点类型统计
export interface NodeTypeCount {
  count: number;
}

// 工作流元数据（用于列表页）
export interface WorkflowMeta {
  id: string;
  name: string;
  description: string;
  categories: string[];
  tags: string[]; // 节点类型标签
  image?: string;
  author: string;
  authorUsername: string;
  authorBio?: string;
  authorAvatar?: string;
  url?: string;
  urlN8n: string;
  nodeTypes: Record<string, NodeTypeCount>;
}

// 工作流节点
export interface WorkflowNode {
  name: string;
  type: string;
  typeVersion?: number;
  position: [number, number];
  parameters?: Record<string, any>;
  credentials?: Record<string, any>;
  webhookId?: string;
}

// 工作流连接
export interface WorkflowConnection {
  node: string;
  type: string;
  index: number;
}

// 完整工作流定义（用于详情页）
export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  connections: Record<string, Record<string, WorkflowConnection[][]>>;
}

// 完整工作流（元数据 + 定义）
export interface WorkflowDetail extends WorkflowMeta {
  workflow: WorkflowDefinition;
}

// 分类
export interface WorkflowCategory {
  slug: string;
  name: string;
  description?: string;
  count: number;
}

// 集成/节点类型
export interface WorkflowIntegration {
  name: string;
  displayName: string;
  count: number;
}

// 筛选条件
export interface WorkflowFilters {
  search?: string;
  categories?: string[];
  integrations?: string[];
  tags?: string[];
}

// 分页结果
export interface PaginatedWorkflows {
  workflows: WorkflowMeta[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 为了向后兼容，保留 Workflow 别名
export type Workflow = WorkflowMeta;
