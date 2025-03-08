# IntelliResume · 智简

IntelliResume 是一个智能简历生成平台，支持用户注册登录、结构化简历编辑、模板实时切换与预览、PDF/图片导出等功能。

## 项目概述

本平台旨在帮助用户快速创建专业的简历，提供多种模板选择，支持实时预览和导出功能。项目采用前后端分离架构，分多阶段迭代开发：

- **第一阶段**：静态页面与交互
- **第二阶段**：MVP 核心功能（用户系统 + 简历 CRUD + Schema 驱动模板引擎 + 导出）
- **第三阶段**：体验增强（HTML 模板上传 + 响应式）
- **第四阶段**：生态扩展（插件包系统 + AI 能力）

## 技术栈

### 前端
- React 19+
- TypeScript 5.x
- Ant Design 5.x
- Tailwind CSS 4
- Vite 8
- React Router v6

### 后端
- Express 4.x
- TypeScript 5.x
- PostgreSQL 16+
- Prisma ORM
- JWT 认证

### 导出功能
- html2canvas
- jsPDF

## 项目结构

```
Ai-Resume/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── components/    # 通用组件
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API 服务
│   │   ├── templates/     # 模板引擎（分层混合架构）
│   │   │   └── engine/    # L1 Schema 驱动 / L2 插件包 / L3 HTML 模板
│   │   └── types/         # 类型定义
│   └── ...
├── backend/               # 后端项目
│   ├── src/
│   │   ├── middleware/    # 中间件
│   │   ├── types/         # 类型定义
│   │   └── utils/         # 工具函数
│   ├── prisma/            # 数据库模型与迁移
│   └── ...
└── docs/                  # 项目文档
```

## 快速开始

### 环境要求
- Node.js >= 18
- PostgreSQL >= 16 (可用 Docker)
- npm

### 安装与运行

#### 数据库（Docker）
```bash
docker run -d --name intelli-resume-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=intelli_resume \
  -p 5432:5432 \
  postgres:16
```

#### 后端
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

#### 前端
```bash
cd frontend
npm install
npm run dev
```

## 许可证

[待定]
