import type { Workflow, WorkflowCategory, WorkflowIntegration } from "@/types/workflow";
import workflowData from "@/data/workflows.json";

/**
 * 获取所有工作流
 */
export async function getAllWorkflows(): Promise<Workflow[]> {
  return workflowData.workflows as Workflow[];
}

/**
 * 根据 ID 获取工作流
 */
export async function getWorkflowById(id: string): Promise<Workflow | null> {
  const workflows = await getAllWorkflows();
  return workflows.find(w => w.id === id) || null;
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

  return Array.from(categoryMap.entries()).map(([slug, count]) => ({
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    count,
  }));
}

/**
 * 获取所有集成
 */
export async function getAllIntegrations(): Promise<WorkflowIntegration[]> {
  const workflows = await getAllWorkflows();
  const integrationMap = new Map<string, number>();

  workflows.forEach(workflow => {
    workflow.integrations.forEach(integration => {
      integrationMap.set(integration, (integrationMap.get(integration) || 0) + 1);
    });
  });

  return Array.from(integrationMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));
}

/**
 * 根据分类筛选工作流
 */
export async function getWorkflowsByCategory(category: string): Promise<Workflow[]> {
  const workflows = await getAllWorkflows();
  return workflows.filter(w => w.categories.includes(category));
}

/**
 * 获取精选工作流
 */
export async function getFeaturedWorkflows(limit: number = 6): Promise<Workflow[]> {
  const workflows = await getAllWorkflows();
  return workflows
    .filter(w => w.metadata?.featured)
    .slice(0, limit);
}
