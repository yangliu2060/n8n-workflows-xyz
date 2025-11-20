import { MetadataRoute } from 'next'
import { getAllWorkflows, getAllCategories } from '@/lib/workflows'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://n8nworkflows.xyz'

  const workflows = await getAllWorkflows()
  const categories = await getAllCategories()

  // 静态页面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/workflows`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // 工作流详情页
  const workflowPages = workflows.map((workflow) => ({
    url: `${baseUrl}/workflows/${workflow.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 分类页
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...workflowPages, ...categoryPages]
}
