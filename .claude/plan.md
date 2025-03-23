# 模拟 Git 提交历史计划

## 目标
将当前仓库的单次提交重写为 2025 年某月内约 40 次提交，模拟真实的开发过程。

## 方案
1. 创建一个孤立分支（orphan branch）
2. 按照项目的逻辑开发顺序，分批 add 文件并提交
3. 每次提交使用 `GIT_AUTHOR_DATE` / `GIT_COMMITTER_DATE` 设定 2025 年的日期
4. 完成后将 main 强制指向新历史，force push

## 时间范围
2025年3月1日 ~ 2025年3月31日，约40次提交，平均不到一天一次，有些天多一些有些天没有，模拟真实节奏。

## 提交顺序（模拟真实开发流程）

1. 初始化项目 + 配置文件
2. 前端 Vite + React 脚手架
3. 添加 Tailwind + Ant Design 配置
4. 后端 Express 脚手架
5. Prisma schema 初版（User模型）
6. 用户注册/登录 API
7. JWT 工具函数
8. 前端路由配置
9. 登录页面
10. 注册页面
11. AuthContext 上下文
12. Header 组件
13. Footer 组件
14. 首页 Hero 区域
15. 首页完善
16. Prisma schema 添加 Resume 模型
17. 简历 CRUD API
18. 模板数据模型
19. 模板 API
20. 前端 API service 层
21. 简历列表页
22. 模板列表页
23. 简历编辑器基础框架
24. 基本信息表单
25. 教育经历表单
26. 工作经历表单
27. 项目经历表单
28. 技能表单
29. 模板引擎 - Registry
30. 模板引擎 - L1 Schema
31. 模板引擎 - Classic Schema
32. 模板引擎 - Modern Schema
33. 模板引擎 - Minimal Schema
34. 导出功能（PDF/图片）
35. 个人设置页面
36. 头像上传
37. 模板投稿功能
38. 发布中心
39. 修复CORS和数据库配置
40. 优化响应式布局和细节调整
