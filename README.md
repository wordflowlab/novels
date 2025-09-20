# 小说发布系统

一个基于 Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui 的静态小说发布平台，支持部署到 Cloudflare Pages。

## 功能特点

- 📚 支持多部小说管理
- 📖 优雅的阅读体验
- 🌓 多种阅读主题（明亮/暗黑/护眼）
- 📱 响应式设计，支持手机/平板/电脑
- 💾 自动保存阅读进度
- ⚡ 静态生成，加载速度快
- 🚀 支持 Cloudflare Pages 部署

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 添加新小说

1. 在 `public/stories/` 目录下创建新的小说文件夹，例如 `002-小说名称/`
2. 添加 `story.md` 文件，包含小说信息
3. 在 `chapters/` 目录下按卷组织章节文件
4. 目录结构示例：

```
public/stories/
├── 001-大明风华录/
│   ├── story.md          # 小说信息
│   └── chapters/
│       ├── volume-1/      # 第一卷
│       │   ├── chapter-001.md
│       │   └── chapter-002.md
│       └── volume-2/      # 第二卷
└── 002-另一部小说/
    └── ...
```

### 部署到 Cloudflare Pages

#### 方法一：通过 Git 自动部署

1. 将项目推送到 GitHub/GitLab
2. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
3. 点击 "Create a project"
4. 连接你的 Git 仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node version: 18 或更高
6. 点击 "Save and Deploy"

#### 方法二：手动部署

```bash
# 构建项目
npm run build

# 使用 Cloudflare Wrangler CLI 部署
npx wrangler pages deploy out --project-name=my-novel-site
```

## 项目结构

```
damingfenghua/
├── app/                   # Next.js App Router 页面
│   ├── page.tsx          # 首页 - 小说列表
│   └── novels/
│       └── [novelId]/
│           ├── page.tsx  # 小说详情页
│           └── chapters/
│               └── [volumeId]/
│                   └── [chapterNumber]/
│                       └── page.tsx  # 章节阅读页
├── components/           # React 组件
│   └── novel/
│       ├── NovelCard.tsx
│       ├── ChapterList.tsx
│       └── ChapterReader.tsx
├── lib/                  # 工具函数
│   ├── types.ts         # TypeScript 类型定义
│   ├── novels.ts        # 小说数据处理
│   ├── markdown.ts      # Markdown 解析
│   └── storage.ts       # 本地存储管理
└── public/
    └── stories/         # 小说文件目录
```

## 小说文件格式

### story.md 示例

```markdown
# 小说：我的小说名称

## 基本信息
- **类型**：玄幻/都市/历史等
- **字数目标**：80万字
- **目标读者**：目标读者描述
- **创作状态**：连载中/已完结

## 故事内核

### 一句话故事
这里是一句话描述你的故事...
```

### 章节文件格式

每个章节文件（如 `chapter-001.md`）的第一行应该是章节标题：

```markdown
# 第一章 章节标题

章节正文内容...
```

## 配置说明

### next.config.js

已配置为静态导出模式，适合部署到 Cloudflare Pages：

```javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}
```

## 许可证

MIT