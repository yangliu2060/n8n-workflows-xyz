import Fuse from "fuse.js";
import type { Workflow } from "@/types/workflow";

// Fuse.js 搜索配置
const fuseOptions = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "description", weight: 0.3 },
    { name: "integrations", weight: 0.2 },
    { name: "categories", weight: 0.1 },
  ],
  threshold: 0.3, // 模糊匹配容差
  ignoreLocation: true, // 忽略匹配位置
  includeScore: true,
};

/**
 * 创建工作流搜索实例
 */
export function createWorkflowSearch(workflows: Workflow[]) {
  return new Fuse(workflows, fuseOptions);
}

/**
 * 搜索工作流
 */
export function searchWorkflows(
  workflows: Workflow[],
  query: string
): Workflow[] {
  if (!query || query.trim() === "") {
    return workflows;
  }

  const fuse = createWorkflowSearch(workflows);
  const results = fuse.search(query);

  return results.map((result) => result.item);
}

/**
 * 按分类筛选工作流
 */
export function filterByCategory(
  workflows: Workflow[],
  category: string
): Workflow[] {
  if (!category) {
    return workflows;
  }

  return workflows.filter((workflow) =>
    workflow.categories.includes(category)
  );
}

/**
 * 按集成筛选工作流
 */
export function filterByIntegration(
  workflows: Workflow[],
  integration: string
): Workflow[] {
  if (!integration) {
    return workflows;
  }

  return workflows.filter((workflow) =>
    workflow.integrations.includes(integration)
  );
}

/**
 * 按难度筛选工作流
 */
export function filterByDifficulty(
  workflows: Workflow[],
  difficulty: string
): Workflow[] {
  if (!difficulty) {
    return workflows;
  }

  return workflows.filter((workflow) => workflow.difficulty === difficulty);
}
