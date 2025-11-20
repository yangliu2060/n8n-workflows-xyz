# n8n 工作流网站 - 任务列表

## 已完成 ✅

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
- [x] 推送到 GitHub

---

## 第一阶段：数据基础设施 (第1周)

### 进行中 🔄
- [ ] 分析 n8n.io API 端点和数据结构
- [ ] 完善数据抓取脚本获取真实数据
- [ ] 实现分页数据获取

### 待开始 📋
- [ ] 配置 GitHub Actions 定时更新

---

## 第二阶段：核心功能增强 (第2-3周)

### 服务端搜索
- [ ] 创建 /api/search API 路由
- [ ] 实现关键词、分类、集成筛选
- [ ] 集成 SWR 实现实时搜索

### 暗色模式
- [ ] 安装 next-themes
- [ ] 添加主题切换按钮
- [ ] 配置暗色样式变量

### 导出功能优化
- [ ] 实现一键复制 JSON
- [ ] 添加复制成功提示

### 工作流可视化 (ReactFlow)
- [ ] 安装 @xyflow/react
- [ ] n8n 节点格式转 ReactFlow 格式
- [ ] 创建自定义节点组件
- [ ] 渲染节点连接关系
- [ ] 添加缩放、拖拽、小地图

---

## 第三阶段：用户系统 (第4-5周)

### 数据库迁移
- [ ] 安装 Turso + Drizzle ORM
- [ ] 设计数据库 Schema
- [ ] 迁移现有数据

### 用户认证 (NextAuth.js)
- [ ] 配置 GitHub + Google OAuth
- [ ] 实现用户会话管理
- [ ] 保护 API 路由

### 收藏功能
- [ ] 收藏/取消收藏 API
- [ ] 用户收藏列表页
- [ ] 收藏按钮组件

### 评分与评论
- [ ] 1-5 星评分功能
- [ ] 评论列表和发布
- [ ] 显示平均评分

### 用户上传工作流
- [ ] JSON 格式验证
- [ ] 自动提取集成信息
- [ ] 用户添加描述/分类
- [ ] 审核机制

---

## 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run fetch-data   # 更新工作流数据
```

## 项目链接

- GitHub: https://github.com/yangliu2060/n8n-workflows-xyz
- 本地: http://localhost:3000
