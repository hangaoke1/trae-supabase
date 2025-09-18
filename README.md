# Supabase 登录注册系统

这是一个使用 Vite + React + TypeScript + Supabase 构建的现代化登录注册系统。

## 功能特性

- ✅ 用户注册和登录
- ✅ 邮箱验证
- ✅ 受保护的路由
- ✅ 现代化的 UI 设计
- ✅ TypeScript 支持
- ✅ 响应式设计

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 5
- **路由**: React Router DOM 7
- **后端服务**: Supabase
- **样式**: 原生 CSS（现代化设计）

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

1. 在 [Supabase](https://supabase.com) 创建一个新项目
2. 复制项目的 URL 和 anon key
3. 更新 `.env.local` 文件：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

## 项目结构

```
src/
├── components/          # React 组件
│   ├── LoginForm.tsx   # 登录表单
│   ├── RegisterForm.tsx # 注册表单
│   └── Dashboard.tsx   # 用户仪表板
├── contexts/           # React Context
│   └── AuthContext.tsx # 认证上下文
├── lib/               # 工具库
│   └── supabase.ts    # Supabase 客户端配置
├── pages/             # 页面组件
│   └── AuthPage.tsx   # 认证页面
├── styles/            # 样式文件
│   └── auth.css       # 认证相关样式
└── App.tsx            # 主应用组件
```

## 主要功能

### 认证功能

- **用户注册**: 使用邮箱和密码注册新账户
- **用户登录**: 使用已注册的邮箱和密码登录
- **自动登录**: 刷新页面后保持登录状态
- **安全退出**: 清除用户会话

### 路由保护

- **公共路由**: 未登录用户只能访问登录/注册页面
- **受保护路由**: 已登录用户才能访问仪表板
- **自动重定向**: 根据登录状态自动跳转到相应页面

### UI/UX 特性

- **现代化设计**: 渐变背景、圆角卡片、阴影效果
- **响应式布局**: 适配桌面和移动设备
- **加载状态**: 表单提交时显示加载状态
- **错误处理**: 友好的错误信息显示
- **成功反馈**: 注册成功后的提示信息

## 环境要求

- Node.js 18.16.0 或更高版本
- npm 或 yarn 包管理器
- Supabase 项目账户

## 部署

### 构建生产版本

```bash
npm run build
```

构建文件将生成在 `dist/` 目录中。

### 预览生产版本

```bash
npm run preview
```

## 注意事项

1. **环境变量**: 确保正确配置 Supabase 的 URL 和 API Key
2. **邮箱验证**: Supabase 默认开启邮箱验证，用户需要验证邮箱后才能登录
3. **安全性**: 不要将 Supabase 的 service key 暴露在前端代码中
4. **CORS**: 确保在 Supabase 项目中正确配置 CORS 设置

## 开发说明

### 添加新功能

1. 在 `src/components/` 中创建新组件
2. 在 `src/contexts/AuthContext.tsx` 中添加新的认证方法
3. 在 `src/styles/auth.css` 中添加相应样式

### 自定义样式

所有样式都在 `src/styles/auth.css` 中定义，可以根据需要修改颜色、字体、布局等。

### 部署 vercel
https://juejin.cn/post/7301193497247727652?searchId=202509181636003E648F32567263ABBC50

## 许可证

MIT License
