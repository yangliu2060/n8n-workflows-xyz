import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkflowById, getAllWorkflows } from "@/lib/workflows";

interface WorkflowPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const workflows = await getAllWorkflows();
  return workflows.map((workflow) => ({
    id: workflow.id,
  }));
}

export async function generateMetadata({ params }: WorkflowPageProps) {
  const { id } = await params;
  const workflow = await getWorkflowById(id);

  if (!workflow) {
    return {
      title: "工作流未找到 - n8n Workflows",
    };
  }

  return {
    title: `${workflow.name} - n8n Workflows`,
    description: workflow.description,
  };
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { id } = await params;
  const workflow = await getWorkflowById(id);

  if (!workflow) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            n8n Workflows
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/workflows" className="text-sm text-muted-foreground hover:text-foreground">
              浏览全部
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/workflows" className="hover:text-foreground">工作流</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{workflow.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{workflow.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {workflow.description}
            </p>

            {/* Integrations */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">使用的集成</h2>
              <div className="flex flex-wrap gap-2">
                {workflow.integrations.map((integration) => (
                  <Badge key={integration} variant="secondary" className="text-sm">
                    {integration}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">分类</h2>
              <div className="flex flex-wrap gap-2">
                {workflow.categories.map((category) => (
                  <Link key={category} href={`/categories/${category}`}>
                    <Badge variant="outline" className="text-sm hover:bg-muted">
                      {category}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* JSON Export */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">导出工作流</CardTitle>
                <CardDescription>
                  复制以下 JSON 配置到 n8n 导入
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify({
                    name: workflow.name,
                    nodes: workflow.nodes,
                    connections: workflow.connections
                  }, null, 2)}
                </pre>
                <Button className="mt-4" variant="outline">
                  复制 JSON
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">统计信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">浏览量</span>
                  <span className="font-medium">{workflow.metadata?.views || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">下载量</span>
                  <span className="font-medium">{workflow.metadata?.downloads || 0}</span>
                </div>
                {workflow.difficulty && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">难度</span>
                    <Badge
                      variant={
                        workflow.difficulty === "beginner"
                          ? "default"
                          : workflow.difficulty === "intermediate"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {workflow.difficulty === "beginner" && "初级"}
                      {workflow.difficulty === "intermediate" && "中级"}
                      {workflow.difficulty === "advanced" && "高级"}
                    </Badge>
                  </div>
                )}
                {workflow.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">创建时间</span>
                    <span className="font-medium">{workflow.createdAt}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Author Card */}
            {workflow.metadata?.author && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">作者</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="font-medium">{workflow.metadata.author}</span>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>数据来源于 n8n.io - 开源自动化平台</p>
        </div>
      </footer>
    </div>
  );
}
