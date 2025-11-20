import { NextRequest, NextResponse } from "next/server";
import { getAllWorkflows } from "@/lib/workflows";
import { searchWorkflows, filterByCategory, filterByIntegration } from "@/lib/search";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const integration = searchParams.get("integration") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "24", 10);

  try {
    let workflows = await getAllWorkflows();

    // 应用搜索
    if (query) {
      workflows = searchWorkflows(workflows, query);
    }

    // 应用分类筛选
    if (category) {
      workflows = filterByCategory(workflows, category);
    }

    // 应用节点类型筛选
    if (integration) {
      workflows = filterByIntegration(workflows, integration);
    }

    // 计算分页
    const total = workflows.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedWorkflows = workflows.slice(offset, offset + limit);

    return NextResponse.json({
      workflows: paginatedWorkflows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "搜索失败" },
      { status: 500 }
    );
  }
}
