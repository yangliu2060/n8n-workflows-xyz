import type {
  Workflow,
  WorkflowCategory,
  WorkflowIntegration,
  WorkflowDefinition,
  WorkflowDetail
} from "@/types/workflow";
import workflowsMeta from "@/data/workflows-meta.json";
import fs from 'fs';
import path from 'path';

/**
 * 获取所有工作流元数据
 */
export async function getAllWorkflows(): Promise<Workflow[]> {
  return workflowsMeta as Workflow[];
}

/**
 * 根据 ID 获取工作流元数据
 */
export async function getWorkflowById(id: string): Promise<Workflow | null> {
  const workflows = await getAllWorkflows();
  return workflows.find(w => w.id === id) || null;
}

/**
 * 根据 ID 获取完整工作流（元数据 + 定义）
 */
export async function getWorkflowDetail(id: string): Promise<WorkflowDetail | null> {
  const meta = await getWorkflowById(id);
  if (!meta) return null;

  try {
    const workflowPath = path.join(process.cwd(), 'data', 'workflows', `${id}.json`);
    const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
    const workflow = JSON.parse(workflowContent) as WorkflowDefinition;

    return {
      ...meta,
      workflow,
    };
  } catch {
    // 如果找不到工作流定义文件，只返回元数据
    return {
      ...meta,
      workflow: { nodes: [], connections: {} },
    };
  }
}

/**
 * 获取所有分类
 */
export async function getAllCategories(): Promise<WorkflowCategory[]> {
  const workflows = await getAllWorkflows();
  const categoryMap = new Map<string, number>();

  workflows.forEach(workflow => {
    workflow.categories.forEach(category => {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 获取所有集成/节点类型
 */
export async function getAllIntegrations(): Promise<WorkflowIntegration[]> {
  const workflows = await getAllWorkflows();
  const integrationMap = new Map<string, number>();

  workflows.forEach(workflow => {
    // 使用 tags 字段（节点类型）
    workflow.tags?.forEach(tag => {
      integrationMap.set(tag, (integrationMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(integrationMap.entries())
    .map(([name, count]) => ({
      name,
      displayName: formatNodeTypeName(name),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 格式化节点类型名称为友好显示名
 */
function formatNodeTypeName(nodeType: string): string {
  // n8n-nodes-base.gmail -> Gmail
  // @n8n/n8n-nodes-langchain.agent -> Agent
  const parts = nodeType.split('.');
  const name = parts[parts.length - 1];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * 根据分类筛选工作流
 */
export async function getWorkflowsByCategory(category: string): Promise<Workflow[]> {
  const workflows = await getAllWorkflows();
  return workflows.filter(w =>
    w.categories.some(c => c.toLowerCase() === category.toLowerCase())
  );
}

/**
 * 获取精选工作流（返回前 N 个）
 */
export async function getFeaturedWorkflows(limit: number = 6): Promise<Workflow[]> {
  const workflows = await getAllWorkflows();
  // 按 ID 降序排列（假设 ID 越大越新）
  return workflows
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .slice(0, limit);
}

/**
 * 获取最新工作流
 */
export async function getRecentWorkflows(limit: number = 12): Promise<Workflow[]> {
  const workflows = await getAllWorkflows();
  return workflows
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .slice(0, limit);
}

/**
 * 获取热门集成的工作流
 */
export async function getWorkflowsByIntegration(integration: string): Promise<Workflow[]> {
  const workflows = await getAllWorkflows();
  return workflows.filter(w => w.tags?.includes(integration));
}

/**
 * 获取所有工作流 ID（用于静态生成）
 */
export async function getAllWorkflowIds(): Promise<string[]> {
  const workflows = await getAllWorkflows();
  return workflows.map(w => w.id);
}
