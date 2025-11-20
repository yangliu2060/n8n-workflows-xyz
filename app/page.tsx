import Link from "next/link";
import { WorkflowCard } from "@/components/WorkflowCard";
import { SearchBar } from "@/components/SearchBar";
import { getAllWorkflows, getAllCategories, getFeaturedWorkflows, getRecentWorkflows } from "@/lib/workflows";

export default async function Home() {
  const workflows = await getAllWorkflows();
  const categories = await getAllCategories();

  // 获取精选工作流（最新的6个）
  const featuredWorkflows = await getFeaturedWorkflows(6);
  // 获取最新工作流（接下来的6个）
  const recentWorkflows = await getRecentWorkflows(12);

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

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
            n8n 工作流浏览器
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            发现和探索 {workflows.length.toLocaleString()}+ 个自动化工作流，提高您的工作效率
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.slug}
                href={`/workflows?category=${encodeURIComponent(category.name)}`}
                className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                {category.name} ({category.count})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Workflows */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">精选工作流</h2>
            <Link href="/workflows" className="text-sm text-muted-foreground hover:text-foreground">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Workflows */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">最新工作流</h2>
            <Link href="/workflows" className="text-sm text-muted-foreground hover:text-foreground">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentWorkflows.slice(6, 12).map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>数据来源于 n8n.io - 开源自动化平台</p>
        </div>
      </footer>
    </div>
  );
}
