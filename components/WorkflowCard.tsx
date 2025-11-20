import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Workflow } from "@/types/workflow";

interface WorkflowCardProps {
  workflow: Workflow;
}

// 格式化节点类型名称
function formatNodeName(nodeType: string): string {
  const parts = nodeType.split('.');
  const name = parts[parts.length - 1];
  // 转换为友好名称
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  // 获取主要节点类型（排除常见的基础节点）
  const mainTags = workflow.tags
    ?.filter(tag => !tag.includes('stickyNote') && !tag.includes('start') && !tag.includes('noOp'))
    .slice(0, 3) || [];

  // 计算节点总数
  const totalNodes = Object.values(workflow.nodeTypes || {})
    .reduce((sum, { count }) => sum + count, 0);

  return (
    <Link href={`/workflows/${workflow.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2">{workflow.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {workflow.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 节点类型标签 */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {mainTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {formatNodeName(tag)}
              </Badge>
            ))}
            {(workflow.tags?.length || 0) > 3 && (
              <Badge variant="outline" className="text-xs">
                +{(workflow.tags?.length || 0) - 3}
              </Badge>
            )}
          </div>

          {/* 底部信息 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span>🔷</span>
              {totalNodes} 节点
            </span>
            {workflow.categories.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {workflow.categories[0]}
              </Badge>
            )}
          </div>

          {/* 作者信息 */}
          {workflow.author && (
            <div className="mt-2 pt-2 border-t text-xs text-muted-foreground truncate">
              by {workflow.author}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
