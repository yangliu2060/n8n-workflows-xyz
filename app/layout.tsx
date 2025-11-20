import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "n8n Workflows - 工作流浏览器",
    template: "%s | n8n Workflows"
  },
  description: "发现和探索 6,945+ 个 n8n 自动化工作流，提高您的工作效率。支持搜索、分类浏览和一键导入。",
  keywords: ["n8n", "工作流", "自动化", "workflow", "automation", "集成", "API"],
  authors: [{ name: "n8n Workflows" }],
  openGraph: {
    title: "n8n Workflows - 工作流浏览器",
    description: "发现和探索 6,945+ 个 n8n 自动化工作流",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "n8n Workflows - 工作流浏览器",
    description: "发现和探索 6,945+ 个 n8n 自动化工作流",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
