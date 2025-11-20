# n8n 工作流网站 - 任务列表

## 已完成

- [x] 初始化 Next.js 项目（TypeScript + App Router + Tailwind）
- [x] 安装和配置 shadcn/ui 组件库
- [x] 创建项目目录结构和 TypeScript 类型定义
- [x] 编写数据抓取脚本从 n8n.io 获取工作流
- [x] 实现首页（Hero + 搜索 + 精选工作流）
- [x] 实现工作流列表页（网格布局 + 卡片组件）
- [x] 实现工作流详情页
- [x] 实现搜索和筛选功能（Fuse.js）
- [x] SEO 优化和 meta 标签配置
- [x] 配置 Vercel 部署

## 待完成

### 数据增强
- [ ] 完善数据抓取脚本，获取真实的 n8n.io 工作流
- [ ] 分析 n8n.io API 端点
- [ ] 实现分页数据获取
- [ ] 添加数据定时更新机制

### 功能增强
- [ ] 实现工作流可视化（ReactFlow）
- [ ] 添加暗色模式支持
- [ ] 实现真正的服务端搜索
- [ ] 添加工作流导入功能
- [ ] 支持工作流收藏

### 用户功能
- [ ] 用户认证（NextAuth.js）
- [ ] 用户收藏列表
- [ ] 工作流评分和评论
- [ ] 用户上传工作流

### 部署和运维
- [ ] 初始化 Git 仓库
- [ ] 推送到 GitHub
- [ ] 部署到 Vercel
- [ ] 配置自定义域名
- [ ] 设置 GitHub Actions 自动更新数据

## 开发命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 更新数据
npm run fetch-data
```

## 访问地址

- 开发服务器: http://localhost:3000
