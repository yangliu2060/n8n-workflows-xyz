import Link from "next/link";
import { Input } from "@/components/ui/input";
import { WorkflowCard } from "@/components/WorkflowCard";
import { getAllWorkflows, getAllCategories, getAllIntegrations } from "@/lib/workflows";

export const metadata = {
  title: "全部工作流 - n8n Workflows",
  description: "浏览所有 n8n 自动化工作流"
};

export default async function WorkflowsPage() {
  const workflows = await getAllWorkflows();
  const categories = await getAllCategories();
  const integrations = await getAllIntegrations();

  // 暂时只显示前100个工作流（后续添加分页）
  const displayWorkflows = workflows.slice(0, 100);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            n8n Workflows
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/workflows" className="text-sm font-medium">
              浏览全部
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">全部工作流</h1>
          <p className="text-muted-foreground">
            共 {workflows.length.toLocaleString()} 个工作流
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-medium mb-2">搜索</h3>
                <Input placeholder="搜索工作流..." />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-medium mb-2">分类</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/workflows?category=${encodeURIComponent(category.name)}`}
                      className="block text-sm text-muted-foreground hover:text-foreground py-1"
                    >
                      {category.name} ({category.count})
                    </Link>
                  ))}
                </div>
              </div>

              {/* Integrations */}
              <div>
                <h3 className="font-medium mb-2">节点类型</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {integrations.slice(0, 20).map((integration) => (
                    <div
                      key={integration.name}
                      className="text-sm text-muted-foreground py-1"
                    >
                      {integration.displayName} ({integration.count})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Workflow Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              显示前 {displayWorkflows.length} 个工作流
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayWorkflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
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
