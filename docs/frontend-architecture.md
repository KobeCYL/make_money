# 前端项目架构文档

## 项目概述

本项目使用 Ant Design Pro + UmiJS 作为基础框架，采用 TypeScript 进行开发。项目采用现代化的前端工程化实践，包括代码规范、提交规范、自动化构建等。

## 目录结构

```
frontEnd/
├── .husky/                # Git Hooks配置目录，用于代码提交前的检查
├── config/                # 项目配置文件目录
│   ├── config.ts         # UmiJS主配置文件
│   ├── defaultSettings.ts # 默认主题设置
│   ├── proxy.ts          # 开发环境代理配置
│   └── routes.ts         # 路由配置文件
├── mock/                  # 模拟数据目录
│   ├── route.ts          # API路由配置
│   └── *.ts              # 各模块的模拟数据
├── public/               # 静态资源目录
│   ├── icons/            # 图标文件
│   └── scripts/          # 外部脚本文件
├── src/                  # 源代码目录
│   ├── .umi/             # UmiJS运行时配置（自动生成）
│   ├── components/       # 公共组件
│   ├── pages/            # 页面组件
│   ├── services/         # API服务
│   ├── access.ts         # 权限配置
│   ├── app.tsx           # 应用入口
│   ├── global.less       # 全局样式
│   └── typings.d.ts      # 全局类型声明
└── types/                # 类型定义目录
```

## 核心目录说明

### config/
- `config.ts`: UmiJS的主配置文件，包含项目的基本配置、插件配置等
- `defaultSettings.ts`: 默认的主题和布局设置
- `proxy.ts`: 开发环境的API代理配置
- `routes.ts`: 项目路由配置，定义了页面的访问路径和组件关系

### mock/
模拟数据目录，用于开发环境模拟后端API响应：
- `route.ts`: 统一的API路由配置
- 其他模块文件：按功能模块划分的模拟数据

### src/
源代码目录，包含所有业务代码：

#### components/
公共组件目录，存放可复用的UI组件

#### pages/
页面组件目录，按照路由结构组织：
- 每个页面一个目录
- 包含页面组件、样式、模型等相关文件

#### services/
 API服务目录：
- 按模块划分的API调用函数
- 包含接口类型定义
- 统一的请求配置

### types/
类型定义目录：
- 项目级别的类型声明
- 第三方库的类型扩展

## 开发规范

### 代码规范
- 使用TypeScript进行开发
- 遵循Ant Design Pro的开发规范
- 使用ESLint + Prettier进行代码格式化

### 样式规范
- 使用Less作为CSS预处理器
- 采用CSS Modules避免样式冲突
- 遵循Ant Design的设计规范

### 提交规范
- 使用Husky + Commitlint规范提交信息
- 提交前自动进行代码检查和格式化

## 构建和部署

### 开发环境
```bash
pnpm install  # 安装依赖
pnpm dev      # 启动开发服务器
```

### 生产环境
```bash
pnpm build    # 构建生产版本
```

## 技术栈

- 框架：React + Ant Design Pro + UmiJS
- 语言：TypeScript
- 样式：Less + CSS Modules
- 状态管理：@umijs/max
- 构建工具：Webpack (通过UmiJS)
- 包管理：pnpm
- 代码规范：ESLint + Prettier
- 提交规范：Husky + Commitlint