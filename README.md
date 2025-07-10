# Lexzyy

一个功能强大（练手）的 `AI` 聊天应用，具有流式响应、对话流可视化、插件系统和附件上传能力。

## ✨ 功能特点

### 🤖 AI 聊天

- 基于 `AI SDK`
- 暂用 `OpenRouter` 作为提供商

### ✨ 流式响应

- 按 `markdown` 元素进行快速的分块解析，避免重复解析
- 使用 [`unified`](https://github.com/unifiedjs/unified) 构建语法树，易于插件拓展
- 语法树转 `JSX` ，而不是 `dangerouslySetInnerHTML`，安全且避免重复渲染
- 代码块 [`lowlight`](https://github.com/wooorm/lowlight) 构建语法树，逐行解析渲染，[`highlight.js`](https://highlightjs.org/) 进行高亮（懒加载）

### 📊 对话流可视化

- 使用 [React Flow](https://reactflow.dev/) 可视化聊天流程
- 实时更新的对话树结构
- 可分支对话，要切换视图或截断消息（单击`or`双击，键盘操作待加入）
- 可自定义节点样式和布局
- 利用 [react-intersection-observer](https://github.com/thebuilder/react-intersection-observer) 检测并高亮正在阅读的节点

### 🔌 插件系统

- 可扩展的工具调用能力（[Tool Calling](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)）
- 用户可配置（`Config UI`）
- 结果可定制（`Result UI`）

### 📄 附件上传

可上传附件，支持多种常见文档格式的文本提取：

- PDF 文档 (`.pdf`)
- Word 文档 (`.doc`, `.docx`)
- Excel 工作簿 (`.xls`, `.xlsx`)
- PowerPoint 演示文稿 (`.ppt`, `.pptx`)
- 文本格式: `XML`, `JSON`, `XHTML`, `LaTeX`, `YAML`, `RSS`, `Atom`

### 🌍 国际化

- 中文 (`zh-CN`)
- 英文 (`en-US`)
- 可扩展的多语言支持

### 🎨 现代化UI

- 响应式设计
- 明暗主题切换
- 封装动态表单用于快速构建插件配置`UI`
- [TailwindCSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) + [Shadcn/ui](https://ui.shadcn.com/) + [Framer Motion](https://www.framer.com/motion/) 构建`UI`

## 🛠️ 技术栈

### 前端框架

- **Next.js 15.3.2** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全

### UI 组件

- **Radix UI** - 无头组件库
- **TailwindCSS 4** - 原子化CSS框架
- **Lucide React** - 图标库
- **Framer Motion** - 动画库

### 状态管理

- **Zustand** - 轻量级状态管理
- **TanStack Query** - 服务器状态管理

### AI & 文档处理

- **AI SDK** - AI 应用开发工具包
- **OpenRouter** - AI 模型提供商
- **PDF Parse** - PDF 处理
- **Mammoth** - Word 文档处理
- **XLSX** - Excel 处理

### 可视化

- **React Flow** - 流程图和节点图
- **Mermaid** - 图表渲染
- **Highlight.js** - 代码高亮

### 开发工具

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git 钩子
- **Storybook** - 组件开发
- **Vitest** - 单元测试

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 环境配置

创建 `.env.local` 文件：

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
npm run start
```
