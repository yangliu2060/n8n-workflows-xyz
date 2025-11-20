import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CopyButton } from "@/components/CopyButton";
import { getWorkflowById, getWorkflowDetail, getAllWorkflows } from "@/lib/workflows";

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

// 格式化节点类型名称
function formatNodeName(nodeType: string): string {
  const parts = nodeType.split('.');
  const name = parts[parts.length - 1];
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { id } = await params;
  const workflowDetail = await getWorkflowDetail(id);

  if (!workflowDetail) {
    notFound();
  }

  // 计算节点总数
  const totalNodes = Object.values(workflowDetail.nodeTypes || {})
    .reduce((sum, { count }) => sum + count, 0);

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
            <ThemeToggle />
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
          <span className="text-foreground">{workflowDetail.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{workflowDetail.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {workflowDetail.description}
            </p>

            {/* 节点类型 */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">使用的节点</h2>
              <div className="flex flex-wrap gap-2">
                {workflowDetail.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {formatNodeName(tag)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">分类</h2>
              <div className="flex flex-wrap gap-2">
                {workflowDetail.categories.map((category) => (
                  <Link key={category} href={`/workflows?category=${encodeURIComponent(category)}`}>
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
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                  {JSON.stringify(workflowDetail.workflow, null, 2)}
                </pre>
                <div className="flex gap-2 mt-4">
                  <CopyButton text={JSON.stringify(workflowDetail.workflow, null, 2)} />
                  <Link href={workflowDetail.urlN8n} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary">
                      在 n8n.io 查看
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">工作流信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">节点数量</span>
                  <span className="font-medium">{totalNodes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">分类</span>
                  <span className="font-medium">{workflowDetail.categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">节点类型</span>
                  <span className="font-medium">{Object.keys(workflowDetail.nodeTypes || {}).length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Author Card */}
            {workflowDetail.author && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">作者</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    {workflowDetail.authorAvatar && (
                      <Image
                        src={workflowDetail.authorAvatar}
                        alt={workflowDetail.author}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{workflowDetail.author}</p>
                      {workflowDetail.authorUsername && (
                        <p className="text-sm text-muted-foreground">@{workflowDetail.authorUsername}</p>
                      )}
                    </div>
                  </div>
                  {workflowDetail.authorBio && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                      {workflowDetail.authorBio}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* External Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">外部链接</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href={workflowDetail.urlN8n}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  在 n8n.io 上查看 →
                </Link>
              </CardContent>
            </Card>
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
