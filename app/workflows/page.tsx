import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WorkflowCard } from "@/components/WorkflowCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getAllWorkflows, getAllCategories, getAllIntegrations } from "@/lib/workflows";
import { searchWorkflows, filterByCategory } from "@/lib/search";

export const metadata = {
  title: "全部工作流 - n8n Workflows",
  description: "浏览所有 n8n 自动化工作流"
};

interface WorkflowsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WorkflowsPage({ searchParams }: WorkflowsPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const limit = 24;

  const allWorkflows = await getAllWorkflows();
  const categories = await getAllCategories();
  const integrations = await getAllIntegrations();

  // 应用筛选
  let workflows = allWorkflows;

  if (query) {
    workflows = searchWorkflows(workflows, query);
  }

  if (category) {
    workflows = filterByCategory(workflows, category);
  }

  // 计算分页
  const total = workflows.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const displayWorkflows = workflows.slice(offset, offset + limit);

  // 构建分页链接
  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (pageNum > 1) params.set("page", pageNum.toString());
    const queryString = params.toString();
    return `/workflows${queryString ? `?${queryString}` : ""}`;
  };

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
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {query ? `搜索: "${query}"` : category ? `分类: ${category}` : "全部工作流"}
          </h1>
          <p className="text-muted-foreground">
            共 {total.toLocaleString()} 个工作流
            {(query || category) && (
              <Link href="/workflows" className="ml-2 text-blue-600 hover:underline">
                清除筛选
              </Link>
            )}
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
                <form action="/workflows" method="get">
                  <Input
                    name="q"
                    placeholder="搜索工作流..."
                    defaultValue={query}
                  />
                  {category && <input type="hidden" name="category" value={category} />}
                </form>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-medium mb-2">分类</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/workflows?category=${encodeURIComponent(cat.name)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                      className={`block text-sm py-1 ${
                        category === cat.name
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.name} ({cat.count})
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
              显示第 {offset + 1}-{Math.min(offset + limit, total)} 个工作流
            </p>

            {displayWorkflows.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayWorkflows.map((workflow) => (
                  <WorkflowCard key={workflow.id} workflow={workflow} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">没有找到匹配的工作流</p>
                <Link href="/workflows" className="text-blue-600 hover:underline mt-2 inline-block">
                  查看全部工作流
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {page > 1 && (
                  <Link href={buildPageUrl(page - 1)}>
                    <Button variant="outline" size="sm">
                      上一页
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-1">
                  {/* First page */}
                  {page > 3 && (
                    <>
                      <Link href={buildPageUrl(1)}>
                        <Button variant={page === 1 ? "default" : "outline"} size="sm">
                          1
                        </Button>
                      </Link>
                      {page > 4 && <span className="px-2">...</span>}
                    </>
                  )}

                  {/* Pages around current */}
                  {Array.from({ length: 5 }, (_, i) => page - 2 + i)
                    .filter(p => p >= 1 && p <= totalPages)
                    .map(p => (
                      <Link key={p} href={buildPageUrl(p)}>
                        <Button variant={p === page ? "default" : "outline"} size="sm">
                          {p}
                        </Button>
                      </Link>
                    ))}

                  {/* Last page */}
                  {page < totalPages - 2 && (
                    <>
                      {page < totalPages - 3 && <span className="px-2">...</span>}
                      <Link href={buildPageUrl(totalPages)}>
                        <Button variant={page === totalPages ? "default" : "outline"} size="sm">
                          {totalPages}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {page < totalPages && (
                  <Link href={buildPageUrl(page + 1)}>
                    <Button variant="outline" size="sm">
                      下一页
                    </Button>
                  </Link>
                )}
              </div>
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
