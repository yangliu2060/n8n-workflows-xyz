import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Workflow } from "@/types/workflow";

interface WorkflowCardProps {
  workflow: Workflow;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
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
          <div className="flex flex-wrap gap-1.5 mb-3">
            {workflow.integrations.slice(0, 3).map((integration) => (
              <Badge key={integration} variant="secondary" className="text-xs">
                {integration}
              </Badge>
            ))}
            {workflow.integrations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{workflow.integrations.length - 3}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span>👁</span>
              {workflow.metadata?.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <span>⬇️</span>
              {workflow.metadata?.downloads || 0}
            </span>
            {workflow.difficulty && (
              <Badge
                variant={
                  workflow.difficulty === "beginner"
                    ? "default"
                    : workflow.difficulty === "intermediate"
                    ? "secondary"
                    : "destructive"
                }
                className="text-xs"
              >
                {workflow.difficulty === "beginner" && "初级"}
                {workflow.difficulty === "intermediate" && "中级"}
                {workflow.difficulty === "advanced" && "高级"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
